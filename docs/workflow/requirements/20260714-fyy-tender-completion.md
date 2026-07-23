# Requirement Workflow Status: 纺院标书软件需求完成

本文件记录本次需求的阶段状态。本机环境结果引用被 Git 忽略的 `docs/workflow/local-environment-status.md`。

## 元信息

| 项 | 内容 |
| --- | --- |
| 需求ID | 20260714-fyy-tender-completion |
| 需求名称 | 纺院标书软件需求完成 |
| 来源文档 | `docs/requirements/纺院需求.md`、`docs/tenders/纺院标书技术部分.docx` |
| 创建时间 | 2026-07-14 +08:00 |
| 当前阶段 | UI/Figma 决策 |
| 总状态 | 需确认 |
| 本机环境状态 | `developer_confirmed_ready` |
| 原始开发分支 | `p6` |
| 需求集成分支 | `codex/fyy-tender-completion-integration` |
| Worktree 开发分支 | 未创建 |
| Worktree 路径 | 未创建 |
| 合并状态 | 未开始 |
| 开发模式 | 高风险严格模式 |
| 缓存读取 | `project/docs/patterns/*.md` 全部缓存 |
| 缓存命中 | 部分命中：Snowy CRUD、banner、组织、用户、角色、权限、日志、文件上传；H5、PAM、跨系统接口需新增设计 |
| 缓存更新 | 无需更新；Product 阶段未产生已验证代码模式 |

## 阶段状态

| 阶段 | 状态 | 产物 | 确认/来源 | 时间 |
| --- | --- | --- | --- | --- |
| 开发环境检测 | 已完成 | `docs/workflow/local-environment-status.md` | 用户选择 1 | 2026-07-14 |
| 当前分支确认 | 已完成 | 开发分支 `p6` | 用户选择 1 | 2026-07-14 |
| 需求集成分支创建 | 已完成 | `codex/fyy-tender-completion-integration` | 用户确认后创建 | 2026-07-14 |
| 需求和框架装载 | 已完成 | 需求 Markdown/HTML、标书抽取文本和素材 | 标书解析、需求明细校验、框架缓存与源码核验 | 2026-07-14 |
| 开发模式决策 | 已完成 | 高风险严格模式 | 用户选择 1 | 2026-07-15 |
| PRD/原型决策 | 已完成 | 生成 PRD 和完整后管低保真原型；跳过 H5 设计 | 用户选择 1 并补充 H5 暂不考虑 | 2026-07-15 |
| Product 产物 | 已完成 | PRD Markdown/HTML、后管页面蓝图、后管低保真原型 | 规格已确认；蓝图、静态和运行时校验均为 PASS | 2026-07-15 |
| Product 原型重画规格 | 已完成 | `docs/superpowers/specs/2026-07-16-fyy-admin-prototype-redesign.md` | 用户选择 1，确认规格并进入实施计划 | 2026-07-16 |
| Product 原型重画计划 | 已完成 | `docs/superpowers/plans/2026-07-16-fyy-admin-prototype-redesign.md` | 用户选择 1，当前会话内联执行 | 2026-07-16 |
| Product 原型重画执行 | 已完成 | `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`、`coverage.html`、兼容跳转入口 | 用户要求不走 executing-plans、直接画；学校端 20 页、平台端 13 页均完成，接口中心与 PAM 仅跳过本次原型 | 2026-07-16 |
| Product 后管原型逐页重设计 | 已完成 | 32 个独立页面组件、ADM-S-002 菜单分组、`prototype-contract.json`、逐页截图与 `runtime-validation.json` | 根据开发者新标注加入 ECharts、移除师生管理独立页并补 Banner 详情图片；继续排除接口中心、PAM、H5 | 2026-07-17 |
| H5 原型需求恢复 | 已完成 | H5-001 至 H5-013、`project/h5` 框架与真实页面模式 | 开发者明确要求“生成 h5 原型”，原跳过决定自 2026-07-23 起失效 | 2026-07-23 |
| Product H5 原型设计 | 已完成（运行时受限） | 26 页逐页蓝图、多文件 H5 原型、契约与 13 项需求覆盖矩阵 | 蓝图、JS 语法、组件/路由/需求映射、静态契约均 PASS；本地 `file://` 被浏览器安全策略拦截，未生成运行时截图 | 2026-07-23 |
| UI/Figma 决策 | 需确认 | - | 等待开发者选择生成 UI/Figma 或跳过 UI 并复用 Snowy 现有 UI | 2026-07-15 |
| Design 产物 | 未开始 | - | - | - |
| 技术设计 | 未开始 | - | - | - |
| 数据设计 | 未开始 | - | - | - |
| Feature Slice 拆分 | 未开始 | - | - | - |
| 并行开发计划 | 未开始 | - | - | - |
| 开发 | 未开始 | - | - | - |
| 测试与质量门禁 | 未开始 | - | - | - |
| Review/Security/QA 审查 | 未开始 | - | - | - |
| 发布 | 未开始 | - | - | - |
| 验收复盘 | 未开始 | - | - | - |

