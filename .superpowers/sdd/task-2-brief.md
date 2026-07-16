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

