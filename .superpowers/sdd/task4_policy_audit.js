const fs = require('fs');

const blueprint = fs.readFileSync('docs/design/FY-20260714-UNICARD-admin-page-blueprint.md', 'utf8');
const html = fs.readFileSync('docs/design/FY-20260714-UNICARD-admin-low-fidelity.html', 'utf8');
const modelMatch = html.match(/const pageSpecs=(\[[\s\S]*?\]);\s*const demoImage=/);
if (!modelMatch) throw new Error('pageSpecs JSON not found in HTML');
const models = JSON.parse(modelMatch[1]);

function cells(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map(value => value.trim());
}

function tableAfter(section, heading) {
  const start = section.indexOf(heading);
  if (start < 0) return [];
  const rows = [];
  for (const line of section.slice(start).split(/\r?\n/).slice(1)) {
    if (/^#{2,4}\s/.test(line)) break;
    if (!line.startsWith('|')) continue;
    const row = cells(line);
    if (row.every(value => /^[-: ]+$/.test(value || '-'))) continue;
    rows.push(row);
  }
  return rows.slice(1);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function isReadAction(action) {
  return ['查看', '详情', '查询', '进入'].some(keyword => action.includes(keyword));
}

const sectionMatches = [...blueprint.matchAll(/^### ((?:ADM-[SP]|API|PAM)-\d{3}) (.+)$/gm)];
const expectedPages = [];
for (let index = 0; index < sectionMatches.length; index += 1) {
  const match = sectionMatches[index];
  const end = index + 1 < sectionMatches.length ? sectionMatches[index + 1].index : blueprint.indexOf('\n## 原型需求覆盖矩阵', match.index);
  const section = blueprint.slice(match.index, end < 0 ? blueprint.length : end);
  const meta = Object.fromEntries(tableAfter(section, '| 项 | 内容 |').filter(row => row.length >= 2).map(row => [row[0], row[1]]));
  const atomRows = tableAfter(section, '#### 原子需求清单');
  const actions = unique(atomRows.filter(row => row.length >= 6 && row[0] === '操作' && row[1] !== '不适用').map(row => row[1]));
  const interactions = tableAfter(section, '#### 操作和点击交互');
  const actionPermissions = Object.fromEntries(interactions.filter(row => row.length >= 7).map(row => [row[0], row[5]]));
  const roles = meta['可见角色'].split('、').map(value => value.trim()).filter(Boolean);
  const actionPolicy = {};
  for (const role of roles) {
    actionPolicy[role] = actions.filter(action => {
      const permission = actionPermissions[action] || '';
      const mentioned = roles.filter(candidate => permission.includes(candidate));
      let permitted = mentioned.length ? mentioned.includes(role) : Boolean(permission && !['不适用', '无权限'].some(token => permission.includes(token)));
      const readOnlyPattern = new RegExp(role.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^；，。]*只读');
      if (permitted && mentioned.includes(role) && readOnlyPattern.test(permission) && !isReadAction(action)) permitted = false;
      return permitted;
    });
  }
  expectedPages.push({ id: match[1], actions, roles, actionPolicy, actionPermissions });
}

const differences = [];
if (expectedPages.length !== 49 || models.length !== 49) differences.push(`page count blueprint=${expectedPages.length} html=${models.length}`);
for (const expected of expectedPages) {
  const actual = models.find(model => model.id === expected.id);
  if (!actual) { differences.push(`${expected.id}: missing HTML model`); continue; }
  const validPermissionKeys = new Set([...expected.actions, '查询', '重置']);
  const actualPermissionKeys = Object.keys(actual.actionPermissions || {});
  for (const key of actualPermissionKeys) if (!validPermissionKeys.has(key)) differences.push(`${expected.id}: extra actionPermissions key=${key}`);
  for (const action of expected.actions) if (!actualPermissionKeys.includes(action)) differences.push(`${expected.id}: missing actionPermissions key=${action}`);
  const expectedPermissionKeys = Object.keys(expected.actionPermissions).filter(key => validPermissionKeys.has(key)).sort();
  if (JSON.stringify(actualPermissionKeys.sort()) !== JSON.stringify(expectedPermissionKeys)) {
    differences.push(`${expected.id}: actionPermissions keys differ from blueprint`);
  }
  for (const role of expected.roles) {
    const expectedActions = [...(expected.actionPolicy[role] || [])].sort();
    const actualActions = [...(actual.actionPolicy?.[role] || [])].sort();
    if (JSON.stringify(expectedActions) !== JSON.stringify(actualActions)) {
      differences.push(`${expected.id}:${role}: expected=${expectedActions.join(',')} actual=${actualActions.join(',')}`);
    }
  }
}

const hardChecks = [
  ['ADM-S-010', '发布至 APP', ['学校管理员', '审核人员']],
  ['ADM-S-010', '设置首页推荐', ['学校管理员', '审核人员']],
  ['ADM-S-014', '进入信息查询子页面', ['学校管理员', '安全审计人员']],
  ['PAM-006', '通行记录导出', ['PAM 分级子账户']],
  ['PAM-006', '用户信息导出', ['PAM 分级子账户']]
];
for (const [id, action, expectedRoles] of hardChecks) {
  const model = models.find(item => item.id === id);
  const actualRoles = Object.entries(model.actionPolicy).filter(([, actions]) => actions.includes(action)).map(([role]) => role).sort();
  if (JSON.stringify(actualRoles) !== JSON.stringify([...expectedRoles].sort())) differences.push(`${id}:${action}: expected roles=${expectedRoles} actual=${actualRoles}`);
}

if (differences.length) {
  console.error(JSON.stringify({ pages: models.length, checkedActions: expectedPages.reduce((sum, page) => sum + page.actions.length, 0), differences }, null, 2));
  process.exit(1);
}
const highRiskPattern = /删除|审核|授权|导入|导出|启用|禁用|停用|配置|发布|推荐|采集|更新|重试/;
const highRiskActions = expectedPages.flatMap(page => page.actions.filter(action => highRiskPattern.test(action)).map(action => `${page.id}:${action}`));
console.log(JSON.stringify({ pages: 49, checkedActions: expectedPages.reduce((sum, page) => sum + page.actions.length, 0), checkedPermissionKeys: expectedPages.reduce((sum, page) => sum + Object.keys(page.actionPermissions).filter(key => page.actions.includes(key) || ['查询','重置'].includes(key)).length, 0), highRiskActions: highRiskActions.length, hardChecks: hardChecks.length, extraPermissionKeys: 0, missingHighRisk: 0, differences: 0 }));