## 当前可选项

```text
节点: UI/Figma 决策
推荐选项: 跳过 UI，复用已完成的后管与 H5 原型进入技术方案
其他选项: 生成 UI/Figma；返回调整后管或 H5 原型；暂停
推荐原因: 后管与 H5 的需求蓝图、交互原型和覆盖矩阵已完成；H5 本地文件浏览器运行时截图仍需在允许本地 URL 的环境补验
记录时间: 2026-07-23
```

## 后管原型重画记录

```text
重画原因: 新原型规范要求基于完整原始 Demo 金标复用 components 预设组件，并以多文件目录交付
交付策略: 新建 docs/design/FY-20260714-UNICARD-admin-low-fidelity/；旧 HTML 改为轻量跳转入口
页面范围: 学校端 19 个独立页面 + 1 个师生管理菜单分组，平台端 13 个独立页面，共 32 个逐页契约
本次原型不适用: 接口中心 8 页、PAM 8 页；需求和 PRD 保留
H5: 继续需求保留、设计延期
标注迁移: 保留页面需求，自动标注按蓝图重建，不迁移旧手工评论
规格: docs/superpowers/specs/2026-07-16-fyy-admin-prototype-redesign.md
计划: docs/superpowers/plans/2026-07-16-fyy-admin-prototype-redesign.md
交付入口: docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html
覆盖矩阵: docs/design/FY-20260714-UNICARD-admin-low-fidelity/coverage.html
兼容入口: docs/design/FY-20260714-UNICARD-admin-low-fidelity.html
组件清单: snowy-runtime-components-v1，51 个运行时组件；其中 32 个需求编号对应独立页面组件，ADM-S-002 仅作为菜单分组
逐页契约: docs/design/FY-20260714-UNICARD-admin-low-fidelity/prototype-contract.json
逐页截图: docs/design/FY-20260714-UNICARD-admin-low-fidelity/runtime-screenshots/ADM-S-001.png 至 ADM-P-013.png
运行报告: docs/design/FY-20260714-UNICARD-admin-low-fidelity/runtime-screenshots/runtime-validation.json
标注落实: ADM-S-001 使用 ECharts 展示用户趋势与活跃/社保卡码应用量；ADM-S-002 删除独立页面；ADM-S-006 详情展示 Banner 图片并支持大图预览
验证结果: 页面蓝图、静态组件契约、32 页运行时契约、32 张逐页截图及 3 条标注浏览器交互回归全部 PASS
残余风险: 接口中心 8 页、PAM 8 页仅跳过本次原型；H5 13 项设计继续延期；正式接口契约、数据库和业务代码尚未进入技术设计与开发
状态: 已完成
记录时间: 2026-07-17
```

## 跳过记录

```text
跳过项: H5 页面设计与 H5 低保真原型
跳过原因: 开发者明确“h5 先不考虑，跳过h5的设计”；不采用当前未跟踪 project/h5 作为正式基线
最低保留产物: PRD 中保留 H5-001 至 H5-013 的需求追踪、延期范围和风险说明
验收标准: 不把 H5 标记为本阶段已设计或已覆盖；后续补充框架后重新进入 H5 Product/Design 门禁
风险记录: APP 对接、页面规格和 H5 技术基线延后确认
记录时间: 2026-07-15
```

```text
恢复项: H5 页面设计与 H5 低保真原型
恢复原因: 开发者于 2026-07-23 明确要求“生成 h5 原型”
需求范围: H5-001 至 H5-013
框架基线: project/h5；Vue 3、Vant、真实业务页面模式与 H5 多文件原型骨架
认证约束: 默认不启用历史登录、Token 和身份守卫；宿主 APP、认证协议与服务消息/卡包契约标记待确认
需求集成分支: codex/fyy-h5-prototype-integration
状态: 已开始
记录时间: 2026-07-23
```

## 框架缓存记录

```text
缓存读取: project/docs/patterns/README.md、framework-inventory.md、module-map.md、feature-capability-map.md、backend-crud-pattern.md、frontend-crud-pattern.md、permission-sql-pattern.md、migration-sql-pattern.md、cache-update-rules.md
缓存是否命中: 部分命中
代码核验: biz/notice、dev/slideshow、sys/user、sys/role、sys/resource/menu、snowy_mysql.sql
复用能力: Snowy 管理端布局、CRUD、组织用户角色、菜单按钮权限、日志、字典、文件上传、banner
缓存更新: 无需更新
原因: 本阶段只完成需求装载，未产生可验证的新实现模式
时间: 2026-07-14
```

