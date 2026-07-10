# 宁波市高校一卡通专区 PRD

版本: 2026-07-10 基于 Word 重拆需求生成

## 已读取的需求文档清单

| 文档 | 说明 |
| --- | --- |
| docs/requirements/纺院需求.md | 本轮唯一业务需求来源，含 62 个原子功能块 |
| docs/tenders/纺院标书技术部分.extract.txt | Word 抽取文本，354 段、5 张表、55 个素材 |
| project/docs/patterns/framework-inventory.md | Snowy 框架总览 |
| project/docs/patterns/module-map.md | 模块归属 |
| project/docs/patterns/feature-capability-map.md | 可复用能力 |
| project/docs/patterns/frontend-crud-pattern.md | 后管 CRUD 交互模式 |

## 背景与目标

建设面向高校的宁波市高校一卡通专区，打通 APP 学校专区、学校端后管、管理端后管、校园类接口和 PAM 人员设备管理能力。目标是让师生和访客能通过一卡通 APP 完成信息查看、预约、身份认证、卡包与消息联动；让学校管理员能维护内容、查询人员与记录、监控设备；让平台管理员能管理学校、组织、权限、日志、接口和 PAM 风险链路。

## 用户角色

| 角色 | 主要目标 | 关键权限 |
| --- | --- | --- |
| 师生/访客 | 使用 APP 学校专区、访客预约、校园码/卡、记录查询 | 仅访问个人范围数据 |
| 学校管理员 | 管理本校内容、师生清单、社保卡申领、设备和记录 | 本校数据范围 |
| 审核人员 | 审核公告、活动、访客或平台审核任务 | 按业务分配审核权限 |
| 管理端管理员 | 管理学校、组织、用户、角色、菜单、日志、对接模块 | 平台管理范围 |
| 运维人员 | 查看接口日志、设备监控、PAM 设备通信和异常 | 运维与审计范围 |

## 核心业务流程

1. APP 用户进入学校专区，浏览首页、公告、资讯、地图、专业、图书和个人中心。
2. 新生通过校园启航完成账号激活、社保卡绑定或办卡预约，系统与招生录取数据源和社保卡体系核验。
3. 学校端管理员维护 banner、应用、首页模块、公告、文章、活动，审核后同步到 APP。
4. 学校端管理员查看同步来的学生、教职工、历史学生、社保卡申领、访客、通行、消费、图书借阅和用户数据。
5. 管理端管理员维护学校、部门、用户、角色、模块、菜单和权限，审计访问、操作和外部调用日志。
6. 校园类接口完成学院初始化、人员管理、信息核验、人员同步、社保码/卡认证和交易推送/接收。
7. PAM 模块管理组织人员、生物特征库、设备分组、人员分组、授权、通行同步、远程设备配置、日志和分级权限。

## 功能范围

### H5/移动端

