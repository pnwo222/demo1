# 纺院一卡通 Product 产物实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于已确认的 62 项标书软件需求，生成完整中文 PRD、逐页 Snowy 后管蓝图、单文件后管低保真原型和可追溯覆盖矩阵，同时按开发者决定跳过 H5 设计。

**Architecture:** 业务事实以 `docs/requirements/纺院需求.md` 的原子需求为源，产品边界以 `docs/superpowers/specs/2026-07-15-fyy-product-design.md` 为准。PRD 负责完整范围与规则，蓝图负责将每个独立后管页面拆为字段、操作、状态、权限与交互，后管 HTML 复用 Snowy Demo 壳并由蓝图驱动；H5-001 至 H5-013 仅保留延期追踪，不生成 H5 原型。

**Tech Stack:** Markdown、单文件 HTML、Vue CDN、Ant Design Vue CDN、Python 校验脚本、Playwright/Edge 运行时检查、Git。

## Global Constraints

- 所有文档和 HTML 使用 UTF-8，默认语言为简体中文。
- 不采用未跟踪的 `project/h5/` 作为正式基线，也不修改该目录。
- 不创建 H5 页面蓝图或 H5 原型；PRD 必须保留 H5-001 至 H5-013 并标记“需求保留、设计延期”。
- 后管原型必须覆盖学校端、管理端、接口中心和 PAM 管理的全部独立页面。
- 同步/只读需求不得擅自增加新增、编辑、删除、导入、导出或审核操作。
- 后管 HTML 必须具备 Snowy Demo v2 强制结构、标注、本地持久化、页面需求抽屉和另存为能力。
- 身份证号、手机号、社保卡号、掌静脉特征、交易接口、批量操作、设备远程配置和分级权限按高风险规则设计。
- 不修改 `project/` 业务代码，不创建 worktree；本计划只生成 Product 阶段文档与原型。

## 文件结构

| 文件 | 职责 |
| --- | --- |
| `docs/prd/FY-20260714-UNICARD-prd.md` | PRD 中文源文件，记录 62 项需求、后管范围、H5 延期、角色、规则和验收 |
| `docs/prd/FY-20260714-UNICARD-prd.html` | 与 Markdown 同步的浏览器评审版 PRD |
| `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md` | 逐独立后管页面的结构化蓝图、框架参考、菜单映射和覆盖条目 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html` | 基于 Snowy Demo v2 的可交互后管原型 |
| `docs/workflow/requirements/20260714-fyy-tender-completion.md` | Product 阶段状态、H5 跳过记录、验证结果和风险 |
| `docs/workflow/status.md` | 项目级需求索引当前阶段摘要 |

---

### Task 1: 冻结需求覆盖基线

**Files:**
- Read: `docs/requirements/纺院需求.md`
- Read: `docs/superpowers/specs/2026-07-15-fyy-product-design.md`
- Read: `docs/tenders/纺院标书技术部分.extract.txt`
- Read: `project/docs/patterns/frontend-crud-pattern.md`
- Read: `project/docs/patterns/feature-capability-map.md`

**Interfaces:**
- Consumes: 原子需求编号 `H5-*`、`ADM-S-*`、`ADM-P-*`、`API-*`、`PAM-*`。
- Produces: 固定覆盖计数 `H5=13`、`ADM-S=20`、`ADM-P=13`、`API=8`、`PAM=8`，供后续 PRD 与覆盖矩阵核验。

- [ ] **Step 1: 运行需求明细校验**

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\tender-requirement-reader\scripts\validate_requirement_detail.py' `
  'docs\requirements\纺院需求.md'
