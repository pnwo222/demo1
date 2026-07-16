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