| 编号 | 名称 | 页面类型 | 菜单路径 | 关键字段 | 关键操作 |
| --- | --- | --- | --- | --- | --- |
| H5-001 | 首页设计 | 看板 | 一卡通 APP / 学校专区 / 首页设计 | 校园资讯、通知公告、特色应用场景、首页 banner | 查看、跳转 |
| H5-002 | 学校简介 | 只读查询 | 一卡通 APP / 学校专区 / 学校简介 | 历史沿革、办学理念、发展目标、师资力量、科研成果 | 查看 |
| H5-003 | 专业介绍 | 只读查询 | 一卡通 APP / 学校专区 / 专业介绍 | 专业代码、专业名称、所属分院 | 查看 |
| H5-004 | 校园地图 | 只读查询 | 一卡通 APP / 学校专区 / 校园地图 | 校园地图图片、场所分布 | 查看、缩放 |
| H5-005 | 招生咨询 | 只读查询 | 一卡通 APP / 学校专区 / 招生咨询 | 招生热线、传真、微信公众号 | 查看、拨号、复制 |
| H5-006 | 通知公告 | 只读查询 | 一卡通 APP / 学校专区 / 通知公告 | 公告标题、公告摘要、发布时间 | 查看清单、查看详情、查看 |
| H5-007 | 校园资讯 | 只读查询 | 一卡通 APP / 学校专区 / 校园资讯 | 资讯标题、资讯封面 | 查看清单、查看详情、查看 |
| H5-008 | 访客预约 | 只读查询 | 一卡通 APP / 学校专区 / 访客预约 | 姓名、身份证号、手机号、访问时间、通行方式、车牌、拜访人、访问缘由 | 提交预约、查看 |
| H5-009 | 校园启航 | 只读查询 | 一卡通 APP / 学校专区 / 校园启航 | 校园账号激活状态、社保卡绑定状态、身份核验结果、预约办卡状态 | 校园账号激活、社保卡绑定、预约办卡、查看 |
| H5-010 | 图书借阅 | 只读查询 | 一卡通 APP / 学校专区 / 图书借阅 | 书名、著者、出版社、出版时间、书籍封面图片、图书编号、书籍借阅状态、馆场地 | 图书检索、查看 |
| H5-011 | 我的 | 只读查询 | 一卡通 APP / 学校专区 / 我的 | 个人资料、访客预约记录、消费记录、图书借阅记录、门禁记录、校园卡账本、社保卡信息、校园码 | 查看、跳转记录详情 |
| H5-012 | 服务消息对接 | 只读查询 | 一卡通 APP / 学校专区 / 服务消息对接 | 消息标题、消息内容、通知时间 | 消息推送、查看消息、查看 |
| H5-013 | 我的卡包对接 | 只读查询 | 一卡通 APP / 学校专区 / 我的卡包对接 | 校园卡信息 | 绑定校园卡、查看校园卡、查看 |

### 后管（学校端）

