# 纺院一卡通后管原型重画实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有单文件后管原型重画为基于 Snowy 原始 Demo 金标和预设组件的多文件原型，覆盖学校端 20 页和平台端 13 页，并明确跳过接口中心、PAM 与 H5 原型。

**Architecture:** 使用 `build-prototype.mjs` 复制完整 `snowy-runtime-components-v1` 运行时，保留原始组件和标注基础设施。业务层按学校端与平台端拆分页面契约，再按看板、内容、只读查询、组织权限、日志监控和审核授权组合独立业务组件；新 `SnowyUnicardShell` 保持金标壳 DOM/类名，只把内容出口替换为业务页面出口，不修改原始 `SnowyShell`。

**Tech Stack:** HTML5、Vue 3.5.13 CDN、Ant Design Vue 4.2.6 CDN、Day.js、JavaScript IIFE 模块、CSS、Python 校验脚本、Node.js、Playwright/Edge。

## Global Constraints

- Product 大规模原型执行必须由单一 Owner 内联完成；不得使用 `subagent-driven-development`、Product worktree 或逐文件独立审查。
- 业务事实以 `docs/requirements/纺院需求.md`、当前 PRD 和已验证页面蓝图为准。
- 本轮原型只包含 `ADM-S-001`～`ADM-S-020`、`ADM-P-001`～`ADM-P-013`，共 33 页。
- `API-001`～`API-008`、`PAM-001`～`PAM-008` 在覆盖矩阵标记 `不适用`，原因固定为“用户明确跳过本次原型；需求和 PRD 保留”。
- `H5-001`～`H5-013` 继续“需求保留、设计延期”，不得进入后管菜单、页面模型或原型覆盖行。
- 必须通过 `build-prototype.mjs` 创建 `docs/design/FY-20260714-UNICARD-admin-low-fidelity/`。
- `golden/original-demo.html` 和仓库级 `prototype-demo-framework/components/` 不得修改。
- 目标目录保留原始组件，新增业务组件只写入目标目录并登记 `registry.js`、`index.html`、`component-manifest.json` 和 `components/README.md`。
- 禁止旧 `pageSpecs`、万能 Schema、`currentConfig`、字段名猜测和万能 CRUD/抽屉。
- 旧 `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html` 只保留轻量跳转，不得保留旧 Vue/Schema/业务脚本。
- 自动标注绑定具体字段、列、按钮或状态节点；不迁移旧手工评论。
- 所有文本文件使用 UTF-8；不修改或提交 `project/h5/`。

## 文件结构

| 文件或目录 | 职责 |
| --- | --- |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html` | 轻量入口，按清单顺序引用样式、数据、组件、状态和主程序 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/component-manifest.json` | `snowy-runtime-components-v1` 文件清单和 SHA-256 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/styles/snowy-prototype.css` | 从 Demo 复制的受保护基础样式 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/styles/unicard-business.css` | 业务页面补充样式，不覆盖基础类的尺寸、间距和控件规则 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/prototype-data.js` | 系统名称、Logo、Demo 基础数据兼容层 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/prototype-state.js` | 原始标注、页面需求、本地持久化和另存为状态能力 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/main.js` | 创建 Vue 应用并挂载 `SnowyUnicardShell` 与原始抽屉/弹窗 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/school-pages.js` | 20 个学校端页面的逐页契约和样例数据 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/platform-pages.js` | 13 个平台端页面的逐页契约和样例数据 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/page-requirements.js` | 33 页整体需求说明 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/page-annotations.js` | 33 页具体节点自动标注基线 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/coverage-data.js` | 33 条已覆盖和 16 条不适用覆盖记录 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/` | 看板、内容、只读查询、组织权限、日志监控、审核授权业务组合组件目录 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/registry.js` | 注册原始组件和新增业务组件 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/README.md` | 原始组件复用清单、新增组件来源和用途 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/coverage.html` | 49 行原型覆盖矩阵评审页 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs` | 静态验证页面、字段、权限、覆盖和禁用旧引擎 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/runtime-check-unicard.mjs` | 浏览器验证 33 页和关键交互 |
| `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html` | 兼容跳转入口 |

---

### Task 1: 冻结 33 页重画范围并更新蓝图/PRD

