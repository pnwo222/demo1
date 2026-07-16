const { chromium } = require('playwright');
const path = require('path');

function check(condition, message) { if (!condition) throw new Error(message); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1680, height: 1000 }, ignoreHTTPSErrors: true });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));
  const target = 'file:///' + path.resolve('docs/design/FY-20260714-UNICARD-admin-low-fidelity.html').replace(/\\/g, '/');
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.snowy-sider', { timeout: 60000 });
  const switchPage = async title => { await page.getByText(title, { exact: true }).first().click(); await page.waitForTimeout(180); };
  const switchRole = async role => { await page.locator('[data-node-key="global:role-preview"]').click(); await page.getByText(role, { exact: true }).last().click(); await page.waitForTimeout(120); };
  const hasAction = async (id, action) => (await page.locator(`[data-node-key="${id}:toolbar:${action}"], [data-node-key$=":action:${action}"]`).count()) > 0;

  await switchPage('文章管理');
  check(await hasAction('ADM-S-010', '发布至 APP'), 'school admin missing publish');
  check(await hasAction('ADM-S-010', '设置首页推荐'), 'school admin missing recommend');
  await switchRole('内容运营人员');
  check(!(await hasAction('ADM-S-010', '发布至 APP')), 'content operator must not publish');
  check(!(await hasAction('ADM-S-010', '设置首页推荐')), 'content operator must not recommend');
  await switchRole('审核人员');
  check(await hasAction('ADM-S-010', '发布至 APP'), 'reviewer missing publish');
  check(await hasAction('ADM-S-010', '设置首页推荐'), 'reviewer missing recommend');

  await switchPage('信息查询分组');
  check(await hasAction('ADM-S-014', '进入信息查询子页面'), 'school admin missing query entry');
  await switchRole('安全审计人员');
  check(await hasAction('ADM-S-014', '进入信息查询子页面'), 'security auditor missing query entry');

  await switchPage('通行记录与用户信息导入导出');
  await switchRole('PAM 分级子账户');
  check(await hasAction('PAM-006', '通行记录导出'), 'PAM account missing access export');
  check(await hasAction('PAM-006', '用户信息导出'), 'PAM account missing user export');
  await switchRole('安全审计人员');
  check(!(await hasAction('PAM-006', '通行记录导出')), 'security auditor must not export access records');
  check(!(await hasAction('PAM-006', '用户信息导出')), 'security auditor must not export users');

  check(errors.length === 0, errors.join('; '));
  console.log(JSON.stringify({ articleRoleChecks: 6, queryEntryChecks: 2, pamExportChecks: 4, consoleErrors: 0 }));
  await browser.close();
})().catch(error => { console.error(error.stack || error.message); process.exit(1); });