| 编号 | 名称 | 页面类型 | 菜单路径 | 关键字段 | 关键操作 |
| --- | --- | --- | --- | --- | --- |
| ADM-S-001 | 业务首页（高校首页） | 看板 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 业务首页（高校首页） | 专区用户数据、校园用户数据、图表、报表 | 查看、报表导出 |
| ADM-S-002 | 师生管理分组 | 只读查询 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 师生管理分组 | 学生统计、教职工统计、历史学生统计 | 查看 |
| ADM-S-003 | 学生管理 | 标准 CRUD | 高校一卡通 / 学校端 / 师生管理 / 学生管理 | 专区注册状态、社保绑卡状态、省内持卡状态、卡规范版本、社保卡金融账户激活状态、学生姓名、身份证号、手机号 | 同步、新增、编辑、删除、查看 |
| ADM-S-004 | 教职工管理 | 标准 CRUD | 高校一卡通 / 学校端 / 师生管理 / 教职工管理 | 专区注册状态、社保绑卡状态、省内持卡状态、卡规范版本、社保卡金融账户激活状态、姓名、身份证号、手机号 | 同步、新增、编辑、删除、查看 |
| ADM-S-005 | 历史学生管理 | 只读查询 | 高校一卡通 / 学校端 / 师生管理 / 历史学生管理 | 姓名、身份证、手机号、所属学院、专业 | 查看 |
| ADM-S-006 | 首页banner管理 | 看板 | 高校一卡通 / 学校端 / 内容管理 / 首页banner管理 | 图片标题、上传图片、展示时间、优先级、链接跳转 | 新增、编辑、删除、查看 |
| ADM-S-007 | 应用上线管理 | 标准 CRUD | 高校一卡通 / 学校端 / 内容管理 / 应用上线管理 | 应用名称、应用图标、应用链接、可见身份、可用状态、展示状态 | 查看、新增、编辑、删除 |
| ADM-S-008 | 首页模块管理 | 看板 | 高校一卡通 / 学校端 / 内容管理 / 首页模块管理 | 展示模板、展示图片、跳转链接、模板样式 | 新增、编辑、删除、同步APP端、查看 |
| ADM-S-009 | 公告管理 | 审核流程 | 高校一卡通 / 学校端 / 内容管理 / 公告管理 | 公告标题、公告内容、发布范围、审核状态、发布时间 | 新增、编辑、删除、审核、查看 |
| ADM-S-010 | 文章管理 | 标准 CRUD | 高校一卡通 / 学校端 / 内容管理 / 文章管理 | 文章标题、发布人、展示模式、审核状态、推荐状态、发布时间 | 新增、编辑、删除、筛选查看、查看 |
| ADM-S-011 | 活动管理 | 标准 CRUD | 高校一卡通 / 学校端 / 内容管理 / 活动管理 | 活动标题、活动内容、身份标签、可见范围、发布时间、展示状态 | 新增、编辑、删除、筛选查看、查看 |
| ADM-S-012 | 社保卡申领记录 | 导入导出 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 社保卡申领记录 | 姓名、证件类型、证件号码、手机号、民族、性别、职业、社保绑卡状态 | 同步、查看、清单导出 |
| ADM-S-013 | 设备状态监控 | 只读查询 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 设备状态监控 | 设备信息、设备位置、在线状态、门长开报警状态、非法时间开门报警状态 | 监控查看、告警提示、查看 |
| ADM-S-014 | 信息查询分组 | 只读查询 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 信息查询分组 | 访客记录、通行记录、消费记录、图书借阅记录 | 查看 |
| ADM-S-015 | 访客记录管理 | 导入导出 | 高校一卡通 / 学校端 / 信息查询 / 访客记录管理 | 来访人、来访单位、手机号、被访人、拜访部门、拜访事由、拜访开始日期、拜访结束日期 | 查看、导出 |
| ADM-S-016 | 通行记录管理 | 只读查询 | 高校一卡通 / 学校端 / 信息查询 / 通行记录管理 | 通行人员信息、设备位置、验证方式、通行方向、通行时间 | 查看 |
| ADM-S-017 | 消费记录管理 | 只读查询 | 高校一卡通 / 学校端 / 信息查询 / 消费记录管理 | 姓名、商家名称、交易金额、支付流水号、支付类型、付款方式、支付时间 | 同步、查看 |
| ADM-S-018 | 图书借阅记录管理 | 只读查询 | 高校一卡通 / 学校端 / 信息查询 / 图书借阅记录管理 | 姓名、学号/工号、书籍题名、条码号、借阅日期、应还日期、归还日期 | 同步、查看 |
| ADM-S-019 | 用户管理（用户信息查看） | 只读查询 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 用户管理（用户信息查看） | 姓名、手机、用户身份、社保绑卡状态、省内持卡状态、首次登录日期、最近登录日期 | 查看 |
| ADM-S-020 | 学校端权限与菜单约束 | 授权分配 | 高校一卡通 / 学校端 / 宁波市高校一卡通后管（学校端） / 学校端权限与菜单约束 | 菜单名称、路由路径、权限标识、入口位置、可见角色 | 菜单配置、权限配置、查看 |

### 后管（管理端）

