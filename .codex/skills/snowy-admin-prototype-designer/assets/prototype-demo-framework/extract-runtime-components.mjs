import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const goldenPath = resolve(root, 'golden/original-demo.html');
const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');

const componentFiles = [
  ['SnowyAnnotationToolbar', 'annotation-toolbar.js'],
  ['SnowyShell', 'snowy-shell.js'],
  ['SnowyBannerQueryForm', 'banner-query-form.js'],
  ['SnowyBannerDataTable', 'banner-data-table.js'],
  ['SnowyBannerPage', 'banner-page.js'],
  ['SnowyMenuResourcePage', 'menu-resource-page.js'],
  ['SnowyComponentPresetPage', 'component-preset-page.js'],
  ['SnowyNodeCommentComposer', 'node-comment-composer.js'],
  ['SnowyRequirementDrawer', 'requirement-drawer.js'],
  ['SnowyContentFormDrawer', 'content-form-drawer.js'],
  ['SnowyMenuFormDrawer', 'menu-form-drawer.js'],
  ['SnowyImportModal', 'import-modal.js'],
  ['SnowyColumnSettingsModal', 'column-settings-modal.js'],
  ['SnowyAnnotationEditorModal', 'annotation-editor-modal.js'],
  ['SnowyImagePreviewModal', 'image-preview-modal.js'],
];

const find = (source, marker, from = 0) => {
  const index = source.indexOf(marker, from);
  if (index < 0) throw new Error(`Marker not found: ${marker.slice(0, 80)}`);
  return index;
};

