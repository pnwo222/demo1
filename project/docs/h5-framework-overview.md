# H5 框架内容介绍

## 定位

`project/h5/` 是独立的移动端实际应用框架，技术栈为 Vue 3、Vite、TypeScript、Vant、Pinia、Vue Router、Axios、UnoCSS 和 Less。它与 `project/snowy-admin-web/` 后管前端并列，后续 H5 页面、H5 原型和移动端组件应优先复用本项目。

当前模板入口仅装载 `/demo` 组件演示页，不装载历史业务路由，也不执行登录、身份选择或 Token 权限守卫。历史真实业务场景已归档到 `.codex/skills/snowy-h5-app-designer/assets/reference-business-scenes/views/`，不再要求长期保留在 H5 框架中。

## 运行方式

```powershell
cd project/h5
pnpm install
pnpm dev
```

生产构建：

```powershell
pnpm build
```

## 目录映射

| 路径 | 职责 |
| --- | --- |
| `src/main.ts` | 应用创建、Pinia、全局组件、插件、路由和通用守卫接入 |
| `src/App.vue` | Vant 主题容器和路由出口 |
| `src/router/` | 当前有效路由、页面标题和通用进度守卫 |
| `src/views/` | 框架页面目录；后续新业务页面按功能放入，历史业务场景不作为框架必备内容 |
| `src/views/demo/` | H5 通用组件、交互和视觉规范演示入口 |
| `src/components/` | 项目级可复用组件 |
| `src/layouts/` | 页面布局参考 |
| `src/hooks/` | 通用组合式函数与历史业务能力参考 |
| `src/utils/http/` | Axios 请求封装 |
| `src/assets/` | 图片、SVG 和 Less 资源 |
| `build/vite/` | 自动导入、组件解析、mock、SVG、压缩等 Vite 插件 |
| `mock/` | 本地 mock 服务 |

## 当前路由基线

- `/` 重定向到 `/demo`。
- `/demo` 展示 H5 组件和交互。
- 未匹配路由进入 404。
- 不使用 `import.meta.glob` 自动装载历史业务路由。
- 历史业务路由定义已移除；历史页面参考由 H5 Skill 去重场景样本提供。

## 组件能力

| 分类 | 组件 |
| --- | --- |
| 基础展示 | Vant Button、Tag、Icon、Cell、Grid、Progress、Empty |
| 表单录入 | Vant Field、Radio、Checkbox、Switch、Stepper、`PasswordTip`、`UploadFile` |
| 选择器 | `OpenApiPicker`、`OpenDatePicker`、`OpenTimePicker`、`OpenMjDatePicker`、`OpenXfDatePicker` |
| 浮层反馈 | Vant Toast、Notify、Dialog、ActionSheet、Popup、`OpenModal` |
| 进度和空态 | `CircleProgress`、`Empty` |
| 滚动列表 | `CommonInfiniteList`、`useInfiniteList`，支持分页、下拉刷新、空态和失败重试 |
| 设备能力 | `IdCardCamera` |

通用组件用法以 `project/h5/src/views/demo/` 为可运行示例；页面结构和业务信息密度以 `.codex/skills/snowy-h5-app-designer/assets/reference-business-scenes/views/` 中最接近的去重业务场景样本为优先参考。

## H5 原型能力

项目本地 `.codex/skills/snowy-h5-app-designer` 提供：

- 实际业务页面模式索引；
- 逐页原型蓝图模板；
- 多文件 HTML 原型骨架；
- 页面级/全局自动标注与用户标注；
- 本地持久化和另存为嵌入；
- 蓝图与原型静态校验脚本。

## 历史认证参考

原应用曾使用：

1. 路由守卫读取按 `openId` 隔离的 Token。
2. 无 Token 时跳转 `/login`，并通过 `redirect` 恢复原目标页。
3. Token 存在时调用用户接口填充 Pinia 用户状态。
4. 用户未完成身份选择时跳转 `/auth`。
5. Axios 请求头附加 Token，401 时触发退出逻辑。
6. 一卡通 JSSDK 用于设置标题、获取头像和关闭页面。

该链路已从当前入口移除，详细记录见 `patterns/h5-routing-auth-pattern.md`。新项目只有在需求明确认证来源、Token 生命周期、身份模型、失败行为和宿主环境后才允许重新接入。