| 编号 | 名称 | 页面类型 | 菜单路径 | 关键字段 | 关键操作 |
| --- | --- | --- | --- | --- | --- |
| ADM-P-001 | 系统首页 | 看板 | 高校一卡通 / 管理端 / 宁波市高校一卡通后管（管理端） / 系统首页 | 高校专区数据、专区用户数据、校园用户数据、高校用户排行、活跃度排行、时间维度、报表 | 查看、报表导出 |
| ADM-P-002 | 学校管理 | 树形 CRUD | 高校一卡通 / 管理端 / 组织架构 / 学校管理 | 学校名称、部门名称、上级节点、层级关系、排序、状态 | 新增、编辑、删除、调整层级、查看 |
| ADM-P-003 | 用户管理 | 标准 CRUD | 高校一卡通 / 管理端 / 组织架构 / 用户管理 | 用户账号、所属部门、角色、权限、账号状态、创建时间 | 新增、编辑、禁用、启用、分配角色、查看 |
| ADM-P-004 | 角色管理 | 授权分配 | 高校一卡通 / 管理端 / 权限管理 / 角色管理 | 角色名称、角色编码、权限集合、状态、关联用户 | 新增、编辑、删除、授权、查看 |
| ADM-P-005 | 模块管理 | 标准 CRUD | 高校一卡通 / 管理端 / 权限管理 / 模块管理 | 模块名称、显示名称、图标、排序、状态 | 新增、编辑、删除、查看 |
| ADM-P-006 | 菜单管理 | 标准 CRUD | 高校一卡通 / 管理端 / 权限管理 / 菜单管理 | 菜单名称、访问路径、显示名称、显示状态、关联模块、排序 | 新增、编辑、删除、排序调整、查看 |
| ADM-P-007 | 访问日志 | 只读查询 | 高校一卡通 / 管理端 / 日志管理 / 访问日志 | 名称、IP地址、地址、浏览器、设备、时间、用户、登录登出类型 | 查看、图表展示 |
| ADM-P-008 | 操作日志 | 只读查询 | 高校一卡通 / 管理端 / 日志管理 / 操作日志 | 用户、IP地址、操作时间、操作内容、操作结果、异常内容 | 查看 |
| ADM-P-009 | 外部调用日志 | 只读查询 | 高校一卡通 / 管理端 / 日志管理 / 外部调用日志 | 日志分类、日志名称、执行状态、请求方式、请求参数、操作时间 | 查看 |
| ADM-P-010 | 对接宁波一卡通后管 | 只读查询 | 高校一卡通 / 管理端 / 宁波市高校一卡通后管（管理端） / 对接宁波一卡通后管 | 用户中心、内容管理、访客预约查询、门禁记录查询、图书借阅记录、消费记录查询、用卡数据统计、审核中心 | 数据对接、监控、查看 |
| ADM-P-011 | 管理端菜单与权限约束 | 授权分配 | 高校一卡通 / 管理端 / 宁波市高校一卡通后管（管理端） / 管理端菜单与权限约束 | 菜单名称、路由路径、权限标识、入口位置、可见角色、按钮权限 | 菜单配置、权限配置、查看 |
| ADM-P-012 | 审核中心数据对接 | 只读查询 | 高校一卡通 / 管理端 / 对接宁波一卡通后管 / 审核中心数据对接 | 审核业务类型、审核单号、提交人、提交时间、审核状态、审核结果 | 数据对接、查看 |
| ADM-P-013 | 系统监控数据对接 | 只读查询 | 高校一卡通 / 管理端 / 对接宁波一卡通后管 / 系统监控数据对接 | 接口日志、设备监控、调用状态、设备状态、异常告警 | 数据对接、监控查看、查看 |

### 接口与数据对接

| 编号 | 名称 | 页面类型 | 菜单路径 | 关键字段 | 关键操作 |
| --- | --- | --- | --- | --- | --- |
| API-001 | 学院数据初始化接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 学院数据初始化接口 | 学院编码、学院名称、上级学院、排序、状态 | 接口调用、字段校验、查看 |
| API-002 | 人员信息管理接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 人员信息管理接口 | 人员姓名、身份标识、人员类型、学院、专业、班级、部门、工号 | 接口调用、字段校验、查看 |
| API-003 | 人员关键信息核验接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 人员关键信息核验接口 | 姓名、身份标识、手机号、社保卡绑定信息、核验结果 | 接口调用、字段校验、查看 |
| API-004 | 人员信息同步接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 人员信息同步接口 | 人员基础资料、持卡信息、同步时间、同步结果 | 接口调用、字段校验、查看 |
| API-005 | 电子社保码认证接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 电子社保码认证接口 | 人员身份、电子社保码、认证场景、认证时间、认证结果 | 接口调用、字段校验、查看 |
| API-006 | 实体社保卡认证接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 实体社保卡认证接口 | 人员身份、社保卡号、认证设备、认证时间、认证结果 | 接口调用、字段校验、查看 |
| API-007 | 移动支付交易信息推送接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 移动支付交易信息推送接口 | 交易流水号、姓名、商家名称、交易金额、支付类型、付款方式、支付时间 | 接口调用、字段校验、查看 |
| API-008 | 实体社保卡交易信息接收接口 | 只读查询 | 高校一卡通 / 接口中心 / 校园类接口 / 实体社保卡交易信息接收接口 | 交易流水号、社保卡信息、交易金额、交易时间、接收状态 | 接口调用、字段校验、查看 |