const componentSource = (name, template) => `(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.${name} = {
    name: '${name}',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: \`${template.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`
  };
})(window);
`;

async function main() {
  const goldenRaw = await readFile(goldenPath, 'utf8');
  const golden = goldenRaw.replace(/\r\n/g, '\n');
  const styleStart = find(golden, '  <style>\n') + '  <style>\n'.length;
  const styleEnd = find(golden, '\n  </style>', styleStart);
  const style = golden.slice(styleStart, styleEnd) + '\n';

  const scriptStart = find(golden, '  <script>\n', styleEnd) + '  <script>\n'.length;
  const scriptEnd = golden.lastIndexOf('\n  </script>');
  const script = golden.slice(scriptStart, scriptEnd);
  const dataStart = find(script, '    const prototypeMeta');
  const appStart = find(script, '    const app = createApp({', dataStart);
  const dataBlock = script.slice(dataStart, appStart).trimEnd();

  const setupMarker = '      setup() {';
  const setupStart = find(script, setupMarker, appStart) + setupMarker.length;
  const returnStart = find(script, '\n        return {', setupStart);
  const returnEnd = find(script, '\n        };', returnStart) + '\n        };'.length;
  const setupBody = script.slice(setupStart, returnStart);
  const contextBlock = script
    .slice(returnStart, returnEnd)
    .replace('\n        return {', '\n        const context = {');

  const templateMarker = '      template: `';
  const templateStart = find(script, templateMarker, returnEnd) + templateMarker.length;
  const templateEnd = find(script, '\n      `\n    });', templateStart);
  const template = script.slice(templateStart, templateEnd);

  const markers = {
    toolbar: '          <div class="annotation-toolbar"',
    shell: '          <a-layout-sider',
    content: '            <a-layout-content class="content"',
    table: '                <div class="table-card">',
    menu: '              <section v-else-if="currentPage === \'menuResource\'"',
    preset: '              <section v-else>',
    nodeComment: '              <div v-if="nodeCommentOpen" class="node-comment-mask"',
    layoutClose: '            </a-layout-content>',
    requirement: '          <a-drawer :title="requirementDrawerTitle"',
    contentDrawer: '          <a-drawer :title="drawerMode === \'detail\'',
    menuDrawer: '          <a-drawer title="菜单表单"',
    importModal: '          <a-modal title="导入数据"',
    columnModal: '          <a-modal title="列设置"',
    annotationModal: '          <a-modal\n            :title="annotationEditorMode',
    previewModal: '          <a-modal :title="previewTitle"',
    rootClose: '        </a-layout>'
  };
  const positions = {};
  let cursor = 0;
  for (const [key, marker] of Object.entries(markers)) {
    positions[key] = find(template, marker, cursor);
    cursor = positions[key] + marker.length;
  }

  const toolbar = template.slice(positions.toolbar, positions.shell).trimEnd();
  const shellHeader = template.slice(positions.shell, positions.content).trimEnd();
  const queryRaw = template.slice(positions.content, positions.table);
  const query = queryRaw.slice(find(queryRaw, '                <div class="query-card">')).trimEnd();
  const tableRaw = template.slice(positions.table, positions.menu).trimEnd();
  const table = tableRaw.replace(/\n              <\/section>\s*$/, '');
  const menu = template.slice(positions.menu, positions.preset).trimEnd();
  const preset = template.slice(positions.preset, positions.nodeComment).replace('<section v-else>', '<section>').trimEnd();
  const nodeComment = template.slice(positions.nodeComment, positions.layoutClose).trimEnd();
  const requirement = template.slice(positions.requirement, positions.contentDrawer).trimEnd();
  const contentDrawer = template.slice(positions.contentDrawer, positions.menuDrawer).trimEnd();
  const menuDrawer = template.slice(positions.menuDrawer, positions.importModal).trimEnd();
  const importModal = template.slice(positions.importModal, positions.columnModal).trimEnd();
  const columnModal = template.slice(positions.columnModal, positions.annotationModal).trimEnd();
  const annotationModal = template.slice(positions.annotationModal, positions.previewModal).trimEnd();
  const previewModal = template.slice(positions.previewModal, positions.rootClose).trimEnd();

  const components = {
    SnowyAnnotationToolbar: toolbar,
    SnowyBannerQueryForm: query,
    SnowyBannerDataTable: table,
    SnowyBannerPage: `
      <section>
        <snowy-banner-query-form></snowy-banner-query-form>
        <snowy-banner-data-table></snowy-banner-data-table>
      </section>`,
    SnowyMenuResourcePage: menu,
    SnowyComponentPresetPage: preset,
    SnowyNodeCommentComposer: nodeComment,
    SnowyShell: `${shellHeader}
            <a-layout-content class="content" @mousemove.capture="hoverNodeForComment" @mouseleave="clearHoverNode" @click.capture="selectNodeForComment">
              <snowy-banner-page v-if="currentPage === 'banner'"></snowy-banner-page>
              <snowy-menu-resource-page v-else-if="currentPage === 'menuResource'"></snowy-menu-resource-page>
              <snowy-component-preset-page v-else></snowy-component-preset-page>
              <snowy-node-comment-composer></snowy-node-comment-composer>
            </a-layout-content>
          </a-layout>`,
    SnowyRequirementDrawer: requirement,
    SnowyContentFormDrawer: contentDrawer,
    SnowyMenuFormDrawer: menuDrawer,
    SnowyImportModal: importModal,
    SnowyColumnSettingsModal: columnModal,
    SnowyAnnotationEditorModal: annotationModal,
    SnowyImagePreviewModal: previewModal,
  };

  const appDir = resolve(root, 'app');
  const componentDir = resolve(root, 'components');
  const styleDir = resolve(root, 'styles');
  await Promise.all([mkdir(appDir, { recursive: true }), mkdir(componentDir, { recursive: true }), mkdir(styleDir, { recursive: true })]);

  const dataSource = `(function (global) {\n${dataBlock}\n\n  global.SnowyPrototypeData = { prototypeMeta, demoImages, seedRows, userAvatar, componentRows };\n})(window);\n`;
  const stateSource = `(function (global) {\n  const { ref, reactive, computed, h, nextTick, onMounted, onBeforeUnmount } = Vue;\n  const { prototypeMeta, demoImages, seedRows, componentRows } = global.SnowyPrototypeData;\n\n  global.createSnowyPrototypeContext = function createSnowyPrototypeContext() {${setupBody}${contextBlock}\n        return context;\n  };\n})(window);\n`;
  await writeFile(resolve(styleDir, 'snowy-prototype.css'), style, 'utf8');
  await writeFile(resolve(appDir, 'prototype-data.js'), dataSource, 'utf8');
  await writeFile(resolve(appDir, 'prototype-state.js'), stateSource, 'utf8');

  const manifestComponents = [];
  for (const [name, file] of componentFiles) {
    if (name === 'SnowyBannerPage' || components[name]) {
      const source = componentSource(name, components[name]);
      await writeFile(resolve(componentDir, file), source, 'utf8');
      manifestComponents.push({ name, file, sha256: sha256(source) });
    }
  }

  const registrySource = `(function (global) {\n  const components = global.SnowyPrototypeComponents || {};\n  global.registerSnowyPrototypeComponents = function registerSnowyPrototypeComponents(app) {\n${componentFiles
    .filter(([name]) => components[name])
    .map(([name]) => `    app.component('${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}', components.${name});`)
    .join('\n')}\n  };\n})(window);\n`;
  await writeFile(resolve(componentDir, 'registry.js'), registrySource, 'utf8');

  const mainSource = `(function (global) {\n  const app = Vue.createApp({\n    setup() {\n      const context = global.createSnowyPrototypeContext();\n      Vue.provide('snowyPrototypeContext', context);\n      return context;\n    },\n    template: \`\n      <a-layout class="app-shell" :class="{ 'annotation-cursor': annotationEnabled && !nodeCommentOpen }">\n        <snowy-annotation-toolbar></snowy-annotation-toolbar>\n        <snowy-shell></snowy-shell>\n        <snowy-requirement-drawer></snowy-requirement-drawer>\n        <snowy-content-form-drawer></snowy-content-form-drawer>\n        <snowy-menu-form-drawer></snowy-menu-form-drawer>\n        <snowy-import-modal></snowy-import-modal>\n        <snowy-column-settings-modal></snowy-column-settings-modal>\n        <snowy-annotation-editor-modal></snowy-annotation-editor-modal>\n        <snowy-image-preview-modal></snowy-image-preview-modal>\n      </a-layout>\n    \`\n  });\n  global.registerSnowyPrototypeComponents(app);\n  app.use(antd);\n  app.mount('#app');\n})(window);\n`;
  await writeFile(resolve(appDir, 'main.js'), mainSource, 'utf8');

  const localScripts = [...componentFiles.map(([, file]) => file), 'registry.js']
    .map(file => `  <script src="components/${file}"></script>`)
    .join('\n');
  const indexSource = `<!doctype html>\n<html lang="zh-CN">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Snowy 后管原型 Demo 框架</title>\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.6/dist/reset.css" />\n  <link rel="stylesheet" href="styles/snowy-prototype.css" />\n</head>\n<body>\n  <div id="app"></div>\n  <script id="snowy-annotation-state" type="application/json">{}</script>\n  <script src="https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/advancedFormat.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/customParseFormat.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/localeData.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/quarterOfYear.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekday.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekOfYear.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekYear.js"></script>\n  <script src="https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.6/dist/antd.min.js"></script>\n  <script src="app/prototype-data.js"></script>\n${localScripts}\n  <script src="app/prototype-state.js"></script>\n  <script src="app/main.js"></script>\n</body>\n</html>\n`;
  await writeFile(resolve(root, 'index.html'), indexSource, 'utf8');

  const manifest = {
    version: 'snowy-runtime-components-v1',
    goldenFile: 'golden/original-demo.html',
    goldenSha256: sha256(goldenRaw),
    entry: 'index.html',
    entrySha256: sha256(indexSource),
    styles: [{ file: 'styles/snowy-prototype.css', sha256: sha256(style) }],
    app: [
      { file: 'app/prototype-data.js', sha256: sha256(dataSource) },
      { file: 'app/prototype-state.js', sha256: sha256(stateSource) },
      { file: 'app/main.js', sha256: sha256(mainSource) },
    ],
    components: [...manifestComponents, { name: 'registry', file: 'registry.js', sha256: sha256(registrySource) }],
  };
  await writeFile(resolve(root, 'component-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`PASS extracted ${manifestComponents.length} runtime Vue components from original Demo`);
}

main().catch(error => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
