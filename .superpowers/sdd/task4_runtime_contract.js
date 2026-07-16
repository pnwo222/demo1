const { chromium } = require('playwright');
const path = require('path');
function check(value, message) { if (!value) throw new Error(message); }
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));
  const target = 'file:///' + path.resolve('docs/design/FY-20260714-UNICARD-admin-low-fidelity.html').replace(/\\/g, '/');
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.annotation-pin');
  const baseline = await page.locator('.annotation-pin').first().evaluate(el => ({ id: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(baseline.nodeKey === 'ADM-S-001:query-card', 'automatic pin lacks stable page nodeKey');
  await page.locator('.annotation-pin').first().click();
  const drawer = page.locator('.ant-drawer:visible');
  await drawer.getByText('删除自动标注', { exact: true }).click();
  await page.waitForTimeout(150);
  check((await page.locator('.annotation-pin').count()) === 0, 'hidden baseline automatic pin still visible');
  await drawer.getByRole('button', { name: '恢复隐藏的自动标注' }).click();
  await page.waitForSelector('.annotation-pin');
  const restored = await page.locator('.annotation-pin').first().evaluate(el => ({ id: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(JSON.stringify(restored) === JSON.stringify(baseline), 'restored automatic pin changed baseline binding');
  const pamType = await page.evaluate(() => pageSpecs.find(spec => spec.id === 'PAM-002').pageType);
  check(pamType === '敏感配置管理', 'PAM-002 pageType mismatch');
  check(errors.length === 0, errors.join('; '));
  console.log(JSON.stringify({ automaticPin: baseline, hiddenAndRestored: true, pamType, errors: 0 }));
  await browser.close();
})().catch(error => { console.error(error.stack || error.message); process.exit(1); });
