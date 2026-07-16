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
