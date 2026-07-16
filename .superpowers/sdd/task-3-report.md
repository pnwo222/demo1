# Task 3 实现报告

状态：DONE

## 交付物

- 新增：`docs/design/FY-20260714-UNICARD-admin-page-blueprint.md`
- 初始提交：`e95ca5d docs: add fyy admin prototype blueprint`
- 审查修复提交：`f22adf2 docs: tighten fyy admin blueprint semantics`
- 最终精修提交：`e5bc845 docs: finalize fyy admin blueprint details`
- Task 5 验收术语修复提交：`acbd074 docs: align pam feature page type`
- 最终原型覆盖证据提交：`6684695 docs: link admin coverage to verified prototype`
- 提交范围仅包含上述蓝图；未读取、修改或提交 `project/h5/`。

## 完成内容

- 记录 8 类 Snowy 框架参考，明确 `biz/notice`、`dev/slideshow`、`sys/user`、`sys/org`、`sys/role`、`sys/resource/menu`、`sys/user/impExp.vue` 的布局、表格、抽屉/弹窗、权限和状态复用方式。
- 建立 49 个后管独立页面的菜单映射：学校端 20、平台端 13、接口中心 8、PAM 8；路由统一为 `/unicard/**`，权限统一为 `unicardSchool*`、`unicardPlatform*`、`unicardInterface*`、`unicardPam*`。
- 每页均包含原始需求摘录、原子需求、同步/展示/筛选/详情/状态/敏感字段、页面结构、查询/表格/详情、新增/编辑/导入导出适用性、操作交互、异常、权限差异及覆盖矩阵行。
- H5-001 至 H5-013 仅记录“需求保留、设计延期”范围决策，不生成 H5 页面、蓝图条目或覆盖矩阵行。
- 人工清理历史底稿中的实质问题：
  - 学生、教职工及其他同步只读页不再提供虚假新增、编辑、删除。
  - ADM-P-005 仅配置既有模块的显示名称、图标和排序，不虚构模块新增、删除。
  - API-001 至 API-008 改为只读调用状态与日志详情；校验、去重和异常拦截由接口服务自动执行，不提供人工调用或业务数据维护。
  - PAM-002、PAM-005、PAM-006、PAM-007、PAM-008 分别按生物特征受控管理、实时同步只读、导入导出、远程设备配置和日志/分级授权重新建模，移除通用 CRUD。
  - 覆盖矩阵不提前宣称 HTML 已实现，统一注明 HTML 待 Task 4 实现与校验。

## 验证证据

```text
validate_admin_blueprint.py --must-contain ...
PASS Snowy admin blueprint checks

页面数：49
覆盖矩阵行：49
H5 页面数：0
禁止压缩/乱码词命中：0
异常路由或权限前缀：0
只读页新增/编辑/删除操作：0
API 人工接口调用/字段校验按钮：0
缺失同步字段、敏感字段或导入导出适用性行：0
git diff --cached --check：无错误
```

最终校验命令：

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' `
  '.codex\skills\snowy-admin-prototype-designer\scripts\validate_admin_blueprint.py' `
  'docs\design\FY-20260714-UNICARD-admin-page-blueprint.md' `
  --must-contain '身份证号,社保卡金融账户激活状态,交易金额,支付流水号,掌静脉,远程设备配置,外部调用日志'
