import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const moduleFiles = [
  'app/modules/school-pages.js',
  'app/modules/platform-pages.js',
  'app/modules/page-requirements.js',
  'app/modules/page-annotations.js',
  'app/modules/coverage-data.js',
];

for (const file of moduleFiles) {
  assert.ok(existsSync(resolve(root, file)), `missing business module: ${file}`);
}

const context = { window: {} };
context.globalThis = context.window;
vm.createContext(context);
for (const file of moduleFiles) {
  vm.runInContext(readFileSync(resolve(root, file), 'utf8'), context, { filename: file });
}

const pages = [...context.window.UnicardSchoolPages, ...context.window.UnicardPlatformPages];
const coverage = context.window.UnicardCoverageData;
assert.equal(pages.length, 33);
assert.equal(new Set(pages.map(page => page.id)).size, 33);
assert.equal(pages.filter(page => /^ADM-S-/.test(page.id)).length, 20);
assert.equal(pages.filter(page => /^ADM-P-/.test(page.id)).length, 13);
assert.equal(coverage.filter(row => row.status === '已覆盖').length, 33);
assert.equal(coverage.filter(row => row.status === '不适用').length, 16);
assert.equal(pages.some(page => /^(API|PAM|H5)-/.test(page.id)), false);

for (const page of pages) {
  assert.ok(page.route.startsWith('/unicard/'), `${page.id} route invalid`);
  assert.ok(page.permission.startsWith('unicard'), `${page.id} permission invalid`);
  assert.ok(page.componentKey, `${page.id} componentKey missing`);
  assert.ok(page.queryFields.every(field => field.source), `${page.id} query source missing`);
  assert.ok(page.tableFields.every(field => field.source && field.shape), `${page.id} table metadata missing`);
  assert.ok(page.actions.every(action => action.source && action.roles.length), `${page.id} action metadata missing`);
}

assert.equal(Object.keys(context.window.UnicardPageRequirements).length, 33);
assert.ok(context.window.UnicardPageAnnotations.length >= 33);
assert.ok(context.window.UnicardPageAnnotations.every(item => item.nodeKey.includes(`${item.pageId}:`)));

const schoolComponentFiles = [
  'components/business/unicard-dashboard-pages.js',
  'components/business/unicard-content-pages.js',
  'components/business/unicard-readonly-pages.js',
  'components/business/unicard-log-monitor-pages.js',
  'components/business/unicard-permission-guide-pages.js',
  'styles/unicard-business.css',
];
for (const file of schoolComponentFiles) {
  assert.ok(existsSync(resolve(root, file)), `missing school business component: ${file}`);
}
const registrySource = readFileSync(resolve(root, 'components/registry.js'), 'utf8');
for (const name of ['SnowyUnicardDashboardPages', 'SnowyUnicardContentPages', 'SnowyUnicardReadonlyPages', 'SnowyUnicardLogMonitorPages', 'SnowyUnicardPermissionGuidePages']) {
  assert.ok(registrySource.includes(name), `school component not registered: ${name}`);
}
const schoolKeys = new Set(context.window.UnicardSchoolPages.map(page => page.componentKey));
assert.deepEqual([...schoolKeys].sort(), ['content', 'dashboard', 'logMonitor', 'permissionGuide', 'readonly']);

console.log('PASS 33 unicard admin page contracts and 49 coverage rows');
