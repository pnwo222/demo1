# Snowy 原型预设组件

本目录是 Demo 实际运行时引用的 Vue 3 预设组件库。`index.html` 通过普通 `<script src>` 逐个加载组件，因此可以直接以 `file://` 打开，不需要 npm、Vite 或本地服务器。

## 现有组件

| 文件 | Vue 组件 | 用途 |
| --- | --- | --- |
| `annotation-toolbar.js` | `SnowyAnnotationToolbar` | 标注开关、页面需求、全部删除和另存为 |
| `snowy-shell.js` | `SnowyShell` | Snowy 侧栏、顶部栏、页签和内容区域 |
| `banner-query-form.js` | `SnowyBannerQueryForm` | 标准查询与重置区域 |
| `banner-data-table.js` | `SnowyBannerDataTable` | 工具栏、表格、字段展示、操作和分页 |
| `banner-page.js` | `SnowyBannerPage` | Banner 查询与表格页面组合 |
| `menu-resource-page.js` | `SnowyMenuResourcePage` | 菜单树与资源管理 |
| `component-preset-page.js` | `SnowyComponentPresetPage` | 上传、状态、头像、进度、附件等展示预设 |
| `node-comment-composer.js` | `SnowyNodeCommentComposer` | 节点选择和多行评论输入 |
| `requirement-drawer.js` | `SnowyRequirementDrawer` | 页面整体需求预览和编辑 |
| `content-form-drawer.js` | `SnowyContentFormDrawer` | 新增、编辑、详情和图片上传 |
| `menu-form-drawer.js` | `SnowyMenuFormDrawer` | 菜单表单 |
| `import-modal.js` | `SnowyImportModal` | 文件导入 |
| `column-settings-modal.js` | `SnowyColumnSettingsModal` | 表格列设置 |
| `annotation-editor-modal.js` | `SnowyAnnotationEditorModal` | 标注详情、编辑、恢复和删除 |
| `image-preview-modal.js` | `SnowyImagePreviewModal` | 图片预览 |
| `registry.js` | 组件注册表 | 统一注册全部预设组件 |

## 使用规则

1. 后续原型优先组合现有组件，不得复制整页后另起一套样式。
2. 页面业务字段、菜单和操作必须来自当前需求蓝图，Demo 数据只用于展示组件能力。
3. 没有满足需求的预设组件时，可参考 Snowy 真实框架页面、本 Demo 中最接近的组件或 Ant Design Vue 官方组件进行选择和组合。
4. 三类来源仍无法满足时才新增组件；新组件沿用现有 Ant Design Vue 控件、CSS 变量、间距、状态和交互方式。
5. 新组件必须独立存放、加入 `registry.js`、`index.html` 和 `component-manifest.json`，并补充测试与运行验证。
6. 不得直接修改 `golden/original-demo.html`；它只用于内容和能力回归。
7. `prototype-contract.json` 是逐页运行契约。业务原型必须从蓝图更新该文件，完整列出查询控件、表头、工具栏、分页、布局指标和自动标注节点；禁止通过 `slice` 截断字段。
8. `refresh-component-manifest.mjs` 只登记业务扩展和当前文件哈希，不能授权修改受保护组件。最终校验会再次与 Skill 内 canonical Demo manifest 对比，并递归检查核心组件是否从 `app/main.js` 实际可达。

## 重新抽取

从原始金标重新生成运行时组件：

```powershell
node extract-runtime-components.mjs
```

校验组件清单：

```powershell
node build-prototype.mjs
```

复制一套可运行的多文件原型：

```powershell
node build-prototype.mjs D:\path\to\prototype-directory
```

新增或修改组件后刷新目标目录清单：

```powershell
node refresh-component-manifest.mjs D:\path\to\prototype-directory
```
