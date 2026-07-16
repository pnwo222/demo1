# 纺院一卡通后管原型重画设计规格

## 1. 文档信息

| 项 | 内容 |
| --- | --- |
| 需求 ID | `20260714-fyy-tender-completion` |
| 设计主题 | 后管低保真原型按原始 Demo 金标和预设组件重画 |
| 设计日期 | 2026-07-16 |
| 当前分支 | `codex/fyy-tender-completion-integration` |
| 需求基线 | `docs/requirements/纺院需求.md` |
| PRD | `docs/prd/FY-20260714-UNICARD-prd.md`、对应 HTML |
| 页面蓝图 | `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md` |
| 原型技能 | `.codex/skills/snowy-admin-prototype-designer` |

## 2. 已确认决策

1. 后管原型改为多文件目录交付，不再使用旧单文件业务渲染引擎。
2. 输出目录为 `docs/design/FY-20260714-UNICARD-admin-low-fidelity/`。
3. 旧文件 `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html` 保留为轻量跳转入口，避免历史链接失效；不得保留旧渲染逻辑。
4. 页面范围仅包含学校端 20 页和平台端 13 页，共 33 页。
5. 接口中心 8 页、PAM 8 页仅跳过本次原型；需求与 PRD 继续保留，蓝图和覆盖记录标记为“本次原型不适用—用户明确跳过”。
6. H5-001 至 H5-013 继续保持“需求保留、设计延期”，不进入本次后管原型。
7. 保留每页整体需求说明；自动标注按当前蓝图重新生成；旧手工评论不迁移。
8. 使用模块化组件组合方案，不采用 49 个完全重复页面组件，也不采用万能 Schema/CRUD 渲染器。

## 3. 目标与非目标

### 3.1 目标

- 以 `prototype-demo-framework/golden/original-demo.html` 为不可变视觉和功能金标。
- 通过 `build-prototype.mjs` 复制完整运行时组件，保持 Snowy 布局、表单、表格、上传、抽屉、弹窗、标注、持久化和另存为能力。
- 使用原始预设组件组合 33 个业务页面，并保持每页字段、操作、状态、异常和权限独立可追溯。
- 让 `index.html` 只负责加载 CSS、状态、业务数据和组件脚本。
- 通过组件清单、静态校验、运行时校验和覆盖矩阵证明原型符合需求与 Demo 基线。

### 3.2 非目标

- 不生成接口中心 8 页、PAM 8 页的本轮可交互原型。
- 不生成 H5/移动端原型。
- 不修改 `project/h5/`。
- 不进入 Figma、技术架构、数据库或业务代码开发。
- 不修改原始 Demo 金标及仓库级预设组件源文件；业务扩展只存在于目标原型目录。

## 4. 输出结构

```text
docs/design/FY-20260714-UNICARD-admin-low-fidelity/
  index.html
  coverage.html
  component-manifest.json
  styles/
    snowy-prototype.css
    unicard-business.css
  app/
    prototype-data.js
    prototype-state.js
    main.js
    modules/
      school-pages.js
      platform-pages.js
      page-requirements.js
      page-annotations.js
      coverage-data.js
  components/
    <原始 Demo 预设组件>
    business/
      unicard-dashboard-pages.js
      unicard-content-pages.js
      unicard-readonly-pages.js
      unicard-governance-pages.js
      unicard-log-monitor-pages.js
      unicard-permission-guide-pages.js
      unicard-role-grant-page.js
      unicard-audit-page.js
    README.md
    registry.js
```

旧 `FY-20260714-UNICARD-admin-low-fidelity.html` 仅包含 UTF-8、页面标题、跳转链接和自动跳转逻辑，目标指向新目录的 `index.html`。

## 5. 组件策略

### 5.1 受保护基础组件

完整复用以下原始能力，不重画 DOM、间距、控件或标注引擎：

- `SnowyAnnotationToolbar`
- `SnowyShell`
- `SnowyBannerQueryForm`
- `SnowyBannerDataTable`
- `SnowyBannerPage`
- `SnowyMenuResourcePage`
- `SnowyNodeCommentComposer`
- `SnowyRequirementDrawer`
- `SnowyContentFormDrawer`
- `SnowyMenuFormDrawer`
- `SnowyImportModal`
- `SnowyColumnSettingsModal`
- `SnowyAnnotationEditorModal`
- `SnowyImagePreviewModal`

组件预设页只作为参考库，不进入业务菜单。

### 5.2 业务组合组件

- 看板：学校首页、平台首页，使用 Snowy 壳和业务统计/图表组合。
- 内容管理：首页 Banner、应用、首页模块、公告、文章、活动，组合查询、表格、图片上传、内容抽屉、审核和状态组件。
- 只读查询：学生、教职工、历史学生、社保卡申领、访客、通行、消费、借阅、用户等页面，使用页面专属查询、表格和详情数据。
- 组织权限：学校、用户、角色、模块、菜单，组合组织树、用户表格、资源树、授权和范围配置。
- 日志监控：设备、访问日志、操作日志、外部调用日志、宁波一卡通对接、审核中心、系统监控，使用状态、详情、告警和受控操作组件。
- 权限说明与分组入口：保留真实菜单导航和授权说明，不创建伪 CRUD。

业务组合组件可以复用结构，但每页必须提供独立字段和操作契约；不得共享“标题、状态、排序、备注”万能字段集。

## 6. 页面范围

### 6.1 本次原型覆盖

- 学校端：`ADM-S-001` 至 `ADM-S-020`，20 页。
- 平台端：`ADM-P-001` 至 `ADM-P-013`，13 页。

### 6.2 本次原型不适用

