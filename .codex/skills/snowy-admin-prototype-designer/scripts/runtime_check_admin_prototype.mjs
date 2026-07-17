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
  const sidebar = page.locator('.snowy-sider');
  if (await requireVisible(sidebar, 'fixed left Snowy sidebar', errors)) {
    const sidebarStyle = await sidebar.evaluate(node => {
      const style = getComputedStyle(node);
      return { position: style.position, top: style.top, height: style.height, overflowY: style.overflowY };
    });
    if (sidebarStyle.position !== 'fixed' || sidebarStyle.top !== '0px' || sidebarStyle.overflowY !== 'auto') {
      errors.push(`Snowy sidebar is not viewport-pinned: ${JSON.stringify(sidebarStyle)}.`);
    }
    await page.evaluate(() => {
      document.body.dataset.runtimeOriginalMinHeight = document.body.style.minHeight || '';
      document.body.style.minHeight = '2200px';
      window.scrollTo(0, 420);
    });
    await page.waitForTimeout(150);
    const stickyTop = await sidebar.evaluate(node => Math.round(node.getBoundingClientRect().top));
    if (stickyTop !== 0) errors.push(`Snowy sidebar moved with page scroll; top=${stickyTop}.`);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.body.style.minHeight = document.body.dataset.runtimeOriginalMinHeight || '';
      delete document.body.dataset.runtimeOriginalMinHeight;
    });
  }
  if (await page.locator('.annotation-toolbar .annotation-tool-meta').count() > 0) {
    errors.push('Annotation toolbar still renders the redundant mode label.');
  }
  const toolbarActions = page.locator('.annotation-toolbar .annotation-tool-action');
  if (await toolbarActions.count() !== 4) errors.push('Annotation toolbar must expose exactly four hover-expand actions.');
  const toolbarMinWidth = await page.locator('.annotation-toolbar').evaluate(node => getComputedStyle(node).minWidth);
  if (toolbarMinWidth !== '0px') errors.push(`Annotation toolbar must size to content without a forced min-width, got ${toolbarMinWidth}.`);
  if (await page.locator('.annotation-toolbar .annotation-tool-separator').count() !== 2) {
    errors.push('Annotation toolbar must separate both the collapse control and the destructive action.');
  }
  if (await toolbarActions.count() > 0) {
    const iconSize = await toolbarActions.first().locator('svg').evaluate(node => getComputedStyle(node).width);
    if (iconSize !== '19px') errors.push(`Annotation action icon size must be 19px, got ${iconSize}.`);
    const firstLabel = toolbarActions.first().locator('.annotation-tool-label');
    const hiddenOpacity = await firstLabel.evaluate(node => getComputedStyle(node).opacity);
    if (hiddenOpacity !== '0') errors.push('Annotation action text is visible before hover.');
    await toolbarActions.first().hover();
    await page.waitForTimeout(250);
    const hoverOpacity = await firstLabel.evaluate(node => getComputedStyle(node).opacity);
    if (hoverOpacity !== '1') errors.push('Annotation action text did not appear on hover.');
  }

  for (const contractPage of pageContract.pages || []) {
    await validateDeclaredPage(page, contractPage, screenshotDirectory, errors);
  }

  const annotationToggle = page.locator('.annotation-toolbar button[title="开启标注"]');
  await requireVisible(annotationToggle, 'annotation mode defaults to off', errors);

  const generatedPins = page.locator('.annotation-pin:visible');
  if (await generatedPins.count() === 0) errors.push('Generated annotation bubbles are not visible while annotation mode is off.');

  const requirementButton = page.locator('.annotation-toolbar button[title="查看和编辑当前页面整体需求"]');
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
          await page.locator('.annotation-toolbar button[title="查看和编辑当前页面整体需求"]').click();
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

  const enableAnnotation = page.locator('.annotation-toolbar button[title="开启标注"]');
  if (await requireVisible(enableAnnotation, 'annotation enable action', errors)) {
    await enableAnnotation.click();
    await requireVisible(page.locator('.annotation-toolbar button[title="关闭标注"]'), 'annotation mode enabled state', errors);
    await page.waitForTimeout(250);
    const activeAnnotationButton = page.locator('.annotation-toolbar button[title="关闭标注"]');
    const activeLabel = activeAnnotationButton.locator('.annotation-tool-label');
    if ((await activeLabel.textContent()).trim() !== '正在标注') errors.push('Active annotation action must display 正在标注.');
    if (await activeLabel.evaluate(node => getComputedStyle(node).opacity) !== '1') errors.push('Active annotation action did not stay expanded.');
    const toolbarCursor = await page.locator('.annotation-toolbar').evaluate(node => getComputedStyle(node).cursor);
    const toolbarButtonCursor = await activeAnnotationButton.evaluate(node => getComputedStyle(node).cursor);
    if (toolbarCursor !== 'default' || toolbarButtonCursor !== 'pointer') {
      errors.push(`Annotation toolbar cursor override failed: toolbar=${toolbarCursor}, button=${toolbarButtonCursor}.`);
    }
    if (!await page.locator('body').evaluate(node => node.classList.contains('annotation-cursor-mode'))) {
      errors.push('Annotation cursor mode is not applied to body; teleported overlays will use the wrong cursor.');
    }
    for (const selector of ['[data-annotation-key="page-content"]', '.query-card']) {
      const arbitraryTarget = page.locator(selector).first();
      if (await requireVisible(arbitraryTarget, `arbitrary annotation target ${selector}`, errors)) {
        await arbitraryTarget.dispatchEvent('mousemove', { clientX: 24, clientY: 24 });
        const hoverOutline = page.locator('.node-comment-outline:not(.selected)');
        await requireVisible(hoverOutline, `arbitrary node hover ${selector}`, errors);
        if (await isVisible(hoverOutline)) {
          const highlightStyle = await hoverOutline.evaluate(node => {
            const style = getComputedStyle(node);
            return { borderWidth: style.borderTopWidth, backgroundColor: style.backgroundColor };
          });
          if (highlightStyle.borderWidth !== '3px') errors.push(`Annotation hover border must be 3px, got ${highlightStyle.borderWidth}.`);
          if (!/^rgba\(.+,\s*0\.(?:1[0-9]|2[0-9])\)$/.test(highlightStyle.backgroundColor)) {
            errors.push(`Annotation hover highlight needs a translucent background, got ${highlightStyle.backgroundColor}.`);
          }
        }
        await arbitraryTarget.dispatchEvent('click', { clientX: 24, clientY: 24 });
        await requireVisible(page.locator('.node-comment-popover'), `arbitrary node selection ${selector}`, errors);
        await page.locator('.node-comment-popover .node-comment-cancel').click();
      }
    }
    const selectControl = page.locator('.query-card .ant-select-selector').first();
    if (await isVisible(selectControl)) {
      await selectControl.click();
      await requireVisible(page.locator('.node-comment-popover'), 'select control annotation composer', errors);
      if (await page.locator('.ant-select-dropdown:visible').count() > 0) {
        errors.push('Business select dropdown opened while annotation mode was enabled.');
      }
      await page.locator('.node-comment-popover .node-comment-cancel').click();
    }
    await page.keyboard.press('Escape');
    await requireVisible(page.locator('.annotation-toolbar button[title="开启标注"]'), 'Escape exits annotation mode', errors);
    await page.locator('.annotation-toolbar button[title="开启标注"]').click();
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
          await requireVisible(page.locator('.annotation-toolbar button[title="开启标注"]'), 'annotation mode resets to off after reload', errors);

          const resourceSubmenu = page.locator('.ant-menu-submenu-title').filter({ hasText: /资源\s*权限/ });
          if (await isVisible(resourceSubmenu)) {
            await resourceSubmenu.click();
            await page.waitForTimeout(200);
          }
          const menuResourceItem = page.locator('.ant-menu-item').filter({ hasText: /菜单\s*资源/ });
          if (await requireVisible(menuResourceItem, 'menu resource page switch target', errors)) {
            await menuResourceItem.click();
            await page.waitForTimeout(300);
            if (await page.locator('.node-comment-pin:visible').count() !== 0) {
              errors.push('Page-scoped annotation leaked from Banner to menu resource page.');
            }

            const bannerMenuItem = page.locator('.ant-menu-item').filter({ hasText: /首页\s*Banner/ });
            if (await requireVisible(bannerMenuItem, 'banner page switch target', errors)) {
              await bannerMenuItem.click();
              await page.waitForTimeout(300);
              await page.locator('.annotation-toolbar button[title="开启标注"]').click();
              const globalBrand = page.locator('[data-annotation-key="global-brand"]');
              if (await requireVisible(globalBrand, 'global annotation target', errors)) {
                await globalBrand.hover();
                await globalBrand.click();
                const globalComposer = page.locator('.node-comment-popover');
                await globalComposer.locator('textarea').fill('运行时全局标注');
                await globalComposer.locator('.node-comment-submit').click();
                await page.locator('.annotation-toolbar button[title="关闭标注"]').click();
                await menuResourceItem.click();
                await page.waitForTimeout(300);
                if (await page.locator('.node-comment-pin:visible').count() !== 1) {
                  errors.push('Global annotation did not remain unique and visible after page switch.');
                }

                await bannerMenuItem.click();
                await page.waitForTimeout(300);
                const addContent = page.getByText('新增内容', { exact: true });
                if (await requireVisible(addContent, 'business drawer trigger', errors)) {
                  await addContent.click();
                  const businessDrawerTitle = page.locator('.ant-drawer:visible .ant-drawer-title');
                  if (await requireVisible(businessDrawerTitle, 'business drawer annotation target', errors)) {
                    await page.locator('.annotation-toolbar button[title="开启标注"]').click();
                    const drawerCursor = await page.locator('.ant-drawer:visible .ant-drawer-body').evaluate(node => getComputedStyle(node).cursor);
                    if (!drawerCursor.startsWith('url(')) errors.push('Teleported business drawer did not inherit the annotation cursor.');
                    await businessDrawerTitle.hover();
                    await businessDrawerTitle.click();
                    const drawerComposer = page.locator('.node-comment-popover');
                    await drawerComposer.locator('textarea').fill('运行时弹窗标注');
                    await drawerComposer.locator('.node-comment-submit').click();
                    await page.locator('.annotation-toolbar button[title="关闭标注"]').click();
                    await page.reload({ waitUntil: 'networkidle' });
                    await page.waitForTimeout(500);
                    if (await isVisible(resourceSubmenu)) {
                      await resourceSubmenu.click();
                      await page.waitForTimeout(200);
                    }
                    await menuResourceItem.click();
                    await page.waitForTimeout(300);
                    if (await page.locator('.node-comment-pin:visible').count() !== 1) {
                      errors.push('Drawer/page annotation leaked after switching away; only the global annotation should remain.');
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  const saveAsButton = page.locator('.annotation-toolbar button[title="另存为包含当前标注的 HTML"]');
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
