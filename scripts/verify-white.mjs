import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const base = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4202';
const output = '/tmp/xdf-white-version-qa';
const checks = [];
const check = (name, pass) => checks.push({ name, pass: Boolean(pass) });
await fs.mkdir(output, { recursive: true });
const files = execFileSync('git', ['ls-tree', '-r', '--name-only', '1586cba', 'src'], { encoding: 'utf8' }).trim().split('\n');
for (const file of files) {
  const original = execFileSync('git', ['show', `1586cba:${file}`], { encoding: 'utf8' });
  const expected = original.replace(/from '(\.\.\/)+assets\//g, match => match.replace("from '", "from '../"));
  check(`White source preserved: ${file}`, (await fs.readFile(`white/${file}`, 'utf8')).trimEnd() === expected.trimEnd());
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [320, 390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await ctx.route('https://fonts.googleapis.com/**', route => route.abort());
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/white/`, { waitUntil: 'networkidle' });
    await page.locator('.hero-poster').evaluate(img => img.decode());
    check(`${width}: white background and original compact hero`, await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(249, 250, 251)' && document.querySelector('#home').getBoundingClientRect().height === 600));
    check(`${width}: no cinematic scroll layer or modal`, await page.locator('.scroll-video, canvas, .scroll-spacer, dialog').count() === 0);
    check(`${width}: original H3 media and logo marquee retained`, await page.locator('.hero-media video').evaluate(v => v.src.includes('enterprise-learning-h3') && v.loop) && await page.locator('.marquee-mask').count() === 1);
    check(`${width}: no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `${output}/${width}-white.png` });
    await page.locator('#goal-business').click();
    await page.getByRole('button', { name: '咨询业务表达方案', exact: true }).click();
    check(`${width}: inquiry selection stays within white version`, await page.locator('#goal').inputValue() === 'business' && new URL(page.url()).pathname === '/white/');
    await page.locator('#company').fill('白底原版验证');
    await page.getByRole('button', { name: '生成咨询摘要', exact: true }).click();
    check(`${width}: original local-only inquiry works`, (await page.locator('#inquiry-summary').inputValue()).includes('白底原版验证') && (await page.locator('#result-title').textContent()).includes('尚未发送'));
    check(`${width}: Maggie contact retained`, await page.locator('a[href="mailto:huting20@xdf.cn"]').count() === 1 && await page.locator('a[href="tel:15811383545"]').count() === 1);
    check(`${width}: no runtime errors`, errors.length === 0);
    await ctx.close();
  }
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  await ctx.route('https://fonts.googleapis.com/**', route => route.abort());
  const page = await ctx.newPage();
  await page.goto(`${base}/scroll/`, { waitUntil: 'networkidle' });
  check('Dark scroll entry retains its own styles and full content', await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(10, 10, 10)' && document.querySelectorAll('.content-chapter').length === 5 && !document.querySelector('.site-shell')));
  await page.screenshot({ path: `${output}/1440-scroll.png` });
  await page.goto(`${base}/white/#contact`, { waitUntil: 'networkidle' });
  check('White direct contact link is visible after returning from dark version', await page.locator('#contact-title').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; }));
  check('Entry styles do not leak across versions', await page.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgb(249, 250, 251)' && !document.querySelector('.cinematic-page')));
  await ctx.close();
} finally {
  await browser.close();
  await fs.writeFile(`${output}/report.json`, JSON.stringify(checks, null, 2));
}
console.log(JSON.stringify({ passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass), output }, null, 2));
assert.ok(checks.every(c => c.pass), 'Saved versions must match the requested designs');