- 接口中心：`API-001` 至 `API-008`，8 页；原因：用户明确仅跳过本次原型，需求和 PRD 保留。
- PAM：`PAM-001` 至 `PAM-008`，8 页；原因同上。
- H5：`H5-001` 至 `H5-013`，继续设计延期。

## 7. 页面与交互契约

- 33 页全部拥有独立菜单、路由、权限标识、可见角色、页面类型和页面需求说明。
- 查询必须实际筛选当前页面数据；重置必须恢复本页条件。
- 表格字段按语义展示：图片缩略图、状态标签、启停开关、金额右对齐、日期时间、敏感文本脱敏、权限树或操作范围。
- 新增、编辑、详情、审核、授权、删除、导入、导出、状态切换仅在蓝图明确允许时出现。
- 图片上传必须支持本地选择、预览和移除；不得使用原生文件输入直接暴露在业务界面。
- 审核、授权、敏感导出、删除和远程配置类操作必须二次确认并显示影响范围与结果。
- 角色切换时，菜单和按钮根据蓝图真实隐藏或禁用；前端权限表现不替代后端鉴权说明。
- 同步只读页面不得出现新增、编辑、删除或无来源导入。
- 页面覆盖加载、空数据、查询无结果、接口异常、无权限；表单另覆盖校验失败、保存中、成功和失败。

## 8. 敏感数据规则

- 身份证号、手机号、社保卡号在列表脱敏；明文和导出使用独立权限说明与审计反馈。
- 社保卡申领记录仅允许学校管理员和安全审计人员访问，不向设备运维人员开放。
- 外部调用日志的请求参数脱敏；普通 UI 不展示认证凭证或敏感载荷。
- 删除、批量操作、授权和敏感导出均展示操作对象、范围和审计提示。

## 9. 标注与页面需求

- 每个页面提供顶部“页面需求”入口，内容来自当前验证蓝图。
- 默认预览；点击编辑图标后进入多行文本编辑；内容发生变化后才出现保存；取消恢复原内容。
- 自动标注只覆盖敏感字段、状态枚举、权限差异、高风险操作、校验规则和异常规则。
- 自动标注绑定具体字段、列、按钮、状态或抽屉字段，不统一绑定页面容器。
- 节点评论支持悬停高亮、点击选择、多行输入、显式发送和编号标记。
- 标注与页面需求修改后立即本地持久化；刷新不丢失；另存为嵌入最新状态。
- 自动标注保留不可变基线：未修改自动标注可隐藏，修改后的自动标注删除时恢复基线，用户标注可真实删除。

## 10. 覆盖矩阵

- `ADM-S-001` 至 `ADM-S-020`、`ADM-P-001` 至 `ADM-P-013`：共 33 行标记 `已覆盖`，每行关联蓝图页面、路由、组件和具体交互。
- `API-001` 至 `API-008`、`PAM-001` 至 `PAM-008`：共 16 行标记 `不适用`，说明“用户明确跳过本次原型；需求和 PRD 保留”。
- 不使用范围行，不以菜单存在替代字段或交互覆盖证据。

## 11. 构建与验证

1. 运行模板与金标校验。
2. 执行 `build-prototype.mjs` 创建目标目录。
3. 保持原始组件不变；新增业务组件后更新目标目录 `registry.js`、`components/README.md`、`index.html` 和业务验证。
4. 运行 `refresh-component-manifest.mjs` 刷新目标目录清单与 SHA-256。
5. 运行蓝图校验，确认 33 个覆盖页与 16 个明确不适用页的状态一致。
6. 运行目录入口原型静态校验，检查组件引用、加载顺序、清单哈希和必需业务字段。
7. 运行浏览器检查：33 个菜单页、查询/重置、分页、详情、适用的新增/编辑/上传/审核/授权/状态切换、异常态、权限态、标注、页面需求和另存为。
8. 验证浏览器无 `pageerror`、console `error`、空白页或核心点击失败。
9. 验证旧 HTML 能跳转到新目录入口，且不含旧渲染器。

## 12. 验收标准

- 多文件目录由 `build-prototype.mjs` 生成，`index.html` 为轻量入口。
- 原始组件、样式和标注能力完整保留；金标文件未修改。
- 33 页菜单、字段、操作、状态、异常和权限与蓝图一致。
- 16 个接口/PAM 页面不进入菜单和页面模型，覆盖矩阵给出明确不适用原因。
- 页面需求和自动标注来源正确、节点绑定具体、刷新与另存为可恢复。
- 静态校验、组件清单哈希、运行时检查和覆盖审计全部通过。
- 旧 HTML 仅为跳转入口；`project/h5/` 保持未修改、未提交。
- Product 原型重画完成后重新进入 UI/Figma 决策。

## 13. 风险与控制

| 风险 | 控制 |
| --- | --- |
| 组件组合退化为万能 CRUD | 按页面蓝图逐页核对字段和操作，业务族组件不得共享万能字段集 |
| 破坏原始 Demo 能力 | 原始组件不修改；使用清单 SHA-256、模板校验和浏览器回归 |
| 大规模文件装配遗漏 | 按学校端、平台端分批生成，由单一 Owner 汇总入口和注册表 |
| 跳过接口/PAM 后追溯丢失 | PRD 保留；蓝图与覆盖矩阵逐项标记不适用及用户决策 |
| 历史链接失效 | 旧单文件保留轻量跳转入口 |
| 旧标注污染新节点 | 仅保留页面需求，自动标注从当前蓝图重建，不迁移旧手工评论 |

## 14. 未决问题

无。页面范围、目录策略、兼容入口和标注迁移方式均已由开发者确认。
