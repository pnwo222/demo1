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

