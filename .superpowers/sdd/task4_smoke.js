const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const errors = [];

function check(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1680, height: 1050 }, ignoreHTTPSErrors: true, acceptDownloads: true });
  const page = await context.newPage();
  page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });
  page.on('pageerror', err => errors.push('pageerror: ' + err.message));
  const target = 'file:///' + path.resolve('docs/design/FY-20260714-UNICARD-admin-low-fidelity.html').replace(/\\/g, '/');
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('.snowy-sider', { timeout: 60000 });

  const switchPage = async title => {
    await page.getByText(title, { exact: true }).first().click();
    await page.waitForTimeout(250);
  };
  const closeModal = async () => {
    const modal = page.locator('.ant-modal-wrap:visible').last();
    if (await modal.count()) {
      await modal.locator('.ant-modal-close').click();
      await modal.waitFor({ state: 'hidden' });
    }
  };
  const confirmVisibleModal = async () => {
    const modal = page.locator('.ant-modal-wrap:visible').last();
    await modal.getByRole('button', { name: /确 定|确 认|OK/i }).click();
    await modal.waitFor({ state: 'hidden' });
  };

  check((await page.title()) === '宁波市高校一卡通专区后管低保真原型', 'HTML title mismatch');
  check((await page.locator('.ant-menu-submenu-title').count()) === 4, 'menu group count mismatch');
  check((await page.locator('.ant-menu-item').count()) === 49, 'menu page count mismatch');
  const policyAudit = await page.evaluate(() => {
    const failures = [];
    for (const spec of pageSpecs) {
      const roles = spec.roles.split('、').map(value => value.trim()).filter(Boolean);
      if (JSON.stringify(Object.keys(spec.actionPolicy).sort()) !== JSON.stringify(roles.sort())) failures.push(spec.id + ':角色未完整映射');
      for (const [role, actions] of Object.entries(spec.actionPolicy)) {
        for (const action of actions) if (!spec.actions.includes(action)) failures.push(`${spec.id}:${role}:${action}:未知操作`);
      }
      for (const field of spec.enumQueryFields) if (!spec.options[field]?.length) failures.push(`${spec.id}:${field}:枚举无选项`);
    }
    const notice = pageSpecs.find(spec => spec.id === 'ADM-S-009');
    const operatorRequired = ['新增', '编辑', '删除', '提交审核', '查看详情'];
    if (!operatorRequired.every(action => notice.actionPolicy['内容运营人员'].includes(action))) failures.push('ADM-S-009:内容运营人员缺操作');
    if (JSON.stringify(notice.actionPolicy['审核人员'].sort()) !== JSON.stringify(['审核', '查看详情'].sort())) failures.push('ADM-S-009:审核人员非审核详情专属');
    return failures;
  });
  check(policyAudit.length === 0, 'role/action or enum policy audit failed: ' + policyAudit.join('; '));
  await page.getByRole('button', { name: '原型需求覆盖矩阵' }).click();
  await page.waitForSelector('.coverage-table');
  check((await page.locator('.coverage-table tbody tr').count()) === 49, 'matrix row count mismatch');
  await closeModal();

  // 稳定节点标注：刷新、页面切换及另存为后恢复相同 pin/commentId/nodeKey。
  await page.getByRole('button', { name: '开启' }).click();
  const queryButton = page.locator('[data-node-key="ADM-S-001:query-submit"]');
  await queryButton.click();
  await page.locator('#node-comment-text').fill('刷新、切页与另存为后仍应绑定该查询按钮。');
  await page.locator('.node-comment-popover .ant-btn-primary').click();
  await page.waitForSelector('.node-comment-pin');
  const pinBefore = await page.locator('.node-comment-pin').first().evaluate(el => ({ commentId: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(pinBefore.nodeKey === 'ADM-S-001:query-submit', 'node pin does not use stable semantic key');
  await switchPage('学生管理');
  await switchPage('业务首页（高校首页）');
  const pinAfterSwitch = await page.locator('.node-comment-pin').first().evaluate(el => ({ commentId: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(JSON.stringify(pinAfterSwitch) === JSON.stringify(pinBefore), 'pin binding changed after page switch');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.node-comment-pin');
  const pinAfterReload = await page.locator('.node-comment-pin').first().evaluate(el => ({ commentId: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(JSON.stringify(pinAfterReload) === JSON.stringify(pinBefore), 'pin binding changed after reload');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '另存为' }).click();
  const download = await downloadPromise;
  const exportedPath = path.resolve('.superpowers/sdd/task4-annotated-export.html');
  await download.saveAs(exportedPath);
  const exportPage = await context.newPage();
  const exportErrors = [];
  exportPage.on('console', msg => { if (msg.type() === 'error') exportErrors.push(msg.text()); });
  exportPage.on('pageerror', err => exportErrors.push(err.message));
  await exportPage.goto('file:///' + exportedPath.replace(/\\/g, '/'), { waitUntil: 'networkidle', timeout: 60000 });
  await exportPage.waitForSelector('.node-comment-pin');
  const pinAfterExport = await exportPage.locator('.node-comment-pin').first().evaluate(el => ({ commentId: el.dataset.commentId, nodeKey: el.dataset.nodeKey }));
  check(JSON.stringify(pinAfterExport) === JSON.stringify(pinBefore), 'pin binding changed in saved HTML');
  check(exportErrors.length === 0, 'saved HTML runtime errors: ' + exportErrors.join('; '));
  await exportPage.close();

  // PAM-006：含“导入”的专属动作必须走文件、移除、预校验与错误明细。
  await switchPage('通行记录与用户信息导入导出');
  await page.getByRole('button', { name: '用户信息导入', exact: true }).click();
  const importModal = page.locator('.ant-modal-wrap:visible');
  await importModal.locator('input[type=file]').setInputFiles({ name: 'pam-users.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('prototype') });
  check(await importModal.getByText('pam-users.xlsx', { exact: false }).isVisible(), 'import preview missing');
  check(await importModal.locator('[data-node-key="import:remove"]').isVisible(), 'import remove missing');
  await importModal.locator('[data-node-key="import:validate"]').click();
  check(await importModal.getByText('成功 18 条，失败 2 条', { exact: false }).isVisible(), 'import precheck summary missing');
  check(await importModal.getByText('人员编号重复', { exact: false }).isVisible(), 'import error detail missing');
  await importModal.locator('.ant-modal-footer .ant-btn').last().click();

  // 授权树和防越权校验。
  await switchPage('设备分组管理');
  await page.getByText('授权', { exact: true }).first().click();
  const authModal = page.locator('.ant-modal-wrap:visible');
  check(await authModal.getByText('当前范围', { exact: true }).isVisible(), 'authorization current scope missing');
  check(await authModal.locator('[data-node-key="authorization:tree"]').isVisible(), 'authorization tree missing');
  await authModal.locator('.ant-select-selector').click();
  await page.getByText('当前部门', { exact: true }).last().click();
  await authModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await authModal.waitFor({ state: 'hidden' });

  // 提交审核与审核必须是两条独立状态机；同时验证公告页逐角色动作策略。
  await switchPage('公告管理');
  const auditRow = page.locator('tbody tr[data-row-key]').first();
  const roleSelectAtNotice = page.locator('[data-node-key="global:role-preview"]');
  await roleSelectAtNotice.click();
  await page.getByText('内容运营人员', { exact: true }).last().click();
  for (const action of ['新增', '编辑', '删除', '提交审核', '查看详情']) {
    const locator = page.locator(`[data-node-key="ADM-S-009:toolbar:${action}"], [data-node-key$=":action:${action}"]`);
    check((await locator.count()) > 0, 'content operator missing action: ' + action);
  }
  check((await page.locator('[data-node-key$=":action:审核"]').count()) === 0, 'content operator must not see reviewer audit action');
  await page.locator('[data-node-key$=":action:提交审核"]').first().click();
  const submissionModal = page.locator('.ant-modal-wrap:visible');
  check(await submissionModal.getByText('发布范围确认', { exact: false }).isVisible(), 'submission modal missing scope confirmation');
  check((await submissionModal.locator('[data-node-key="audit:decision"]').count()) === 0, 'submission must not open reviewer audit form');
  await submissionModal.locator('[data-node-key="submission:note"] textarea').fill('内容编辑完成，申请审核。').catch(async () => submissionModal.locator('textarea').fill('内容编辑完成，申请审核。'));
  await submissionModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await submissionModal.waitFor({ state: 'hidden' });
  check((await auditRow.innerText()).includes('待审核'), 'submission did not change draft to pending review');
  await roleSelectAtNotice.click();
  await page.getByText('审核人员', { exact: true }).last().click();
  check((await page.locator('[data-node-key="ADM-S-009:toolbar:新增"]').count()) === 0, 'reviewer must not see create');
  check((await page.locator('[data-node-key$=":action:删除"]').count()) === 0, 'reviewer must not see delete');
  check((await page.locator('[data-node-key$=":action:提交审核"]').count()) === 0, 'reviewer must not see submit review');
  await page.locator('[data-node-key$=":action:审核"]').first().click();
  const auditModal = page.locator('.ant-modal-wrap:visible');
  await auditModal.locator('[data-node-key="audit:opinion"] textarea').fill('内容合规，同意发布。').catch(async () => auditModal.locator('textarea').fill('内容合规，同意发布。'));
  await auditModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await auditModal.waitFor({ state: 'hidden' });
  const auditRowText = await page.locator('tbody tr[data-row-key]').first().innerText();
  check(auditRowText.includes('审核通过'), 'audit did not update row status; row=' + auditRowText);

  // 启用/禁用状态词必须保持“禁用”，不能写成“停用”。
  await switchPage('用户管理');
  const platformUserRow = page.locator('tbody tr[data-row-key]').first();
  await page.locator('[data-node-key$=":action:禁用"]').first().click();
  const statusModal = page.locator('.ant-modal-wrap:visible');
  check(await statusModal.getByText('状态切换需二次确认', { exact: false }).isVisible(), 'status confirmation missing');
  await statusModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await statusModal.waitFor({ state: 'hidden' });
  check((await platformUserRow.locator('[data-node-key$=":field:账号状态"]').innerText()) === '禁用', 'disable did not write page-specific 禁用 status');
  await page.locator('[data-node-key$=":action:启用"]').first().click();
  const enableModal = page.locator('.ant-modal-wrap:visible');
  await enableModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await enableModal.waitFor({ state: 'hidden' });
  check((await platformUserRow.locator('[data-node-key$=":field:账号状态"]').innerText()) === '启用', 'enable did not restore 启用 status');

  // 启用/停用类型页面由字段枚举决定关闭值为“停用”。
  await switchPage('应用上线管理');
  const availabilitySwitch = page.locator('[data-node-key$=":switch:可用状态"]').first();
  await availabilitySwitch.click();
  const stopModal = page.locator('.ant-modal-wrap:visible');
  check(await stopModal.getByText('停用', { exact: true }).last().isVisible(), 'availability switch must map off to 停用');
  await stopModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await stopModal.waitFor({ state: 'hidden' });
  await availabilitySwitch.click();
  const restartModal = page.locator('.ant-modal-wrap:visible');
  check(await restartModal.getByText('停用', { exact: true }).first().isVisible(), 'availability row did not persist 停用');
  await restartModal.locator('.ant-modal-footer .ant-btn-primary').click();
  await restartModal.waitFor({ state: 'hidden' });

  // PAM-002 角色差异：安全审计人员只读，PAM 分级子账户才可采集/更新。
  await switchPage('掌静脉识别算法特征库');
  check(await page.getByText('发起采集', { exact: true }).first().isVisible(), 'PAM account capture action missing');
  const roleSelect = page.locator('[data-node-key="global:role-preview"]');
  await roleSelect.click();
  await page.getByText('安全审计人员', { exact: true }).last().click();
  check((await page.getByText('发起采集', { exact: true }).count()) === 0, 'auditor must not see capture action');
  check((await page.getByText('更新登记状态', { exact: true }).count()) === 0, 'auditor must not see status update action');
  await roleSelect.click();
  await page.getByText('PAM 分级子账户', { exact: true }).last().click();
  check(await page.getByText('发起采集', { exact: true }).first().isVisible(), 'PAM account capture action not restored');

  // 三类以上页面枚举必须来自页面专属语义。
  const enums = await page.evaluate(() => ({
    audit: pageSpecs.find(p => p.id === 'ADM-S-009').options['审核状态'],
    verify: pageSpecs.find(p => p.id === 'API-005').options['认证结果'],
    access: pageSpecs.find(p => p.id === 'ADM-S-016').options['通行方向'],
    palm: pageSpecs.find(p => p.id === 'PAM-002').options['登记状态']
  }));
  check(enums.audit?.includes('审核驳回'), 'audit enum not page-specific');
  check(enums.verify?.includes('未通过'), 'verification enum not page-specific');
  check(enums.access?.includes('离开'), 'direction enum not page-specific');
  check(enums.palm?.includes('登记中'), 'palm enum not page-specific');

  // 复审指定的六个枚举字段必须有需求选项并实际渲染为下拉。
  const requiredOptionFields = [
    ['ADM-S-007', '应用上线管理', '可见身份', '学生'],
    ['ADM-S-010', '文章管理', '展示模式', '图文'],
    ['ADM-S-011', '活动管理', '身份标签', '教职工'],
    ['ADM-S-012', '社保卡申领记录', '民族', '汉族'],
    ['ADM-S-012', '社保卡申领记录', '性别', '女'],
    ['API-005', '电子社保码认证接口', '认证场景', '食堂支付']
  ];
  const requiredOptionsAudit = await page.evaluate(items => items.map(([id, , field, expected]) => {
    const values = pageSpecs.find(spec => spec.id === id)?.options?.[field] || [];
    return { id, field, expected, values };
  }), requiredOptionFields);
  for (const item of requiredOptionsAudit) check(item.values.includes(item.expected), `${item.id}:${item.field} missing required option ${item.expected}`);
  for (const [id, title, field] of requiredOptionFields) {
    await switchPage(title);
    check(await page.locator(`[data-node-key="${id}:query:${field}"] .ant-select`).isVisible(), `${id}:${field} not rendered as select`);
  }

  // 日期范围真实解析与边界包含；分页必须切换不同 rowKey。
  await switchPage('通行记录管理');
  const dateInputs = page.locator('.query-card .ant-picker-input input');
  check((await dateInputs.count()) >= 2, 'date range picker missing');
  await dateInputs.nth(0).click();
  await page.locator('.ant-picker-dropdown:visible td[title="2026-07-10"]').first().click();
  await page.locator('.ant-picker-dropdown:visible td[title="2026-07-12"]').first().click();
  await page.locator('[data-node-key="ADM-S-016:query-submit"]').click();
  await page.waitForTimeout(250);
  const dateKeys = await page.locator('tbody tr[data-row-key]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-key')));
  check(dateKeys.length === 3, 'date boundary filter should return 3 rows, got ' + dateKeys.length);
  check(dateKeys[0].endsWith('010') && dateKeys[2].endsWith('012'), 'date filter boundaries incorrect: ' + dateKeys.join(','));
  await page.locator('[data-node-key="ADM-S-016:query-reset"]').click();
  const firstPageKeys = await page.locator('tbody tr[data-row-key]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-key')));
  await page.locator('.ant-pagination-item-2').click();
  await page.waitForTimeout(250);
  const secondPageKeys = await page.locator('tbody tr[data-row-key]').evaluateAll(rows => rows.map(row => row.getAttribute('data-row-key')));
  check(firstPageKeys.length === 10 && secondPageKeys.length === 10, 'pagination page size mismatch');
  check(firstPageKeys.every(key => !secondPageKeys.includes(key)), 'pagination repeated first-page row keys');

  // 自动标注未修改删除只隐藏本地副本，支持恢复。
  await page.getByRole('button', { name: '标注清单' }).click();
  const annotationDrawer = page.locator('.ant-drawer:visible');
  await annotationDrawer.getByText('删除自动标注', { exact: true }).click();
  check(await annotationDrawer.getByRole('button', { name: '恢复隐藏的自动标注' }).isVisible(), 'hidden baseline restore entry missing');
  await annotationDrawer.getByRole('button', { name: '恢复隐藏的自动标注' }).click();
  check(await annotationDrawer.getByText('删除自动标注', { exact: true }).isVisible(), 'baseline annotation restore failed');

  check(errors.length === 0, errors.join('\n'));
  console.log(JSON.stringify({
    title: await page.title(), menuGroups: 4, pages: 49, matrixRows: 49,
    stablePin: pinAfterReload, importPrecheck: true, authorizationTree: true,
    submitAndAuditStates: true, statusEnumsChanged: true, roleActionPolicies: true,
    enumsChecked: 10, dateRows: dateKeys.length, paginationKeysChanged: true, errors: 0
  }));
  await browser.close();
  if (fs.existsSync(exportedPath)) fs.unlinkSync(exportedPath);
})().catch(error => {
  if (errors.length) console.error(errors.join('\n'));
  console.error(error.stack || error.message);
  process.exit(1);
});