### PAM/人员与设备协同管理

| 编号 | 名称 | 页面类型 | 菜单路径 | 关键字段 | 关键操作 |
| --- | --- | --- | --- | --- | --- |
| PAM-001 | 组织架构与人员管理 | 树形 CRUD | 高校一卡通 / PAM管理 / 组织架构与人员管理 | 组织名称、部门结构、姓名、证件号、所属部门、掌静脉生物信息 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-002 | 掌静脉识别算法特征库 | 标准 CRUD | 高校一卡通 / PAM管理 / 掌静脉识别算法特征库 | 掌静脉特征、特征库容量5万、采集时间、更新时间 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-003 | 设备分组管理 | 标准 CRUD | 高校一卡通 / PAM管理 / 设备分组管理 | 设备名称、区域、功能类型、设备分组、授权范围 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-004 | 人员分组管理 | 标准 CRUD | 高校一卡通 / PAM管理 / 人员分组管理 | 人员姓名、岗位、权限等级、人员分组、授权范围 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-005 | 用户通行实时同步 | 标准 CRUD | 高校一卡通 / PAM管理 / 用户通行实时同步 | 人员、设备、认证结果、通行状态、同步时间 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-006 | 通行记录与用户信息导入导出 | 导入导出 | 高校一卡通 / PAM管理 / 通行记录与用户信息导入导出 | 通行时间、人员、设备、导出格式Excel、导出格式CSV、用户信息导入文件、用户信息导出文件 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-007 | 设备运维监测与远程配置 | 标准 CRUD | 高校一卡通 / PAM管理 / 设备运维监测与远程配置 | 设备在线状态、设备离线状态、设备故障状态、通信中断、认证失败率异常、认证模式、识别参数、设备版本 | 新增、编辑、删除、导入、导出、授权、查看 |
| PAM-008 | 日志与分级权限管理 | 授权分配 | 高校一卡通 / PAM管理 / 日志与分级权限管理 | 操作人员、操作时间、操作内容、操作结果、通信时间、数据内容、交互状态、管理范围 | 新增、编辑、删除、导入、导出、授权、查看 |

## 后管菜单设计