```text
缓存读取: project/docs/patterns/h5-routing-auth-pattern.md、project/docs/patterns/h5-ui-component-pattern.md
缓存是否命中: 命中
代码核验: project/h5/src/views/index、notice、news、yy、signCard、book、mine、code、sys/user/card、demo；project/h5/src/components/OpenApiPicker、OpenDatePicker、Empty
复用能力: 移动端门户、Banner、应用宫格、公告与资讯、预约表单与记录、多步骤办卡、图书检索与详情、个人中心、校园码与绑卡
缓存更新: 无需更新
原因: 本阶段生成业务原型，未修改 project/h5 框架模式
时间: 2026-07-23
```

## 分支和 Worktree 记录

```text
原始开发分支: p6
需求集成分支: codex/fyy-tender-completion-integration
Worktree 开发分支: 未创建
Worktree 路径: 未创建
Worktree 合回需求集成分支: 未开始
需求集成分支验证: 未开始
是否已询问合回原始开发分支: 否
最终合并结果: 未开始
时间: 2026-07-14
```

```text
H5 原型开发基线: codex/fyy-tender-completion-integration
H5 原型需求集成分支: codex/fyy-h5-prototype-integration
H5 Product 阶段 worktree: 不适用
创建时间: 2026-07-23
```

## 风险记录

- H5 原型已完成 26 页、H5-001 至 H5-013 覆盖与静态契约验证；Codex 浏览器禁止访问本地 `file://`，因此 320/375/390/414px 的真实浏览器截图与横向溢出检查需在允许本地 URL 的环境补验。
- H5/APP 现有框架与对接契约仍需确认。
- 身份证号、手机号、社保卡号、掌静脉特征属于敏感或生物识别数据，需明确加密、脱敏、授权、留存和删除规则。
- 移动支付和实体社保卡交易接口需明确签名、幂等、金额校验、重试和对账机制。
- 设备远程配置、批量导入导出、权限分级和删除操作必须重点进行安全与审计检查。

## 阶段变更记录

```text
阶段: Product H5 原型设计
状态: 已完成（运行时受限）
来源: docs/requirements/纺院需求.md H5-001 至 H5-013；project/h5/src/views/**；snowy-h5-app-designer
产物: docs/design/FY-20260714-UNICARD-h5-page-blueprint.md；docs/design/FY-20260714-UNICARD-h5-low-fidelity/
页面范围: 26 个独立页面；学校专区、访客预约、校园启航、图书服务、我的、服务消息、校园卡包
验证: H5 蓝图校验 PASS；H5 原型静态校验 PASS；JS 语法 PASS；26 页组件/路由/需求映射 PASS；320/375/390/414 视口契约已声明
标注: 全局壳与页面级作用域分离；29 个自动标注目标与页面蓝图一致
运行时限制: Codex 浏览器安全策略禁止访问本地 file:// 页面，未绕过策略，未生成浏览器截图
缓存更新: 无需更新，未修改 project/h5 生产代码或形成新的框架实现模式
下一步: UI/Figma 决策
时间: 2026-07-23
```

```text
阶段: 需求和框架装载
状态: 已完成
来源: AGENTS.md；纺院标书技术部分.docx；tender-requirement-reader；snowy-framework-reader；project/docs/**；project/docs/patterns/**
产物: docs/requirements/纺院需求.md；docs/requirements/纺院需求.html；docs/tenders/纺院标书技术部分.extract.txt；docs/tenders/assets/纺院标书技术部分/
验证: 62 个软件功能块；validate_requirement_detail.py PASS；硬件纯规格已排除；H5、后管、接口与 PAM 均保留
下一步: 开发模式决策
时间: 2026-07-14
```

```text
阶段: 开发模式决策
状态: 已完成
来源: 用户选择 1
产物: 高风险严格模式
加强门禁: 敏感数据与生物特征保护；交易接口签名、幂等与对账；分级权限；设备远程控制；批量导入导出；Security、QA 和多类 Review
下一步: PRD/原型决策
时间: 2026-07-15
```

```text
阶段: PRD/原型决策与 Product 方案设计
状态: 需确认
来源: 用户选择生成 PRD 和低保真原型；确认统一交付方案；确认后管信息架构和高风险规则；明确跳过 H5 设计
产物: docs/superpowers/specs/2026-07-15-fyy-product-design.md
下一步: 开发者审阅并确认产品设计规格
时间: 2026-07-15
```

```text
阶段: Product 产物
状态: 已完成
来源: 已确认的产品设计规格；Task 1 至 Task 5 验证证据
Product 产物: 已完成
H5 设计: 已跳过
H5 跳过原因: 开发者明确暂不考虑 H5 设计，且不采用未跟踪 project/h5 作为正式基线
产物: docs/prd/FY-20260714-UNICARD-prd.md；docs/prd/FY-20260714-UNICARD-prd.html；docs/design/FY-20260714-UNICARD-admin-page-blueprint.md；docs/design/FY-20260714-UNICARD-admin-low-fidelity.html
蓝图校验: PASS
原型静态校验: PASS
运行时校验: PASS
缓存更新: 无需更新，Product 阶段未产生已验证代码模式
下一步: UI/Figma 决策
时间: 2026-07-15
```
