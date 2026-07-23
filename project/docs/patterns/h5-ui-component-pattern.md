# H5 UI 与组件模式缓存

## 参考入口

通用组件金标：`project/h5/src/views/demo/`

实际页面模式：`project/h5/src/views/`。页面结构选择必须先命中 `.codex/skills/snowy-h5-app-designer/references/actual-page-patterns.md`。

## 视觉基线

| 项 | 基线 |
| --- | --- |
| 设计视口 | 375px，兼容 320/390/414px |
| 主色 | `#2D65F0` |
| 页面背景 | `#F7F8FA` |
| 内容背景 | `#FFFFFF` |
| 卡片圆角 | 8px |
| 页面标题 | 18-20px |
| 分区标题 | 16px |
| 正文/辅助 | 14px / 12px |
| 间距 | 4px 基数，常用 8/12/16/24px |

## 组件选择顺序

1. 复用 `project/h5/src/components/`。
2. 组合 Vant 官方组件。
3. 参考 `/demo` 新增页面级组件。
4. 只有跨页面复用明确时才提升为全局组件。

## 已有组件

| 场景 | 优先组件 | 约束 |
| --- | --- | --- |
| 表单 | Vant Field/Cell/Form | 完整处理必填、禁用、错误、清空 |
| 密码 | `PasswordTip` | 与密码输入同步展示强度 |
| 上传 | `UploadFile` | 正式项目走上传服务；Demo 可覆盖 `after-read` 本地预览 |
| 普通选择 | `OpenApiPicker` | 可使用本地 columns 或 API |
| 日期/时间 | `OpenDatePicker`、`OpenTimePicker` | 使用底部浮层，确认后回填 |
| 日期范围 | `OpenMjDatePicker`、`OpenXfDatePicker` | 业务语义不同，不混为万能选择器 |
| 底部弹窗 | `OpenModal` | 必须可由遮罩和关闭按钮退出 |
| 圆形进度 | `CircleProgress` | 百分比限制 0-100 |
| 空状态 | `Empty` | 文案应符合具体业务 |
| 身份证拍摄 | `IdCardCamera` | 需相机权限和 HTTPS/localhost |

## 页面结构

- 页面入口放在 `src/views/<feature>/index.vue`。
- 页面内部组件放在 `src/views/<feature>/components/`。
- 页面入口负责数据装配和区块组合，不承载大段重复 UI。
- 独立详情、编辑、结果页使用独立路由，不用单页面无限切换状态模拟。
- 固定头部、底部导航和安全区必须在真实移动端视口验证。

## 原型设计规则

- 原型的字段和交互来自需求，实际业务页面提供页面结构和信息密度，Demo 只补充通用组件用法。
- 每个按钮均需可操作；不可用时展示禁用原因。
- 列表至少覆盖加载、正常、空、失败和分页/加载更多状态。
- 表单至少覆盖初始、校验错误、提交中、成功和失败状态。
- 涉及图片、文件、地图、相机时展示真实媒体形态，不用文字占位代替。
- HTML 原型必须使用 H5 专用多文件骨架和标注运行时，不复用桌面后管壳。
- 首页、列表、详情、记录、表单、多步骤、结果页、校园码和个人中心分别命中对应真实页面模式，不使用万能页面。