| 一级菜单 | 二级菜单 | 三级菜单/页面 | 路由路径 | 权限标识 | 可见角色 | Snowy 关系 |
| --- | --- | --- | --- | --- | --- | --- |
| 高校一卡通 | 学校端 | 业务首页（高校首页） | /fy/unicard/adm/s/001 | fy:unicard:adm:s:001 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 师生管理分组 | /fy/unicard/adm/s/002 | fy:unicard:adm:s:002 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 学生管理 | /fy/unicard/adm/s/003 | fy:unicard:adm:s:003 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 教职工管理 | /fy/unicard/adm/s/004 | fy:unicard:adm:s:004 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 历史学生管理 | /fy/unicard/adm/s/005 | fy:unicard:adm:s:005 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 首页banner管理 | /fy/unicard/adm/s/006 | fy:unicard:adm:s:006 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue；project/snowy-admin-web/src/views/dev/slideshow/index.vue |
| 高校一卡通 | 学校端 | 应用上线管理 | /fy/unicard/adm/s/007 | fy:unicard:adm:s:007 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 首页模块管理 | /fy/unicard/adm/s/008 | fy:unicard:adm:s:008 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 公告管理 | /fy/unicard/adm/s/009 | fy:unicard:adm:s:009 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue；project/snowy-admin-web/src/views/dev/slideshow/index.vue |
| 高校一卡通 | 学校端 | 文章管理 | /fy/unicard/adm/s/010 | fy:unicard:adm:s:010 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue；project/snowy-admin-web/src/views/dev/slideshow/index.vue |
| 高校一卡通 | 学校端 | 活动管理 | /fy/unicard/adm/s/011 | fy:unicard:adm:s:011 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 社保卡申领记录 | /fy/unicard/adm/s/012 | fy:unicard:adm:s:012 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 设备状态监控 | /fy/unicard/adm/s/013 | fy:unicard:adm:s:013 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 信息查询分组 | /fy/unicard/adm/s/014 | fy:unicard:adm:s:014 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 访客记录管理 | /fy/unicard/adm/s/015 | fy:unicard:adm:s:015 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 通行记录管理 | /fy/unicard/adm/s/016 | fy:unicard:adm:s:016 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 消费记录管理 | /fy/unicard/adm/s/017 | fy:unicard:adm:s:017 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 图书借阅记录管理 | /fy/unicard/adm/s/018 | fy:unicard:adm:s:018 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 学校端 | 用户管理（用户信息查看） | /fy/unicard/adm/s/019 | fy:unicard:adm:s:019 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | 学校端 | 学校端权限与菜单约束 | /fy/unicard/adm/s/020 | fy:unicard:adm:s:020 | 学校管理员、审核人员、运维人员 | project/snowy-admin-web/src/views/sys/role/index.vue |
| 高校一卡通 | 管理端 | 系统首页 | /fy/unicard/adm/p/001 | fy:unicard:adm:p:001 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 学校管理 | /fy/unicard/adm/p/002 | fy:unicard:adm:p:002 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/org/index.vue |
| 高校一卡通 | 管理端 | 用户管理 | /fy/unicard/adm/p/003 | fy:unicard:adm:p:003 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | 管理端 | 角色管理 | /fy/unicard/adm/p/004 | fy:unicard:adm:p:004 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/role/index.vue |
| 高校一卡通 | 管理端 | 模块管理 | /fy/unicard/adm/p/005 | fy:unicard:adm:p:005 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 菜单管理 | /fy/unicard/adm/p/006 | fy:unicard:adm:p:006 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 访问日志 | /fy/unicard/adm/p/007 | fy:unicard:adm:p:007 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 操作日志 | /fy/unicard/adm/p/008 | fy:unicard:adm:p:008 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 外部调用日志 | /fy/unicard/adm/p/009 | fy:unicard:adm:p:009 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 对接宁波一卡通后管 | /fy/unicard/adm/p/010 | fy:unicard:adm:p:010 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 管理端菜单与权限约束 | /fy/unicard/adm/p/011 | fy:unicard:adm:p:011 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/role/index.vue |
| 高校一卡通 | 管理端 | 审核中心数据对接 | /fy/unicard/adm/p/012 | fy:unicard:adm:p:012 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 管理端 | 系统监控数据对接 | /fy/unicard/adm/p/013 | fy:unicard:adm:p:013 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 接口中心 | 学院数据初始化接口 | /fy/unicard/api/001 | fy:unicard:api:001 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 接口中心 | 人员信息管理接口 | /fy/unicard/api/002 | fy:unicard:api:002 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | 接口中心 | 人员关键信息核验接口 | /fy/unicard/api/003 | fy:unicard:api:003 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | 接口中心 | 人员信息同步接口 | /fy/unicard/api/004 | fy:unicard:api:004 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | 接口中心 | 电子社保码认证接口 | /fy/unicard/api/005 | fy:unicard:api:005 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 接口中心 | 实体社保卡认证接口 | /fy/unicard/api/006 | fy:unicard:api:006 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 接口中心 | 移动支付交易信息推送接口 | /fy/unicard/api/007 | fy:unicard:api:007 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | 接口中心 | 实体社保卡交易信息接收接口 | /fy/unicard/api/008 | fy:unicard:api:008 | 管理端管理员、运维人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | PAM管理 | 组织架构与人员管理 | /fy/unicard/pam/001 | fy:unicard:pam:001 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/sys/org/index.vue |
| 高校一卡通 | PAM管理 | 掌静脉识别算法特征库 | /fy/unicard/pam/002 | fy:unicard:pam:002 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | PAM管理 | 设备分组管理 | /fy/unicard/pam/003 | fy:unicard:pam:003 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | PAM管理 | 人员分组管理 | /fy/unicard/pam/004 | fy:unicard:pam:004 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | PAM管理 | 用户通行实时同步 | /fy/unicard/pam/005 | fy:unicard:pam:005 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | PAM管理 | 通行记录与用户信息导入导出 | /fy/unicard/pam/006 | fy:unicard:pam:006 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/sys/user/index.vue |
| 高校一卡通 | PAM管理 | 设备运维监测与远程配置 | /fy/unicard/pam/007 | fy:unicard:pam:007 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/biz/notice/index.vue |
| 高校一卡通 | PAM管理 | 日志与分级权限管理 | /fy/unicard/pam/008 | fy:unicard:pam:008 | 管理端管理员、运维人员、安全审计人员 | project/snowy-admin-web/src/views/sys/role/index.vue |

