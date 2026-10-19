import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const base = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4202';
const output = '/tmp/xdf-white-version-qa';
const checks = [];
const check = (name, pass) => checks.push({ name, pass: Boolean(pass) });
await fs.mkdir(output, { recursive: true });
// The white page now has approved AI-course additions. Keep exact preservation
// checks for unchanged primitives, and verify the evolving page through behavior.
const files = ['src/components/Marquee.tsx', 'src/lib.ts', 'src/main.tsx'];
for (const file of files) {
  const original = execFileSync('git', ['show', `1586cba:${file}`], { encoding: 'utf8' });
  const expected = original
    .replace(/from '(\.\.\/)+assets\//g, match => match.replace("from '", "from '../"))
    .replaceAll('胡婷 Maggie', '胡经理');
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
    check(`${width}: planner contact retained`, await page.locator('a[href="mailto:huting20@xdf.cn"]').count() === 1 && await page.locator('a[href="tel:15811383545"]').count() === 1);
    await page.getByRole('button', { name: '咨询 AI 外刊精读方案', exact: true }).click();
    check(`${width}: reading interest is carried into the inquiry`, await page.locator('#learning-interest').inputValue() === 'reading' && await page.locator('#inquiry-result').count() === 0);
    for (const project of [
      { id: 'ai-speaking', value: 'speaking', name: 'AI 口语外教', button: '咨询AI 口语外教方案' },
      { id: 'word-camp', value: 'vocabulary', name: '单词训练营', button: '咨询单词训练营方案' },
    ]) {
      const section = page.locator(`#${project.id}`);
      const tabs = section.getByRole('tab');
      check(`${width}: ${project.id} has four accessible learning steps`, await tabs.count() === 4 && await section.getByRole('tabpanel').count() === 1);
      for (let index = 0; index < 4; index++) {
        await tabs.nth(index).click();
        await section.locator('img').evaluate(image => image.decode());
        check(`${width}: ${project.id} step ${index + 1} loads the original product image`, await section.locator('img').evaluate(image => image.naturalWidth > 0 && image.getBoundingClientRect().width <= innerWidth) && await tabs.nth(index).getAttribute('aria-selected') === 'true');
      }
      await tabs.first().focus();
      await page.keyboard.press('ArrowRight');
      check(`${width}: ${project.id} supports keyboard step changes`, await tabs.nth(1).evaluate(tab => document.activeElement === tab) && await tabs.nth(1).getAttribute('aria-selected') === 'true');
      await section.screenshot({ path: `${output}/${width}-${project.id}.png` });
      await page.getByRole('button', { name: project.button, exact: true }).click();
      check(`${width}: ${project.id} consultation keeps selected interest and goal`, await page.locator('#learning-interest').inputValue() === project.value && await page.locator('#goal').inputValue() === 'business' && new URL(page.url()).pathname === '/white/');
      await page.getByRole('button', { name: '生成咨询摘要', exact: true }).click();
      const summary = await page.locator('#inquiry-summary').inputValue();
      const draft = new URL(await page.locator('#email-summary').getAttribute('href'));
      check(`${width}: ${project.id} summary and email draft retain the selected project`, summary.includes(`关注 AI 学习项目：${project.name}`) && draft.pathname === 'huting20@xdf.cn' && draft.searchParams.get('body') === summary);
      check(`${width}: ${project.id} introduces no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.getByText('六种学习方式，可以如何组合？', { exact: true }).click();
    check(`${width}: course catalogue contains all six services`, await page.locator('#solutions details h3').count() === 6);
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
  for (const anchor of ['ai-speaking', 'word-camp']) {
    await page.goto(`${base}/white/#${anchor}`, { waitUntil: 'networkidle' });
    check(`White direct ${anchor} link restores the requested service`, await page.locator(`#${anchor}`).evaluate(element => { const bounds = element.getBoundingClientRect(); return bounds.top >= -1 && bounds.top < innerHeight; }));
  }
  await ctx.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await nojs.newPage();
  await fallback.goto(`${base}/white/`);
  check('No-JS fallback includes both new learning services and contact channels', await fallback.getByRole('heading', { name: 'AI 口语外教', exact: true }).isVisible() && await fallback.getByRole('heading', { name: '单词训练营 · 酷酷背', exact: true }).isVisible() && await fallback.locator('a[href="mailto:huting20@xdf.cn"]').isVisible());
  await nojs.close();
} finally {
  await browser.close();
  await fs.writeFile(`${output}/report.json`, JSON.stringify(checks, null, 2));
}
console.log(JSON.stringify({ passed: checks.filter(c => c.pass).length, failed: checks.filter(c => !c.pass), output }, null, 2));
assert.ok(checks.every(c => c.pass), 'Saved versions must match the requested designs');
