import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function isVisible(locator) {
  return locator.isVisible().catch(() => false);
}

async function requireVisible(locator, label, errors) {
  if (await isVisible(locator)) return true;
  errors.push(`MISSING OR HIDDEN: ${label}`);
  return false;
}

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
  const source = await readFile(filePath, 'utf8');
  const requiredSourceMarkers = [
    'snowy-prototype-kit-v1',
    'snowy-component-manifest',
    'SNOWY_COMPONENTS_SOURCE_START',
    'SNOWY_ANNOTATION_COMPONENT_START',
    'snowy-annotation-toolbar',
    'createSnowyAnnotationComponent',
    'saveAsHtml',
    'snowy-annotation-state',
  ];
  for (const marker of requiredSourceMarkers) {
    if (!source.includes(marker)) errors.push(`SOURCE MARKER MISSING: ${marker}`);
  }
  if (source.includes('annotation-card')) errors.push('OBSOLETE STRUCTURE FOUND: annotation-card');

  page.on('pageerror', error => errors.push(`PAGEERROR: ${error.message || error}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`CONSOLE ERROR: ${message.text()}`);
    if (message.type() === 'warning') warnings.push(`CONSOLE WARN: ${message.text()}`);
  });

  await page.goto(pathToFileURL(filePath).href, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  await requireVisible(page.locator('.snowy-app-shell'), 'Snowy application shell', errors);
  await requireVisible(page.locator('.snowy-annotation-toolbar'), 'top annotation toolbar', errors);

  const annotationToggle = page.locator('.snowy-annotation-toolbar button', { hasText: '开启标注' });
  await requireVisible(annotationToggle, 'annotation mode defaults to off', errors);

  const generatedPins = page.locator('.snowy-comment-pin:visible');
  if (await generatedPins.count() === 0) errors.push('Generated annotation bubbles are not visible while annotation mode is off.');

  const requirementButton = page.locator('.snowy-annotation-toolbar button', { hasText: '页面需求' });
  if (await requireVisible(requirementButton, '页面需求 toolbar action', errors)) {
    await requirementButton.click();
    const requirementDrawer = page.locator('.ant-drawer:visible').filter({ hasText: '整体需求说明' }).last();
    if (await requireVisible(requirementDrawer, '页面需求 drawer', errors)) {
      const preview = requirementDrawer.locator('.snowy-annotation-preview');
      await requireVisible(preview, '页面需求 default preview', errors);
      if (await isVisible(requirementDrawer.locator('textarea'))) {
        errors.push('页面需求 opened directly in edit mode; preview must be the default.');
      }

      const editRequirement = requirementDrawer.locator('.snowy-inline-edit');
      if (await requireVisible(editRequirement, '页面需求 edit action', errors)) {
        await editRequirement.click();
        const textarea = requirementDrawer.locator('textarea');
        if (await requireVisible(textarea, '页面需求 textarea after edit', errors)) {
          const originalRequirement = await textarea.inputValue();
          const saveBeforeChange = requirementDrawer.getByText('保存', { exact: true });
          if (await isVisible(saveBeforeChange)) errors.push('页面需求 Save is visible before content changes.');

          const runtimeRequirement = `${originalRequirement}\n[运行时校验]`;
          await textarea.fill(runtimeRequirement);
          const saveRequirement = requirementDrawer.getByText('保存', { exact: true });
          if (await requireVisible(saveRequirement, '页面需求 Save after change', errors)) {
            await saveRequirement.click();
            if (!await isVisible(requirementDrawer.locator('.snowy-annotation-preview'))) {
              errors.push('页面需求 did not return to preview after Save.');
            }
          }

          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(800);
          await page.locator('.snowy-annotation-toolbar button', { hasText: '页面需求' }).click();
          const reloadedDrawer = page.locator('.ant-drawer:visible').filter({ hasText: '整体需求说明' }).last();
          const reloadedPreview = reloadedDrawer.locator('.snowy-annotation-preview');
          if (!(await reloadedPreview.textContent().catch(() => '')).includes('[运行时校验]')) {
            errors.push('页面需求 edit was not persisted after reload.');
          }

          await reloadedDrawer.locator('.snowy-inline-edit').click();
          await reloadedDrawer.locator('textarea').fill(originalRequirement);
          const restoreSave = reloadedDrawer.getByText('保存', { exact: true });
          if (await isVisible(restoreSave)) await restoreSave.click();
          const closeRequirement = reloadedDrawer.getByText('关闭', { exact: true });
          if (await isVisible(closeRequirement)) await closeRequirement.click();
        }
      }
    }
  }

  const enableAnnotation = page.locator('.snowy-annotation-toolbar button', { hasText: '开启标注' });
  if (await requireVisible(enableAnnotation, 'annotation enable action', errors)) {
    await enableAnnotation.click();
    await requireVisible(page.locator('.snowy-annotation-toolbar button', { hasText: '关闭标注' }), 'annotation mode enabled state', errors);
    const commentTarget = page.locator('.snowy-query-card [data-node-key]').first();
    if (await requireVisible(commentTarget, 'commentable business node', errors)) {
      await commentTarget.hover();
      await commentTarget.click();
      const commentPopover = page.locator('.snowy-comment-popover');
      if (await requireVisible(commentPopover, 'node comment input', errors)) {
        const commentTextarea = commentPopover.locator('textarea');
        if (await requireVisible(commentTextarea, 'multiline node comment textarea', errors)) {
          await commentTextarea.fill('运行时标注校验\n第二行');
          await commentPopover.locator('.snowy-comment-send').click();
          await page.waitForTimeout(300);
          await requireVisible(page.locator('.snowy-comment-pin').last(), 'saved node comment bubble', errors);
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(800);
          await requireVisible(page.locator('.snowy-comment-pin').last(), 'persisted node comment bubble after reload', errors);
          await requireVisible(page.locator('.snowy-annotation-toolbar button', { hasText: '开启标注' }), 'annotation mode resets to off after reload', errors);
        }
      }
    }
  }

  const saveAsButton = page.locator('.snowy-annotation-toolbar button', { hasText: '另存为' });
  if (await requireVisible(saveAsButton, '另存为 toolbar action', errors)) {
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(error => {
      errors.push(`SAVE AS DOWNLOAD FAILED: ${error.message}`);
      return null;
    });
    await saveAsButton.click();
    const download = await downloadPromise;
    if (download) {
      const downloadPath = await download.path().catch(() => '');
      if (!downloadPath) {
        errors.push('SAVE AS DOWNLOAD PATH MISSING');
      } else {
        const exportedHtml = await readFile(downloadPath, 'utf8');
        if (!exportedHtml.includes('snowy-annotation-state')) errors.push('Exported HTML is missing embedded annotation state.');
        if (!exportedHtml.includes('运行时标注校验')) errors.push('Exported HTML is missing the latest user annotation.');
      }
    }
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.trim().length < 80) {
    errors.push('Rendered body text is too short; possible blank page.');
  }

  const menuItems = await page.locator('.snowy-menu-item').all();
  const maxMenuClicks = Math.min(menuItems.length, 20);
  for (let index = 0; index < maxMenuClicks; index += 1) {
    const item = page.locator('.snowy-menu-item').nth(index);
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