## 状态和业务规则

| 规则 | 内容 |
| --- | --- |
| 数据范围 | 学校端默认仅查看和维护本校数据；管理端可按学校、部门、角色和权限范围查看。 |
| 同步只读 | 学生、教职工、历史学生、社保卡申领、消费、通行、图书借阅等同步数据默认只读展示，除非需求明确提出维护操作。 |
| 内容审核 | 公告、文章、活动涉及发布前审核，状态至少包括待审核、审核通过、审核不通过、已发布、已下架，最终状态机待确认。 |
| 敏感信息 | 身份证号、手机号、社保卡信息、掌静脉特征默认脱敏展示，详情和导出需要权限控制与审计。 |
| 导出审计 | 涉及人员、消费、通行、社保卡、PAM 的导出操作需要记录导出人、时间、条件和结果。 |
| 设备远程配置 | PAM 远程配置、认证模式、识别参数调整属于高风险操作，需要授权、确认和日志留痕。 |

## 非功能需求

| 类别 | 要求 |
| --- | --- |
| 安全 | 接口鉴权、权限校验、敏感字段脱敏/加密、导出审计、PAM 高风险操作二次确认。 |
| 可用性 | 后管页面需具备加载、空数据、接口异常、无权限和保存失败反馈。 |
| 兼容性 | 后管基于现有 Snowy Vue3 + Ant Design Vue；H5 框架待补充。 |
| 可观测性 | 接口调用、设备通信、用户操作和异常日志均需可查询。 |

## 埋点或成功指标

| 指标 | 口径 |
| --- | --- |
| 学校专区访问量 | APP 学校专区首页访问 PV/UV |
| 新生激活完成率 | 完成校园账号激活人数 / 目标新生人数 |
| 社保卡绑定率 | 已绑定社保卡人数 / 专区注册人数 |
| 内容发布成功率 | 发布成功内容数 / 提交发布内容数 |
| 接口成功率 | 成功调用次数 / 总调用次数 |
| 设备在线率 | 在线设备数 / 接入设备数 |

## 不在本期范围

| 范围 | 说明 |
| --- | --- |
| 硬件采购参数 | 仅作为设备接入参考，不进入软件开发范围。 |
| H5 生产实现 | 当前只输出移动端低保真原型和信息结构，框架待补充后再开发。 |
| 外部系统改造 | 校园数据中台、图书馆、访客、社保卡体系、宁波一卡通 APP 的接口能力需另行确认。 |

## 原型需求覆盖矩阵