```

## 后续输入与未决项

- Task 4 应以本蓝图的菜单映射、逐页字段和覆盖矩阵生成 HTML，并将当前“HTML 待 Task 4”逐项落到真实 UI 和交互。
- 接口协议、枚举、错误码、签名算法、SLA、审核动作边界、PAM 内建/外部边界仍按 PRD 标记待确认；本任务未虚构结论。
- 工作区中的 `project/h5/` 保持用户原有未跟踪状态。

## Task 3 审查修复

审查结论中的 P1/P2 已全部处理：

- 全量审计 49 页并重建只读、同步、监控、分组、权限说明和 API 页操作契约；移除人工“同步”“数据对接”、无来源删除确认、通用更新当前记录和人工接口调用。
- “查看”类动作均改为页面专属只读详情、日志详情、指标详情或路由导航，数据变化明确为“无”或“仅切换路由”。
- 页面可见角色、原子权限、操作按钮权限和覆盖矩阵角色统一；内容审核、PAM 特征采集、文件导入导出、远程设备配置和分级授权按职责拆分按钮角色。
- ADM-P-012 固定为平台管理员、审核人员；学校端角色按菜单映射收敛。
- 23 个敏感数据页面建立“列表脱敏—明文权限—访问审计—受控导出”规则；重点补齐 ADM-S-012、ADM-S-015、ADM-S-017、API-007。
- 覆盖矩阵 49 行统一区分 `蓝图覆盖：已覆盖；原型覆盖：待 Task 4 实现`，不提前声明 HTML 原型已覆盖。
- 页面查询、表格、详情和新增/编辑表单按字段语义生成控件说明；ADM-P-005 移除无来源状态字段，仅维护既有模块显示名称、图标、排序及关联关系查看。

审查后最终证据：

```text
PASS Snowy admin blueprint checks
pages=49
coverageRows=49
h5Pages=0
falseOps=0
readDeletePopups=0
roleIssues=0
sensitiveIssues=0
coverageIssues=0
genericPhrases=0
moduleStatusFields=0
```

## Task 3 最终精修

- 49 个页面的工具栏、操作列、导入导出和原子操作均改为真实按钮名称、按钮样式及点击结果；清除 `执行对应操作或刷新展示`、`执行当前行页面专属操作`、`文字按钮/危险按钮`、`页面专属弹窗或不适用`、`页面专属按钮/链接` 等占位描述。
- API-001 至 API-008 按接口业务重建查询字段、表格字段、详情字段、字段类型、语义示例和校验规则，字段所属区域均非空且不再复用无关业务字段。
- API-005 仅展示关联请求标识、认证场景、认证结果和脱敏人员标识等元数据；电子社保码凭证只作为瞬时校验输入，不采集、不落日志、不进入查询/表格/详情、不可明文展示且不存在明文查看权限。
- PAM-002 仅展示不可逆模板标识、版本、状态、容量及登记时间等元数据；掌静脉真实模板不进入 UI、日志或导出，永不展示且不存在明文权限。
- ADM-P-005 查询区仅保留模块名称和显示名称；模块名称/显示名称为文本，图标为图标预览与选择器，排序为数值与数字输入框，不设置状态伪字段。
- 抽样检查每类至少两页：学校端 `ADM-S-003`、`ADM-S-009`；平台端 `ADM-P-005`、`ADM-P-012`；接口中心 `API-002`、`API-005`；PAM `PAM-002`、`PAM-007`。抽样同时修正学校端身份证筛选控件为输入后掩码的文本输入框。

最终精修审计：

```text
PASS Snowy admin blueprint checks
pages=49
coverage=49
h5Pages=0
generic=0
apiEmptyRegions=0
api5RawUi=0
api5PlaintextPermission=0
pam2RawUi=0
pam2PlaintextPermission=0
p5BadQuery=0
p5StatePseudoFields=0
actionConsistency=0
mojibake=0
API-005 边界声明存在：true
PAM-002 边界声明存在：true
git diff --cached --check：无错误
```

## Task 5 独立验收修复

- 将 PAM-002 逐页蓝图的页面类型从“敏感元数据管理”统一为菜单映射和原型采用的“敏感配置管理”。
- 全文件 `敏感元数据管理` 残留为 0；PAM-002 逐页页面类型 `敏感配置管理` 为 1。
- 复验结果：`PASS Snowy admin blueprint checks`，页面数 49，覆盖矩阵行 49，`git diff --cached --check` 无错误。
- 提交仅包含蓝图单行术语修复；未读取、修改或提交 `project/h5/`。

## 最终原型覆盖矩阵修复

- 基于 `docs/design/FY-20260714-UNICARD-admin-low-fidelity.html` 中最终 49 个 `pageSpecs`，将覆盖矩阵 49 行统一更新为“蓝图覆盖：已覆盖；原型覆盖：已覆盖”。
- 每行均提供独立定位证据：`pageSpecs[id=<页面ID>]`、对应 `route` 和完整菜单路径，不使用范围行代替逐页覆盖证明。
- 蓝图逐页段与原型 `pageSpecs` 的页面 ID、route、权限标识、可见角色和动作集合逐页比对，差异为 0；矩阵 ID 共 49 个且无重复、无缺失。

最终验证证据：

```text
PASS Snowy admin blueprint checks
PASS basic Snowy admin prototype checks
pageSpecs=49
blueprintPages=49
idRoutePermissionRoleActionIssues=0
matrixRows=49
uniqueMatrixIds=49
evidenceIssues=0
pendingPrototype=0
coveredPrototype=49
mojibake=0
git diff --cached --check：无错误
```

- 独立提交仅包含蓝图覆盖矩阵；未修改后管 HTML，未读取、修改或提交 `project/h5/`。
