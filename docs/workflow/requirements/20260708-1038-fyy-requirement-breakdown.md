# Requirement Workflow Status: 纺院标书软件需求拆解

本文件记录单个需求或功能的阶段状态。环境自检不在这里重复记录，只引用 `docs/workflow/status.md` 的全局状态。

## 元信息

| 项 | 内容 |
| --- | --- |
| 需求ID | 20260708-1038-fyy-requirement-breakdown |
| 需求名称 | 纺院标书软件需求拆解 |
| 来源文档 | `docs/requirements/纺院需求.md`、`D:/www/www/chg/纺院/纺院标书技术部分.docx` |
| 创建时间 | 2026-07-08 10:38 +08:00 |
| 当前阶段 | UI/Figma 决策 |
| 总状态 | 需确认 |
| 本机环境状态 | 引用 `docs/workflow/local-environment-status.md`，当前为 `developer_confirmed_ready` |
| 当前确认方式 | 编号选择，输入兜底 |
| 原始当前分支 | `p5` |
| 需求集成分支 | `codex/fyy-requirement-breakdown` |
| Worktree 开发分支 | 未创建 |
| Worktree 路径 | 未创建 |
| 合并状态 | 未开始 |
| 开发模式 | 高风险严格模式 |
| 缓存读取 | `project/docs/patterns/README.md`、`framework-inventory.md`、`module-map.md`、`feature-capability-map.md`、`backend-crud-pattern.md`、`frontend-crud-pattern.md`、`permission-sql-pattern.md`、`migration-sql-pattern.md`、`cache-update-rules.md` |
| 缓存命中 | 部分命中：banner/轮播、CRUD、权限、SQL 模式命中；H5、PAM、跨系统接口为待设计 |
| 缓存更新 | 无需更新；本阶段仅需求拆解，未形成新的已验证代码模式 |

## 阶段状态

| 阶段 | 状态 | 产物 | 确认/来源 | 时间 |
| --- | --- | --- | --- | --- |
| 当前分支确认 | 已完成 | 开发分支 `p5` | 用户选择 1 | 2026-07-08 10:33 +08:00 |
| 分支创建 | 已完成 | `codex/fyy-requirement-breakdown` | 用户确认后创建 | 2026-07-08 10:35 +08:00 |
| 需求和框架装载 | 已完成 | `docs/requirements/纺院需求.md`、`docs/tenders/纺院标书技术部分.extract.txt`、`docs/tenders/assets/纺院标书技术部分/` | 标书解析、框架缓存读取 | 2026-07-08 10:38 +08:00 |
| 开发模式决策 | 已完成 | 高风险严格模式 | 用户选择 1 | 2026-07-08 10:40 +08:00 |
| PRD/原型决策 | 已完成 | 生成 PRD 和低保真原型 | 用户选择 1 | 2026-07-08 10:43 +08:00 |
| Product 产物 | 已完成（按新版工作流重生成） | `docs/prd/FY-20260708-UNICARD-prd.md`、`docs/prd/FY-20260708-UNICARD-prd.html`、`docs/design/FY-20260708-UNICARD-admin-low-fidelity.html`、`docs/design/FY-20260708-UNICARD-h5-low-fidelity.html` | Product Agent；用户要求按更新后的工作流重新生成 PRD 和低保真原型；后管原型基于 Demo 模板 | 2026-07-08 16:35 +08:00 |
| UI/Figma 决策 | 需确认 | - | 待用户选择 | - |
| Design 产物 | 未开始 | - | - | - |
| 最小需求说明 | 已完成 | `docs/requirements/纺院需求.md` | 标书需求拆解 | 2026-07-08 10:38 +08:00 |
| 技术设计 | 未开始 | - | - | - |
| 数据设计 | 未开始 | - | - | - |
| Feature Slice 拆分 | 未开始 | - | - | - |
| 并行开发计划 | 未开始 | - | - | - |
| 开发 | 未开始 | - | - | - |
| 测试与质量门禁 | 未开始 | - | - | - |
| Review/Security/QA 审查 | 未开始 | - | - | - |
| 发布 | 未开始 | - | - | - |
| 验收复盘 | 未开始 | - | - | - |

## 跳过记录

```text
跳过项: 无
跳过原因: -
最低保留产物: docs/requirements/纺院需求.md
验收标准: 已包含范围、菜单设计、验收标准、风险和待确认问题
风险记录: 身份认证、敏感信息、交易金额、权限、设备远程控制、批量导出为重点审查项
记录时间: 2026-07-08 10:38 +08:00
```

## 当前可选项

```text
节点: UI/Figma 决策
推荐选项: 生成 UI/Figma
其他选项: 跳过 UI，复用 Snowy 现有 UI；返回补充 PRD/原型；自定义
自定义输入: 支持
记录时间: 2026-07-08 16:35 +08:00
```