| 需求编号 | 原型文件 | 覆盖位置 | 状态 |
| --- | --- | --- | --- |
| H5-001 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 首页设计 | 已覆盖 |
| H5-002 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 学校简介 | 已覆盖 |
| H5-003 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 专业介绍 | 已覆盖 |
| H5-004 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 校园地图 | 已覆盖 |
| H5-005 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 招生咨询 | 已覆盖 |
| H5-006 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 通知公告 | 已覆盖 |
| H5-007 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 校园资讯 | 已覆盖 |
| H5-008 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 访客预约 | 已覆盖 |
| H5-009 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 校园启航 | 已覆盖 |
| H5-010 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 图书借阅 | 已覆盖 |
| H5-011 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 我的 | 已覆盖 |
| H5-012 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 服务消息对接 | 已覆盖 |
| H5-013 | docs/design/FY-20260708-UNICARD-h5-low-fidelity.html | 我的卡包对接 | 已覆盖 |
| ADM-S-001 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 业务首页（高校首页） | 已覆盖 |
| ADM-S-002 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 师生管理分组 | 已覆盖 |
| ADM-S-003 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 学生管理 | 已覆盖 |
| ADM-S-004 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 教职工管理 | 已覆盖 |
| ADM-S-005 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 历史学生管理 | 已覆盖 |
| ADM-S-006 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 首页banner管理 | 已覆盖 |
| ADM-S-007 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 应用上线管理 | 已覆盖 |
| ADM-S-008 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 首页模块管理 | 已覆盖 |
| ADM-S-009 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 公告管理 | 已覆盖 |
| ADM-S-010 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 文章管理 | 已覆盖 |
| ADM-S-011 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 活动管理 | 已覆盖 |
| ADM-S-012 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 社保卡申领记录 | 已覆盖 |
| ADM-S-013 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 设备状态监控 | 已覆盖 |
| ADM-S-014 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 信息查询分组 | 已覆盖 |
| ADM-S-015 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 访客记录管理 | 已覆盖 |
| ADM-S-016 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 通行记录管理 | 已覆盖 |
| ADM-S-017 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 消费记录管理 | 已覆盖 |
| ADM-S-018 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 图书借阅记录管理 | 已覆盖 |
| ADM-S-019 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 用户管理（用户信息查看） | 已覆盖 |
| ADM-S-020 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 学校端权限与菜单约束 | 已覆盖 |
| ADM-P-001 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 系统首页 | 已覆盖 |
| ADM-P-002 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 学校管理 | 已覆盖 |
| ADM-P-003 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 用户管理 | 已覆盖 |
| ADM-P-004 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 角色管理 | 已覆盖 |
| ADM-P-005 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 模块管理 | 已覆盖 |
| ADM-P-006 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 菜单管理 | 已覆盖 |
| ADM-P-007 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 访问日志 | 已覆盖 |
| ADM-P-008 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 操作日志 | 已覆盖 |
| ADM-P-009 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 外部调用日志 | 已覆盖 |
| ADM-P-010 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 对接宁波一卡通后管 | 已覆盖 |
| ADM-P-011 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 管理端菜单与权限约束 | 已覆盖 |
| ADM-P-012 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 审核中心数据对接 | 已覆盖 |
| ADM-P-013 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 系统监控数据对接 | 已覆盖 |
| API-001 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 学院数据初始化接口 | 已覆盖 |
| API-002 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 人员信息管理接口 | 已覆盖 |
| API-003 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 人员关键信息核验接口 | 已覆盖 |
| API-004 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 人员信息同步接口 | 已覆盖 |
| API-005 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 电子社保码认证接口 | 已覆盖 |
| API-006 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 实体社保卡认证接口 | 已覆盖 |
| API-007 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 移动支付交易信息推送接口 | 已覆盖 |
| API-008 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 实体社保卡交易信息接收接口 | 已覆盖 |
| PAM-001 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 组织架构与人员管理 | 已覆盖 |
| PAM-002 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 掌静脉识别算法特征库 | 已覆盖 |
| PAM-003 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 设备分组管理 | 已覆盖 |
| PAM-004 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 人员分组管理 | 已覆盖 |
| PAM-005 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 用户通行实时同步 | 已覆盖 |
| PAM-006 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 通行记录与用户信息导入导出 | 已覆盖 |
| PAM-007 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 设备运维监测与远程配置 | 已覆盖 |
| PAM-008 | docs/design/FY-20260708-UNICARD-admin-low-fidelity.html | 日志与分级权限管理 | 已覆盖 |

## 验收标准

| 编号 | 标准 |
| --- | --- |
| AC-PRD-001 | PRD 覆盖 H5、学校端、管理端、接口、PAM 全部 62 个需求编号。 |
| AC-PRD-002 | 后管菜单设计包含路由、权限标识、入口位置、可见角色和 Snowy 复用关系。 |
| AC-PRD-003 | 后管原型有独立页面蓝图并通过校验。 |
| AC-PRD-004 | 后管和 H5 原型分文件输出，均可直接浏览。 |
| AC-PRD-005 | 敏感字段、导出、权限、设备远程配置和 PAM 生物信息风险已记录。 |
