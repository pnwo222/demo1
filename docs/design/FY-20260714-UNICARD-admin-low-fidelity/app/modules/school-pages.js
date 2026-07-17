(function (global) {
  'use strict';

  const F = (name, shape = '文本', source = '需求明确', options = {}) => Object.freeze({
    key: options.key || name,
    label: name,
    source,
    shape,
    sensitive: Boolean(options.sensitive),
  });
  const fields = (names, shape = '文本', source = '需求明确') => names.map(name => F(name, shape, source));
  const A = (name, roles, source = '需求明确', kind = 'link') => Object.freeze({ name, roles, source, kind });
  const S = (name, source = '需求明确') => Object.freeze({ name, source });
  const sampleValue = field => {
    if (field.sensitive) return field.label.includes('手机') ? '138****1024' : '3302**********1024';
    if (/时间|日期/.test(field.label)) return '2026-07-16 09:30';
    if (/状态|结果/.test(field.label)) return '正常';
    if (/金额/.test(field.label)) return '¥ 32.80';
    return `${field.label}示例`;
  };
  const page = definition => Object.freeze({
    ...definition,
    formFields: definition.formFields || [],
    states: definition.states || [S('正常'), S('空数据', '框架惯例')],
    exceptions: definition.exceptions || [S('加载失败', '框架惯例'), S('无权限', '框架惯例')],
    sampleRows: definition.sampleRows || [Object.fromEntries(definition.tableFields.map(field => [field.key, sampleValue(field)]))],
  });
  const schoolAdmin = ['学校管理员'];
  const contentRoles = ['学校管理员', '内容运营人员'];
  const auditRoles = ['学校管理员', '内容运营人员', '审核人员'];
  const securityRoles = ['学校管理员', '安全审计人员'];

  const pages = [
    page({
      id: 'ADM-S-001', title: '业务首页', menuPath: '高校一卡通 / 学校端 / 业务首页', route: '/unicard/school/dashboard', permission: 'unicardSchoolDashboardView', roles: schoolAdmin, pageType: '看板', componentKey: 'dashboard',
      queryFields: [F('统计周期', '日期范围选择器')], tableFields: fields(['专区用户数据', '校园用户数据', '图表', '报表'], '指标/图表'), detailFields: fields(['专区用户数据', '校园用户数据', '统计口径', '更新时间']),
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看指标详情', schoolAdmin), A('报表导出', schoolAdmin, '需求明确', 'controlled')],
      states: [S('加载中', '框架惯例'), S('正常', '框架惯例'), S('空数据', '框架惯例')],
    }),
    page({
      id: 'ADM-S-002', title: '师生管理', menuPath: '高校一卡通 / 学校端 / 师生管理', route: '/unicard/school/people', permission: 'unicardSchoolPeopleView', roles: schoolAdmin, pageType: '分组入口', componentKey: 'readonly',
      queryFields: [], tableFields: fields(['学生统计', '教职工统计', '历史学生统计'], '统计卡片'), detailFields: fields(['学生统计', '教职工统计', '历史学生统计', '社保卡绑定状态']),
      actions: [A('进入学生管理', schoolAdmin), A('进入教职工管理', schoolAdmin), A('进入历史学生管理', schoolAdmin)], states: [S('统计正常'), S('同步异常')],
    }),
    page({
      id: 'ADM-S-003', title: '学生管理', menuPath: '高校一卡通 / 学校端 / 师生管理 / 学生管理', route: '/unicard/school/people/student', permission: 'unicardSchoolStudentView', roles: schoolAdmin, pageType: '同步只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '身份证号', '手机号', '所属学院', '专业', '班级']),
      tableFields: [F('学生姓名'), F('身份证号', '脱敏文本', '需求明确', { sensitive: true }), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['所属学院', '专业', '班级', '学号']), ...fields(['专区注册状态', '社保绑卡状态', '省内持卡状态', '卡规范版本', '社保卡金融账户激活状态'], '状态标签')],
      detailFields: [F('学生姓名'), F('身份证号', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), F('手机号', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), ...fields(['所属学院', '专业', '班级', '学号', '专区注册状态', '社保绑卡状态', '省内持卡状态', '卡规范版本', '社保卡金融账户激活状态'])],
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看学生详情', schoolAdmin)], states: [S('已注册'), S('未注册'), S('已绑卡'), S('未绑卡')], exceptions: [S('同步异常'), S('查询无结果', '框架惯例'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-004', title: '教职工管理', menuPath: '高校一卡通 / 学校端 / 师生管理 / 教职工管理', route: '/unicard/school/people/staff', permission: 'unicardSchoolStaffView', roles: schoolAdmin, pageType: '同步只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '身份证号', '手机号', '入职年份', '当前状态', '部门']),
      tableFields: [F('姓名'), F('身份证号', '脱敏文本', '需求明确', { sensitive: true }), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['入职年份', '当前状态', '部门', '工号']), ...fields(['专区注册状态', '社保绑卡状态', '省内持卡状态', '卡规范版本', '社保卡金融账户激活状态'], '状态标签')],
      detailFields: [F('姓名'), F('身份证号', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), F('手机号', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), ...fields(['入职年份', '当前状态', '部门', '工号', '专区注册状态', '社保绑卡状态', '省内持卡状态', '卡规范版本', '社保卡金融账户激活状态'])],
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看教职工详情', schoolAdmin)], states: [S('在职'), S('离职'), S('已绑卡'), S('未绑卡')], exceptions: [S('同步异常'), S('查询无结果', '框架惯例'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-005', title: '历史学生管理', menuPath: '高校一卡通 / 学校端 / 师生管理 / 历史学生管理', route: '/unicard/school/people/history', permission: 'unicardSchoolHistoryStudentView', roles: schoolAdmin, pageType: '只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '身份证号', '手机号', '所属学院', '专业']), tableFields: [F('姓名'), F('身份证号', '脱敏文本', '需求明确', { sensitive: true }), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['所属学院', '专业'])], detailFields: [F('姓名'), F('身份证号', '脱敏文本', '需求明确', { sensitive: true }), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['所属学院', '专业'])],
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看历史学生详情', schoolAdmin)],
    }),
    page({
      id: 'ADM-S-006', title: '首页 Banner 管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 首页 Banner 管理', route: '/unicard/school/content/banner', permission: 'unicardSchoolBanner*', roles: contentRoles, pageType: '内容管理', componentKey: 'content',
      queryFields: fields(['图片标题', '展示时间', '启用状态']), tableFields: [F('图片标题'), F('上传图片', '图片缩略图'), F('展示时间', '日期时间范围'), F('优先级', '数字'), F('链接跳转', '链接'), F('启用状态', '状态开关')], detailFields: fields(['图片标题', '上传图片', '展示时间', '优先级', '链接跳转', '启用状态']), formFields: fields(['图片标题', '上传图片', '展示时间', '优先级', '链接跳转']),
      actions: [A('查询', contentRoles, '框架惯例', 'primary'), A('重置', contentRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('查看详情', contentRoles), A('预览图片', contentRoles)], states: [S('启用'), S('停用'), S('未到展示时间'), S('已过期')], exceptions: [S('上传失败'), S('链接非法'), S('删除失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-007', title: '应用上线管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 应用上线管理', route: '/unicard/school/content/app', permission: 'unicardSchoolApp*', roles: contentRoles, pageType: '内容管理', componentKey: 'content',
      queryFields: fields(['应用名称', '可见身份', '可用状态', '展示状态']), tableFields: [F('应用名称'), F('应用图标', '图片缩略图'), F('应用链接', '链接'), F('可见身份', '标签组'), F('可用状态', '状态标签'), F('展示状态', '状态开关')], detailFields: fields(['应用名称', '应用图标', '应用链接', '可见身份', '可用状态', '展示状态']), formFields: fields(['应用名称', '应用图标', '应用链接', '可见身份', '可用状态', '展示状态']),
      actions: [A('查询', contentRoles, '框架惯例', 'primary'), A('重置', contentRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('查看详情', contentRoles)], states: [S('可用'), S('不可用'), S('展示'), S('隐藏')], exceptions: [S('图标上传失败'), S('应用链接非法'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-008', title: '首页模块管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 首页模块管理', route: '/unicard/school/content/module', permission: 'unicardSchoolModule*', roles: contentRoles, pageType: '内容管理', componentKey: 'content',
      queryFields: fields(['展示模板', '模板样式']), tableFields: [F('展示模板'), F('展示图片', '图片缩略图'), F('跳转链接', '链接'), F('模板样式'), F('APP 同步状态', '状态标签')], detailFields: fields(['展示模板', '展示图片', '跳转链接', '模板样式', 'APP 同步状态']), formFields: fields(['展示模板', '展示图片', '跳转链接', '模板样式']),
      actions: [A('查询', contentRoles, '框架惯例', 'primary'), A('重置', contentRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('同步 APP 端', contentRoles), A('查看详情', contentRoles)], states: [S('待同步'), S('同步中'), S('同步成功'), S('同步失败')], exceptions: [S('图片上传失败'), S('同步失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-009', title: '公告管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 公告管理', route: '/unicard/school/content/notice', permission: 'unicardSchoolNotice*', roles: auditRoles, pageType: '审核流程', componentKey: 'content',
      queryFields: fields(['公告标题', '发布范围', '审核状态', '发布时间']), tableFields: [F('公告标题'), F('公告内容', '长文本省略+详情'), F('发布范围', '标签组'), F('审核状态', '状态标签'), F('发布时间', '日期时间')], detailFields: fields(['公告标题', '公告内容', '发布范围', '审核状态', '发布时间', '审核意见']), formFields: fields(['公告标题', '公告内容', '发布范围', '计划发布时间']),
      actions: [A('查询', auditRoles, '框架惯例', 'primary'), A('重置', auditRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('提交审核', contentRoles), A('审核', ['审核人员'], '需求明确', 'controlled'), A('查看详情', auditRoles)], states: [S('草稿'), S('待审核'), S('审核通过'), S('审核驳回'), S('已发布')], exceptions: [S('审核冲突'), S('发布失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-010', title: '文章管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 文章管理', route: '/unicard/school/content/article', permission: 'unicardSchoolArticle*', roles: auditRoles, pageType: '内容管理/审核', componentKey: 'content',
      queryFields: fields(['文章标题', '发布人', '展示模式', '审核状态', '推荐状态', '发布时间']), tableFields: [F('文章标题'), F('发布人'), F('展示模式'), F('审核状态', '状态标签'), F('推荐状态', '状态标签'), F('发布时间', '日期时间')], detailFields: fields(['文章标题', '文章内容', '发布人', '展示模式', '审核状态', '推荐状态', '发布时间', '审核意见']), formFields: fields(['文章标题', '文章内容', '封面图片', '展示模式']),
      actions: [A('查询', auditRoles, '框架惯例', 'primary'), A('重置', auditRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('提交审核', contentRoles), A('审核', ['审核人员'], '需求明确', 'controlled'), A('发布至 APP', contentRoles), A('设置首页推荐', ['学校管理员', '内容运营人员']), A('查看详情', auditRoles)], states: [S('草稿'), S('待审核'), S('审核通过'), S('审核驳回'), S('已发布'), S('已推荐')], exceptions: [S('审核冲突'), S('发布失败'), S('推荐失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-011', title: '活动管理', menuPath: '高校一卡通 / 学校端 / 内容管理 / 活动管理', route: '/unicard/school/content/activity', permission: 'unicardSchoolActivity*', roles: contentRoles, pageType: '内容管理', componentKey: 'content',
      queryFields: fields(['活动标题', '身份标签', '可见范围', '发布时间', '展示状态']), tableFields: [F('活动标题'), F('活动内容', '长文本省略+详情'), F('身份标签', '标签组'), F('可见范围', '标签组'), F('发布时间', '日期时间'), F('展示状态', '状态开关')], detailFields: fields(['活动标题', '活动内容', '身份标签', '可见范围', '发布时间', '展示状态']), formFields: fields(['活动标题', '活动内容', '活动图片', '身份标签', '可见范围', '计划发布时间']),
      actions: [A('查询', contentRoles, '框架惯例', 'primary'), A('重置', contentRoles, '框架惯例'), A('新增', contentRoles, '需求明确', 'primary'), A('编辑', contentRoles), A('删除', ['学校管理员'], '需求明确', 'danger'), A('发布', contentRoles), A('查看详情', contentRoles)], states: [S('草稿'), S('待发布'), S('已发布'), S('已下线')], exceptions: [S('图片上传失败'), S('发布失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-012', title: '社保卡申领记录', menuPath: '高校一卡通 / 学校端 / 社保卡申领记录', route: '/unicard/school/social-card', permission: 'unicardSchoolSocialCardView', roles: securityRoles, pageType: '只读查询/受控导出', componentKey: 'readonly',
      queryFields: fields(['姓名', '证件类型', '证件号码', '手机号', '社保绑卡状态']), tableFields: [F('姓名'), F('证件类型'), F('证件号码', '脱敏文本', '需求明确', { sensitive: true }), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['民族', '性别', '职业']), F('社保绑卡状态', '状态标签')], detailFields: [F('姓名'), F('证件类型'), F('证件号码', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), F('手机号', '按权限查看的脱敏文本', '需求明确', { sensitive: true }), ...fields(['民族', '性别', '职业', '社保绑卡状态'])],
      actions: [A('查询', securityRoles, '框架惯例', 'primary'), A('重置', securityRoles, '框架惯例'), A('查看申领详情', securityRoles), A('清单导出', ['学校管理员'], '需求明确', 'controlled')], states: [S('已绑卡'), S('未绑卡'), S('申领中')], exceptions: [S('导出超范围'), S('敏感权限不足'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-013', title: '设备状态监控', menuPath: '高校一卡通 / 学校端 / 设备状态监控', route: '/unicard/school/device', permission: 'unicardSchoolDeviceView', roles: ['学校管理员', '设备运维人员'], pageType: '状态监控', componentKey: 'logMonitor',
      queryFields: fields(['设备名称', '设备位置', '在线状态', '报警状态']), tableFields: [F('设备信息'), F('设备位置'), F('在线状态', '状态标签'), F('门长开报警状态', '告警标签'), F('非法时间开门报警状态', '告警标签'), F('最近上报时间', '日期时间')], detailFields: fields(['设备信息', '设备位置', '在线状态', '门长开报警状态', '非法时间开门报警状态', '最近上报时间']),
      actions: [A('查询', ['学校管理员', '设备运维人员'], '框架惯例', 'primary'), A('重置', ['学校管理员', '设备运维人员'], '框架惯例'), A('查看设备详情', ['学校管理员', '设备运维人员'])], states: [S('在线'), S('离线'), S('门长开报警'), S('非法时间开门报警')], exceptions: [S('设备离线'), S('数据上报中断'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-014', title: '信息查询', menuPath: '高校一卡通 / 学校端 / 信息查询', route: '/unicard/school/query', permission: 'unicardSchoolQueryView', roles: securityRoles, pageType: '分组入口', componentKey: 'readonly',
      queryFields: [], tableFields: fields(['访客记录', '通行记录', '消费记录', '图书借阅记录'], '统计卡片'), detailFields: fields(['访客记录', '通行记录', '消费记录', '图书借阅记录']),
      actions: [A('进入访客记录', securityRoles), A('进入通行记录', securityRoles), A('进入消费记录', securityRoles), A('进入图书借阅记录', securityRoles)],
    }),
    page({
      id: 'ADM-S-015', title: '访客记录', menuPath: '高校一卡通 / 学校端 / 信息查询 / 访客记录', route: '/unicard/school/query/visitor', permission: 'unicardSchoolVisitorView', roles: securityRoles, pageType: '只读查询/受控导出', componentKey: 'readonly',
      queryFields: fields(['来访人', '来访单位', '手机号', '被访人', '拜访部门', '拜访日期']), tableFields: [F('来访人'), F('来访单位'), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['被访人', '拜访部门', '拜访事由']), F('拜访开始日期', '日期时间'), F('拜访结束日期', '日期时间')], detailFields: [F('来访人'), F('来访单位'), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['被访人', '拜访部门', '拜访事由', '拜访开始日期', '拜访结束日期'])],
      actions: [A('查询', securityRoles, '框架惯例', 'primary'), A('重置', securityRoles, '框架惯例'), A('查看访客详情', securityRoles), A('导出访客记录', ['学校管理员'], '需求明确', 'controlled')], exceptions: [S('导出超范围'), S('查询失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-016', title: '通行记录', menuPath: '高校一卡通 / 学校端 / 信息查询 / 通行记录', route: '/unicard/school/query/access', permission: 'unicardSchoolAccessView', roles: securityRoles, pageType: '只读查询', componentKey: 'readonly',
      queryFields: fields(['人员姓名', '设备位置', '验证方式', '通行方向', '通行时间']), tableFields: [F('通行人员信息'), F('设备位置'), F('验证方式', '字典标签'), F('通行方向', '字典标签'), F('通行时间', '日期时间')], detailFields: fields(['通行人员信息', '设备位置', '验证方式', '通行方向', '通行时间']),
      actions: [A('查询', securityRoles, '框架惯例', 'primary'), A('重置', securityRoles, '框架惯例'), A('查看通行详情', securityRoles)],
    }),
    page({
      id: 'ADM-S-017', title: '消费记录', menuPath: '高校一卡通 / 学校端 / 信息查询 / 消费记录', route: '/unicard/school/query/consume', permission: 'unicardSchoolConsumeView', roles: securityRoles, pageType: '只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '商家名称', '支付流水号', '支付类型', '付款方式', '支付时间']), tableFields: [F('姓名'), F('商家名称'), F('交易金额', '金额'), F('支付流水号'), F('支付类型', '字典标签'), F('付款方式', '字典标签'), F('支付时间', '日期时间')], detailFields: fields(['姓名', '商家名称', '交易金额', '支付流水号', '支付类型', '付款方式', '支付时间']),
      actions: [A('查询', securityRoles, '框架惯例', 'primary'), A('重置', securityRoles, '框架惯例'), A('查看消费详情', securityRoles)], exceptions: [S('金额格式异常'), S('查询失败'), S('无权限', '框架惯例')],
    }),
    page({
      id: 'ADM-S-018', title: '图书借阅记录', menuPath: '高校一卡通 / 学校端 / 信息查询 / 图书借阅记录', route: '/unicard/school/query/borrow', permission: 'unicardSchoolBorrowView', roles: securityRoles, pageType: '只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '学号/工号', '书籍题名', '条码号', '借阅日期']), tableFields: [F('姓名'), F('学号/工号'), F('书籍题名'), F('条码号'), F('借阅日期', '日期'), F('应还日期', '日期'), F('归还日期', '日期')], detailFields: fields(['姓名', '学号/工号', '书籍题名', '条码号', '借阅日期', '应还日期', '归还日期']),
      actions: [A('查询', securityRoles, '框架惯例', 'primary'), A('重置', securityRoles, '框架惯例'), A('查看借阅详情', securityRoles)], states: [S('借阅中'), S('已归还'), S('已逾期')],
    }),
    page({
      id: 'ADM-S-019', title: '用户管理', menuPath: '高校一卡通 / 学校端 / 用户管理', route: '/unicard/school/user', permission: 'unicardSchoolUserView', roles: schoolAdmin, pageType: '只读查询', componentKey: 'readonly',
      queryFields: fields(['姓名', '手机号', '用户身份', '社保绑卡状态', '省内持卡状态']), tableFields: [F('姓名'), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), F('用户身份', '标签'), F('社保绑卡状态', '状态标签'), F('省内持卡状态', '状态标签'), F('首次登录日期', '日期时间'), F('最近登录日期', '日期时间')], detailFields: [F('姓名'), F('手机号', '脱敏文本', '需求明确', { sensitive: true }), ...fields(['用户身份', '社保绑卡状态', '省内持卡状态', '首次登录日期', '最近登录日期'])],
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看用户详情', schoolAdmin)], states: [S('已绑卡'), S('未绑卡'), S('省内持卡'), S('未持卡')],
    }),
    page({
      id: 'ADM-S-020', title: '权限与菜单说明', menuPath: '高校一卡通 / 学校端 / 权限与菜单说明', route: '/unicard/school/permission-guide', permission: 'unicardSchoolPermissionGuideView', roles: schoolAdmin, pageType: '权限说明', componentKey: 'permissionGuide',
      queryFields: fields(['菜单名称', '权限标识', '可见角色']), tableFields: [F('菜单名称'), F('路由路径', '代码文本'), F('权限标识', '代码文本'), F('入口位置'), F('可见角色', '标签组'), F('数据范围'), F('按钮权限', '标签组')], detailFields: fields(['菜单名称', '路由路径', '权限标识', '入口位置', '可见角色', '数据范围', '按钮权限']),
      actions: [A('查询', schoolAdmin, '框架惯例', 'primary'), A('重置', schoolAdmin, '框架惯例'), A('查看学校端权限说明', schoolAdmin)], exceptions: [S('无权限', '框架惯例')],
    }),
  ];

  const independentPages = pages.filter(item => item.id !== 'ADM-S-002');
  if (!Array.isArray(independentPages) || independentPages.length !== 19) {
    throw new Error('school independent page contracts must contain 19 pages');
  }
  global.UnicardSchoolPages = Object.freeze(independentPages.map(item => Object.freeze(item)));
})(window);