**Files:**
- Create: `.superpowers/fyy-admin-redesign/verify-scope.ps1`
- Modify: `docs/prd/FY-20260714-UNICARD-prd.md`
- Modify: `docs/prd/FY-20260714-UNICARD-prd.html`
- Modify: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`

**Interfaces:**
- Consumes: 已确认规格 `docs/superpowers/specs/2026-07-16-fyy-admin-prototype-redesign.md`。
- Produces: 33 个本次原型页面、16 个明确不适用页面和 H5 延期边界，供后续数据模块与覆盖矩阵消费。

- [ ] **Step 1: 写入范围校验脚本并先验证旧产物不满足新范围**

在 `.superpowers/fyy-admin-redesign/verify-scope.ps1` 写入：

```powershell
$blueprint = Get-Content -LiteralPath 'docs/design/FY-20260714-UNICARD-admin-page-blueprint.md' -Encoding UTF8 -Raw
$prd = Get-Content -LiteralPath 'docs/prd/FY-20260714-UNICARD-prd.md' -Encoding UTF8 -Raw
$covered = [regex]::Matches($blueprint, '原型覆盖：已覆盖').Count
$notApplicable = [regex]::Matches($blueprint, '原型覆盖：不适用').Count
if ($covered -ne 33) { throw "expected 33 covered admin pages, got $covered" }
if ($notApplicable -ne 16) { throw "expected 16 skipped API/PAM pages, got $notApplicable" }
if ($prd -notmatch '学校端 20 页、平台端 13 页') { throw 'PRD redraw scope missing' }
if ($prd -notmatch '接口中心 8 页、PAM 8 页.*用户明确跳过本次原型') { throw 'PRD skipped scope missing' }
```

Run:

```powershell
& '.superpowers/fyy-admin-redesign/verify-scope.ps1'
```

Expected: FAIL，指出旧蓝图仍有 49 条原型已覆盖记录。

- [ ] **Step 2: 更新 PRD Markdown 与 HTML 的重画范围**

在“本期范围与延期范围”后增加同义内容：

```text
后管原型重画范围：学校端 20 页、平台端 13 页，共 33 页。
接口中心 8 页、PAM 8 页：用户明确跳过本次原型；需求和 PRD 保留。
H5 13 项：需求保留、设计延期。
```

HTML 必须使用相同中文，不改变 62 项需求正文和菜单/权限表。

- [ ] **Step 3: 更新蓝图总览和 49 行覆盖矩阵**

保留 49 个页面蓝图正文；将 `API-001`～`API-008`、`PAM-001`～`PAM-008` 的矩阵状态改为：

```text
蓝图覆盖：已覆盖；原型覆盖：不适用；原因：用户明确跳过本次原型；需求和 PRD 保留
```

`ADM-S-*` 和 `ADM-P-*` 的 33 行保持原型覆盖 `已覆盖`，但证据定位改为新目录页面 ID、route 和业务组件键。

- [ ] **Step 4: 运行范围和蓝图校验**

Run:

```powershell
& '.superpowers/fyy-admin-redesign/verify-scope.ps1'
& 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' `
  '.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_blueprint.py' `
  'docs/design/FY-20260714-UNICARD-admin-page-blueprint.md'
```

Expected: 范围脚本 exit 0；蓝图输出 `PASS Snowy admin blueprint checks`。

- [ ] **Step 5: 提交范围变更**

```powershell
git add -- 'docs/prd/FY-20260714-UNICARD-prd.md' 'docs/prd/FY-20260714-UNICARD-prd.html' 'docs/design/FY-20260714-UNICARD-admin-page-blueprint.md'
git commit -m 'docs: scope fyy admin prototype redraw'
```

### Task 2: 从原始 Demo 构建多文件原型骨架

**Files:**
- Create directory: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/`
- Read: `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html`
- Read: `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/component-manifest.json`
- Read: `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/components/README.md`
- Read: `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/golden/original-demo.html`

**Interfaces:**
- Consumes: `build-prototype.mjs` 和 `snowy-runtime-components-v1` 清单。
- Produces: 哈希有效、可直接 `file://` 打开的完整 Demo 运行时副本。

- [ ] **Step 1: 验证源模板和目标目录前置状态**

```powershell
$py='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& $py '.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_prototype.py' `
  --template '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html'
