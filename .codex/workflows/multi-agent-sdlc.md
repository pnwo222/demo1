# 外卖平台 Codex 多 Agent SDLC 工作流

## 项目场景

- 业务：外卖平台
- 前端：Vue3 H5，移动端用户体验
- 后端：Java，提供订单、商品、商家、支付、配送等 API

核心链路：

用户浏览商家 -> 选择商品 -> 加入购物车 -> 提交订单 -> 支付 -> 商家接单 -> 配送 -> 完成/取消/退款

## 总控调度规则

所有阶段默认由 Orchestrator Agent 先出场，再分派给专业 Agent。

阶段开始前必须输出：

```text
当前阶段：
阶段目标：
调用 Agent：
输入材料：
预期输出：
验收标准：
是否需要用户确认：
下一阶段：
```

阶段完成后必须输出：

```text
阶段结果：
已生成产物：
未解决问题：
是否允许进入下一阶段：
下一步建议：
```

阶段门禁：

- HTML PRD 未确认，不进入低保真原型。
- 低保真原型未确认，不进入 UI 设计。
- Figma UI 未确认，不进入技术设计。
- 技术设计未确认，不进入开发。
- 数据模型、migration 和回滚策略未确认，不进入开发。
- P0/P1 Review 问题未修复，不允许合并。
- CI 和发布检查未通过，不进入全量发布。

## PPT 对齐补充规则

为对齐 PPT 中“总控 Agent 编排、专业 Agent 并行、PR 汇总”的模式，当前项目补充以下规则：

- 数据库和接口契约不是 Backend Agent 的附属任务，必须由 Data Agent 参与审查。
- 高风险 PR 需要并行审查：Bug Reviewer、Security Reviewer、Performance Reviewer、Maintainability Reviewer、QA Reviewer。
- 普通 PR 至少由 Reviewer Agent 做汇总审查。
- 质量门禁必须覆盖：Unit Test、Integration Test、E2E Test、Contract Test、Lint、Typecheck、Build、Coverage、SAST、SCA、Secret Scan、DAST。
- Orchestrator 必须在阶段开始和阶段结束时输出状态，不能隐式跳过总控。

## 阶段 1：产品设计

由 Product Agent 输出外卖业务 PRD、用户故事、MVP 范围、验收标准，并生成 HTML 版 PRD。

由 Orchestrator Agent 调度执行，并在完成后询问用户是否确认 PRD。

必须明确：

- 用户、商家、骑手、平台运营各自能做什么。
- 订单从创建到完成的完整状态。
- 商品、库存、购物车、优惠、配送费、包装费、支付和退款规则。
- H5 用户端本期范围和后台/商家/骑手端是否在本期。

推荐提示词：

```text
你是外卖平台 Product Agent。
请基于当前需求生成 PRD。
必须包含用户角色、核心点餐流程、功能范围、订单状态、金额规则、异常场景、验收标准、埋点指标和不在本期范围。
请同时生成一个可打开的 HTML PRD，保存到 docs/prd/。
HTML 必须包含内联 CSS，适合浏览器评审和打印为 PDF。
不要进入功能开发代码。
```

## 阶段 2：UI/UX 设计

由 Design Agent 使用项目本地 `.codex/skills/ui-ux-pro-max` 生成设计系统，并连接 Figma 直接生成可编辑设计图。

必须先运行设计系统检索：

```powershell
python .codex/skills/ui-ux-pro-max/scripts/search.py "food delivery ecommerce mobile vue h5" --design-system --persist -p "外卖平台"
python .codex/skills/ui-ux-pro-max/scripts/search.py "food delivery mobile vue" --stack vue
```

如果是具体页面，例如确认订单页：

```powershell
python .codex/skills/ui-ux-pro-max/scripts/search.py "checkout cart food delivery mobile" --design-system --persist -p "外卖平台" --page "checkout"
```

重点页面：

- 首页
- 商家列表
- 商家详情
- 商品分类和商品列表
- 商品规格弹窗
- 购物车
- 确认订单
- 地址选择
- 支付结果
- 订单列表
- 订单详情

必须覆盖：

- loading
- empty
- error
- offline
- sold out
- merchant closed
- payment pending
- permission denied

Figma 设计图要求：

