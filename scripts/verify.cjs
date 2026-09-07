const { chromium } = require('/Users/xdf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const url = process.env.ENTERPRISE_PREVIEW_URL || 'http://127.0.0.1:4199/enterprise-training-landing/';
const output = process.env.ENTERPRISE_QA_OUTPUT || '/Users/xdf/.codex/visualizations/2026/07/22/019f878d-5fe4-73f0-8465-9ff985ebfd37/enterprise-training/review-2026-09-07';
const report = { checks: [], viewports: [] };
function check(name, condition) { assert.ok(condition, name); report.checks.push(name); }
async function load(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { page, errors };
}
async function snapshot(page, name) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: name.endsWith('full') });
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [320, 390, 768, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const { page, errors } = await load(context);
      const dom = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
        return {
          width: innerWidth, height: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth > innerWidth,
          invalidAnchors: [...document.querySelectorAll('a[href^="#"]')].map(e => e.hash.slice(1)).filter(id => !document.getElementById(id)),
          duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
          contactTop: document.querySelector('#contact').getBoundingClientRect().top,
          imagesLoaded: [...document.images].every(i => i.complete && i.naturalWidth > 0),
          brandLogos: document.querySelectorAll('img[src^="assets/brands/"]').length,
          h1Count: document.querySelectorAll('h1').length,
          remoteResources: performance.getEntriesByType('resource').filter(r => !r.name.startsWith(location.origin)).map(r => r.name),
          scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
        };
      });
      check(`${width}px: no horizontal overflow`, !dom.overflow);
      check(`${width}px: anchors/IDs/headings valid`, dom.invalidAnchors.length === 0 && dom.duplicateIds.length === 0 && dom.h1Count === 1);
      check(`${width}px: no failed images or runtime errors`, dom.imagesLoaded && errors.length === 0);
      check(`${width}px: brand, project and partner logos present`, dom.brandLogos === 9);
      check(`${width}px: no remote runtime dependencies`, dom.remoteResources.length === 0);
      check(`${width}px: reduced motion honored`, dom.scrollBehavior === 'auto');
      report.viewports.push(dom);
      if (width === 390 || width === 1440) {
        await snapshot(page, `verified-${width}-hero`);
        await snapshot(page, `verified-${width}-full`);
        await page.locator('.proof-band').screenshot({ path: path.join(output, `verified-${width}-project-logos.png`) });
        await page.locator('.partner-block').screenshot({ path: path.join(output, `verified-${width}-partner-logos.png`) });
        await page.locator('#solutions').evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 90));
        await snapshot(page, `verified-${width}-solutions`);
        await page.locator('#ai-reading').evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 90));
        await snapshot(page, `verified-${width}-reading`);
        await page.locator('#contact').evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 90));
        await snapshot(page, `verified-${width}-contact`);
      }
      if (width < 800) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator('.menu-toggle').click();
        check(`${width}px: menu label opens`, await page.locator('.menu-toggle').getAttribute('aria-label') === '关闭导航');
        await page.keyboard.press('Escape');
        check(`${width}px: Escape closes menu and returns focus`, await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'false' && await page.locator('.menu-toggle').evaluate(e => document.activeElement === e));
        await page.locator('#solutions').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => !document.querySelector('#mobile-consult').hidden);
        check(`${width}px: mobile inquiry visible during browsing`, await page.locator('#mobile-consult').isVisible());
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('#mobile-consult').hidden);
        check(`${width}px: mobile inquiry hides at contact`, !(await page.locator('#mobile-consult').isVisible()));
      }
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
    const { page, errors } = await load(context);
    await page.locator('#goal-global').focus();
    await page.keyboard.press('ArrowRight');
    check('Scenario keyboard selection updates content and inquiry', await page.locator('#goal-business').getAttribute('aria-selected') === 'true' && await page.locator('#goal').inputValue() === 'business' && (await page.locator('#scenario-title').textContent()).includes('介绍方案'));
    await page.keyboard.press('End');
    check('Scenario End key selects foundation', await page.locator('#goal-foundation').getAttribute('aria-selected') === 'true');
    await page.locator('#scenario-cta').click();
    check('Contextual CTA retains selected goal', await page.locator('#goal').inputValue() === 'foundation');
    await page.locator('#learn-sentence').click();
    check('Sentence preview switches and relabels panel', await page.locator('#learning-panel').getAttribute('aria-labelledby') === 'learn-sentence' && await page.locator('.grammar-key').isVisible());
    await page.keyboard.press('ArrowDown');
    check('Vertical learning tabs support keyboard', await page.locator('#learn-speaking').getAttribute('aria-selected') === 'true');
    await page.locator('.course-catalog summary').click();
    check('Course catalogue expands', await page.locator('.catalog-grid').isVisible());
    await page.locator('.faq-list summary').first().click();
    check('FAQ expands', await page.locator('.faq-list details').first().getAttribute('open') !== null);

    await page.locator('#goal').selectOption('');
    await page.locator('.form-submit').click();
    check('Missing goal shows inline error and focuses field', await page.locator('#goal-error').isVisible() && await page.locator('#goal').evaluate(e => document.activeElement === e));
    await page.locator('#company').fill('测试团队 <img src=x onerror=alert(1)>');
    await page.locator('#goal').selectOption('business');
    await page.locator('#size').selectOption({ label: '21–50 人' });
    await page.locator('#timing').selectOption({ label: '1–3 个月内' });
    const networkBefore = await page.evaluate(() => performance.getEntriesByType('resource').length);
    await page.locator('.form-submit').click();
    const summary = await page.locator('#inquiry-summary').inputValue();
    check('Summary contains chosen details as plain text', summary.includes('测试团队 <img src=x onerror=alert(1)>') && summary.includes('业务表达') && summary.includes('21–50 人'));
    check('No lead is transmitted or injected', await page.evaluate(() => performance.getEntriesByType('resource').length) === networkBefore && await page.locator('img[src="x"]').count() === 0);
    check('Summary focuses visible result and reports unsent status', await page.locator('#result-title').evaluate(e => document.activeElement === e) && (await page.locator('#result-title').textContent()).includes('尚未发送'));
    await page.locator('#copy-summary').click();
    check('Clipboard success copies exact summary', await page.evaluate(() => navigator.clipboard.readText()) === summary);
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('denied by QA'); }; });
    await page.locator('#copy-summary').click();
    check('Clipboard denial provides selection fallback', (await page.locator('#copy-status').textContent()).includes('手动复制') && await page.locator('#inquiry-summary').evaluate(e => e.selectionEnd - e.selectionStart === e.value.length));
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#download-summary').click();
    const download = await downloadEvent;
    await download.saveAs(path.join(output, 'verified-inquiry.txt'));
    check('UTF-8 download contains complete inquiry', (await fs.readFile(path.join(output, 'verified-inquiry.txt'), 'utf8')).includes(summary));
    await page.locator('#company').fill('新的测试团队');
    check('Editing a field hides stale summary', !(await page.locator('#inquiry-result').isVisible()));
    check('Confirmed planner identity is visible', await page.locator('#planner-name').textContent() === '胡婷 Maggie' && (await page.locator('#sales-channels h3').textContent()) === '企业培训规划师' && !(await page.locator('#sales-pending').isVisible()));
    check('Confirmed contact links match supplied details', await page.locator('#sales-links a[href="mailto:huting20@xdf.cn"]').count() === 1 && await page.locator('#sales-links a[href="tel:15811383545"]').count() === 1);
    const emailDraft = new URL(await page.locator('#email-summary').getAttribute('href'));
    check('Production email draft preserves exact recipient and inquiry', emailDraft.pathname === 'huting20@xdf.cn' && emailDraft.searchParams.get('body') === summary && emailDraft.searchParams.get('subject') === '企业英语培训需求咨询');
    check('No runtime errors during full interaction flow', errors.length === 0);
    await context.close();

    for (const [name, config, expected] of [
      ['empty', {}, 0],
      ['invalid', { email: 'bad\r\n@example.test', phone: '--------', consultationUrl: 'javascript:alert(1)', wechatId: '<script>' }, 0],
      ['valid', { email: 'sales@example.test', phone: '+86 010 5555 0101', consultationUrl: 'https://example.test/consult', wechatId: 'sales_test' }, 4]
    ]) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      await context.route('**/sales-config.js', route => route.fulfill({ contentType: 'text/javascript', body: `window.ENTERPRISE_SALES = ${JSON.stringify(config)};` }));
      const { page } = await load(context);
      check(`${name} contact configuration is validated`, await page.locator('#sales-links > *').count() === expected);
      check(`${name} pending state matches available channels`, await page.locator('#sales-pending').isVisible() === !expected);
      if (expected) {
        await page.locator('#goal').selectOption('discuss');
        await page.locator('.form-submit').click();
        check('Configured email receives encoded inquiry draft', (await page.locator('#email-summary').getAttribute('href')).startsWith('mailto:sales@example.test?subject=') && (await page.locator('#email-summary').getAttribute('href')).includes('&body='));
      }
      await context.close();
    }
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const nojsPage = await nojs.newPage();
    await nojsPage.goto(url);
    check('No-JS form cannot send default GET request', await nojsPage.locator('.form-submit').isDisabled());
    check('No-JS contact details remain available', await nojsPage.locator('#planner-name').textContent() === '胡婷 Maggie' && await nojsPage.locator('#sales-links a[href="mailto:huting20@xdf.cn"]').isVisible() && await nojsPage.locator('#sales-links a[href="tel:15811383545"]').isVisible() && !(await nojsPage.locator('#sales-pending').isVisible()));
    await nojsPage.locator('.course-catalog summary').click();
    check('No-JS catalogue remains available', await nojsPage.locator('.catalog-grid').isVisible());
    await nojs.close();
    await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ passed: report.checks.length, viewports: report.viewports, output }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
