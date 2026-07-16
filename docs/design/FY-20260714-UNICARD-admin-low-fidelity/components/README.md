# 宁波市高校一卡通后管业务组件

本目录保留原始 Demo 抽取组件，并在 `business/` 下新增按业务形态组合的页面组件。新增组件沿用原始 `SnowyShell` 的布局类、Ant Design Vue 控件、查询卡片、表格卡片、抽屉、弹窗、状态和标注机制，不修改原始 Demo 组件的 DOM 与样式。

| 组件 | 来源与用途 | 验证 |
| --- | --- | --- |
| `SnowyUnicardDashboardPages` | 参考 Snowy 首页和原始 Demo 卡片密度；学校/平台指标与报表 | 模型映射、运行时切页和导出确认 |
| `SnowyUnicardContentPages` | 组合 Banner 查询/表格/图片预览与内容抽屉习惯；公告、文章、活动状态分离 | 内容页字段、上传预览移除、审核动作 |
| `SnowyUnicardReadonlyPages` | 参考 `sys/user` 同步只读查询；敏感字段脱敏 | 只读动作白名单、详情与受控导出 |
| `SnowyUnicardLogMonitorPages` | 参考 Snowy 日志页与监控状态卡 | 日志无 CRUD、设备异常状态和详情 |
| `SnowyUnicardPermissionGuidePages` | 参考 `sys/resource/menu` 与角色数据范围 | 路由、权限标识、角色和按钮权限 |

静态验证使用 `tests/verify-unicard-model.mjs`；浏览器交互验证使用 `tests/runtime-check-unicard.mjs`。
