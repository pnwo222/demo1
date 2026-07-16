(function (global) {
  'use strict';

  const summaries = Object.freeze({
    'ADM-S-001': '按时间查看专区与校园用户指标、图表和报表，并对报表导出实施权限控制。',
    'ADM-S-002': '展示学生、教职工和历史学生统计，作为三个师生只读页面的分组入口。',
    'ADM-S-003': '同步并只读查询学生基础信息、专区注册状态和社保卡相关状态，敏感字段脱敏。',
    'ADM-S-004': '同步并只读查询教职工基础信息、在职状态和社保卡相关状态，敏感字段脱敏。',
    'ADM-S-005': '按姓名、证件、手机、学院和专业查询历史学生，只提供详情查看。',
    'ADM-S-006': '维护首页 Banner 的图片、展示时间、优先级和跳转链接，支持图片预览和移除。',
    'ADM-S-007': '维护应用名称、图标、链接、可见身份、可用状态和展示状态。',
    'ADM-S-008': '维护首页模块模板、图片、跳转链接和样式，并展示 APP 同步结果。',
    'ADM-S-009': '维护公告内容与发布范围，区分草稿、提交审核、审核和发布状态。',
    'ADM-S-010': '维护文章，分离内容编辑、审核、发布至 APP 和首页推荐权限。',
    'ADM-S-011': '维护活动内容、身份标签、可见范围、发布时间和展示状态。',
    'ADM-S-012': '只读查询社保卡申领记录，证件和手机脱敏，清单导出独立授权并审计。',
    'ADM-S-013': '监控设备在线状态、位置、门长开与非法时间开门报警，不提供远程配置。',
    'ADM-S-014': '作为访客、通行、消费和借阅记录的分组入口，不虚构数据维护能力。',
    'ADM-S-015': '只读查询访客和拜访信息，手机脱敏，访客记录导出受控。',
    'ADM-S-016': '只读查询通行人员、设备位置、验证方式、方向和时间。',
    'ADM-S-017': '只读查询姓名、商家、交易金额、流水、支付类型、方式和时间。',
    'ADM-S-018': '只读查询借阅人、书籍、条码、借阅、应还和归还日期。',
    'ADM-S-019': '只读查看学校用户身份、绑卡、持卡和登录日期，手机脱敏。',
    'ADM-S-020': '展示学校端菜单层级、路由、权限标识、入口、角色、数据范围和按钮权限。',
    'ADM-P-001': '按时间和高校查看专区、用户、排行、活跃度和报表指标。',
    'ADM-P-002': '按组织树维护学校和部门层级、排序及启停，删除前校验引用关系。',
    'ADM-P-003': '维护平台用户、部门和状态，角色分配独立授权并防止越权。',
    'ADM-P-004': '维护角色并通过资源树和数据范围授权，记录变更前后值并防止自我提权。',
    'ADM-P-005': '仅配置模块显示名称、图标和排序，并只读查看关联菜单与权限。',
    'ADM-P-006': '按资源树维护菜单、路径、显示状态、模块、排序和权限标识。',
    'ADM-P-007': '只读查询访问日志，展示客户端与登录登出信息，IP 地址脱敏。',
    'ADM-P-008': '只读查询操作日志，展示操作内容、结果与异常，IP 地址脱敏。',
    'ADM-P-009': '只读查询外部调用日志，请求参数与响应摘要脱敏。',
    'ADM-P-010': '只读展示宁波一卡通各业务域对接状态、最近同步时间和异常。',
    'ADM-P-011': '展示平台端菜单、路由、权限标识、入口、可见角色、数据范围和按钮权限。',
    'ADM-P-012': '只读展示审核中心对接数据；实际审核动作边界等待接口契约确认。',
    'ADM-P-013': '监控接口、设备、调用状态、设备状态和异常告警，不提供外部系统维护 CRUD。',
  });

  const pages = [...global.UnicardSchoolPages, ...global.UnicardPlatformPages];
  const requirements = Object.fromEntries(pages.map(page => [page.id, Object.freeze({
    id: page.id,
    title: page.title,
    summary: summaries[page.id],
    menuPath: page.menuPath,
    route: page.route,
    permission: page.permission,
    roles: page.roles,
    pageType: page.pageType,
    queryFields: page.queryFields.map(field => field.label),
    tableFields: page.tableFields.map(field => field.label),
    detailFields: page.detailFields.map(field => field.label),
    formFields: page.formFields.map(field => field.label),
    actions: page.actions.map(action => action.name),
    states: page.states.map(state => state.name),
    exceptions: page.exceptions.map(exception => exception.name),
    source: '需求到原型页面蓝图',
  })]));

  global.UnicardPageRequirements = Object.freeze(requirements);
})(window);
