import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { chromium } from 'file:///C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';

const target = 'D:/www/www/chg/demo/docs/design/FY-20260714-UNICARD-admin-low-fidelity.html';
const errors = [];
const checkpoints = [];
const check = (condition, label) => {
  if (!condition) throw new Error(label);
  checkpoints.push(label);
  console.log(`PASS ${label}`);
};
const softCheck = (condition, label) => {
  if (!condition) {
    errors.push(`ASSERTION: ${label}`);
    console.error(`FAIL ${label}`);
    return;
  }
  checkpoints.push(label);
  console.log(`PASS ${label}`);
};

let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'msedge' })
    .catch(() => chromium.launch({ headless: true, channel: 'chrome' }))
    .catch(() => chromium.launch({ headless: true }));
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(`PAGEERROR: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`CONSOLE ERROR: ${message.text()}`);
  });

  console.log('CHECKPOINT goto');
  await page.goto(pathToFileURL(target).href, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.app-shell', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(1500);
  check(await page.locator('.app-shell').isVisible(), 'Snowy application shell visible');
  check(await page.locator('.annotation-toolbar').isVisible(), 'annotation toolbar visible');
  check((await page.locator('body').innerText()).trim().length > 80, 'body is not blank');
  softCheck(await page.locator('.annotation-pin:visible').count() > 0, 'baseline annotation pins visible while mode off');
  check(await page.locator('.annotation-toolbar').getByText('开启', { exact: true }).isVisible(), 'annotation defaults off');

  const menuItems = page.locator('.ant-menu-item');
  check(await menuItems.count() === 49, '49 page menu items rendered');
  for (const id of ['ADM-S-001', 'ADM-P-013', 'API-008', 'PAM-008']) {
    const item = page.locator(`.ant-menu-item[data-menu-id$="${id}"]`).or(page.getByText(id, { exact: false })).first();
    if (await item.isVisible().catch(() => false)) await item.click();
  }

  console.log('CHECKPOINT coverage matrix');
  await page.getByText('原型需求覆盖矩阵', { exact: true }).click();
  const matrix = page.locator('.ant-modal:visible').filter({ hasText: '原型需求覆盖矩阵' }).last();
  check(await matrix.isVisible(), 'coverage matrix opens');
  check(await matrix.locator('tbody tr').count() === 49, 'coverage matrix renders 49 rows');
  check(await matrix.getByText('H5-001', { exact: true }).count() === 0, 'coverage matrix has no H5 row');
  await page.keyboard.press('Escape');

  console.log('CHECKPOINT requirements persistence');
  await page.locator('.annotation-toolbar').getByText('页面需求', { exact: true }).click();
  let drawer = page.locator('.ant-drawer:visible').last();
  softCheck((await drawer.innerText()).includes('整体需求说明'), 'requirement drawer exposes checker-compatible title');
  check(await drawer.locator('.requirement-preview').isVisible(), 'requirement drawer defaults to preview');
  softCheck(await drawer.getByTitle('编辑整体需求描述').count() > 0, 'requirement edit exposes checker-compatible title attribute');
  await drawer.locator('.requirement-preview').hover();
  check(await drawer.locator('.requirement-edit').count() === 1, 'requirement edit control rendered');
  await drawer.locator('.requirement-edit').click({ force: true });
  const textarea = drawer.locator('textarea');
  const original = await textarea.inputValue();
  check(!(await drawer.getByText('保存', { exact: true }).isVisible().catch(() => false)), 'requirement save hidden before change');
  await textarea.fill(`${original}\n[Task5运行时校验]`);
  await page.waitForTimeout(300);
  console.log(`INFO requirement buttons after change: ${JSON.stringify(await drawer.locator('button').allTextContents())}`);
  softCheck(await drawer.getByText('保存', { exact: true }).isVisible().catch(() => false), 'requirement save exposes checker-compatible exact text');
  const saveButton = drawer.locator('.ant-drawer-footer button').first();
  check(await saveButton.isVisible(), 'requirement save visible after change');
  await saveButton.click();
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.app-shell', { state: 'visible', timeout: 30000 });
  await page.locator('.annotation-toolbar').getByText('页面需求', { exact: true }).click();
  drawer = page.locator('.ant-drawer:visible').last();
  check((await drawer.locator('.requirement-preview').innerText()).includes('[Task5运行时校验]'), 'requirement edit persists after reload');
  await drawer.locator('.requirement-preview').hover();
  await drawer.locator('.requirement-edit').click({ force: true });
  await drawer.locator('textarea').fill(original);
  await page.waitForTimeout(300);
  await drawer.locator('.ant-drawer-footer button').first().click();
  await drawer.getByText('关闭', { exact: true }).click();
  await page.locator('.requirement-drawer').waitFor({ state: 'hidden' });
  check(true, 'requirement drawer closes through visible footer action');

  console.log('CHECKPOINT annotation persistence');
  await page.locator('.annotation-toolbar').getByText('开启', { exact: true }).click();
  check(await page.locator('.annotation-toolbar').getByText('关闭', { exact: true }).isVisible(), 'annotation mode enables');
  softCheck(await page.locator('.query-card .ant-form-item-label').first().isVisible().catch(() => false), 'comment target exposes checker-compatible Ant form label');
  const targetLabel = page.locator('.query-card label').first();
  check(await targetLabel.isVisible(), 'commentable query label visible');
  await targetLabel.click();
  const popover = page.locator('.node-comment-popover');
  await popover.locator('textarea').fill('Task5运行时标注\n第二行');
  softCheck(await popover.locator('.node-comment-submit').count() > 0, 'node comment submit exposes checker-compatible class');
  const submitComment = popover.locator('button').last();
  check(await submitComment.isEnabled(), 'node comment submit enables after input');
  await submitComment.click();
  check(await page.locator('.node-comment-pin').last().isVisible(), 'node comment pin saved');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.app-shell', { state: 'visible', timeout: 30000 });
  check(await page.locator('.node-comment-pin').last().isVisible(), 'node comment persists after reload');
  check(await page.locator('.annotation-toolbar').getByText('开启', { exact: true }).isVisible(), 'annotation mode resets off after reload');

  console.log('CHECKPOINT save as');
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  await page.locator('.annotation-toolbar').getByText('另存为', { exact: true }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  check(Boolean(downloadPath), 'save-as download has path');
  const exported = await readFile(downloadPath, 'utf8');
  check(exported.includes('snowy-annotation-state'), 'export embeds annotation state');
  check(exported.includes('Task5运行时标注'), 'export embeds latest node comment');

  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`PASS equivalent runtime browser check (${checkpoints.length} assertions)`);
} catch (error) {
  console.error(`FAIL equivalent runtime browser check: ${error.stack || error}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
}
