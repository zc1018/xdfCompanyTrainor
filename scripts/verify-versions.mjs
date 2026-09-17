import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4202';
const output = '/tmp/xdf-home-versions-qa';
const checks = [];
const check = (name, pass) => checks.push({ name, pass: Boolean(pass) });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await fs.mkdir(output, { recursive: true });
try {
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    const page = await context.newPage();
    const errors = [];
    let videos = 0;
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('.mp4')) videos++; });
    await page.goto(`${base}/static/`, { waitUntil: 'networkidle' });
    await page.locator('.scroll-poster').evaluate(image => image.decode());
    check(`${width}: independent static entry`, await page.title() === '新东方企业英语培训｜静态版' && await page.locator('html').getAttribute('data-experience') === 'static');
    check(`${width}: static version mounts no video, canvas, motion control or spacer`, await page.locator('video, canvas, .motion-control, .scroll-spacer').count() === 0);
    check(`${width}: static content is immediately visible without scroll animation`, await page.locator('[data-reveal]').evaluateAll(nodes => nodes.every(node => { const style = getComputedStyle(node); return style.opacity === '1' && style.transform === 'none' && style.transitionDuration === '0s'; })));
    check(`${width}: no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `${output}/${width}-static-home.png` });
    await page.locator('.scroll-cue').click();
    check(`${width}: native chapter link stays on static version without smooth scrolling`, await page.evaluate(() => location.pathname === '/static/' && location.hash === '#capability' && getComputedStyle(document.documentElement).scrollBehavior === 'auto'));
    await page.getByRole('button', { name: '找到适合的方案', exact: true }).click();
    await page.locator('#goal-business').click();
    await page.getByRole('button', { name: '咨询业务表达方案', exact: true }).click();
    check(`${width}: static inquiry keeps the chosen goal and stable URL`, await page.locator('#goal').inputValue() === 'business' && new URL(page.url()).pathname === '/static/' && new URL(page.url()).hash === '#contact');
    await page.locator('#company').fill('双版本验证团队');
    await page.getByRole('button', { name: '生成咨询摘要', exact: true }).click();
    const text = await page.locator('#inquiry-summary').inputValue();
    check(`${width}: static local inquiry remains functional`, text.includes('双版本验证团队') && text.includes('业务表达') && (await page.locator('#result-title').textContent()).includes('尚未发送'));
    await page.locator('.page-footer a').click();
    check(`${width}: static footer returns to its own home`, await page.evaluate(() => scrollY < 1 && location.pathname === '/static/' && location.hash === '#home'));
    await page.goto(`${base}/static/#contact`);
    await page.locator('#contact-title').waitFor();
    check(`${width}: static direct contact link works`, await page.locator('#contact-title').evaluate(el => document.activeElement === el && el.getBoundingClientRect().top >= document.querySelector('.nav-row').getBoundingClientRect().bottom));
    check(`${width}: no video requests or runtime errors throughout static browsing`, videos === 0 && errors.length === 0);
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('https://fonts.googleapis.com/**', route => route.abort());
  const page = await context.newPage();
  const content = {};
  for (const version of ['scroll', 'static']) {
    await page.goto(`${base}/${version}/`);
    await page.locator('#contact').waitFor();
    content[version] = await page.locator('.page-content').innerText();
  }
  check('Both saved versions share all enterprise content and contact details', content.scroll === content.static);
  await context.close();
  const motion = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await motion.route('https://fonts.googleapis.com/**', route => route.abort());
  const scroll = await motion.newPage();
  await scroll.goto(`${base}/scroll/`);
  await scroll.waitForFunction(() => document.querySelector('.scroll-video')?.dataset.phase === 'cache', null, { timeout: 45000 });
  check('Named scroll entry retains the original video experience', await scroll.title() === '新东方企业英语培训｜滚屏版' && await scroll.locator('.motion-control').count() === 1 && await scroll.locator('.scroll-spacer').count() === 1);
  await scroll.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await scroll.waitForFunction(() => Number(document.querySelector('.scroll-video').dataset.progress) > .99);
  check('Named scroll entry continues to scrub the video', await scroll.locator('.scroll-video video').evaluate(video => video.paused && !video.autoplay && !video.loop));
  await motion.close();
} finally {
  await browser.close();
  await fs.writeFile(`${output}/report.json`, JSON.stringify(checks, null, 2));
}
console.log(JSON.stringify({ passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass), output }, null, 2));
assert.ok(checks.every(c => c.pass), 'Both saved versions must pass');
