# Task 1：冻结需求覆盖基线验证报告

## 执行范围

- 任务简报：`.superpowers/sdd/task-1-brief.md`（已一次性完整读取）。
- 基线分支：`codex/fyy-tender-completion-integration`。
- 基线提交：`e27c9a1 docs: add fyy tender requirement baseline`。
- 已核对材料：
  - `docs/requirements/纺院需求.md`
  - `docs/superpowers/specs/2026-07-15-fyy-product-design.md`
  - `docs/tenders/纺院标书技术部分.extract.txt`
  - `project/docs/patterns/frontend-crud-pattern.md`
  - `project/docs/patterns/feature-capability-map.md`
- 边界：仅进行需求基线只读验证；未读取、修改、暂存或提交 `project/h5/`。

## Step 1：需求明细校验

命令：

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\tender-requirement-reader\scripts\validate_requirement_detail.py' `
  'docs\requirements\纺院需求.md'
```

输出摘要：

- 退出码：`0`。
- `FAIL_TOTAL=0`。
- `WARN_TOTAL=71`，其中模糊短语 WARN 66 条、同步/只读动作 WARN 5 条。
- 最后一行：`PASS requirement detail checks`。

### WARN 人工复核结论

1. 66 条 `WARN vague phrase needs review: 卡状态`：均为校验器规则 `r"卡状态"` 对明确业务字段的子串命中，例如“社保卡状态”“社保绑卡状态”“省内持卡状态”。这些字段在需求摘要、严格原子需求明细或字段清单中有明确语义和来源，不是“等状态”式压缩写法；未发现字段遗漏。
2. `H5-008 ... action without source tag: 新增`：误报。命中的是“新增字段”这一原子类型，不是无来源新增操作。姓名、身份证号、手机号、访问时间、通行方式、车牌、拜访人、访问缘由、备注均来自 P0068；真正操作“提交预约”已标记为`需求明确`，审核数据同步来自 P0067。
3. `ADM-S-010 ... action without source tag: 审核`：误报。“审核”仅出现在来源明确的“审核状态”字段中，并非审核操作。标书 P0142 明确新增、编辑、删除、筛选查看及审核状态字段；四项真实操作均已标记为`需求明确`。
4. `ADM-S-011 ... action without source tag: 审核`：误报。“审核状态”被标记为`待确认`，不是虚构审核操作。标书 P0148 明确新增、编辑修改、删除、筛选查看及按身份标签选择可见范围；真实操作均有来源标记。
5. `ADM-S-015 ... action without source tag: 审核`：误报。“审核状态”是 P0163 明确要求的展示/状态字段，页面真实操作“查看、导出”均已标记为`需求明确`，不存在审核操作扩写。
6. `ADM-P-010 ... action without source tag: 审核`：误报。“审核中心”是 P0223 明确要求的数据对接模块名，不是审核操作；真实操作“数据对接、监控”均已标记为`需求明确`。

人工复核总评：WARN 不包含字段遗漏或无来源操作，不构成 Task 1 阻塞项。

## Step 2：五类原子需求数量

命令：

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

输出：

```text
H5=13
ADM-S=20
ADM-P=13
API=8
PAM=8
```

结论：五类计数与 Task 1 固定覆盖计数完全一致，共 62 个原子需求。

## Step 3：H5 跳过边界

命令：

```powershell
rg -n 'H5 设计|H5 原型|project/h5' 'docs\superpowers\specs\2026-07-15-fyy-product-design.md'
```

输出摘要：

```text
14:| H5 框架 | 不采用当前未跟踪的 `project/h5/` 作为正式基线 |
15:| H5 设计 | 本阶段明确跳过，不生成 H5 页面蓝图或 H5 原型 |
31:本阶段不生成 H5 原型、Figma 稿、技术架构、数据库方案或业务代码。
142:- 不生成 H5 原型，也不把 H5 页面混入后管原型。
156:- H5 页面设计与 H5 原型。
```

结论：规格明确同时满足“不采用 `project/h5/`”“跳过 H5 设计”“不生成 H5 原型”三项边界；H5 需求仅保留在延期范围和需求追踪中。

## 文件变更与提交

- P2 审查修复：将 `docs/requirements/纺院需求.md` 原第 1196 行修正为 `| 状态字段 | 审核状态 | 待确认 | 状态展示 |`，原第 2102 行修正为 `| 状态字段 | 对接状态 | 待确认 | 状态展示 |`；均保留来源为“待确认”，消除多余的第五个表格单元格。
- 修复验证：需求校验退出码为 `0`，最后一行为 `PASS requirement detail checks`；两处修正行上下文正常，旧的 `待确认 | 需求明确` 5 列模式无匹配。
- 文件变更：`docs/requirements/纺院需求.md` 仅修改上述两行；新增并更新 `.superpowers/sdd/task-1-report.md`。
- 暂存：无。
- 提交：`b15ffa8 docs: fix requirement status table rows`，仅包含 `docs/requirements/纺院需求.md`，未包含 `.superpowers/` 或 `project/h5/`。

## 最终状态

`DONE`

需求明细校验通过，固定计数匹配，H5 跳过边界清晰；WARN 已完成人工复核且无真实缺陷。