- 直接创建或更新 Figma 设计文件。
- 使用 Vue3 H5 移动端画板，建议尺寸为 375x812 或 390x844。
- 页面结构、组件、状态必须可编辑。
- 颜色、字体、间距、组件和交互规则来自 `ui-ux-pro-max` 设计系统。
- 至少包含商家列表、商家详情、购物车、确认订单、支付结果、订单详情。
- 正式 UI 必须是可落地设计稿，不允许只交付线框图、低保真原型或抽象色块占位稿。
- 每个正式页面必须包含 `Ready for Dev` 画板，按真实 H5 尺寸、8px 栅格、16px 页面边距和 44px 以上触控目标设计。
- 每个正式页面必须包含 `Handoff` 标注区域，写明 viewport、内容宽度、组件尺寸、间距、颜色 token、字体、状态要求、图片规格和前端组件拆分建议。
- 商家封面、商品图、活动横幅必须使用真实图片质感的图片资产；设计评审可使用可授权占位图，生产需说明商家上传图片和 CDN 裁切规格。
- 分类、导航、操作按钮等 icon 必须使用统一、优美、可编辑的 SVG 图标；禁止使用 emoji 或粗糙几何色块冒充图标。
- 中文界面必须使用 Figma 可正确渲染的中文字体，例如 `Noto Sans SC`，并通过截图检查无缺字、重叠、裁切。
- 关键组件层级必须按前端可实现命名，例如 `HomeHeader`、`SearchBar`、`PromoBanner`、`CategoryScroller`、`MerchantCard`、`BottomTabBar`。
- 图片来源和替换策略必须写入设计摘要或 Handoff；若使用 Unsplash 等占位图，需要保留来源链接。

推荐提示词：

```text
你是外卖平台 Design Agent。
请基于 PRD 输出 Vue3 H5 UI/UX 方案。
必须先使用 .codex/skills/ui-ux-pro-max 生成设计系统，然后连接 Figma 生成可编辑设计图。
每个页面必须包含组件、状态、交互、移动端适配和可验收说明。
正式 UI 必须输出可落地设计稿，不要只输出原型图或抽象占位图。
必须创建 Ready for Dev 画板和 Handoff 标注，说明 8px 栅格、16px 页面边距、44px 触控目标、颜色 token、中文字体、图片规格和前端组件拆分。
商家封面、商品图和活动横幅必须使用真实图片质感资产；分类、导航和操作按钮必须使用统一优美的可编辑 SVG 图标。
生成后必须截图检查中文字体、图片裁切、长文案和组件重叠问题。
重点设计点餐、购物车、确认订单、支付结果和订单详情。
```

## 阶段 3：技术设计

由 Architect Agent 输出外卖平台技术设计。

必须明确：

| 设计项 | 必须明确的问题 | 常见产物 |
| --- | --- | --- |
| 模块边界 | 用户、商家、商品、购物车、订单、支付、配送分别由哪些模块负责 | 架构图、模块图 |
| 接口契约 | Vue3 H5 如何调用 Java API，请求、响应、错误码、分页、权限 | OpenAPI、API 文档 |
| 数据模型 | 用户、地址、商家、商品、SKU、购物车、订单、订单项、支付、退款、配送 | ERD、Migration |
| 订单状态机 | 哪些状态可以流转，谁触发，是否影响库存/支付/退款 | 状态机图 |
| 一致性策略 | 下单、扣库存、支付回调、取消、退款如何保证幂等和一致性 | 事务/补偿方案 |
| 安全模型 | 用户、商家、骑手、运营数据隔离和权限 | Threat Model、权限矩阵 |
| 可运维性 | 日志、指标、告警、限流、降级、回滚 | Runbook、SLO |

推荐提示词：

```text
你是外卖平台 Architect Agent。
请输出 Vue3 H5 + Java 后端技术设计。
必须包含模块边界、订单状态机、API、数据模型、支付/库存/订单一致性策略、权限模型、监控指标和回滚方案。
```

## 阶段 4：按用户价值切 Feature Slice

在拆分 feature slice 前，Orchestrator 必须调用 Data Agent 检查：

- 表结构和实体关系
- Migration 顺序
- 索引和唯一约束
- 数据兼容和回滚策略
- 订单、库存、支付、退款的数据一致性风险

不要按岗位切成“前端做全部页面、后端做全部接口”。应按一个可验收的业务闭环切。

示例：外卖用户端 MVP

| Slice | 用户价值 | 内容 |
| --- | --- | --- |
| Slice 1 | 用户能看到商家和商品 | 商家列表、商家详情、商品类目、基础 Java API |
| Slice 2 | 用户能选择商品 | SKU 选择、购物车、数量增减、价格展示 |
| Slice 3 | 用户能提交订单 | 地址选择、费用明细、订单创建、库存/营业/配送校验 |
| Slice 4 | 用户能支付订单 | 支付单创建、支付结果、支付回调、幂等、订单状态更新 |
| Slice 5 | 用户能查看订单 | 订单列表、订单详情、取消订单、状态流转 |
| Slice 6 | 平台可安全上线 | 权限、审计、E2E、灰度、监控、发布说明 |

