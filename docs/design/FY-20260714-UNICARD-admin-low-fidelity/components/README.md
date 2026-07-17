# 宁波市高校一卡通后管业务组件

本目录保留原始 Demo 抽取组件，并在 `pages/` 下按需求编号提供 32 个独立页面组件，在 `business/` 下提供壳、节点评论和学校首页 ECharts 图表等组合组件。新增组件沿用原始 `SnowyShell` 的布局类、Ant Design Vue 控件、查询卡片、表格卡片、抽屉、弹窗、状态和标注机制，不修改原始 Demo 组件的 DOM 与样式。

| 组件 | 来源与用途 | 验证 |
| --- | --- | --- |
| `SnowyUnicardSchoolDashboardCharts` | 按 ADM-S-001 展示专区用户、校园用户、活跃用户和社保卡码应用数据 | ECharts 折线图、柱状图、Tooltip、图例、响应式缩放与空状态 |
| `SnowyUnicardContentPages` | 组合 Banner 查询/表格/图片预览与内容抽屉习惯；公告、文章、活动状态分离 | 内容页字段、上传预览移除、审核动作 |
| `SnowyUnicardReadonlyPages` | 参考 `sys/user` 同步只读查询；敏感字段脱敏 | 只读动作白名单、详情与受控导出 |
| `SnowyUnicardLogMonitorPages` | 参考 Snowy 日志页与监控状态卡 | 日志无 CRUD、设备异常状态和详情 |
| `SnowyUnicardPermissionGuidePages` | 参考 `sys/resource/menu` 与角色数据范围 | 路由、权限标识、角色和按钮权限 |
| `SnowyUnicardGovernancePages` | 参考 `sys/org`、`sys/user`、`sys/resource/menu` | 组织树、用户、模块、菜单 CRUD 与引用校验 |
| `SnowyUnicardRoleGrantPage` | 参考 `sys/role` 的资源树和数据范围 | 越权、自我提权、变更前后值与确认 |
| `SnowyUnicardAuditPage` | 参考 Snowy 只读日志页面 | 审核对接数据只读、状态与详情 |
| `SnowyUnicardPageOutlet` | 按需求编号明确分发 32 个独立页面，不读取字段名推断页面 | 32 个页面契约与未知页面错误态 |
| `SnowyUnicardShell` | 等价复用原始 `SnowyShell` 的侧栏、顶部栏、页签和内容区 | 32 个独立页面、ADM-S-002 菜单分组、角色切换和页面切换 |
| `SnowyUnicardBusinessDrawers` | 按逐页契约展示内容/治理表单和只读详情；复用 Ant Drawer/Upload | 页面字段、上传预览移除、保存与关闭 |

静态验证使用 `tests/verify-unicard-model.mjs`；浏览器交互验证使用 `tests/runtime-check-unicard.mjs`。
