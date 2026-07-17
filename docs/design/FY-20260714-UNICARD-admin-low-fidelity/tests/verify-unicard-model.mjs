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
assert.equal(pages.length, 32);
assert.equal(new Set(pages.map(page => page.id)).size, 32);
assert.equal(pages.filter(page => /^ADM-S-/.test(page.id)).length, 19);
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

assert.equal(Object.keys(context.window.UnicardPageRequirements).length, 32);
assert.ok(context.window.UnicardPageAnnotations.length >= 32);
assert.ok(context.window.UnicardPageAnnotations.every(item => item.nodeKey.includes(`${item.pageId}:`)));

const registrySource = readFileSync(resolve(root, 'components/registry.js'), 'utf8');
const indexSource = readFileSync(resolve(root, 'index.html'), 'utf8');
const dashboardSource = readFileSync(resolve(root, 'components/business/unicard-school-dashboard-charts.js'), 'utf8');
assert.ok(indexSource.includes('echarts@5/dist/echarts.min.js'), 'ECharts runtime is not loaded');
assert.ok(dashboardSource.includes("type: 'line'"), 'school dashboard user trend line chart missing');
assert.ok(dashboardSource.includes("type: 'bar'"), 'school dashboard application bar chart missing');
assert.equal(pages.some(page => page.id === 'ADM-S-002'), false, 'ADM-S-002 must remain a menu group, not an independent page');
const contract = JSON.parse(readFileSync(resolve(root, 'prototype-contract.json'), 'utf8'));
assert.equal(contract.version, 'snowy-prototype-page-contract-v1');
assert.equal(contract.pages.length, 32);
assert.equal(contract.pages.some(page => page.id === 'ADM-S-002'), false, 'ADM-S-002 page contract must be removed');
assert.deepEqual(contract.pages.map(page => page.id), pages.map(page => page.id));
for (const page of pages) {
  const componentFile = `components/pages/${page.id.toLowerCase()}.js`;
  assert.ok(existsSync(resolve(root, componentFile)), `missing explicit page component: ${componentFile}`);
  const componentName = `Snowy${page.id.split('-').map(part => part[0] + part.slice(1).toLowerCase()).join('')}Page`;
  assert.ok(registrySource.includes(componentName), `explicit page component not registered: ${componentName}`);
  const pageContract = contract.pages.find(item => item.id === page.id);
  assert.equal(JSON.stringify(pageContract.query.fields.map(field => field.label)), JSON.stringify(Array.from(page.queryFields, field => field.label)));
  assert.equal(JSON.stringify(pageContract.table.fields), JSON.stringify([...Array.from(page.tableFields, field => field.label), '操作']));
  assert.equal(pageContract.table.pagination, true);
  assert.ok(pageContract.annotations.length > 0, `${page.id} annotation contract missing`);
}
const platformPages = context.window.UnicardPlatformPages;
for (const id of ['ADM-P-007', 'ADM-P-008', 'ADM-P-009', 'ADM-P-010', 'ADM-P-012', 'ADM-P-013']) {
  const page = platformPages.find(item => item.id === id);
  assert.equal(page.actions.some(action => ['新增', '编辑', '删除'].includes(action.name)), false, `${id} readonly boundary violated`);
}
const rolePage = platformPages.find(page => page.id === 'ADM-P-004');
assert.equal(rolePage.componentKey, 'roleGrant');
assert.ok(rolePage.detailFields.some(field => field.label === '变更前权限'));
assert.ok(rolePage.detailFields.some(field => field.label === '变更后权限'));

console.log('PASS 32 unicard admin page contracts, ADM-S-002 menu grouping, ECharts dashboard and 49 coverage rows');