推荐提示词：

```text
请把外卖平台当前需求拆成 feature slice。
每个 slice 必须包含用户价值、Vue3 H5 前端任务、Java 后端任务、数据库影响、测试要求、验收标准和依赖关系。
```

## 阶段 5：并行开发

Frontend Agent：

- 实现 Vue3 H5 页面、组件、路由和状态管理。
- 处理移动端适配、滚动、弹窗、底部结算栏、支付反馈。
- 不信任前端价格、库存和权限最终结果。

Backend Agent：

- 实现 Java API、订单、支付、库存、商家、配送等业务逻辑。
- 处理事务、幂等、订单状态机、权限和审计日志。
- 更新接口文档和测试。

QA Agent：

- 同步准备下单链路、支付链路、订单状态和权限测试。

## 阶段 6：测试与质量门禁

前端 Vue3 H5：

- Lint
- Typecheck
- Unit Test
- Build
- 移动端核心页面验证

后端 Java：

- Unit Test
- Integration Test
- API Contract Test
- Build
- Migration 验证

核心链路测试：

- 下单 E2E
- 支付回调幂等
- 订单状态机非法流转
- 库存并发
- 退款和取消
- 用户/商家/骑手越权

安全检查：

- SAST
- SCA
- Secret Scan
- DAST

## 阶段 7：审查

不让开发 Agent 自己给自己放行。

推荐 Reviewer：

| Reviewer | 重点 |
| --- | --- |
| Bug Reviewer | 下单、购物车、支付、订单状态真实缺陷 |
| Security Reviewer | 越权、支付回调、敏感数据、接口滥用 |
| Performance Reviewer | 商家列表、商品列表、订单列表慢查询和缓存 |
| Maintainability Reviewer | Vue 组件边界、Java 模块边界、重复代码 |
| QA Reviewer | 下单、支付、退款、权限、异常订单测试覆盖 |

执行规则：

- 高风险 PR 必须并行执行 Bug、Security、Performance、Maintainability、QA 五类审查。
- 普通 PR 至少执行 Reviewer Agent 汇总审查。
- P0 必须修复，不允许合并。
- P1 合并前应修复。
- P2 可记录为后续优化。

推荐提示词：

```text
请以代码审查模式检查当前分支相对 main 的 diff。
重点关注外卖平台下单链路、支付金额、订单状态机、库存并发、越权风险、性能风险和缺失测试。
按 P0 / P1 / P2 输出必须修改项。
```

## 阶段 8：部署发布

发布流程：

1. CI 构建：Vue3 H5 构建、Java 构建、测试、镜像、安全扫描全部通过。
2. 预发：接近生产的环境完成 UAT 和联调。
3. Feature Flag：控制下单、支付、优惠、退款等功能暴露范围。
4. Canary：小流量发布，观察下单成功率、支付成功率、接口错误率和核心指标。
5. 全量：逐步扩大流量，确认无异常后完成。
6. 回滚：异常时按预案回滚前端资源、Java 服务、配置和数据。

重点监控：

- 下单成功率
- 支付成功率
- 支付回调失败率
- 订单创建失败率
- 退款失败率
- 接口错误率
- 接口 P95/P99 耗时
- 数据库慢查询

## 阶段 9：验收和复盘

验收维度：

- H5 点餐体验验收
- 商品和购物车验收
- 下单验收
- 支付验收
- 订单状态验收
- 权限和数据隔离验收
- 性能验收
- 安全验收
- 发布验收

复盘关注：

- 需求是否误解
- 金额和订单状态是否有返工
- CI 失败原因
- Review 问题类型
- 线上问题和回滚情况
- 哪些 Agent 规则需要更新

## 从 0 到 1 落地路线

| 时间 | 重点 | 交付物 |
| --- | --- | --- |
| 第 1 周 | 建规则 | AGENTS.md、PR 模板、测试命令、外卖业务规范 |
| 第 2 周 | 建角色 | Orchestrator、Product、Design、Architect、Data、Frontend、Backend、QA、Security、Reviewer Agent |
| 第 3 周 | 跑案例 | 用“商家列表 + 商品详情 + 购物车”跑完整闭环，生成 HTML PRD 和 Figma 设计图 |
| 第 4 周 | 接工具 | Git、CI、安全扫描、自动 Review、H5 预览环境 |
| 持续 | 优化 | 基于返工、事故、CI、Review 数据更新规则 |
