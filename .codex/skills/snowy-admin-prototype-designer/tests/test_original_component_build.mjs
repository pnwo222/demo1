import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { test } from 'node:test';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { buildPrototype } from '../assets/prototype-demo-framework/build-prototype.mjs';
import { refreshComponentManifest } from '../assets/prototype-demo-framework/refresh-component-manifest.mjs';

const root = resolve(import.meta.dirname, '../assets/prototype-demo-framework');
const read = path => readFile(join(root, path), 'utf8');

const componentScripts = [
  'components/annotation-toolbar.js',
  'components/snowy-shell.js',
  'components/banner-query-form.js',
  'components/banner-data-table.js',
  'components/banner-page.js',
  'components/menu-resource-page.js',
  'components/component-preset-page.js',
  'components/node-comment-composer.js',
  'components/requirement-drawer.js',
  'components/content-form-drawer.js',
  'components/menu-form-drawer.js',
  'components/import-modal.js',
  'components/column-settings-modal.js',
  'components/annotation-editor-modal.js',
  'components/image-preview-modal.js',
  'components/registry.js',
];

test('index is a lightweight file-compatible runtime entry', async () => {
  const html = await read('index.html');
  assert.ok(Buffer.byteLength(html, 'utf8') < 8_000, 'index.html must not contain the full Demo implementation');
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /createApp\s*\(\s*\{[\s\S]{1000,}/);
  assert.doesNotMatch(html, /type=["']module["']/i);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.match(html, /styles\/snowy-prototype\.css/);
  assert.match(html, /app\/prototype-data\.js/);
  assert.match(html, /app\/prototype-state\.js/);
  assert.match(html, /app\/main\.js/);
});

test('index imports every preset component before the application entry', async () => {
  const html = await read('index.html');
  let previousIndex = -1;
  for (const script of componentScripts) {
    await stat(join(root, script));
    const scriptIndex = html.indexOf(script);
    assert.ok(scriptIndex > previousIndex, `${script} is missing or loaded out of order`);
    previousIndex = scriptIndex;
  }
  assert.ok(html.indexOf('app/main.js') > previousIndex, 'main.js must load after component registration');
});

test('component registry exposes the complete reusable Demo component set', async () => {
  const registry = await read('components/registry.js');
  for (const name of [
    'SnowyAnnotationToolbar',
    'SnowyShell',
    'SnowyBannerQueryForm',
    'SnowyBannerDataTable',
    'SnowyComponentPresetPage',
    'SnowyNodeCommentComposer',
    'SnowyContentFormDrawer',
    'SnowyAnnotationEditorModal',
  ]) {
    assert.match(registry, new RegExp(name), `registry missing ${name}`);
  }
  assert.match(registry, /registerSnowyPrototypeComponents/);
});

test('external assets preserve original Demo capabilities and visible content', async () => {
  const combined = (
    await Promise.all([
      read('styles/snowy-prototype.css'),
      read('app/prototype-data.js'),
      read('app/prototype-state.js'),
      ...componentScripts.map(read),
      read('app/main.js'),
    ])
  ).join('\n');
  for (const marker of [
    'snowy-admin-prototype-v2',
    '首页 Banner',
    '组件预设',
    'annotation-toolbar',
    'node-comment-popover',
    'saveAsAnnotatedHtml',
    '页面需求',
    '另存为',
  ]) {
    assert.ok(combined.includes(marker), `runtime component assets missing ${marker}`);
  }
});

test('builder copies a complete multi-file prototype directory', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'snowy-runtime-components-'));
  try {
    await buildPrototype(temp);
    assert.match(await readFile(join(temp, 'index.html'), 'utf8'), /components\/registry\.js/);
    await stat(join(temp, 'styles', 'snowy-prototype.css'));
    await stat(join(temp, 'app', 'prototype-state.js'));
    await stat(join(temp, 'components', 'snowy-shell.js'));
    await stat(join(temp, 'components', 'annotation-editor-modal.js'));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('manifest refresh discovers a newly imported preset component', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'snowy-runtime-extension-'));
  try {
    await buildPrototype(temp);
    const newComponent = `(function(global){\n  global.SnowyPrototypeComponents.SnowyAuditPanel={name:'SnowyAuditPanel',template:'<section>审核记录</section>'};\n})(window);\n`;
    await writeFile(join(temp, 'components', 'audit-panel.js'), newComponent, 'utf8');
    const entryPath = join(temp, 'index.html');
    const entry = await readFile(entryPath, 'utf8');
    await writeFile(
      entryPath,
      entry.replace(
        '<script src="components/registry.js"></script>',
        '<script src="components/audit-panel.js"></script>\n  <script src="components/registry.js"></script>',
      ),
      'utf8',
    );
    await refreshComponentManifest(temp);
    const manifest = JSON.parse(await readFile(join(temp, 'component-manifest.json'), 'utf8'));
    assert.ok(manifest.components.some(item => item.name === 'SnowyAuditPanel' && item.file === 'audit-panel.js'));
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