if (Test-Path 'docs/design/FY-20260714-UNICARD-admin-low-fidelity') { throw 'target directory already exists; inspect before rebuilding' }
```

Expected: `PASS Snowy runtime component contract (template)`；目标目录不存在。

- [ ] **Step 2: 使用官方构建脚本复制运行时**

```powershell
& 'C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' `
  '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/build-prototype.mjs' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
```

Expected: `PASS runtime component prototype:`，目标包含入口、样式、app、components 和清单。

- [ ] **Step 3: 验证复制件与源组件逐项一致**

```powershell
$source='.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework'
$target='docs/design/FY-20260714-UNICARD-admin-low-fidelity'
$manifest=Get-Content -LiteralPath "$target/component-manifest.json" -Encoding UTF8 -Raw | ConvertFrom-Json
$files=@($manifest.entry)+@($manifest.styles.file)+@($manifest.app.file)+@($manifest.components.file | ForEach-Object { "components/$_" })
foreach($file in $files){
  $a=(Get-FileHash -Algorithm SHA256 -LiteralPath "$source/$file").Hash
  $b=(Get-FileHash -Algorithm SHA256 -LiteralPath "$target/$file").Hash
  if($a -ne $b){throw "copied runtime mismatch: $file"}
}
```

Expected: exit 0。

- [ ] **Step 4: 提交纯运行时骨架**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
git commit -m 'docs: scaffold fyy Snowy prototype runtime'
```

### Task 3: 建立 33 页业务契约、需求说明、标注和覆盖数据

**Files:**
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/school-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/platform-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/page-requirements.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/page-annotations.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/modules/coverage-data.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/component-manifest.json`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`

**Interfaces:**
- Produces: `window.UnicardSchoolPages`, `window.UnicardPlatformPages`, `window.UnicardPageRequirements`, `window.UnicardPageAnnotations`, `window.UnicardCoverageData`。
- Page contract fields: `id`, `menuPath`, `route`, `permission`, `roles`, `pageType`, `componentKey`, `queryFields`, `tableFields`, `detailFields`, `formFields`, `actions`, `states`, `exceptions`, `sampleRows`。

- [ ] **Step 1: 先创建模型验证脚本并验证模块尚不存在**

`verify-unicard-model.mjs` 必须读取五个 IIFE 模块并断言：

```javascript
assert.equal(pages.length, 33);
assert.equal(new Set(pages.map(page => page.id)).size, 33);
assert.equal(pages.filter(page => /^ADM-S-/.test(page.id)).length, 20);
assert.equal(pages.filter(page => /^ADM-P-/.test(page.id)).length, 13);
assert.equal(coverage.filter(row => row.status === '已覆盖').length, 33);
assert.equal(coverage.filter(row => row.status === '不适用').length, 16);
assert.equal(pages.some(page => /^(API|PAM|H5)-/.test(page.id)), false);
for (const page of pages) {
  assert.ok(page.route.startsWith('/unicard/'));
  assert.ok(page.permission.startsWith('unicard'));
  assert.ok(page.queryFields.every(field => field.source));
  assert.ok(page.tableFields.every(field => field.source && field.shape));
  assert.ok(page.actions.every(action => action.source && action.roles.length));
}
```

Run:

```powershell
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs'
```

Expected: FAIL，指出业务模块文件不存在。

- [ ] **Step 2: 逐页编写学校端和平台端契约**

模块采用 IIFE，只导出冻结数组。每个文件先直接声明蓝图中对应的完整页面对象，文件结尾必须使用：

```javascript
if (!Array.isArray(pages) || pages.length !== 20) {
  throw new Error('school page contracts must contain 20 pages');
}
global.UnicardSchoolPages = Object.freeze(pages.map(page => Object.freeze(page)));
```

平台端文件使用相同结尾检查，但页数固定为 13 并导出 `global.UnicardPlatformPages`。每页字段和动作必须直接抄录蓝图具体条目及来源标签；只读页面 `formFields` 为空数组，且不得出现无来源增删改。

- [ ] **Step 3: 编写 33 页需求说明和具体节点自动标注**

需求说明以页面 ID 为键。自动标注记录必须包含：

```javascript
{
  id: 'ADM-S-012-sensitive-id',
  pageId: 'ADM-S-012',
  nodeKey: 'ADM-S-012:table:证件号码',
  title: '敏感字段展示',
  summary: '证件号码在列表脱敏；明文查看和导出需要独立权限并记录审计。',
  source: '需求明确'
}
```

禁止使用 `query-card` 作为全部标注的共同 `nodeKey`。

- [ ] **Step 4: 编写 49 行覆盖数据**

33 条已覆盖记录包含 `pageId`、`route`、`componentKey`、字段、操作、状态、权限和证据；16 条接口/PAM 记录使用：

```javascript
{ id: 'API-001', status: '不适用', reason: '用户明确跳过本次原型；需求和 PRD 保留' }
```

- [ ] **Step 5: 在入口和清单中登记模块并运行模型测试**

模块脚本加载顺序：学校、平台、页面需求、标注、覆盖数据，然后加载组件和状态。把五个文件加入 `component-manifest.json` 的 `app` 数组，再运行清单刷新。

```powershell
node '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/refresh-component-manifest.mjs' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs'
```

Expected: `PASS 33 unicard admin page contracts and 49 coverage rows`。

- [ ] **Step 6: 提交业务契约**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
git commit -m 'docs: add fyy admin page contracts'
```

