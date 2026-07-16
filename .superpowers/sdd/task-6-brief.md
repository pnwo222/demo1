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

