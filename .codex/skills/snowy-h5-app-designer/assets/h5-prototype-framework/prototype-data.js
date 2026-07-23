window.H5PrototypeData = {
  title: '校园服务',
  schoolName: '示例学校',
  currentPage: 'home',
  pageRequirements: {
    home: '首页集中展示常用服务、公告和校园资讯，入口与排序应以实际需求为准。',
    records: '记录页按时间筛选并展示业务状态，支持查看详情和空状态。',
    form: '申请表单按业务主题分组，包含必填校验、选择器、承诺和提交反馈。'
  },
  annotations: [
    {
      id: 'auto-home-service',
      index: 1,
      scope: 'page:home',
      pageId: 'home',
      targetKey: 'home-service-grid',
      title: '服务入口来源',
      content: '此处仅演示入口形态；正式原型必须按当前需求生成入口名称、图标和跳转。',
      source: 'template',
      automatic: true
    }
  ]
}