```text
阶段: Product 产物重生成
状态: 已完成
来源: 用户要求“工作流已更新，请重新 生成 PRD 和低保真原型”；AGENTS.md；.codex/workflows/admin-prototype-design-workflow.md；docs/design/prototype-demo-framework/index.html；docs/requirements/纺院需求.md；project/docs/**；project/docs/patterns/**
产物: docs/prd/FY-20260708-UNICARD-prd.md; docs/prd/FY-20260708-UNICARD-prd.html; docs/design/FY-20260708-UNICARD-admin-low-fidelity.html; docs/design/FY-20260708-UNICARD-h5-low-fidelity.html
覆盖: PRD 保留需求来源、范围、角色、学校端后管菜单、管理端后管菜单、接口建设、PAM、H5、状态规则、验收标准和风险；后管原型从 Demo 模板复制生成，保留 Snowy Admin Shell、框架参考清单、菜单映射、CRUD 形式选择、覆盖矩阵；H5 原型独立成文件并标记 H5 框架待补充
验证: 四个产物存在；后管原型包含 prototypeMeta、Vue + Ant Design Vue CDN、.snowy-sider、.snowy-header、.tabs-row、query-card、toolbar、a-table、a-drawer、a-modal、a-upload、原型需求覆盖矩阵、框架参考清单；未检出 s-table、xn-*、hasPerm、mock、toolConfig 等面向开发的可见术语；`data-source` 仅为 Ant Design Vue 表格绑定属性
下一步: UI/Figma 决策
时间: 2026-07-08 16:35 +08:00
```

## 框架缓存记录

```text
缓存读取: project/docs/patterns/README.md, framework-inventory.md, module-map.md, feature-capability-map.md, backend-crud-pattern.md, frontend-crud-pattern.md, permission-sql-pattern.md, migration-sql-pattern.md, cache-update-rules.md
缓存是否命中: 部分命中
缓存更新: 无需更新
更新文件: -
原因: 本阶段仅完成需求拆解；banner/CRUD/权限/SQL 已有缓存命中，H5/PAM/跨系统接口尚未进入实现核验，不能写入新模式缓存
时间: 2026-07-08 10:38 +08:00
```

## 分支和 Worktree 记录

```text
原始当前分支: p5
需求集成分支: codex/fyy-requirement-breakdown
Worktree 开发分支: 未创建
Worktree 路径: 未创建
Worktree 合回需求集成分支: 未开始
需求集成分支验证: 未开始
是否已询问合回原始当前分支: 否
最终合并结果: 未开始
时间: 2026-07-08 10:38 +08:00
```

## 阶段变更记录

```text
阶段: 需求和框架装载
状态: 已完成
来源: AGENTS.md, .codex/workflows/multi-agent-sdlc.md, .codex/agents/orchestrator.md, docs/requirements/纺院需求.md, project/docs/**, project/docs/patterns/**, 纺院标书技术部分.docx
产物: docs/requirements/纺院需求.md; docs/tenders/纺院标书技术部分.extract.txt; docs/tenders/assets/纺院标书技术部分/
下一步: 开发模式决策
时间: 2026-07-08 10:38 +08:00
```

```text
阶段: 开发模式决策
状态: 已完成
来源: 用户选择 1
产物: 高风险严格模式
下一步: PRD/原型决策
时间: 2026-07-08 10:40 +08:00
```

```text
阶段: PRD/原型决策
状态: 已完成
来源: 用户选择 1
产物: 生成 PRD 和低保真原型
下一步: Product 产物
时间: 2026-07-08 10:43 +08:00
```

```text
阶段: Product 产物
状态: 已完成
来源: docs/requirements/纺院需求.md
产物: docs/prd/20260708-fyy-prd.html; docs/design/20260708-fyy-admin-low-fidelity.html; docs/design/20260708-fyy-h5-low-fidelity.html
下一步: UI/Figma 决策
时间: 2026-07-08 10:43 +08:00
```

```text
阶段: Product 产物返工
状态: 已完成
来源: 用户反馈原型与需求差距大；用户要求“我修改了工作流，请重新走 prd 流程”；AGENTS.md；.codex/workflows/multi-agent-sdlc.md；.codex/agents/product.md
产物: 覆盖重写 docs/prd/20260708-fyy-prd.html; 覆盖重写 docs/design/20260708-fyy-admin-low-fidelity.html; 覆盖重写 docs/design/20260708-fyy-h5-low-fidelity.html
覆盖: PRD 增加原型需求覆盖矩阵；后管原型覆盖学校端、管理端、接口建设、PAM 管理；H5 原型覆盖 H5-001~H5-013 / T0R12~T0R23；原型补充字段、操作、状态、异常和权限入口
验证: 三个 HTML 文件存在；UTF-8 读取未发现常见乱码；覆盖矩阵关键编号可检索；后管和 H5 原型内嵌脚本语法检查通过
下一步: UI/Figma 决策
时间: 2026-07-08 11:38 +08:00
```
