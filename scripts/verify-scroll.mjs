import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const base = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4202';
const output = process.env.ENTERPRISE_QA_OUTPUT || '/tmp/xdf-scroll-home-qa';
const checks = [];
const check = (name, pass) => checks.push({ name, pass: Boolean(pass) });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await fs.mkdir(output, { recursive: true });
async function open(page, hash = 'home') {
  await page.goto(`${base}/?v=scroll-qa#${hash}`, { waitUntil: 'domcontentloaded' });
  await page.locator('.scroll-poster').evaluate(image => image.decode());
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#hero-title').parentElement).opacity === '1');
}
async function context(options = {}) {
  const ctx = await browser.newContext(options);
  await ctx.route('https://fonts.googleapis.com/**', route => route.abort());
  return ctx;
}
async function scrollToProgress(page, progress) {
  await page.evaluate(p => window.scrollTo({ top: p * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' }), progress);
  await page.waitForFunction(p => Math.abs(Number(document.querySelector('.scroll-video').dataset.progress) - p) < 0.005, progress);
}
async function pixels(page) {
  return page.locator('.scroll-video canvas').evaluate(canvas => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let hash = 2166136261;
    for (let i = 0; i < data.length; i += 64) hash = Math.imul(hash ^ data[i], 16777619);
    return hash >>> 0;
  });
}
async function atSection(page, id) {
  await page.waitForFunction(sectionId => {
    const section = document.getElementById(sectionId);
    const top = section.getBoundingClientRect().top;
    const navBottom = document.querySelector('.nav-row').getBoundingClientRect().bottom;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    const target = Math.min(top + scrollY - padding, document.documentElement.scrollHeight - innerHeight);
    return top >= navBottom - 1 && Math.abs(scrollY - target) < 2;
  }, id);
}
try {
  for (const [width, height] of [[320,740], [390,844], [768,1024], [1440,900], [1932,1354]]) {
    const ctx = await context({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await ctx.newPage(); const errors = []; let mediaRequests = 0;
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('.mp4')) mediaRequests++; });
    await open(page);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      hero: document.querySelector('#home').getBoundingClientRect().height,
      spacer: document.querySelector('.scroll-spacer').getBoundingClientRect().height,
      videoPaused: document.querySelector('.scroll-video video').paused,
      headings: document.querySelectorAll('h1').length,
    }));
    check(`${width}: readable responsive shell without horizontal overflow`, !layout.overflow && layout.hero >= height - 2 && layout.headings === 1);
    check(`${width}: full 80vh scroll interval retained`, Math.abs(layout.spacer - height * .8) < 2);
    check(`${width}: reduced motion retains poster without fetching video`, layout.videoPaused && mediaRequests === 0 && await page.locator('.scroll-video').getAttribute('data-phase') === 'poster');
    await page.screenshot({ path: path.join(output, `${width}-hero.png`) });
    await page.locator('#capability').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, `${width}-capability.png`) });
    await page.getByRole('button', { name: '找到适合的方案', exact: true }).click();
    await page.locator('#solutions-title').waitFor({ state: 'visible' });
    await atSection(page, 'solutions');
    check(`${width}: second-screen CTA scrolls to the inline solutions chapter`, new URL(page.url()).hash === '#solutions' && await page.locator('#solutions-title').evaluate(el => document.activeElement === el));
    check(`${width}: every chapter is visible in continuous document order`, await page.evaluate(() => {
      const ids = ['capability', 'solutions', 'ai-reading', 'delivery', 'faq', 'contact'];
      const sections = ids.map(id => document.getElementById(id));
      return sections.every((el, i) => el.offsetHeight > 0 && !el.closest('[hidden], dialog') && (!i || el.getBoundingClientRect().top >= sections[i - 1].getBoundingClientRect().bottom));
    }));
    check(`${width}: no modal, hidden chapter, nested scroller, or body scroll lock`, await page.evaluate(() => !document.querySelector('dialog, [aria-modal="true"], .content-chapter[hidden]') && getComputedStyle(document.body).overflow !== 'hidden' && getComputedStyle(document.querySelector('.page-content')).overflowY === 'visible' && document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, `${width}-solutions.png`) });
    await page.locator('.nav-consult').click();
    await atSection(page, 'contact');
    await page.screenshot({ path: path.join(output, `${width}-contact.png`) });
    check(`${width}: planner contact channels retained`, await page.locator('#contact a[href="mailto:huting20@xdf.cn"]').isVisible() && await page.locator('#contact a[href="tel:15811383545"]').isVisible());
    check(`${width}: inquiry anchor remains clear of the fixed header`, await page.locator('#contact-title').evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.nav-row').getBoundingClientRect().bottom));
    if (width < 768) {
      await page.getByRole('button', { name: '打开导航菜单', exact: true }).click();
      await page.getByRole('navigation', { name: '移动导航' }).getByText('学习方式').click();
      await atSection(page, 'ai-reading');
      check(`${width}: mobile navigation scrolls, closes, and focuses the chapter`, await page.locator('#reading-title').evaluate(el => document.activeElement === el) && await page.locator('#mobile-navigation').count() === 0);
      await page.screenshot({ path: path.join(output, `${width}-learning.png`) });
      await page.getByRole('button', { name: '打开导航菜单', exact: true }).click();
      await page.keyboard.press('Escape');
      check(`${width}: Escape closes only the mobile menu and restores its focus`, await page.locator('#mobile-navigation').count() === 0 && await page.getByRole('button', { name: '打开导航菜单', exact: true }).evaluate(el => document.activeElement === el));
    }
    check(`${width}: no runtime exceptions`, errors.length === 0);
    await ctx.close();
  }

  const ctx = await context({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await open(page);
  await page.waitForFunction(() => document.querySelector('.scroll-video').dataset.phase === 'cache', null, { timeout: 45000 });
  check('Canvas cache loads with all external origins blocked', Number(await page.locator('.scroll-video').getAttribute('data-frames')) >= 24);
  const initial = await pixels(page);
  const response = await page.request.get(await page.locator('.scroll-video video').evaluate(video => video.src));
  check('Local mirror retains the exact supplied source bytes', createHash('md5').update(await response.body()).digest('hex') === '806d3c91cd585a6e677514da5efca637');
  check('Video is scroll-driven without autoplay or looping', await page.locator('.scroll-video video').evaluate(v => v.paused && !v.autoplay && !v.loop && v.muted && v.playsInline));
  await page.screenshot({ path: path.join(output, 'video-start.png') });
  await scrollToProgress(page, .5); const middle = await pixels(page);
  await page.screenshot({ path: path.join(output, 'video-middle.png') });
  await scrollToProgress(page, 1); const end = await pixels(page);
  await page.waitForTimeout(1100);
  check('Scrolling advances distinct decoded canvas frames', initial !== middle && middle !== end);
  check('Stopping scroll leaves the scene stationary', end === await pixels(page));
  await page.screenshot({ path: path.join(output, 'video-end.png') });
  await scrollToProgress(page, 0);
  check('Reverse scrolling restores the first frame', initial === await pixels(page));
  await page.getByRole('button', { name: '暂停滚屏动效', exact: true }).click();
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(250);
  check('Pause holds the background while the document scrolls', initial === await pixels(page));
  await page.getByRole('button', { name: '开启滚屏动效', exact: true }).click();
  await page.waitForFunction(() => Number(document.querySelector('.scroll-video').dataset.progress) > .995);
  check('Resuming catches up to current scroll position', end === await pixels(page));

  await page.getByRole('button', { name: '找到适合的方案', exact: true }).click();
  await atSection(page, 'solutions');
  await page.locator('#goal-global').focus(); await page.keyboard.press('ArrowRight');
  check('Scenario keyboard navigation retains the business plan', await page.locator('#goal-business').getAttribute('aria-selected') === 'true' && (await page.locator('#scenario-panel').textContent()).includes('介绍方案'));
  await page.getByRole('button', { name: '咨询业务表达方案', exact: true }).click();
  await atSection(page, 'contact');
  check('Scenario selection carries into inquiry form', await page.locator('#goal').inputValue() === 'business');
  let posts = 0; page.on('request', request => { if (request.method() !== 'GET') posts++; });
  await page.locator('#company').fill('测试团队 <img src=x onerror=alert(1)>');
  await page.locator('#size').selectOption('21–50 人');
  await page.getByRole('button', { name: '生成咨询摘要', exact: true }).click();
  const summary = await page.locator('#inquiry-summary').inputValue();
  check('Inquiry stays plain text, complete, and unsent', summary.includes('业务表达') && summary.includes('21–50 人') && summary.includes('<img') && await page.locator('img[src="x"]').count() === 0 && posts === 0);
  check('Generated result receives focus and states unsent', (await page.locator('#result-title').textContent()).includes('尚未发送') && await page.locator('#result-title').evaluate(el => document.activeElement === el));
  const mail = new URL(await page.locator('#email-summary').getAttribute('href'));
  check('Mail draft retains Maggie and exact encoded summary', mail.pathname === 'huting20@xdf.cn' && mail.searchParams.get('body') === summary);
  await page.getByRole('button', { name: '复制摘要', exact: true }).click();
  check('Copy retains the exact inquiry text', await page.evaluate(() => navigator.clipboard.readText()) === summary);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '保存为文本', exact: true }).click();
  await (await downloading).saveAs(path.join(output, 'summary.txt'));
  check('Download retains the inquiry text', (await fs.readFile(path.join(output, 'summary.txt'), 'utf8')).includes(summary));
  await page.getByRole('navigation', { name: '主导航', exact: true }).getByRole('link', { name: '学习方式', exact: true }).click();
  await atSection(page, 'ai-reading');
  await page.locator('.nav-consult').click();
  await atSection(page, 'contact');
  check('Navigating between chapters preserves the current inquiry', await page.locator('#inquiry-summary').inputValue() === summary);
  await page.locator('#company').fill('已调整团队');
  check('Editing invalidates the old summary', await page.locator('#inquiry-result').count() === 0);
  await page.locator('#goal').selectOption('');
  await page.getByRole('button', { name: '生成咨询摘要', exact: true }).click();
  check('Missing target focuses the required choice', await page.locator('#goal-error').isVisible() && await page.locator('#goal').evaluate(el => document.activeElement === el));
  const mainNav = page.getByRole('navigation', { name: '主导航', exact: true });
  await mainNav.getByRole('link', { name: '学习方式', exact: true }).click();
  await atSection(page, 'ai-reading');
  await page.locator('#learn-0').focus(); await page.keyboard.press('ArrowRight');
  check('Learning modes retain accessible keyboard controls', (await page.locator('#learning-panel').textContent()).includes('时间状语从句'));
  check('All cross-domain article topics remain available', await page.locator('#ai-reading li').count() === 6);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#learn-1')).backgroundColor === 'rgb(255, 255, 255)');
  await page.screenshot({ path: path.join(output, '1440-learning.png') });
  await mainNav.getByRole('link', { name: '交付与案例', exact: true }).click();
  await atSection(page, 'delivery');
  check('Delivery steps, case and verified brand list retained', await page.locator('.delivery-steps li').count() === 4 && await page.locator('.brand-history-list img').count() === 8 && (await page.locator('.case-study').textContent()).includes('跨国香精香料企业'));
  await page.screenshot({ path: path.join(output, '1440-delivery.png') });
  await mainNav.getByRole('link', { name: '常见问题', exact: true }).click();
  await atSection(page, 'faq');
  const beforeFaqHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.locator('#faq summary').first().click();
  check('FAQ answers remain expandable', await page.locator('#faq details').first().getAttribute('open') !== null);
  await page.waitForFunction(() => Math.abs(Number(document.querySelector('.scroll-video').dataset.progress) - scrollY / (document.documentElement.scrollHeight - innerHeight)) < .002);
  check('Video progress adapts to expanded content and new document height', await page.evaluate(() => document.documentElement.scrollHeight) > beforeFaqHeight);
  await page.screenshot({ path: path.join(output, '1440-faq.png') });
  await page.goBack(); await atSection(page, 'delivery');
  check('Browser back restores the previous inline chapter', new URL(page.url()).hash === '#delivery' && await page.locator('#delivery-title').evaluate(el => el === document.activeElement));
  await page.goForward(); await atSection(page, 'faq');
  check('Browser forward restores the next inline chapter', new URL(page.url()).hash === '#faq');
  await page.locator('.page-footer a').click();
  await page.waitForFunction(() => scrollY < 1);
  check('Footer returns to the top of the same page', new URL(page.url()).hash === '#home' && await page.locator('#hero-title').evaluate(el => el === document.activeElement));
  check('No runtime errors or hidden lead submission', errors.length === 0 && posts === 0 && await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0));
  await ctx.close();

  const fallback = await context({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => { window.createImageBitmap = undefined; });
  const fallbackPage = await fallback.newPage(); await open(fallbackPage);
  await fallbackPage.waitForFunction(() => document.querySelector('.scroll-video video').readyState >= 2);
  await scrollToProgress(fallbackPage, .5);
  await fallbackPage.waitForFunction(() => { const v = document.querySelector('.scroll-video video'); return !v.seeking && Math.abs(v.currentTime - .5 * (v.duration - .05)) < .08; });
  check('Seeking fallback scrubs correctly without frame-cache support', await fallbackPage.locator('.scroll-video').getAttribute('data-phase') === 'video');
  await fallback.close();

  const mobile = await context({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage(); await open(mobilePage);
  await mobilePage.waitForFunction(() => document.querySelector('.scroll-video').dataset.phase === 'cache', null, { timeout: 45000 });
  check('Mobile uses a bounded, smaller frame cache', Number(await mobilePage.locator('.scroll-video').getAttribute('data-frames')) <= 48);
  await mobilePage.screenshot({ path: path.join(output, '390-video-start.png') });
  const mobileStart = await pixels(mobilePage); await scrollToProgress(mobilePage, 1);
  check('Mobile cache renders later frames during scroll', mobileStart !== await pixels(mobilePage));
  await mobilePage.screenshot({ path: path.join(output, '390-video-end.png') });
  await mobile.close();

  const production = await context({ viewport: { width: 1440, height: 900 } });
  let remoteAttempts = 0;
  await production.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === 'enterprise-preview.test') {
      const response = await route.fetch({ url: `${base}${url.pathname}${url.search}` });
      await route.fulfill({ response });
    } else { if (url.hostname.endsWith('cloudfront.net')) remoteAttempts++; await route.abort(); }
  });
  const productionPage = await production.newPage();
  await productionPage.goto('https://enterprise-preview.test/');
  await productionPage.waitForFunction(() => document.querySelector('.scroll-video').dataset.phase === 'cache', null, { timeout: 45000 });
  check('Production prefers CloudFront and recovers via the same-origin mirror', remoteAttempts > 0 && await productionPage.locator('.scroll-video video').evaluate(v => new URL(v.src).origin === location.origin));
  await production.close();

  const failed = await context(); await failed.route('**/*.mp4', route => route.abort());
  const failedPage = await failed.newPage(); await open(failedPage);
  check('Unavailable video retains the poster and inquiry entry', await failedPage.locator('.scroll-video').getAttribute('data-phase') === 'poster' && await failedPage.locator('.nav-consult').isEnabled());
  await failed.close();
  const direct = await context({ reducedMotion: 'reduce' }); const directPage = await direct.newPage();
  await open(directPage, 'contact'); await directPage.locator('#contact-title').waitFor({ state: 'visible' });
  await atSection(directPage, 'contact');
  check('Direct contact URL lands at the inline planner with no modal', await directPage.locator('dialog').count() === 0 && await directPage.locator('#contact-title').evaluate(el => el === document.activeElement));
  await direct.close();
  const nojs = await context({ javaScriptEnabled: false }); const nojsPage = await nojs.newPage(); await nojsPage.goto(base);
  check('No-JS fallback retains email and phone', await nojsPage.locator('a[href="mailto:huting20@xdf.cn"]').isVisible() && await nojsPage.locator('a[href="tel:15811383545"]').isVisible());
  await nojs.close();
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(checks, null, 2));
}
console.log(JSON.stringify({ passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass), output }, null, 2));
assert.ok(checks.every(c => c.pass), 'All checks must pass');
