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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
page.setDefaultTimeout(4000);
const errors = [];
page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });

try {
  console.log('RUNTIME: open entry');
  await page.goto(entryUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.locator('.unicard-shell').waitFor({ timeout: 5000 });
  console.log('RUNTIME: shell ready');
  assert.match(await page.locator('.brand').innerText(), /宁波市高校一卡通专区/);
  assert.equal(await page.locator('.snowy-sider .ant-menu-item').count(), 33);
  const menuText = await page.locator('.snowy-sider').innerText();
  assert.match(menuText, /学校端/);
  assert.match(menuText, /平台端/);
  assert.doesNotMatch(menuText, /接口中心|PAM|H5/);

  await page.getByText('学生管理', { exact: true }).last().click();
  await page.locator('[data-page-id="ADM-S-003"]').waitFor();
  assert.match(await page.locator('[data-page-id="ADM-S-003"]').innerText(), /身份证号/);
  const firstQuery = page.locator('[data-page-id="ADM-S-003"] .query-card input').first();
  await firstQuery.fill('张同学');
  await page.getByRole('button', { name: /重\s*置/ }).last().click();
  assert.equal(await firstQuery.inputValue(), '');
  await page.getByText('查看详情', { exact: true }).first().click();
  await page.getByText('学生详情').waitFor();
  await page.getByRole('button', { name: /关\s*闭/ }).click();
  console.log('RUNTIME: student flow ready');

  await page.getByText('首页 Banner 管理', { exact: true }).click();
  await page.locator('[data-page-id="ADM-S-006"]').waitFor();
  await page.locator('[data-page-id="ADM-S-006"] .ant-pagination-next').click();
  assert.match(await page.locator('[data-page-id="ADM-S-006"] .ant-pagination-item-active').innerText(), /2/);
  await page.locator('.header-right .ant-select').click();
  await page.getByText('内容运营人员', { exact: true }).last().click();
  assert.equal(await page.locator('[data-page-id="ADM-S-006"]').getByText('删除', { exact: true }).count(), 0);
  await page.locator('.header-right .ant-select').click();
  await page.getByText('学校管理员', { exact: true }).last().click();
  await page.getByRole('button', { name: /新\s*增/ }).click();
  await page.getByText('新增首页 Banner').waitFor();
  const upload = page.locator('.unicard-business-drawer input[type="file"]');
  await upload.setInputFiles({ name: 'banner.png', mimeType: 'image/png', buffer: Buffer.from('prototype-image') });
  await page.getByText('预览图片', { exact: true }).last().click();
  await page.getByText('图片预览').waitFor();
  await page.locator('.ant-modal-wrap:visible .ant-modal-close').click();
  await page.getByText('移除图片', { exact: true }).click();
  await page.getByRole('button', { name: /取\s*消/ }).last().click();
  console.log('RUNTIME: banner flow ready');

  await page.getByText('公告管理', { exact: true }).click();
  await page.locator('[data-page-id="ADM-S-009"]').waitFor();
  await page.getByText('提交审核', { exact: true }).first().click();
  await page.getByRole('button', { name: /确\s*定/ }).click();
  console.log('RUNTIME: notice flow ready');

  await page.getByText('角色管理', { exact: true }).last().click();
  await page.locator('[data-page-id="ADM-P-004"]').waitFor();
  await page.getByText('授权', { exact: true }).first().click();
  await page.getByText('变更核对', { exact: true }).click();
  await page.getByText('变更前权限').waitFor();
  await page.locator('.ant-drawer:visible').getByRole('button', { name: /取\s*消/ }).click();
  console.log('RUNTIME: role flow ready');

  await page.locator('.snowy-sider').getByText('设备状态监控', { exact: true }).click();
  await page.locator('[data-page-id="ADM-S-013"]').waitFor();
  assert.match(await page.locator('[data-page-id="ADM-S-013"]').innerText(), /离线|报警/);

  await page.getByRole('button', { name: /页面需求/ }).click();
  assert.match(await page.locator('.ant-drawer').last().innerText(), /设备|监控/);
  await page.locator('.ant-drawer:visible').getByTitle('编辑整体需求描述').click();
  const requirementEditor = page.locator('.ant-drawer:visible textarea');
  await requirementEditor.fill(`${await requirementEditor.inputValue()} 运行时持久化`);
  await page.locator('.ant-drawer:visible').getByRole('button', { name: /保\s*存/ }).click();
  await page.locator('.ant-drawer:visible').getByRole('button', { name: /关\s*闭/ }).click();
  await page.getByRole('button', { name: /开启/ }).click();
  assert.ok(await page.locator('.annotation-cursor').count());
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /另存为/ }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /annotated.*\.html$/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.unicard-shell').waitFor();
  await page.locator('.snowy-sider').getByText('设备状态监控', { exact: true }).click();
  await page.getByRole('button', { name: /页面需求/ }).click();
  assert.match(await page.locator('.ant-drawer:visible').innerText(), /运行时持久化/);
  const coveragePage = await browser.newPage();
  await coveragePage.goto(pathToFileURL(resolve(root, 'coverage.html')).href, { waitUntil: 'domcontentloaded' });
  await coveragePage.locator('#coverage-body tr').first().waitFor();
  assert.equal(await coveragePage.locator('#coverage-body tr').count(), 49);
  assert.equal(await coveragePage.locator('#coverage-body tr .status.skip').count(), 16);
  await coveragePage.close();
  console.log('RUNTIME: annotation flow ready');

  assert.deepEqual(errors, []);
  console.log('PASS 33-page Snowy admin runtime and annotation workflow');
} catch (error) {
  console.error('RUNTIME ERRORS:', errors.join(' | ') || 'none');
  console.error('RUNTIME PAGE:', (await page.locator('body').innerText().catch(() => '')).slice(0, 2400));
  throw error;
} finally {
  await browser.close();
}
