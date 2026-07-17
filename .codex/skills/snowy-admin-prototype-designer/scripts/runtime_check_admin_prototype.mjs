import { existsSync, readdirSync, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function isVisible(locator) {
  return locator.isVisible().catch(() => false);
}

async function requireVisible(locator, label, errors) {
  if (await isVisible(locator)) return true;
  errors.push(`MISSING OR HIDDEN: ${label}`);
  return false;
}

async function closeVisibleOverlays(page) {
  for (const selector of ['.ant-modal-wrap:visible .ant-modal-close', '.ant-drawer:visible .ant-drawer-close']) {
    const controls = page.locator(selector);
    for (let index = (await controls.count()) - 1; index >= 0; index -= 1) {
      await controls.nth(index).click({ force: true }).catch(() => {});
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);
}

const normalizeText = value => String(value || '').replace(/\s+/g, ' ').trim();

async function readPrototypeSources(rootDirectory) {
  const files = [];
  const visit = directory => {
    for (const name of readdirSync(directory)) {
      const path = resolve(directory, name);
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(?:html|css|js|mjs|json)$/i.test(name)) files.push(path);
    }
  };
  visit(rootDirectory);
  return (await Promise.all(files.map(path => readFile(path, 'utf8')))).join('\n');
}

async function validateDeclaredPage(page, pageContract, screenshotDirectory, errors) {
  if (pageContract.activateSelector) {
    const activation = page.locator(pageContract.activateSelector).first();
    if (await requireVisible(activation, `${pageContract.id} activation`, errors)) {
      await activation.click();
      await page.waitForTimeout(250);
    }
  }
  const root = page.locator(pageContract.rootSelector).first();
  if (!await requireVisible(root, `${pageContract.id} page root`, errors)) return;
  const query = root.locator(pageContract.query.rootSelector).first();
  const table = root.locator(pageContract.table.rootSelector).first();
  if (!await requireVisible(query, `${pageContract.id} query form`, errors)) return;
  if (!await requireVisible(table, `${pageContract.id} data table`, errors)) return;

  const queryBox = await query.boundingBox();
  const tableBox = await table.boundingBox();
  if (queryBox && tableBox) {
    if (queryBox.y >= tableBox.y) errors.push(`LAYOUT ${pageContract.id}: query area must be before table area`);
    const actualGap = Math.round(tableBox.y - (queryBox.y + queryBox.height));
    if (Math.abs(actualGap - Number(pageContract.layout.queryTableGap)) > 3) {
      errors.push(`LAYOUT ${pageContract.id}: query/table gap ${actualGap}px differs from contract ${pageContract.layout.queryTableGap}px`);
    }
  }

  const layout = await Promise.all([query, table].map(locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { padding: style.padding, borderRadius: style.borderRadius };
  })));
  if (layout[0].padding !== pageContract.layout.queryPadding) {
    errors.push(`LAYOUT ${pageContract.id}: query padding ${layout[0].padding} differs from ${pageContract.layout.queryPadding}`);
  }
  if (layout[1].padding !== pageContract.layout.tablePadding) {
    errors.push(`LAYOUT ${pageContract.id}: table padding ${layout[1].padding} differs from ${pageContract.layout.tablePadding}`);
  }
  if (layout.some(item => item.borderRadius !== pageContract.layout.cardBorderRadius)) {
    errors.push(`LAYOUT ${pageContract.id}: card border radius differs from ${pageContract.layout.cardBorderRadius}`);
  }

  const controlSelectors = {
    input: '.ant-input',
    select: '.ant-select',
    'date-range': '.ant-picker-range',
    date: '.ant-picker',
    tree: '.ant-select-tree, .ant-tree-select',
  };
  const formItems = query.locator('.ant-form-item');
  for (const field of pageContract.query.fields) {
    const item = formItems.filter({ hasText: field.label }).first();
    if (!await requireVisible(item, `${pageContract.id} query field ${field.label}`, errors)) continue;
    const selector = controlSelectors[field.control];
    if (!selector) {
      errors.push(`CONTRACT ${pageContract.id}: unsupported query control ${field.control}`);
    } else {
      await requireVisible(item.locator(selector).first(), `${pageContract.id} query control ${field.label}/${field.control}`, errors);
    }
  }

  const queryButtons = (await query.locator('button').allTextContents()).map(normalizeText).filter(Boolean);
  let previousAction = -1;
  for (const action of pageContract.query.actions) {
    const compactAction = action.replace(/\s+/g, '');
    const actionIndex = queryButtons.findIndex(text => text.replace(/\s+/g, '').endsWith(compactAction));
    if (actionIndex < 0) errors.push(`MISSING ${pageContract.id}: query action ${action}`);
    if (actionIndex >= 0 && actionIndex <= previousAction) errors.push(`ORDER ${pageContract.id}: query action ${action} is out of Demo order`);
    if (actionIndex >= 0) previousAction = actionIndex;
  }

  const headers = (await table.locator('thead th').allTextContents()).map(normalizeText);
  for (const field of pageContract.table.fields) {
    if (!headers.includes(field)) errors.push(`MISSING ${pageContract.id}: table field ${field}`);
  }
  const tableText = normalizeText(await table.innerText());
  for (const action of pageContract.table.toolbarActions) {
    if (!tableText.includes(action)) errors.push(`MISSING ${pageContract.id}: table toolbar action ${action}`);
  }
  if (pageContract.table.pagination) {
    await requireVisible(table.locator('.ant-pagination').first(), `${pageContract.id} pagination`, errors);
  }

  for (const annotation of pageContract.annotations) {
    const target = root.locator(annotation.targetSelector).first();
    const marker = root.locator(annotation.markerSelector).first();
    await requireVisible(target, `${pageContract.id} annotation target ${annotation.id}`, errors);
    await requireVisible(marker, `${pageContract.id} automatic annotation marker ${annotation.id}`, errors);
  }

  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: resolve(screenshotDirectory, `${pageContract.id}.png`), fullPage: true });
  }
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node runtime_check_admin_prototype.mjs <admin-prototype.html> [screenshot-directory]');
    process.exit(2);
  }

  const filePath = resolve(target);
  const screenshotDirectory = process.argv[3] ? resolve(process.argv[3]) : '';
  if (!existsSync(filePath)) {
    console.error(`FAIL file not found: ${filePath}`);
    process.exit(2);
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    const require = createRequire(import.meta.url);
    const nodeModules = process.env.NODE_PATH
      || 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
    const pnpmRoot = resolve(nodeModules, '.pnpm');
    const playwrightPackage = existsSync(pnpmRoot)
      ? readdirSync(pnpmRoot).find(name => /^playwright@/.test(name))
      : '';
    if (!playwrightPackage) {
      console.error('FAIL Playwright is not available to local node or the bundled Codex runtime.');
      console.error(String(error && error.message || error));
      process.exit(2);
    }
    ({ chromium } = require(resolve(pnpmRoot, playwrightPackage, 'node_modules/playwright')));
  }

  const browser = await chromium.launch({ headless: true, channel: 'msedge' })
    .catch(() => chromium.launch({ headless: true, channel: 'chrome' }))
    .catch(() => chromium.launch({ headless: true }));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const warnings = [];
  const source = await readPrototypeSources(dirname(filePath));
  const contractPath = resolve(dirname(filePath), 'prototype-contract.json');
  let pageContract;
  try {
    pageContract = JSON.parse(await readFile(contractPath, 'utf8'));
  } catch (error) {
    console.error(`FAIL unable to read prototype contract: ${contractPath}: ${error.message}`);
    process.exit(1);
  }
  const requiredSourceMarkers = [
    'snowy-admin-prototype-v2',
    'annotation-toolbar',
    'const annotationEnabled = ref(false)',
    'pageRequirements',
    'requirementDrawerOpen',
    'saveAsAnnotatedHtml',
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

  await requireVisible(page.locator('.app-shell'), 'Snowy application shell', errors);
  await requireVisible(page.locator('.annotation-toolbar'), 'top annotation toolbar', errors);

  for (const contractPage of pageContract.pages || []) {
    await validateDeclaredPage(page, contractPage, screenshotDirectory, errors);
  }

  const annotationToggle = page.locator('.annotation-toolbar').getByText('开启', { exact: true });
  await requireVisible(annotationToggle, 'annotation mode defaults to off', errors);

  const generatedPins = page.locator('.annotation-pin:visible');
  if (await generatedPins.count() === 0) errors.push('Generated annotation bubbles are not visible while annotation mode is off.');

  const requirementButton = page.locator('.annotation-toolbar').getByText('页面需求', { exact: true });
  if (await requireVisible(requirementButton, '页面需求 toolbar action', errors)) {
    await requirementButton.click();
    const requirementDrawer = page.locator('.ant-drawer:visible').filter({ hasText: '整体需求说明' }).last();
    if (await requireVisible(requirementDrawer, '页面需求 drawer', errors)) {
      const preview = requirementDrawer.locator('.requirement-preview');
      await requireVisible(preview, '页面需求 default preview', errors);
      if (await isVisible(requirementDrawer.locator('textarea'))) {
        errors.push('页面需求 opened directly in edit mode; preview must be the default.');
      }

      const editRequirement = requirementDrawer.getByTitle('编辑整体需求描述');
      if (await requireVisible(editRequirement, '页面需求 edit action', errors)) {
        await editRequirement.click();
        const textarea = requirementDrawer.locator('textarea');
        if (await requireVisible(textarea, '页面需求 textarea after edit', errors)) {
          const originalRequirement = await textarea.inputValue();
          const saveBeforeChange = page.locator('.ant-drawer-footer button').filter({ hasText: /保\s*存/ }).last();
          if (await isVisible(saveBeforeChange)) errors.push('页面需求 Save is visible before content changes.');

          const runtimeRequirement = `${originalRequirement}\n[运行时校验]`;
          await textarea.fill(runtimeRequirement);
          await textarea.dispatchEvent('input');
          await page.waitForTimeout(300);
          const saveRequirement = page.locator('.ant-drawer-footer button').filter({ hasText: /保\s*存/ }).last();
          if (await requireVisible(saveRequirement, '页面需求 Save after change', errors)) {
            await saveRequirement.click();
            if (!await isVisible(requirementDrawer.locator('.requirement-preview'))) {
              errors.push('页面需求 did not return to preview after Save.');
            }
          }

          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(800);
          await page.locator('.annotation-toolbar').getByText('页面需求', { exact: true }).click();
          const reloadedDrawer = page.locator('.ant-drawer:visible').filter({ hasText: '整体需求说明' }).last();
          const reloadedPreview = reloadedDrawer.locator('.requirement-preview');
          if (!(await reloadedPreview.textContent().catch(() => '')).includes('[运行时校验]')) {
            errors.push('页面需求 edit was not persisted after reload.');
          }

          await reloadedDrawer.getByTitle('编辑整体需求描述').click();
          await reloadedDrawer.locator('textarea').fill(originalRequirement);
          await reloadedDrawer.locator('textarea').dispatchEvent('input');
          await page.waitForTimeout(200);
          const restoreSave = page.locator('.ant-drawer-footer button').filter({ hasText: /保\s*存/ }).last();
          if (await isVisible(restoreSave)) await restoreSave.click();
        }
      }
    }
  }

  await closeVisibleOverlays(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const enableAnnotation = page.locator('.annotation-toolbar').getByText('开启', { exact: true });
  if (await requireVisible(enableAnnotation, 'annotation enable action', errors)) {
    await enableAnnotation.click();
    await requireVisible(page.locator('.annotation-toolbar').getByText('关闭', { exact: true }), 'annotation mode enabled state', errors);
    const commentTarget = page.locator('.query-card .ant-form-item-label').first();
    if (await requireVisible(commentTarget, 'commentable business node', errors)) {
      await commentTarget.hover();
      await commentTarget.click();
      const commentPopover = page.locator('.node-comment-popover');
      if (await requireVisible(commentPopover, 'node comment input', errors)) {
        const commentTextarea = commentPopover.locator('textarea');
        if (await requireVisible(commentTextarea, 'multiline node comment textarea', errors)) {
          await commentTextarea.fill('运行时标注校验\n第二行');
          await commentPopover.locator('.node-comment-submit').click();
          await page.waitForTimeout(300);
          await requireVisible(page.locator('.node-comment-pin').last(), 'saved node comment bubble', errors);
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForTimeout(800);
          await requireVisible(page.locator('.node-comment-pin').last(), 'persisted node comment bubble after reload', errors);
          await requireVisible(page.locator('.annotation-toolbar').getByText('开启', { exact: true }), 'annotation mode resets to off after reload', errors);
        }
      }
    }
  }

  const saveAsButton = page.locator('.annotation-toolbar').getByText('另存为', { exact: true });
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

  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await writeFile(resolve(screenshotDirectory, 'runtime-validation.json'), JSON.stringify({
      status: errors.length ? 'FAIL' : 'PASS',
      checkedPages: (pageContract.pages || []).map(item => item.id),
      errors,
      warnings,
    }, null, 2) + '\n', 'utf8');
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