### Task 4: 实现学校端 20 页组件组合

**Files:**
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-dashboard-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-content-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-readonly-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-log-monitor-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-permission-guide-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/styles/unicard-business.css`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/registry.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/README.md`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs`

**Interfaces:**
- Produces Vue components: `SnowyUnicardDashboardPages`, `SnowyUnicardContentPages`, `SnowyUnicardReadonlyPages`, `SnowyUnicardLogMonitorPages`, `SnowyUnicardPermissionGuidePages`。
- Consumes: `activeBusinessPage`, `businessRows`, `businessQuery`, `businessPagination` and page-specific handlers from the prototype context。

- [ ] **Step 1: 扩展静态测试并验证学校端组件尚未登记**

新增断言：五个组件脚本存在、入口加载顺序正确、注册表包含五个组件、学校端 20 个页面 ID 都映射到明确 `componentKey`。

Expected: FAIL，指出业务组件缺失。

- [ ] **Step 2: 实现学校首页、分组入口和权限说明**

保持 Snowy 内容密度；学校首页提供明确时间筛选、指标、图表与受控导出；分组入口只导航到子页面；权限说明展示菜单、角色、数据范围和按钮权限，不提供维护按钮。

- [ ] **Step 3: 实现六个内容页面**

Banner、应用、首页模块、公告、文章、活动分别使用蓝图字段。Banner 和图片页面复用 `SnowyBannerQueryForm`、`SnowyBannerDataTable`、`SnowyContentFormDrawer` 和图片预览；公告使用独立提交审核/审核状态流；文章发布与首页推荐按角色分离；活动保留身份标签和可见范围。

- [ ] **Step 4: 实现学校端只读查询和监控页面**

学生、教职工、历史学生、社保卡申领、访客、通行、消费、借阅、用户页面各自渲染专属字段；敏感字段脱敏；社保卡与访客导出走受控确认；设备监控展示在线/离线/异常和业务报警，不提供远程配置。

- [ ] **Step 5: 登记组件并运行学校端静态测试**

```powershell
node '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/refresh-component-manifest.mjs' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs'
```

Expected: `PASS school pages 20/20 with page-specific fields and actions`。

- [ ] **Step 6: 提交学校端组件**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
git commit -m 'docs: implement fyy school admin prototype pages'
```

### Task 5: 实现平台端 13 页组件组合

**Files:**
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-governance-pages.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-role-grant-page.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-audit-page.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-dashboard-pages.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-log-monitor-pages.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-permission-guide-pages.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/registry.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/README.md`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs`

**Interfaces:**
- Produces Vue components: `SnowyUnicardGovernancePages`, `SnowyUnicardRoleGrantPage`, `SnowyUnicardAuditPage`，并扩展共享业务组件的平台分支。
- Consumes: 平台端 13 个逐页契约、组织树、资源树、角色范围、日志和监控数据。

- [ ] **Step 1: 扩展平台端失败测试**

断言 13 个页面都有非空组件键、具体字段、具体动作和角色权限；只读日志/监控没有新增编辑删除；角色授权含资源树和变更前后范围。

Expected: FAIL，指出平台业务组件尚未登记。

