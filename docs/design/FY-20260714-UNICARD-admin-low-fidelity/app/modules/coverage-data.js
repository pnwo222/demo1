(function (global) {
  'use strict';

  const coverageMatrixName = '原型需求覆盖矩阵';
  const pages = [...global.UnicardSchoolPages, ...global.UnicardPlatformPages];
  const covered = pages.map(page => Object.freeze({
    id: page.id,
    pageId: page.id,
    status: '已覆盖',
    route: page.route,
    componentKey: page.componentKey,
    fields: page.tableFields.map(field => field.label),
    actions: page.actions.map(action => action.name),
    states: page.states.map(state => state.name),
    permissions: page.roles,
    evidence: `${page.id} / ${page.route} / ${page.componentKey}`,
  }));
  const menuGroupCoverage = Object.freeze({
    id: 'ADM-S-002', pageId: 'ADM-S-002', status: '已覆盖', route: '不适用', componentKey: 'menu-group',
    fields: ['学生管理', '教职工管理', '历史学生管理'], actions: ['展开师生管理菜单', '进入子页面'], states: ['展开', '收起'],
    permissions: ['学校管理员'], evidence: '学校端 / 师生管理菜单分组 / ADM-S-003、ADM-S-004、ADM-S-005',
  });
  const skippedIds = [
    'API-001', 'API-002', 'API-003', 'API-004', 'API-005', 'API-006', 'API-007', 'API-008',
    'PAM-001', 'PAM-002', 'PAM-003', 'PAM-004', 'PAM-005', 'PAM-006', 'PAM-007', 'PAM-008',
  ];
  const skipped = skippedIds.map(id => Object.freeze({
    id,
    status: '不适用',
    reason: '用户明确跳过本次原型；需求和 PRD 保留',
  }));

  global.UnicardCoverageMeta = Object.freeze({ name: coverageMatrixName, covered: 33, notApplicable: 16 });
  global.UnicardCoverageData = Object.freeze([...covered, menuGroupCoverage, ...skipped]);
})(window);
