import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const nodeModules = process.env.NODE_PATH || 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const pnpmRoot = resolve(nodeModules, '.pnpm');
const playwrightPackage = readdirSync(pnpmRoot).find(name => /^playwright@/.test(name));
assert.ok(playwrightPackage, 'bundled Playwright package is missing');
const { chromium } = require(resolve(pnpmRoot, playwrightPackage, 'node_modules/playwright'));
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entryUrl = pathToFileURL(resolve(root, 'index.html')).href;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(8000);
const errors = [];
page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });

try {
  await page.goto(entryUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.locator('.unicard-shell').waitFor();

  // 标注 1：首页按需求展示真实 ECharts 图表。
  await page.locator('[data-page-id="ADM-S-001"]').waitFor();
  assert.match(await page.locator('[data-page-id="ADM-S-001"]').innerText(), /专区用户|校园用户|活跃用户|社保卡码应用量/);
  await page.locator('[data-page-id="ADM-S-001"] .unicard-echart canvas').first().waitFor();
  assert.equal(await page.locator('[data-page-id="ADM-S-001"] .unicard-echart canvas').count(), 2);

  // 标注 2：师生管理只保留菜单分组，不存在独立页面入口。
  assert.equal(await page.locator('.snowy-sider .ant-menu-item').count(), 32);
  assert.equal(await page.locator('.snowy-sider .ant-menu-item').filter({ hasText: /^师生管理$/ }).count(), 0);
  const studentGroup = page.locator('.snowy-sider .ant-menu-submenu-title').filter({ hasText: '师生管理' });
  assert.equal(await studentGroup.count(), 1);
  await studentGroup.click();
  assert.equal(await page.getByText('学生管理', { exact: true }).last().count(), 1);
  assert.equal(await page.getByText('教职工管理', { exact: true }).last().count(), 1);
  assert.equal(await page.getByText('历史学生管理', { exact: true }).last().count(), 1);

  // 标注 3：Banner 详情必须显示图片，并可查看大图。
  await page.locator('.snowy-sider .ant-menu-submenu-title').filter({ hasText: '内容管理' }).click();
  await page.locator('.snowy-sider').getByText('首页 Banner 管理', { exact: true }).click();
  const bannerPage = page.locator('[data-page-id="ADM-S-006"]');
  await bannerPage.waitFor();
  await bannerPage.getByText('查看详情', { exact: true }).first().click();
  const detailDrawer = page.locator('.ant-drawer:visible');
  await detailDrawer.locator('.unicard-detail-image').waitFor();
  assert.ok(await detailDrawer.locator('.unicard-detail-image').getAttribute('src'));
  await detailDrawer.getByRole('button', { name: '查看大图' }).click();
  const previewModal = page.locator('.ant-modal-wrap:visible');
  await previewModal.getByText('Banner 图片预览', { exact: true }).waitFor();
  const previewImage = previewModal.locator('img[alt="Banner 大图预览"]');
  await previewImage.waitFor();
  assert.ok(await previewImage.getAttribute('src'));

  assert.deepEqual(errors, []);
  console.log('PASS 3 annotated requirements: ECharts dashboard, no standalone teacher-student page, Banner detail image preview');
} catch (error) {
  console.error('RUNTIME ERRORS:', errors.join(' | ') || 'none');
  console.error('RUNTIME PAGE:', (await page.locator('body').innerText().catch(() => '')).slice(0, 2400));
  throw error;
} finally {
  await browser.close();
}