- [ ] **Step 2: 实现平台首页、学校、用户、角色、模块和菜单页面**

学校管理复用组织树形态；用户管理复用用户表格与角色分配；角色管理使用资源树和数据范围；模块管理只允许需求明确的显示名称、图标和排序配置；菜单管理使用资源树和按钮权限，不增加无来源动作。

- [ ] **Step 3: 实现日志、对接、审核和监控页面**

访问日志、操作日志、外部调用日志保持只读；请求参数脱敏。宁波一卡通对接与系统监控展示状态、最近时间、异常和详情，不提供外部系统维护 CRUD。审核中心为只读对接视图，审核动作边界保持待接口确认。

- [ ] **Step 4: 实现平台权限说明和角色差异**

平台管理员、审核人员、安全审计人员和设备运维人员的菜单/按钮必须按蓝图分离；安全审计人员原则上只读；设备运维人员不得访问社保卡敏感记录。

- [ ] **Step 5: 刷新清单并运行平台端静态测试**

```powershell
node '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/refresh-component-manifest.mjs' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs'
```

Expected: `PASS platform pages 13/13; permission and readonly checks pass`。

- [ ] **Step 6: 提交平台端组件**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
git commit -m 'docs: implement fyy platform admin prototype pages'
```

### Task 6: 装配业务壳、标注、覆盖页和兼容跳转

**Files:**
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-shell.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/business/unicard-page-outlet.js`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/coverage.html`
- Create: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/runtime-check-unicard.mjs`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/prototype-data.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/prototype-state.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/app/main.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/registry.js`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/components/README.md`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`
- Modify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html`

**Interfaces:**
- `SnowyUnicardShell`: 保持 `snowy-sider`、`snowy-header`、`tabs-row`、面包屑和内容区结构，内容区调用 `SnowyUnicardPageOutlet`。
- `SnowyUnicardPageOutlet`: 只负责按明确 `componentKey` 分发到已注册业务族组件，不读取字段名或生成万能表单。

- [ ] **Step 1: 创建运行时失败测试**

运行时测试至少断言：系统标题、2 个业务菜单组、33 个页面菜单、无 API/PAM/H5 菜单、页面切换、查询/重置、分页、详情、Banner 上传预览移除、公告提交审核/审核、角色授权、设备异常状态、权限过滤、页面需求、具体节点标注、刷新持久化和另存为。

Expected: FAIL，指出业务壳和页面出口尚未挂载。

- [ ] **Step 2: 装配业务壳与页面出口**

`SnowyUnicardShell` 从原始 `SnowyShell` 复制等价壳结构和类名，保留原始 `SnowyShell` 文件与注册；仅把内容区域的 Demo 页面切换替换为：

```html
<snowy-unicard-page-outlet></snowy-unicard-page-outlet>
<snowy-node-comment-composer></snowy-node-comment-composer>
```

页面出口只允许显式映射的业务组件键，未知键显示业务错误态，不回退到组件预设页。

- [ ] **Step 3: 更新系统元数据、状态和主程序**

系统名为“宁波市高校一卡通专区”，Logo 简称为“一卡通”。状态层接入 33 页菜单、逐页查询/分页/行数据/权限、页面需求和自动标注，并保留原始本地持久化、自动标注基线和另存为逻辑。

- [ ] **Step 4: 生成覆盖矩阵评审页**

`coverage.html` 直接加载 `coverage-data.js` 并展示 49 行；33 行 `已覆盖` 必须给出蓝图、路由、组件和交互证据；16 行 `不适用` 显示固定用户决策原因。

- [ ] **Step 5: 把旧单文件替换为轻量跳转入口**

旧文件只保留：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=FY-20260714-UNICARD-admin-low-fidelity/index.html" />
  <title>宁波市高校一卡通专区后管原型</title>
