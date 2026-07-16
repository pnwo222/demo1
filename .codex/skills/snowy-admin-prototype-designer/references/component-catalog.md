# Snowy 后管原型组件目录

业务原型只能在 Schema 中选择本目录登记的组件。组件注册表源码为 `assets/prototype-demo-framework/src/component-registry.js`，可运行示例为 `src/demo-schema.json`。

## 页面与布局

| 组件 | 用途 |
| --- | --- |
| `SnowyShell` | Snowy 后管整体壳 |
| `SnowyMenu` | 多级业务菜单 |
| `SnowyTabs` | 已访问页面页签 |
| `QueryForm` | `a-form + a-row + a-col` 查询区 |
| `PageToolbar` | 新增、批量、导入、导出和表格工具 |
| `DataTable` | 显式列配置、勾选、分页和操作列 |
| `TablePagination` | 表格分页 |
| `FormDrawer` | 新增/编辑表单抽屉 |
| `DetailDrawer` | 只读详情抽屉 |
| `ConfirmModal` | 删除和风险操作确认 |
| `ImportModal` | 导入弹窗 |
| `ImagePreview` | 图片预览 |
| `AnnotationLayer` | 标注、页面需求、本地持久化和另存为 |

## 查询与表单字段

| 组件 | 适用字段 |
| --- | --- |
| `Input` | 单行文本、编号、姓名、关键词 |
| `Textarea` | 说明、备注、长文本 |
| `Select` | 平铺枚举和状态选择 |
| `TreeSelect` | 组织、学院、菜单、区域等层级数据 |
| `DateRange` | 日期范围 |
| `DateTime` | 单个日期时间 |
| `NumberInput` | 排序、数量、比例等数字 |
| `ImageUpload` | 图片选择、预览和移除 |
| `FileUpload` | 附件选择、回显和移除 |
| `ImportUpload` | Excel/CSV 拖拽导入 |

## 表格与详情展示

| 组件 | 适用字段 |
| --- | --- |
| `Text` | 普通文本 |
| `MaskedText` | 身份证、手机号等敏感信息 |
| `Amount` | 右对齐金额/数值 |
| `StatusTag` | 业务状态枚举 |
| `Switch` | 是否显示、启用/停用等即时开关 |
| `Image` | 封面图、缩略图和空图占位 |
| `Avatar` | 用户头像 |
| `Attachment` | 文件名和附件入口 |
| `Progress` | 完成率和进度 |
| `Badge` | 带圆点的轻量状态 |
| `LongText` | 省略展示并通过悬浮查看全文 |

## 操作

| 组件 | 用途 |
| --- | --- |
| `LinkAction` | 详情、编辑、审核等行内普通操作 |
| `ButtonAction` | 工具栏普通命令 |
| `DangerAction` | 删除、批量删除等风险操作 |
| `IconAction` | 刷新、密度、列设置等图标工具 |

## Schema 约束

- 每个页面独立声明 `queryFields`、`columns`、`detailFields`、`createFields`、`editFields`、`toolbarActions` 和 `rowActions`。
- 每一项必须有唯一 `key` 和明确 `component`，字段文案、选项、必填、禁用、宽度等作为该项属性配置。
- 不得因为使用共享渲染组件而缩减业务字段；共享的是稳定 UI 实现，不是业务字段集合。
- 自动标注的 `nodeKey` 必须绑定具体查询字段、列、按钮、状态或抽屉字段，不得统一绑定整个查询卡片或页面。

## 扩展规则

- 仅样式/语义别名：在 Schema 的 `extensions` 中声明 `name` 和已注册的 `baseComponent`。
- 全新展示或交互：在组件包源码中实现，加入 `component-registry.js`，补充 Demo Schema 和测试后再使用。
- 禁止在业务 Schema 或生成后的 HTML 中插入任意 HTML、CSS、脚本来绕过组件包。

## 构建命令

```text
node .codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/build-prototype.mjs --schema docs/design/<需求ID>-admin-prototype-schema.json --output docs/design/<需求ID>-admin-low-fidelity.html
```
