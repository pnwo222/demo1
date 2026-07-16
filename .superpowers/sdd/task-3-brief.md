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

