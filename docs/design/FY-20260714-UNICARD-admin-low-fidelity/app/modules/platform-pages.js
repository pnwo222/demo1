(function (global) {
  'use strict';

  const F = (name, shape = '文本', source = '需求明确', options = {}) => Object.freeze({ key: options.key || name, label: name, source, shape, sensitive: Boolean(options.sensitive) });
  const fields = (names, shape = '文本', source = '需求明确') => names.map(name => F(name, shape, source));
  const A = (name, roles, source = '需求明确', kind = 'link') => Object.freeze({ name, roles, source, kind });
  const S = (name, source = '需求明确') => Object.freeze({ name, source });
  const sampleValue = field => field.sensitive ? '已脱敏' : /时间|日期/.test(field.label) ? '2026-07-16 09:30' : /状态|结果/.test(field.label) ? '正常' : `${field.label}示例`;
  const page = definition => Object.freeze({
    ...definition,
    formFields: definition.formFields || [],
    states: definition.states || [S('正常'), S('空数据', '框架惯例')],
    exceptions: definition.exceptions || [S('加载失败', '框架惯例'), S('无权限', '框架惯例')],
    sampleRows: definition.sampleRows || [Object.fromEntries(definition.tableFields.map(field => [field.key, sampleValue(field)]))],
  });
  const platformAdmin = ['平台管理员'];
  const auditReaders = ['平台管理员', '安全审计人员'];

  const pages = [
    page({
      id: 'ADM-P-001', title: '系统首页', menuPath: '高校一卡通 / 平台端 / 系统首页', route: '/unicard/platform/dashboard', permission: 'unicardPlatformDashboardView', roles: platformAdmin, pageType: '看板', componentKey: 'dashboard',
      queryFields: [F('统计周期', '日期范围选择器'), F('高校', '树选择器')], tableFields: fields(['高校专区数据', '专区用户数据', '校园用户数据', '高校用户排行', '活跃度排行', '报表'], '指标/图表'), detailFields: fields(['高校专区数据', '专区用户数据', '校园用户数据', '高校用户排行', '活跃度排行', '统计口径', '更新时间']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('查看指标详情', platformAdmin), A('报表导出', platformAdmin, '需求明确', 'controlled')], states: [S('加载中', '框架惯例'), S('正常', '框架惯例'), S('空数据', '框架惯例')],
    }),
    page({
      id: 'ADM-P-002', title: '学校管理', menuPath: '高校一卡通 / 平台端 / 组织架构 / 学校管理', route: '/unicard/platform/org/school', permission: 'unicardPlatformSchool*', roles: platformAdmin, pageType: '树形 CRUD', componentKey: 'governance',
      queryFields: fields(['学校名称', '部门名称', '状态']), tableFields: [F('学校名称'), F('部门名称'), F('上级节点', '树节点'), F('层级关系', '树路径'), F('排序', '数字'), F('状态', '状态开关')], detailFields: fields(['学校名称', '部门名称', '上级节点', '层级关系', '排序', '状态']), formFields: fields(['学校名称', '部门名称', '上级节点', '排序', '状态']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('新增', platformAdmin, '需求明确', 'primary'), A('编辑', platformAdmin), A('删除', platformAdmin, '需求明确', 'danger'), A('调整层级', platformAdmin, '需求明确', 'controlled'), A('查看详情', platformAdmin)], states: [S('启用'), S('停用')], exceptions: [S('存在下级节点'), S('存在关联用户'), S('层级调整失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-003', title: '用户管理', menuPath: '高校一卡通 / 平台端 / 组织架构 / 用户管理', route: '/unicard/platform/org/user', permission: 'unicardPlatformUser*', roles: platformAdmin, pageType: '用户 CRUD', componentKey: 'governance',
      queryFields: fields(['用户账号', '所属部门', '角色', '账号状态']), tableFields: [F('用户账号'), F('所属部门', '树路径'), F('角色', '标签组'), F('权限', '标签组'), F('账号状态', '状态开关'), F('创建时间', '日期时间')], detailFields: fields(['用户账号', '所属部门', '角色', '权限', '账号状态', '创建时间']), formFields: fields(['用户账号', '所属部门', '账号状态']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('新增', platformAdmin, '需求明确', 'primary'), A('编辑', platformAdmin), A('禁用', platformAdmin, '需求明确', 'danger'), A('启用', platformAdmin), A('分配角色', platformAdmin, '需求明确', 'controlled'), A('查看详情', platformAdmin)], states: [S('启用'), S('停用'), S('锁定')], exceptions: [S('账号重复'), S('越权分配角色'), S('禁用当前账号'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-004', title: '角色管理', menuPath: '高校一卡通 / 平台端 / 权限管理 / 角色管理', route: '/unicard/platform/auth/role', permission: 'unicardPlatformRole*', roles: platformAdmin, pageType: '角色 CRUD/授权', componentKey: 'roleGrant',
      queryFields: fields(['角色名称', '角色编码', '状态']), tableFields: [F('角色名称'), F('角色编码', '代码文本'), F('权限集合', '标签组'), F('数据范围', '树路径'), F('状态', '状态开关'), F('关联用户', '数字')], detailFields: fields(['角色名称', '角色编码', '权限集合', '数据范围', '状态', '关联用户', '变更前权限', '变更后权限']), formFields: fields(['角色名称', '角色编码', '状态']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('新增', platformAdmin, '需求明确', 'primary'), A('编辑', platformAdmin), A('删除', platformAdmin, '需求明确', 'danger'), A('菜单授权', platformAdmin, '需求明确', 'controlled'), A('数据授权', platformAdmin, '框架惯例', 'controlled'), A('查看详情', platformAdmin)], states: [S('启用'), S('停用'), S('授权成功'), S('授权失败')], exceptions: [S('角色编码重复'), S('角色已关联用户'), S('越权授权'), S('自我提权'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-005', title: '模块管理', menuPath: '高校一卡通 / 平台端 / 权限管理 / 模块管理', route: '/unicard/platform/auth/module', permission: 'unicardPlatformModule*', roles: platformAdmin, pageType: '显示配置', componentKey: 'governance',
      queryFields: fields(['模块名称', '显示名称']), tableFields: [F('模块名称'), F('显示名称'), F('图标', '图标'), F('排序', '数字'), F('关联菜单', '标签组'), F('关联权限', '标签组')], detailFields: fields(['模块名称', '显示名称', '图标', '排序', '关联菜单', '关联权限']), formFields: fields(['显示名称', '图标', '排序']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('配置显示字段', platformAdmin), A('查看关联菜单与权限', platformAdmin)], exceptions: [S('配置保存失败'), S('查询无结果', '框架惯例'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-006', title: '菜单管理', menuPath: '高校一卡通 / 平台端 / 权限管理 / 菜单管理', route: '/unicard/platform/auth/menu', permission: 'unicardPlatformMenu*', roles: platformAdmin, pageType: '树形资源 CRUD', componentKey: 'governance',
      queryFields: fields(['菜单名称', '访问路径', '显示状态', '关联模块']), tableFields: [F('菜单名称'), F('访问路径', '代码文本'), F('显示名称'), F('显示状态', '状态开关'), F('关联模块'), F('排序', '数字'), F('权限标识', '代码文本')], detailFields: fields(['菜单名称', '访问路径', '显示名称', '显示状态', '关联模块', '排序', '权限标识']), formFields: fields(['菜单名称', '访问路径', '显示名称', '显示状态', '关联模块', '排序', '权限标识']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('新增', platformAdmin, '需求明确', 'primary'), A('编辑', platformAdmin), A('删除', platformAdmin, '需求明确', 'danger'), A('排序调整', platformAdmin), A('查看详情', platformAdmin)], states: [S('显示'), S('隐藏'), S('启用'), S('停用')], exceptions: [S('权限标识重复'), S('存在子菜单'), S('菜单被角色引用'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-007', title: '访问日志', menuPath: '高校一卡通 / 平台端 / 日志管理 / 访问日志', route: '/unicard/platform/log/access', permission: 'unicardPlatformAccessLogView', roles: auditReaders, pageType: '只读日志', componentKey: 'logMonitor',
      queryFields: fields(['名称', 'IP 地址', '用户', '登录登出类型', '时间']), tableFields: [F('名称'), F('IP 地址', '脱敏文本', '需求明确', { sensitive: true }), F('地址'), F('浏览器'), F('设备'), F('时间', '日期时间'), F('用户'), F('登录登出类型', '字典标签')], detailFields: [F('名称'), F('IP 地址', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['地址', '浏览器', '设备', '时间', '用户', '登录登出类型'])],
      actions: [A('查询', auditReaders, '框架惯例', 'primary'), A('重置', auditReaders, '框架惯例'), A('查看访问日志详情', auditReaders)], states: [S('登录成功'), S('登录失败'), S('已登出')], exceptions: [S('日志查询失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-008', title: '操作日志', menuPath: '高校一卡通 / 平台端 / 日志管理 / 操作日志', route: '/unicard/platform/log/operation', permission: 'unicardPlatformOperationLogView', roles: auditReaders, pageType: '只读日志', componentKey: 'logMonitor',
      queryFields: fields(['用户', 'IP 地址', '操作时间', '操作结果']), tableFields: [F('用户'), F('IP 地址', '脱敏文本', '需求明确', { sensitive: true }), F('操作时间', '日期时间'), F('操作内容', '长文本省略+详情'), F('操作结果', '状态标签'), F('异常内容', '长文本省略+详情')], detailFields: [F('用户'), F('IP 地址', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['操作时间', '操作内容', '操作结果', '异常内容'])],
      actions: [A('查询', auditReaders, '框架惯例', 'primary'), A('重置', auditReaders, '框架惯例'), A('查看操作日志详情', auditReaders)], states: [S('成功'), S('失败')], exceptions: [S('日志查询失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-009', title: '外部调用日志', menuPath: '高校一卡通 / 平台端 / 日志管理 / 外部调用日志', route: '/unicard/platform/log/external', permission: 'unicardPlatformExternalLogView', roles: auditReaders, pageType: '只读日志', componentKey: 'logMonitor',
      queryFields: fields(['日志分类', '日志名称', '执行状态', '请求方式', '操作时间']), tableFields: [F('日志分类'), F('日志名称'), F('执行状态', '状态标签'), F('请求方式', '字典标签'), F('请求参数', '脱敏 JSON', '需求明确', { sensitive: true }), F('操作时间', '日期时间')], detailFields: [F('日志分类'), F('日志名称'), F('执行状态'), F('请求方式'), F('请求参数', '脱敏 JSON', '需求明确', { sensitive: true }), F('响应摘要', '脱敏 JSON', '框架惯例', { sensitive: true }), F('操作时间')],
      actions: [A('查询', auditReaders, '框架惯例', 'primary'), A('重置', auditReaders, '框架惯例'), A('查看外部调用日志详情', auditReaders)], states: [S('成功'), S('失败'), S('超时')], exceptions: [S('请求参数不可见'), S('日志查询失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-010', title: '宁波一卡通对接', menuPath: '高校一卡通 / 平台端 / 宁波一卡通对接', route: '/unicard/platform/integration', permission: 'unicardPlatformIntegrationView', roles: auditReaders, pageType: '对接状态', componentKey: 'logMonitor',
      queryFields: fields(['业务域', '对接状态', '最近同步时间']), tableFields: [F('用户中心'), F('内容管理'), F('访客预约查询'), F('门禁记录查询'), F('图书借阅记录'), F('消费记录查询'), F('用卡数据统计'), F('审核中心'), F('对接状态', '状态标签'), F('最近同步时间', '日期时间')], detailFields: fields(['业务域', '对接状态', '最近同步时间', '最近成功时间', '异常摘要']),
      actions: [A('查询', auditReaders, '框架惯例', 'primary'), A('重置', auditReaders, '框架惯例'), A('查看对接状态详情', auditReaders)], states: [S('正常'), S('部分异常'), S('中断')], exceptions: [S('外部系统超时'), S('接口异常'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-011', title: '权限与菜单说明', menuPath: '高校一卡通 / 平台端 / 权限与菜单说明', route: '/unicard/platform/permission-guide', permission: 'unicardPlatformPermissionGuideView', roles: platformAdmin, pageType: '权限说明', componentKey: 'permissionGuide',
      queryFields: fields(['菜单名称', '权限标识', '可见角色']), tableFields: [F('菜单名称'), F('路由路径', '代码文本'), F('权限标识', '代码文本'), F('入口位置'), F('可见角色', '标签组'), F('数据范围'), F('按钮权限', '标签组')], detailFields: fields(['菜单名称', '路由路径', '权限标识', '入口位置', '可见角色', '数据范围', '按钮权限']),
      actions: [A('查询', platformAdmin, '框架惯例', 'primary'), A('重置', platformAdmin, '框架惯例'), A('查看平台端权限说明', platformAdmin)], exceptions: [S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-012', title: '审核中心', menuPath: '高校一卡通 / 平台端 / 审核中心', route: '/unicard/platform/audit', permission: 'unicardPlatformAuditView', roles: ['平台管理员', '审核人员'], pageType: '只读对接视图', componentKey: 'audit',
      queryFields: fields(['审核业务类型', '审核单号', '提交人', '提交时间', '审核状态']), tableFields: [F('审核业务类型'), F('审核单号'), F('提交人'), F('提交时间', '日期时间'), F('审核状态', '状态标签'), F('审核结果', '状态标签')], detailFields: fields(['审核业务类型', '审核单号', '提交人', '提交时间', '审核状态', '审核结果', '审核意见', '来源系统']),
      actions: [A('查询', ['平台管理员', '审核人员'], '框架惯例', 'primary'), A('重置', ['平台管理员', '审核人员'], '框架惯例'), A('查看审核数据详情', ['平台管理员', '审核人员'])], states: [S('待审核'), S('审核通过'), S('审核驳回')], exceptions: [S('对接延迟'), S('来源数据异常'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-P-013', title: '系统监控', menuPath: '高校一卡通 / 平台端 / 系统监控', route: '/unicard/platform/monitor', permission: 'unicardPlatformMonitorView', roles: ['平台管理员', '设备运维人员', '安全审计人员'], pageType: '监控看板', componentKey: 'logMonitor',
      queryFields: fields(['监控类型', '调用状态', '设备状态', '告警级别']), tableFields: [F('接口日志'), F('设备监控'), F('调用状态', '状态标签'), F('设备状态', '状态标签'), F('异常告警', '告警标签'), F('最近上报时间', '日期时间')], detailFields: fields(['监控类型', '调用状态', '设备状态', '异常告警', '最近上报时间', '异常摘要']),
      actions: [A('查询', ['平台管理员', '设备运维人员', '安全审计人员'], '框架惯例', 'primary'), A('重置', ['平台管理员', '设备运维人员', '安全审计人员'], '框架惯例'), A('查看监控详情', ['平台管理员', '设备运维人员', '安全审计人员'])], states: [S('正常'), S('告警'), S('离线'), S('调用失败')], exceptions: [S('监控数据延迟'), S('接口异常'), S('设备上报中断'), S('无权限', '框架惯例')],
    }),
  ];

  if (!Array.isArray(pages) || pages.length !== 13) {
    throw new Error('platform page contracts must contain 13 pages');
  }
  global.UnicardPlatformPages = Object.freeze(pages.map(item => Object.freeze(item)));
})(window);