```

Expected: 最后一行包含 `PASS requirement detail checks`；WARN 仅作为人工复核项，不得包含字段遗漏或无来源操作。

- [ ] **Step 2: 核对五类原子需求数量**

```powershell
$file = 'docs\requirements\纺院需求.md'
$groups = [ordered]@{
  H5 = '^### H5-'
  'ADM-S' = '^### ADM-S-'
  'ADM-P' = '^### ADM-P-'
  API = '^### API-'
  PAM = '^### PAM-'
}
foreach ($entry in $groups.GetEnumerator()) {
  "$($entry.Key)=$((rg -c $entry.Value $file))"
}
```

Expected:

```text
H5=13
ADM-S=20
ADM-P=13
API=8
PAM=8
```

- [ ] **Step 3: 确认 H5 跳过边界**

```powershell
rg -n 'H5 设计|H5 原型|project/h5' 'docs\superpowers\specs\2026-07-15-fyy-product-design.md'
```

Expected: 明确出现“不采用 `project/h5/`”“跳过 H5 设计”“不生成 H5 原型”。

### Task 2: 生成并校验完整 PRD

**Files:**
- Create: `docs/prd/FY-20260714-UNICARD-prd.md`
- Create: `docs/prd/FY-20260714-UNICARD-prd.html`
- Reference only: `codex/fyy-requirement-breakdown:docs/prd/FY-20260708-UNICARD-prd.md`
- Reference only: `codex/fyy-requirement-breakdown:docs/prd/FY-20260708-UNICARD-prd.html`

**Interfaces:**
- Consumes: Task 1 的 62 项需求基线与确认后的 Product 规格。
- Produces: `FY-20260714-UNICARD-prd.md/html`，供蓝图生成、技术设计和 QA 使用。

- [ ] **Step 1: 只读导出历史 PRD 作为内容核对来源**

```powershell
git show 'codex/fyy-requirement-breakdown:docs/prd/FY-20260708-UNICARD-prd.md' | Select-Object -First 80
```

Expected: 可读取历史 PRD，且包含学校端、管理端、接口、PAM 与 H5 需求；不得直接继承历史流程状态或 H5 已设计结论。

- [ ] **Step 2: 创建当前 PRD Markdown**

创建 `docs/prd/FY-20260714-UNICARD-prd.md`，必须依次包含以下一级或二级章节：

```markdown
# 宁波市高校一卡通专区产品需求文档
## 文档信息与需求来源
## 背景与目标
## 本期范围与延期范围
## 用户角色与权限边界
## 总体业务流程
## 学校端后管需求
## 管理端后管需求
## 接口中心需求
## PAM 管理需求
## H5/APP 需求追踪（设计延期）
## 后管菜单设计
## 状态与业务规则
## 敏感数据与安全规则
## 异常场景
## 非功能需求
## 验收标准
## 成功指标
## 风险与后续阶段输入
```

其中 H5 章节必须逐项列出 `H5-001` 至 `H5-013`，每项状态固定为“需求保留、设计延期”，原因固定为“开发者明确本阶段暂不考虑 H5 设计，且不采用当前未跟踪 project/h5 作为正式基线”。

- [ ] **Step 3: 将 PRD 渲染为单文件 HTML**

创建 `docs/prd/FY-20260714-UNICARD-prd.html`，内联 CSS，不依赖构建工具。HTML 中必须包含与 Markdown 相同的章节、需求编号、菜单表、权限表、高风险规则与验收表。

- [ ] **Step 4: 执行 PRD 覆盖检查**

```powershell
$files = @(
  'docs\prd\FY-20260714-UNICARD-prd.md',
  'docs\prd\FY-20260714-UNICARD-prd.html'
)
$ids = @('H5-001','H5-013','ADM-S-001','ADM-S-020','ADM-P-001','ADM-P-013','API-001','API-008','PAM-001','PAM-008')
foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file -Encoding UTF8 -Raw
  foreach ($id in $ids) {
    if (-not $content.Contains($id)) { throw "$file missing $id" }
  }
  if (-not $content.Contains('需求保留、设计延期')) { throw "$file missing H5 defer decision" }
}
```

Expected: exit code `0`，无缺失编号。

- [ ] **Step 5: 提交 PRD**

```powershell
git add -- 'docs/prd/FY-20260714-UNICARD-prd.md' 'docs/prd/FY-20260714-UNICARD-prd.html'
git commit -m 'docs: add fyy unicard product requirements'
```

### Task 3: 生成后管框架参考、菜单映射与逐页蓝图

**Files:**
- Create: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- Read: `.codex/skills/snowy-admin-prototype-designer/references/page-blueprint-template.md`
- Read: `.codex/skills/snowy-admin-prototype-designer/references/prototype-acceptance-checklist.md`
- Read: `project/snowy-admin-web/src/views/sys/user/index.vue`
- Read: `project/snowy-admin-web/src/views/sys/role/index.vue`
- Read: `project/snowy-admin-web/src/views/sys/resource/menu/index.vue`
- Read: `project/snowy-admin-web/src/views/sys/org/index.vue`
- Read: `project/snowy-admin-web/src/views/biz/notice/index.vue`
- Read: `project/snowy-admin-web/src/views/dev/slideshow/index.vue`

**Interfaces:**
- Consumes: 当前 PRD 和原子需求字段。
- Produces: 通过校验的逐页蓝图，供 Task 4 的 HTML 页面模型、页面需求文本与覆盖矩阵消费。

- [ ] **Step 1: 运行蓝图缺失预检**

```powershell
Test-Path -LiteralPath 'docs\design\FY-20260714-UNICARD-admin-page-blueprint.md'
```

Expected: 首次执行返回 `False`。

- [ ] **Step 2: 创建框架参考清单**

蓝图开头必须逐项记录以下映射：

```text
普通内容 CRUD -> biz/notice
Banner 与图片上传 -> dev/slideshow
人员与组织树 -> sys/user、sys/org
角色与授权 -> sys/role
模块与菜单资源 -> sys/resource/menu
导入导出 -> sys/user/impExp.vue
```

每项注明查询布局、表格、抽屉/弹窗、权限按钮和状态展示复用方式。

- [ ] **Step 3: 创建菜单与页面映射**

逐菜单写出：一级菜单、二级菜单、三级菜单、路由路径、权限标识、可见角色、页面类型、独立页面标识和需求编号。路由统一使用：

```text
/unicard/school/**
/unicard/platform/**
/unicard/interface/**
/unicard/pam/**
```

权限标识统一使用：

```text
unicardSchool*
unicardPlatform*
unicardInterface*
unicardPam*
```

- [ ] **Step 4: 按独立页面填写完整蓝图**

每个页面必须完整写出：需求编号、页面名称、菜单路径、路由、权限、角色、页面类型、参考 Snowy 页面、原始摘录、原子需求清单、同步/展示/筛选/查询/表格/详情/新增/编辑/导入导出/状态/敏感字段、操作按钮、状态异常、权限差异、字段展示形态、点击交互、空态/加载/错误态与覆盖矩阵行。

同步只读页面的新增、编辑和删除字段必须明确写为“不适用｜需求明确：来源系统同步只读”，不能省略或写“同详情”。

- [ ] **Step 5: 运行蓝图校验**

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\snowy-admin-prototype-designer\scripts\validate_admin_blueprint.py' `
  'docs\design\FY-20260714-UNICARD-admin-page-blueprint.md' `
  --must-contain '身份证号,社保卡金融账户激活状态,交易金额,支付流水号,掌静脉,远程设备配置,外部调用日志'
```

Expected: `PASS Snowy admin blueprint checks`，无 FAIL；任何万能 CRUD、压缩字段或虚假覆盖 WARN 必须先修复。

- [ ] **Step 6: 提交蓝图**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-page-blueprint.md'
git commit -m 'docs: add fyy admin prototype blueprint'
```

### Task 4: 生成 Snowy 后管低保真 HTML

**Files:**
- Copy from: `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html`
- Read: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- Reference only: `codex/fyy-requirement-breakdown:docs/design/FY-20260708-UNICARD-admin-low-fidelity.html`

**Interfaces:**
- Consumes: 通过 Task 3 校验的蓝图。
- Produces: Snowy Demo v2 结构的可交互后管原型和内嵌覆盖矩阵。

- [ ] **Step 1: 校验原始 Demo 模板**

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\snowy-admin-prototype-designer\scripts\validate_admin_prototype.py' `
  --template '.codex\skills\snowy-admin-prototype-designer\assets\prototype-demo-framework\index.html'
```

Expected: `PASS basic Snowy admin template checks`；模板自身的开发提示 WARN 可接受。

- [ ] **Step 2: 复制 Demo 模板**

```powershell
New-Item -ItemType Directory -Force -Path 'docs\design' | Out-Null
Copy-Item -LiteralPath '.codex\skills\snowy-admin-prototype-designer\assets\prototype-demo-framework\index.html' `
  -Destination 'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html' -Force
```

- [ ] **Step 3: 按蓝图替换业务模型**

将模板中的系统标题、Logo 简称、菜单、页面模型、查询字段、表格列、详情、新增/编辑、操作、状态、权限、页面需求和覆盖矩阵替换为“宁波市高校一卡通专区”内容。必须保留：

```text
snowy-admin-prototype-v2
prototypeMeta
.snowy-sider
.snowy-header
.tabs-row
query-card
toolbar
a-table
a-drawer
a-modal
annotation-toolbar
node-comment-pin
pageRequirements
saveAsAnnotatedHtml
```

历史原型只能用于核对已经验证过的页面交互，不得恢复 H5 文件、历史流程状态或与当前蓝图不一致的字段。

- [ ] **Step 4: 实现逐页专属交互**

每个页面的查询、重置、详情、允许的新增/编辑/删除、导入、导出、审核、授权、状态切换、分页和异常反馈必须与蓝图一致。身份证号、手机号使用脱敏文本；金额右对齐；状态使用标签；启停使用开关；图片使用缩略图与上传预览；权限范围使用角色、组织或资源树形态。

- [ ] **Step 5: 执行静态原型校验**

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\snowy-admin-prototype-designer\scripts\validate_admin_prototype.py' `
  --must-contain '学生管理,社保卡金融账户激活状态,支付流水号,掌静脉,远程设备配置,外部调用日志,原型需求覆盖矩阵' `
  'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html'
```

Expected: `PASS basic Snowy admin prototype checks`，无 FAIL；泛化字段 WARN 必须人工确认不存在万能字段集。

### Task 5: 执行运行时与覆盖矩阵验收

**Files:**
- Verify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html`
- Verify: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- Verify: `docs/prd/FY-20260714-UNICARD-prd.md`

**Interfaces:**
- Consumes: Task 2 至 Task 4 的全部 Product 产物。
- Produces: 可记录到需求状态文件的静态、运行时、覆盖和编码验证证据。

- [ ] **Step 1: 执行浏览器运行时检查**

```powershell
$env:NODE_PATH = 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  '.codex\skills\snowy-admin-prototype-designer\scripts\runtime_check_admin_prototype.mjs' `
  'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html'
```

Expected: `PASS runtime browser check`；不得出现 `PAGEERROR`、`CONSOLE ERROR`、空白页、核心按钮点击失败或持久化失败。

- [ ] **Step 2: 核对覆盖矩阵与 H5 延期状态**

```powershell
$admin = Get-Content -LiteralPath 'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html' -Encoding UTF8 -Raw
$prd = Get-Content -LiteralPath 'docs\prd\FY-20260714-UNICARD-prd.md' -Encoding UTF8 -Raw
$adminIds = @('ADM-S-001','ADM-S-020','ADM-P-001','ADM-P-013','API-001','API-008','PAM-001','PAM-008')
foreach ($id in $adminIds) {
  if (-not $admin.Contains($id)) { throw "admin prototype missing $id" }
}
foreach ($id in @('H5-001','H5-013')) {
  if (-not $prd.Contains($id)) { throw "PRD missing deferred $id" }
  if ($admin.Contains($id)) { throw "admin prototype incorrectly includes $id" }
}
```

Expected: exit code `0`，后管关键编号存在，H5 仅存在于 PRD 延期范围。

- [ ] **Step 3: 核对 UTF-8 和禁止词**

```powershell
$files = @(
  'docs\prd\FY-20260714-UNICARD-prd.md',
  'docs\prd\FY-20260714-UNICARD-prd.html',
  'docs\design\FY-20260714-UNICARD-admin-page-blueprint.md',
  'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html'
)
foreach ($file in $files) {
  $content = Get-Content -LiteralPath $file -Encoding UTF8 -Raw
  if ($content -match '�|锟斤拷|涓|鏂') { throw "encoding issue: $file" }
}
$html = Get-Content -LiteralPath 'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html' -Encoding UTF8 -Raw
if ($html -match 'annotation-card|currentConfig|接口/mock|开发实现') { throw 'forbidden prototype marker found' }
```

Expected: exit code `0`。

- [ ] **Step 4: 提交后管原型**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity.html'
git commit -m 'docs: add fyy Snowy admin prototype'
```

### Task 6: 更新 Product 阶段状态

**Files:**
- Modify: `docs/workflow/requirements/20260714-fyy-tender-completion.md`
- Modify: `docs/workflow/status.md`

**Interfaces:**
- Consumes: Task 1 至 Task 5 的验证证据。
- Produces: Product 阶段已完成记录和 UI/Figma 决策门禁。

- [ ] **Step 1: 更新需求状态文件**

将当前阶段改为 `UI/Figma 决策`，并记录：

```text
Product 产物: 已完成
H5 设计: 已跳过
H5 跳过原因: 开发者明确暂不考虑 H5 设计，且不采用未跟踪 project/h5 作为正式基线
产物: PRD Markdown/HTML、后管页面蓝图、后管低保真原型
蓝图校验: PASS
原型静态校验: PASS
运行时校验: PASS
缓存更新: 无需更新，Product 阶段未产生已验证代码模式
下一步: UI/Figma 决策
```

- [ ] **Step 2: 更新全局需求索引**

把 `docs/workflow/status.md` 中本需求的当前阶段更新为 `UI/Figma 决策`，状态更新为 `需确认`。

- [ ] **Step 3: 验证状态与实际文件一致**

```powershell
$required = @(
  'docs\prd\FY-20260714-UNICARD-prd.md',
  'docs\prd\FY-20260714-UNICARD-prd.html',
  'docs\design\FY-20260714-UNICARD-admin-page-blueprint.md',
  'docs\design\FY-20260714-UNICARD-admin-low-fidelity.html'
)
foreach ($file in $required) {
  if (-not (Test-Path -LiteralPath $file)) { throw "missing artifact: $file" }
}
rg -n 'UI/Figma 决策|Product 产物.*已完成|H5.*已跳过' `
  'docs\workflow\requirements\20260714-fyy-tender-completion.md' `
  'docs\workflow\status.md'
```

Expected: 四个产物存在，状态文件能检索到 Product 完成、H5 跳过和下一阶段。

- [ ] **Step 4: 提交状态记录**

```powershell
git add -- 'docs/workflow/requirements/20260714-fyy-tender-completion.md' 'docs/workflow/status.md'
git commit -m 'docs: record fyy Product artifacts'
```

### Task 7: Product 阶段最终复核

**Files:**
- Verify: `docs/prd/FY-20260714-UNICARD-prd.md`
- Verify: `docs/prd/FY-20260714-UNICARD-prd.html`
- Verify: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- Verify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html`
- Verify: `docs/workflow/requirements/20260714-fyy-tender-completion.md`

**Interfaces:**
- Consumes: 全部 Product 产物和提交记录。
- Produces: 允许进入 UI/Figma 决策的证据摘要。

- [ ] **Step 1: 重跑全部强制校验**

依次重跑 Task 1 的需求校验、Task 3 的蓝图校验、Task 4 的原型静态校验、Task 5 的运行时检查和 UTF-8 检查。

Expected: 所有命令 exit code `0`，三个主要校验均输出 PASS。

- [ ] **Step 2: 检查 Git 范围**

```powershell
git status --short
git log -5 --oneline
```

Expected: Product 产物和状态文件已提交；`project/h5/` 仍保持原有未跟踪状态且未进入任何提交。

- [ ] **Step 3: 输出 Product 完成摘要**

摘要必须包含：PRD、蓝图、后管原型、框架参考、菜单覆盖、页面覆盖、字段/交互覆盖、覆盖矩阵、三个校验结果、H5 跳过记录、未决问题和是否允许进入 UI/Figma 决策。
