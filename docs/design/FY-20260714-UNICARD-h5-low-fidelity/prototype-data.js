window.H5PrototypeData = {
  title: '宁波市高校一卡通 · 纺院专区',
  schoolName: '浙江纺织服装职业技术学院',
  currentPage: (location.hash || '#/home').slice(2) || 'home',
  pageRequirements: {
    home: 'H5-001：首页聚合 Banner、通知公告、校园资讯、特色应用场景和学校专区入口。',
    'school-profile': 'H5-002：以图文展示历史沿革、办学理念、发展目标、师资力量和科研成果。',
    majors: 'H5-003：专业列表展示专业代码、专业名称和所属分院。',
    'major-detail': 'H5-003：专业详情完整展示专业代码、专业名称和所属分院。',
    'campus-map': 'H5-004：以图片呈现校园地图和场所分布。',
    admission: 'H5-005：展示招生热线、传真和微信公众号。',
    notices: 'H5-006：查看通知公告清单。',
    'notice-detail': 'H5-006：查看通知公告详情。',
    news: 'H5-007：查看校园资讯清单、推荐状态与展示状态。',
    'news-detail': 'H5-007：查看校园资讯图文详情。',
    'visitor-apply': 'H5-008：访客填写九项预约信息并提交审核。',
    'visitor-records': 'H5-008：查看已通过、待审核、未通过预约记录。',
    'visitor-detail': 'H5-008：查看预约详情和最新审核状态。',
    onboarding: 'H5-009：校园启航聚合账号激活、身份核验、社保卡绑定与预约办卡。',
    'onboarding-verify': 'H5-009：新生信息与招生录取数据源比对核验。',
    'onboarding-card': 'H5-009：选择已有本省社保卡绑定或无卡预约办理。',
    'onboarding-apply-card': 'H5-009：选择并预览预约办卡材料。',
    'onboarding-result': 'H5-009：展示认证、绑卡和预约办卡结果。',
    books: 'H5-010：提供新书推荐、图书检索和借阅排行。',
    'book-results': 'H5-010：展示图书检索结果和完整书目字段。',
    'book-detail': 'H5-010：展示图书详情、借阅状态和馆场地。',
    mine: 'H5-011：聚合个人资料、预约、消费、图书、门禁、账本、社保卡和校园码。',
    profile: 'H5-011：展示个人资料和身份差异。',
    messages: 'H5-012：集中展示宁波一卡通 APP 服务消息。',
    'message-detail': 'H5-012：查看消息内容并更新阅读状态。',
    wallet: 'H5-013：绑定并查看校园卡和校园码。'
  },
  annotations: [
    { id: 'h5ann-001', index: 1, scope: 'page:home', pageId: 'home', targetKey: 'home-content-source', title: '首页发布约束', content: 'Banner、公告和资讯由学校端维护；仅“已发布”内容允许在 H5 首页展示。', source: 'H5-001', automatic: true },
    { id: 'h5ann-002', index: 2, scope: 'page:school-profile', pageId: 'school-profile', targetKey: 'school-profile-sections', title: '学校简介发布约束', content: '历史沿革、办学理念、发展目标、师资力量和科研成果均由已发布图文内容提供。', source: 'H5-002', automatic: true },
    { id: 'h5ann-003', index: 3, scope: 'page:majors', pageId: 'majors', targetKey: 'major-search', title: '专业检索范围待确认', content: '标书仅明确展示专业代码、名称和所属分院；专业名称检索与分院筛选属于原型补充能力，正式范围待确认。', source: 'H5-003', automatic: true },
    { id: 'h5ann-004', index: 4, scope: 'page:campus-map', pageId: 'campus-map', targetKey: 'campus-map-media', title: '地图交互范围待确认', content: '标书明确以图片展示校园地图；缩放与全屏预览是否纳入正式范围待确认。', source: 'H5-004', automatic: true },
    { id: 'h5ann-005', index: 5, scope: 'page:admission', pageId: 'admission', targetKey: 'admission-contact-actions', title: '联系操作依赖宿主能力', content: '拨号、复制和二维码保存依赖浏览器或宁波一卡通 APP 宿主能力，正式调用方式待确认。', source: 'H5-005', automatic: true },
    { id: 'h5ann-006', index: 6, scope: 'page:notices', pageId: 'notices', targetKey: 'notice-list-content', title: '公告扩展字段待确认', content: '标书仅明确通知公告的查看；摘要、发布时间和关键字检索为移动端列表补充字段，正式范围待确认。', source: 'H5-006', automatic: true },
    { id: 'h5ann-007', index: 7, scope: 'page:notice-detail', pageId: 'notice-detail', targetKey: 'notice-detail-body', title: '公告撤回规则', content: '详情页仅展示已发布公告；公告被撤回后不得继续展示正文。', source: 'H5-006', automatic: true },
    { id: 'h5ann-008', index: 8, scope: 'page:news', pageId: 'news', targetKey: 'news-list-cards', title: '资讯展示与推荐规则', content: '列表仅展示已发布资讯；被推荐的资讯可进入首页 Banner。', source: 'H5-007', automatic: true },
    { id: 'h5ann-009', index: 9, scope: 'page:news-detail', pageId: 'news-detail', targetKey: 'news-detail-body', title: '资讯下架规则', content: '推荐资讯可从首页 Banner 进入；资讯下架后详情不得继续展示。', source: 'H5-007', automatic: true },
    { id: 'h5ann-010', index: 10, scope: 'page:visitor-apply', pageId: 'visitor-apply', targetKey: 'visitor-sensitive-fields', title: '访客敏感信息保护', content: '身份证号和手机号属于敏感字段；脱敏、加密、留存和审计规则需在安全方案中确认。', source: 'H5-008', automatic: true },
    { id: 'h5ann-011', index: 11, scope: 'page:visitor-apply', pageId: 'visitor-apply', targetKey: 'visitor-passage-fields', title: '驾车来访校验规则', content: '通行方式选择“驾车”后，车牌号变为必填；选择“步行”时不展示车牌号。', source: 'H5-008', automatic: true },
    { id: 'h5ann-012', index: 12, scope: 'page:visitor-records', pageId: 'visitor-records', targetKey: 'visitor-status-tabs', title: '预约审核状态语义', content: '原型状态为待审核、已通过、未通过；被访人与部门审核过程暂合并为“待审核”，正式细分状态待对接协议确认。', source: 'H5-008', automatic: true },
    { id: 'h5ann-013', index: 13, scope: 'page:visitor-detail', pageId: 'visitor-detail', targetKey: 'visitor-detail-sensitive', title: '预约详情脱敏规则', content: '身份证号和手机号默认中段脱敏；正式脱敏位数与可见角色需在安全方案中确认。', source: 'H5-008', automatic: true },
    { id: 'h5ann-014', index: 14, scope: 'page:onboarding', pageId: 'onboarding', targetKey: 'onboarding-identity', title: '校园启航身份限制', content: '校园启航仅对新生开放；新生身份必须以招生录取数据源核验结果为准。', source: 'H5-009', automatic: true },
    { id: 'h5ann-015', index: 15, scope: 'page:onboarding-verify', pageId: 'onboarding-verify', targetKey: 'onboarding-verify-form', title: '新生信息核验规则', content: '姓名、身份证号、考生号和录取手机号必须与招生录取数据一致；接口字段与失败原因待确认。', source: 'H5-009', automatic: true },
    { id: 'h5ann-016', index: 16, scope: 'page:onboarding-card', pageId: 'onboarding-card', targetKey: 'onboarding-card-sensitive', title: '社保卡敏感数据保护', content: '社保卡号、身份证号和手机号需脱敏展示并加密传输；授权、留存和删除规则待确认。', source: 'H5-009', automatic: true },
    { id: 'h5ann-017', index: 17, scope: 'page:onboarding-apply-card', pageId: 'onboarding-apply-card', targetKey: 'card-material-upload', title: '办卡材料预览限制', content: '原型仅在本地选择、预览和移除图片，不代表材料已上传至正式服务。', source: '框架惯例', automatic: true },
    { id: 'h5ann-018', index: 18, scope: 'page:onboarding-result', pageId: 'onboarding-result', targetKey: 'onboarding-result-status', title: '办理结果可信来源', content: '原型结果由 mock 驱动；正式认证、绑卡和预约办卡状态必须以后端及外部系统返回为准。', source: 'H5-009', automatic: true },
    { id: 'h5ann-019', index: 19, scope: 'page:books', pageId: 'books', targetKey: 'book-service-source', title: '图书数据对接边界', content: '检索、推荐、排行、借阅状态和馆藏地均以图书馆系统返回数据为准。', source: 'H5-010', automatic: true },
    { id: 'h5ann-020', index: 20, scope: 'page:book-detail', pageId: 'book-detail', targetKey: 'book-detail-availability', title: '图书服务能力边界', content: '本需求仅包含检索、推荐、排行和信息展示，不包含预约或借书操作。', source: 'H5-010', automatic: true },
    { id: 'h5ann-021', index: 21, scope: 'page:mine', pageId: 'mine', targetKey: 'mine-user-summary', title: '个人信息展示保护', content: '个人资料、手机号和社保卡信息属于敏感数据；展示、缓存和失效规则待安全方案确认。', source: 'H5-011', automatic: true },
    { id: 'h5ann-022', index: 22, scope: 'page:mine', pageId: 'mine', targetKey: 'mine-service-groups', title: '身份可见范围差异', content: '访客仅展示预约与通行相关入口，师生展示校园卡、图书、消费等服务；正式身份模型待确认。', source: 'H5-011', automatic: true },
    { id: 'h5ann-023', index: 23, scope: 'page:profile', pageId: 'profile', targetKey: 'profile-edit-scope', title: '个人资料编辑范围待确认', content: '标书仅明确集中展示个人资料；手机号等字段是否允许编辑，以及编辑后的核验流程待确认。', source: 'H5-011', automatic: true },
    { id: 'h5ann-024', index: 24, scope: 'page:messages', pageId: 'messages', targetKey: 'message-integration', title: '服务消息对接协议', content: '用户标识、消息推送、送达状态与已读回传协议需与宁波一卡通 APP 确认。', source: 'H5-012', automatic: true },
    { id: 'h5ann-025', index: 25, scope: 'page:message-detail', pageId: 'message-detail', targetKey: 'message-detail-status', title: '消息已读回传规则', content: '进入详情后在原型内更新为已读；是否向宁波一卡通 APP 回传已读状态待协议确认。', source: 'H5-012', automatic: true },
    { id: 'h5ann-026', index: 26, scope: 'page:wallet', pageId: 'wallet', targetKey: 'wallet-integration', title: '校园卡包对接边界', content: '卡号、实名信息、绑定状态和回传字段需由宁波一卡通 APP 与校园卡系统共同确认。', source: 'H5-013', automatic: true },
    { id: 'h5ann-027', index: 27, scope: 'page:wallet', pageId: 'wallet', targetKey: 'wallet-card-number', title: '校园卡号脱敏规则', content: '校园卡号默认中段脱敏；正式脱敏位数与可见角色需在安全方案中确认。', source: 'H5-013', automatic: true }
  ],
  majors: [
    { code: '550117', name: '人物形象设计', college: '时装学院', desc: '面向时尚造型、化妆设计与形象管理领域培养高素质技术技能人才。' },
    { code: '480411', name: '纺织品设计', college: '纺织学院', desc: '培养纺织产品设计、工艺开发和品牌应用复合型人才。' },
    { code: '530605', name: '市场营销', college: '商学院', desc: '聚焦数字营销、品牌传播与商业运营能力。' },
    { code: '510204', name: '数字媒体技术', college: '信息技术学院', desc: '培养数字内容制作、交互设计与前端开发人才。' }
  ],
  notices: [
    { id: 1, title: '关于暑期校园服务时间调整的通知', summary: '暑期食堂、图书馆及校园服务大厅开放时间安排。', time: '2026-07-22', important: true },
    { id: 2, title: '一卡通校园码使用说明', summary: '校园码适用于校门通行、图书借阅和身份核验场景。', time: '2026-07-18', important: false },
    { id: 3, title: '新生校园启航线上办理提示', summary: '请新生提前完成身份核验、社保卡绑定或预约办卡。', time: '2026-07-15', important: false }
  ],
  news: [
    { id: 1, title: '学校举行产教融合成果展示活动', publisher: '校园资讯', time: '2026-07-21', recommended: true, image: './images/campus-news.png' },
    { id: 2, title: '暑期社会实践团队正式出征', publisher: '团委', time: '2026-07-19', recommended: false, image: './images/index-head.png' },
    { id: 3, title: '图书馆发布本月新书推荐', publisher: '图书馆', time: '2026-07-16', recommended: false, image: './images/book-cover.png' }
  ],
  visitorRecords: [
    { id: 1, status: '已通过', date: '2026-07-25 09:30', target: '王老师', reason: '招生咨询', dept: '招生就业处' },
    { id: 2, status: '待审核', date: '2026-07-28 14:00', target: '李老师', reason: '项目交流', dept: '信息技术学院' },
    { id: 3, status: '未通过', date: '2026-07-12 10:00', target: '陈老师', reason: '参观校园', dept: '党政办公室' }
  ],
  books: [
    { id: 1, title: '服装设计基础', author: '周明', publisher: '中国纺织出版社', year: '2025-08', number: 'TS941.2/128', status: '在馆', location: '图书馆二层艺术设计区', rank: 1 },
    { id: 2, title: '数字媒体交互设计', author: '林然', publisher: '电子工业出版社', year: '2024-11', number: 'TP37/056', status: '借出', location: '图书馆三层信息技术区', rank: 2 },
    { id: 3, title: '品牌营销实务', author: '赵倩', publisher: '高等教育出版社', year: '2025-03', number: 'F713.5/219', status: '在馆', location: '图书馆四层经管区', rank: 3 }
  ],
  messages: [
    { id: 1, title: '访客预约审核通过', content: '您提交的 7 月 25 日访客预约已通过审核，请在预约时间内到校。', time: '2026-07-23 09:18', read: false },
    { id: 2, title: '校园码服务提醒', content: '校园码已更新，请在通行前打开页面并保持屏幕亮度。', time: '2026-07-22 16:40', read: false },
    { id: 3, title: '图书到期提醒', content: '您借阅的图书将在 3 天后到期，请及时归还。', time: '2026-07-20 08:00', read: true }
  ]
}