</head>
<body><a href="FY-20260714-UNICARD-admin-low-fidelity/index.html">打开新版多文件后管原型</a></body>
</html>
```

- [ ] **Step 6: 更新入口、注册表、说明和清单**

入口按“基础数据 → 业务模块 → 原始组件 → 新业务组件 → registry → 状态 → main”加载；`components/README.md` 记录每个新增组件的 Snowy/Demo 来源和验证用例。刷新清单后验证所有哈希。

- [ ] **Step 7: 运行运行时测试**

```powershell
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/runtime-check-unicard.mjs'
```

Expected: `PASS 33-page Snowy admin runtime and annotation workflow`，console/pageerror 为 0。

- [ ] **Step 8: 提交装配结果**

```powershell
git add -- 'docs/design/FY-20260714-UNICARD-admin-low-fidelity' 'docs/design/FY-20260714-UNICARD-admin-low-fidelity.html'
git commit -m 'docs: assemble fyy multi-file admin prototype'
```

### Task 7: 完成静态、运行时、覆盖与工作流验收

**Files:**
- Verify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html`
- Verify: `docs/design/FY-20260714-UNICARD-admin-low-fidelity/coverage.html`
- Verify: `docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- Modify: `docs/workflow/requirements/20260714-fyy-tender-completion.md`
- Modify: `docs/workflow/status.md`

**Interfaces:**
- Consumes: Task 1～6 产物。
- Produces: Product 原型重画完成证据和重新进入 UI/Figma 决策的状态。

- [ ] **Step 1: 运行蓝图、模板和目标原型校验**

```powershell
$py='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& $py '.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_blueprint.py' `
  'docs/design/FY-20260714-UNICARD-admin-page-blueprint.md'
& $py '.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_prototype.py' `
  --template '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html'
& $py '.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_prototype.py' `
  --must-contain '学生管理,社保卡金融账户激活状态,设备状态监控,外部调用日志,原型需求覆盖矩阵' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity/index.html'
```

Expected: 三项均输出 PASS，exit 0。

- [ ] **Step 2: 运行模型、业务运行时和原始 Demo 运行时检查**

```powershell
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/verify-unicard-model.mjs'
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/runtime-check-unicard.mjs'
$env:NODE_PATH='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
node 'docs/design/FY-20260714-UNICARD-admin-low-fidelity/tests/runtime-check-unicard.mjs'
```

Expected: 33 页模型 PASS、业务运行时输出 `PASS 33-page Snowy admin runtime and annotation workflow`。仓库自带 `runtime_check_admin_prototype.mjs` 面向旧单文件入口并会读取入口源码标记；本次轻量入口以自定义 Playwright 检查和实际浏览器检查作为多文件等价证据，不在 `index.html` 中伪造旧单文件源码标记。

- [ ] **Step 3: 检查组件哈希、UTF-8、旧引擎和跳过边界**

```powershell
$target='docs/design/FY-20260714-UNICARD-admin-low-fidelity'
node '.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/refresh-component-manifest.mjs' $target
rg -n 'pageSpecs|currentConfig|snowy-prototype-schema|active\.query|active\.details' $target
rg -n 'API-00[1-8]|PAM-00[1-8]|H5-0' "$target/app" "$target/components"
```

Expected: 清单刷新 PASS；旧引擎禁用词为 0；接口/PAM/H5 不出现在菜单和页面模块中，仅允许出现在 `coverage-data.js` 的不适用记录。

- [ ] **Step 4: 检查 Git 范围**

```powershell
git diff --check
git status --short
git log --oneline -- 'project/h5'
```

Expected: 交付文件已提交；`project/h5/` 仍为用户原有未跟踪目录且没有提交历史。

- [ ] **Step 5: 更新工作流状态**

状态文件记录：

```text
Product 原型重画: 已完成
页面覆盖: 学校端20、平台端13
本次原型不适用: 接口中心8、PAM8
H5: 需求保留、设计延期
原始组件复用: PASS
组件清单校验: PASS
蓝图校验: PASS
原型静态校验: PASS
运行时校验: PASS
下一步: UI/Figma 决策
```

- [ ] **Step 6: 提交验收与状态**

```powershell
git add -- 'docs/workflow/status.md' 'docs/workflow/requirements/20260714-fyy-tender-completion.md' `
  'docs/design/FY-20260714-UNICARD-admin-low-fidelity'
git commit -m 'docs: record fyy admin prototype redesign acceptance'
```

- [ ] **Step 7: 最终 Product 审查**

只做一次整体验收审查，重点检查：金标/组件能力保留、33 页字段和操作、16 条不适用、敏感数据、权限差异、标注节点绑定、旧跳转入口、无旧万能引擎、运行时错误为 0。Critical/Important/P0/P1 必须修复后重新验证；无害 WARN 记录即可。
