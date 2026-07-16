import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createComponentRegistry } from '../assets/prototype-demo-framework/src/component-registry.js';
import { validatePrototypeSchema } from '../assets/prototype-demo-framework/src/schema-validator.js';
import { buildPrototype } from '../assets/prototype-demo-framework/build-prototype.mjs';
import { readFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const validPage = () => ({
  id: 'student',
  title: '学生管理',
  menuPath: ['师生管理', '学生管理'],
  route: '/biz/student',
  permission: 'bizStudentView',
  pageType: 'readonly-table',
  queryFields: [{ key: 'name', label: '姓名', component: 'Input' }],
  columns: [{ key: 'name', title: '姓名', component: 'Text' }],
  detailFields: [{ key: 'name', label: '姓名', component: 'Text' }],
  createFields: [],
  editFields: [],
  toolbarActions: [],
  rowActions: [{ key: 'detail', label: '详情', component: 'LinkAction' }],
  annotations: [],
  requirement: '查看学生清单。',
  rows: [{ id: 1, name: '张同学' }],
});

test('registry exposes required Snowy and field components', () => {
  const registry = createComponentRegistry();
  for (const name of [
    'SnowyShell', 'QueryForm', 'DataTable', 'FormDrawer', 'DetailDrawer',
    'ImageUpload', 'ImportUpload', 'Input', 'Select', 'TreeSelect', 'DateRange',
    'Text', 'MaskedText', 'StatusTag', 'Switch', 'Image', 'Attachment', 'LinkAction',
    'AnnotationLayer',
  ]) {
    assert.ok(registry.has(name), `missing component: ${name}`);
  }
});

test('valid schema passes with explicit components', () => {
  const schema = { version: 1, system: { name: '测试系统', logoText: '测' }, pages: [validPage()] };
  const result = validatePrototypeSchema(schema, createComponentRegistry());
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test('unknown field component blocks schema', () => {
  const page = validPage();
  page.columns[0].component = 'MagicStatus';
  const result = validatePrototypeSchema({ version: 1, system: {}, pages: [page] }, createComponentRegistry());
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /unknown component MagicStatus/);
});

test('missing field component blocks schema', () => {
  const page = validPage();
  delete page.queryFields[0].component;
  const result = validatePrototypeSchema({ version: 1, system: {}, pages: [page] }, createComponentRegistry());
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /queryFields.*component is required/);
});

test('extension components require and preserve a registered base component', () => {
  assert.throws(() => createComponentRegistry([{ name: 'RiskLevel' }]), /requires a registered baseComponent/);
  const registry = createComponentRegistry([{ name: 'RiskLevel', baseComponent: 'StatusTag' }]);
  assert.equal(registry.get('RiskLevel').baseComponent, 'StatusTag');
  const page = validPage();
  page.columns[0].component = 'RiskLevel';
  assert.equal(validatePrototypeSchema({ version: 1, system: {}, pages: [page] }, registry).ok, true);
});

test('duplicate page id blocks schema', () => {
  const page = validPage();
  const result = validatePrototypeSchema({ version: 1, system: {}, pages: [page, validPage()] }, createComponentRegistry());
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /duplicate page id student/);
});

test('query, table, detail, create and edit fields are validated independently', () => {
  const page = validPage();
  page.createFields = [{ key: 'name', label: '姓名' }];
  const result = validatePrototypeSchema({ version: 1, system: {}, pages: [page] }, createComponentRegistry());
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /createFields.*component is required/);
});

test('demo schema covers component-based query, table, form, upload and annotations', async () => {
  const schemaPath = resolve(import.meta.dirname, '../assets/prototype-demo-framework/src/demo-schema.json');
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  const result = validatePrototypeSchema(schema, createComponentRegistry());
  assert.equal(result.ok, true, result.errors.join('\n'));
  const serialized = JSON.stringify(schema);
  for (const component of ['Input', 'ImageUpload', 'StatusTag', 'Switch', 'MaskedText']) {
    assert.match(serialized, new RegExp(`"component":"${component}"`));
  }
  assert.ok(schema.pages.every(page => page.requirement && Array.isArray(page.annotations)));
});

test('builder emits one self-contained component-kit HTML', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'snowy-kit-'));
  try {
    const outputPath = join(temp, 'prototype.html');
    const schemaPath = resolve(import.meta.dirname, '../assets/prototype-demo-framework/src/demo-schema.json');
    await buildPrototype({ schemaPath, outputPath });
    const html = await readFile(outputPath, 'utf8');
    assert.match(html, /snowy-prototype-kit-v1/);
    assert.match(html, /id="snowy-component-manifest"/);
    assert.match(html, /SNOWY_COMPONENTS_SOURCE_START/);
    assert.match(html, /SNOWY_ANNOTATION_COMPONENT_START/);
    assert.match(html, /createSnowyComponents/);
    assert.match(html, /createSnowyAnnotationComponent/);
    assert.doesNotMatch(html, /src="\.\/src\//);
    assert.doesNotMatch(html, /href="\.\/src\//);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
