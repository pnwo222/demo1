import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node runtime_check_admin_prototype.mjs <admin-prototype.html>');
    process.exit(2);
  }

  const filePath = resolve(target);
  if (!existsSync(filePath)) {
    console.error(`FAIL file not found: ${filePath}`);
    process.exit(2);
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    console.error('FAIL Playwright is not available to local node. Install/use Playwright, or use Codex browser/node_repl runtime check instead.');
    console.error(String(error && error.message || error));
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: true, channel: 'msedge' })
    .catch(() => chromium.launch({ headless: true, channel: 'chrome' }))
    .catch(() => chromium.launch({ headless: true }));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const warnings = [];

  page.on('pageerror', error => errors.push(`PAGEERROR: ${error.message || error}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`CONSOLE ERROR: ${message.text()}`);
    if (message.type() === 'warning') warnings.push(`CONSOLE WARN: ${message.text()}`);
  });

  await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.trim().length < 80) {
    errors.push('Rendered body text is too short; possible blank page.');
  }

  const menuItems = await page.locator('.ant-menu-item').all();
  const maxMenuClicks = Math.min(menuItems.length, 20);
  for (let index = 0; index < maxMenuClicks; index += 1) {
    const item = page.locator('.ant-menu-item').nth(index);
    if (await item.isVisible().catch(() => false)) {
      await item.click({ timeout: 5000 }).catch(error => {
        errors.push(`MENU CLICK FAILED ${index}: ${error.message}`);
      });
      await page.waitForTimeout(150);
    }
  }

  const buttonTexts = ['查询', '重置', '新增', '详情', '编辑', '删除', '导入', '导出'];
  for (const text of buttonTexts) {
    const candidate = page.getByText(text, { exact: true }).first();
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click({ timeout: 5000 }).catch(error => {
        errors.push(`CLICK FAILED ${text}: ${error.message}`);
      });
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(150);
    }
  }

  await browser.close();

  for (const warning of warnings) console.log(`WARN ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exit(1);
  }
  console.log(`PASS runtime browser check: ${filePath}`);
}

main().catch(error => {
  console.error(`FAIL runtime check crashed: ${error && error.stack || error}`);
  process.exit(1);
});
