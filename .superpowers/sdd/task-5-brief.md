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

