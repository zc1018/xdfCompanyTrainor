import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const base = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4202';
const output = process.env.ENTERPRISE_QA_OUTPUT || '/tmp/xdf-motion-home-20260917';
const checks = [];
const check = (name, pass) => { checks.push({ name, pass: !!pass }); };
async function open(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-title').waitFor({ state: 'visible' });
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth));
  // Third-party fonts/media must not make local interaction checks wait on network-idle.
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]));
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#home .relative.z-20 > div')).opacity === '1' && getComputedStyle(document.querySelector('#home nav')).opacity === '1');
}
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [320, 390, 768, 1024, 1440, 1932]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1932 ? 1354 : 1000 }, reducedMotion: 'reduce' });
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    const page = await context.newPage();
    const errors = [];
    let videoRequests = 0;
    page.on('request', request => { if (request.url().endsWith('.mp4')) videoRequests++; });
    page.on('pageerror', error => errors.push(error.message));
    await open(page);
    const state = await page.evaluate(() => {
      const hero = document.querySelector('#home').getBoundingClientRect();
      const nav = document.querySelector('#home nav').getBoundingClientRect();
      const text = document.querySelector('#home .relative.z-20 > div').getBoundingClientRect();
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      return { overflow: document.documentElement.scrollWidth > innerWidth, heroHeight: hero.height,
        navFits: nav.left >= hero.left && nav.right <= hero.right, textFits: text.bottom <= nav.top - 12,
        broken: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
        anchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash),
        duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
        marqueeAnimation: getComputedStyle(document.querySelector('.marquee-track')).animationName,
        videoPaused: document.querySelector('video').paused, headingCount: document.querySelectorAll('h1').length,
        logoCopies: document.querySelectorAll('.marquee-set').length, logoCount: document.querySelectorAll('.marquee-set:first-child img').length };
    });
    check(`${width}: no horizontal overflow`, !state.overflow);
    check(`${width}: exact 600px hero`, state.heroHeight === 600);
    check(`${width}: navigation and text fit without overlap`, state.navFits && state.textFits);
    check(`${width}: assets load`, state.broken.length === 0);
    check(`${width}: headings, IDs and anchors valid`, state.headingCount === 1 && !state.anchors.length && !state.duplicateIds.length);
    check(`${width}: reduced motion stops video and marquee`, state.videoPaused && state.marqueeAnimation === 'none');
    check(`${width}: reduced motion retains loaded cover without fetching video`, videoRequests === 0 && await page.locator('.hero-poster').evaluate(image => image.complete && image.naturalWidth > 0 && getComputedStyle(image).visibility === 'visible'));
    check(`${width}: eight verified marks rendered twice`, state.logoCount === 8 && state.logoCopies === 2);
    check(`${width}: no runtime exceptions`, errors.length === 0);
    await page.screenshot({ path: path.join(output, `${width}-hero.png`) });
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: path.join(output, `${width}-full.png`), fullPage: true });
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(output, `${width}-contact.png`) });
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  // Prove the hero works without any external origin, including the former CDN.
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
  const page = await context.newPage();
  await open(page);
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v?.readyState >= 2 && v.currentTime > 0 && !v.paused; }, undefined, { timeout: 10000 });
  const video = await page.locator('video').evaluate(v => ({ src: v.src, poster: v.poster, ready: v.readyState, playing: !v.paused, time: v.currentTime, loop: v.loop, muted: v.muted, playsInline: v.playsInline, autoplay: v.autoplay, onlyMedia: [...v.parentElement.children].map(el => el.tagName).join(',') === 'IMG,VIDEO' }));
  check('Same-origin video and cover, autoplay flags and no overlay', new URL(video.src).origin === new URL(base).origin && new URL(video.poster).origin === new URL(base).origin && video.loop && video.muted && video.playsInline && video.autoplay && video.onlyMedia);
  check('Video loads and plays with every external origin blocked', video.ready >= 2 && video.playing && video.time > 0);
  const response = await page.request.get(video.src);
  check('Served video preserves original source bytes', response.ok() && createHash('md5').update(await response.body()).digest('hex') === '671571ff2d7eac1356e6b4b839e24fc0');
  await page.screenshot({ path: path.join(output, '1440-video-hero.png') });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.screenshot({ path: path.join(output, '390-video-hero.png') });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: '暂停背景视频与标识滚动' }).click();
  check('Pause control stops video and marquee', await page.locator('video').evaluate(v => v.paused) && await page.locator('.marquee-track').evaluate(el => getComputedStyle(el).animationPlayState === 'paused'));
  await page.getByRole('button', { name: '播放背景视频与标识滚动' }).click();
  await page.locator('.marquee-mask').hover();
  check('Marquee pauses on hover', await page.locator('.marquee-track').evaluate(el => getComputedStyle(el).animationPlayState === 'paused'));
  const visibleLogo = await page.locator('.marquee-mask figure').evaluateAll(elements => elements.findIndex(el => { const rect = el.getBoundingClientRect(); return rect.left > 80 && rect.right < innerWidth - 80; }));
  await page.locator('.marquee-mask figure').nth(visibleLogo).hover();
  await page.waitForFunction(index => Number(getComputedStyle(document.querySelectorAll('.marquee-mask figure')[index].firstElementChild).opacity) > 0.99, visibleLogo);
  check('Hovered logo reveals gradient and white mark', await page.locator('.marquee-mask figure').nth(visibleLogo).locator('img').evaluate(el => getComputedStyle(el).filter.includes('invert(1)')));
  await page.screenshot({ path: path.join(output, 'marquee-hover.png') });
  await page.getByRole('button', { name: '聊聊企业培训需求' }).click();
  check('Hero CTA targets planner section and moves focus', await page.locator('#contact-title').evaluate(el => document.activeElement === el));
  await page.getByRole('button', { name: '生成咨询摘要' }).click();
  check('Required goal validation focuses input', await page.locator('#goal-error').isVisible() && await page.locator('#goal').evaluate(el => document.activeElement === el));
  await page.locator('#goal-global').focus();
  await page.keyboard.press('ArrowRight');
  check('Scenario keyboard updates goal and panel', await page.locator('#goal-business').getAttribute('aria-selected') === 'true' && await page.locator('#goal').inputValue() === 'business' && (await page.locator('#scenario-panel').textContent()).includes('介绍方案'));
  await page.getByRole('button', { name: '咨询业务表达方案' }).click();
  check('Scenario CTA carries consultation context', await page.locator('#goal').inputValue() === 'business');
  await page.locator('#learn-0').focus();
  await page.keyboard.press('ArrowRight');
  check('Learning preview supports keyboard tabs', await page.locator('#learning-panel').getAttribute('aria-labelledby') === 'learn-1' && (await page.locator('#learning-panel').textContent()).includes('时间状语从句'));
  await page.locator('#solutions summary').click();
  check('All four course formats expand', (await page.locator('#solutions details').textContent()).includes('主讲老师与班主任'));
  await page.locator('#faq summary').first().click();
  check('FAQ opens', await page.locator('#faq details').first().getAttribute('open') !== null);
  await page.locator('#company').fill('测试团队 <img src=x onerror=alert(1)>');
  await page.locator('#size').selectOption('21–50 人');
  let sent = 0;
  page.on('request', request => { if (request.method() !== 'GET') sent++; });
  await page.getByRole('button', { name: '生成咨询摘要' }).click();
  const summary = await page.locator('#inquiry-summary').inputValue();
  check('Summary is complete plain text without transmission', summary.includes('业务表达') && summary.includes('21–50 人') && summary.includes('<img') && !(await page.locator('img[src="x"]').count()) && sent === 0);
  check('Summary reports unsent and receives focus', (await page.locator('#result-title').textContent()).includes('尚未发送') && await page.locator('#result-title').evaluate(el => document.activeElement === el));
  const mail = new URL(await page.locator('#email-summary').getAttribute('href'));
  check('Email recipient and encoded draft are correct', mail.pathname === 'huting20@xdf.cn' && mail.searchParams.get('body') === summary);
  check('Confirmed planner phone is retained', await page.locator('#contact a[href="tel:15811383545"]').count() === 1);
  await page.getByRole('button', { name: '复制摘要' }).click();
  check('Clipboard contains exact summary', await page.evaluate(() => navigator.clipboard.readText()) === summary);
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('QA denial'); }; });
  await page.getByRole('button', { name: '复制摘要' }).click();
  check('Clipboard denial selects copyable text', await page.locator('#inquiry-summary').evaluate(el => el.selectionEnd - el.selectionStart === el.value.length));
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '保存为文本' }).click();
  const file = await downloading; await file.saveAs(path.join(output, 'summary.txt'));
  check('UTF-8 download preserves summary', (await fs.readFile(path.join(output, 'summary.txt'), 'utf8')).includes(summary));
  await page.locator('#company').fill('更改后的团队');
  check('Editing invalidates old summary', await page.locator('#inquiry-result').count() === 0);
  check('No browser storage or hidden lead submission', await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0) && sent === 0);
  await context.close();
  const fallback = await browser.newContext();
  await fallback.route('**/*.mp4', route => route.abort());
  await fallback.route('https://fonts.googleapis.com/**', route => route.abort());
  const fallbackPage = await fallback.newPage(); await open(fallbackPage);
  check('Blocked video and fonts leave heading and CTA usable', await fallbackPage.getByRole('heading', { level: 1 }).isVisible() && await fallbackPage.getByRole('button', { name: '聊聊企业培训需求' }).isEnabled());
  await fallbackPage.waitForFunction(() => document.querySelector('video')?.dataset.failed === 'true');
  await fallbackPage.waitForFunction(() => document.querySelector('.hero-poster')?.naturalWidth > 0);
  check('Failed video reveals original cover instead of blank background', await fallbackPage.locator('video').evaluate(v => getComputedStyle(v).visibility === 'hidden') && await fallbackPage.locator('.hero-poster').isVisible());
  await fallbackPage.setViewportSize({ width: 1440, height: 1000 });
  await fallbackPage.screenshot({ path: path.join(output, '1440-video-fallback.png') });
  await fallbackPage.setViewportSize({ width: 390, height: 1000 });
  await fallbackPage.screenshot({ path: path.join(output, '390-video-fallback.png') });
  await fallback.close();
  const slow = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  let releaseVideo;
  const videoGate = new Promise(resolve => { releaseVideo = resolve; });
  await slow.route('**/*.mp4', async route => { await videoGate; await route.abort(); });
  await slow.route('https://fonts.googleapis.com/**', route => route.abort());
  const slowPage = await slow.newPage(); await open(slowPage);
  check('Slow-loading video displays a loaded first-frame cover', await slowPage.locator('video').evaluate(v => v.readyState === 0 && !!v.poster) && await slowPage.locator('.hero-poster').evaluate(img => img.complete && img.naturalWidth > 0));
  await slowPage.screenshot({ path: path.join(output, '1440-video-loading.png') });
  releaseVideo();
  await slow.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  await nojs.route('https://fonts.googleapis.com/**', route => route.abort());
  const nojsPage = await nojs.newPage(); await nojsPage.goto(base);
  check('No-JS fallback retains confirmed contact channels', await nojsPage.locator('a[href="mailto:huting20@xdf.cn"]').isVisible() && await nojsPage.locator('a[href="tel:15811383545"]').isVisible());
  await nojs.close();
} finally { await browser.close(); await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(checks, null, 2)); }
console.log(JSON.stringify({ passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass), output }, null, 2));
assert.ok(checks.every(check => check.pass), 'All checks must pass');
