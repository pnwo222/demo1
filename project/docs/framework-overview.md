# Snowy 框架内容介绍

## 来源

- `project/README.md`
- `project/pom.xml`
- `project/snowy-admin-web/package.json`
- `project/snowy-web-app/pom.xml`
- `docs/requirements/**`

## 框架定位

`project/` 已包含 Snowy/SnowyAdmin 快速开发平台，不是空白项目。后续业务功能开发应基于该框架增量扩展，优先复用现有前端布局、路由、组件、权限、接口封装、后端插件化模块、公共工具、异常处理、数据访问和安全能力。

框架主要技术栈：

| 层 | 技术 |
| --- | --- |
| 前端 | Vue 3、Ant Design Vue 4、Vite、Pinia、Vue Router、Axios、Tailwind CSS |
| 后端 | Java 17、Spring Boot 3、MyBatis-Plus、Sa-Token、Druid、MySQL、Redis |
| 安全 | 国密相关能力、Sa-Token 权限、审计日志、敏感字段处理 |
| 构建 | 前端 npm scripts，后端 Maven 多模块 |

## 目录映射

| 目录 | 类型 | 说明 |
| --- | --- | --- |
| `project/snowy-admin-web/` | 前端 | Vue 3 管理端，包含 `src/api`、`src/components`、`src/router`、`src/store`、`src/views` 等 |
| `project/snowy-web-app/` | 后端启动模块 | Spring Boot 主应用、资源配置、初始化 SQL、运行入口 |
| `project/snowy-common/` | 后端公共模块 | 公共实体、结果对象、异常、分页、工具类、拦截器等 |
| `project/snowy-plugin/` | 后端插件实现 | `auth`、`biz`、`client`、`dev`、`gen`、`mobile`、`sys` 等插件实现 |
| `project/snowy-plugin-api/` | 后端插件 API | 各插件对外 API 契约和 provider 接口 |
| `project/images/` | 架构图片 | Snowy 业务、应用、数据、技术、部署架构图 |
| `project/docs/` | 框架文档 | 本仓库为 Agent 工作流生成的框架说明和开发规范 |

## 后端模块关系

顶层 Maven 工程 `project/pom.xml` 聚合：

- `snowy-common`：通用基础能力。
- `snowy-plugin-api`：插件 API 契约。
- `snowy-plugin`：插件实现集合。
- `snowy-web-app`：主启动模块，依赖插件实现并打包运行。

开发业务功能时，优先判断是否应放入已有插件：

- 系统权限、组织、角色、用户等：`snowy-plugin-sys`。
- 通用业务功能：`snowy-plugin-biz`。
- C 端或用户侧能力：`snowy-plugin-client`。
- 移动端管理能力：`snowy-plugin-mobile`。
- 开发工具和配置能力：`snowy-plugin-dev`。

跨插件调用或对外暴露能力时，先在 `snowy-plugin-api` 定义契约，再在对应插件实现 provider 或 service。

## 前端结构

`project/snowy-admin-web/src/` 主要包含：

- `api/`：接口 client 和请求封装。
- `components/`：通用 Vue 组件。
- `config/`：主题、路由和系统配置。
- `layout/`：后台管理布局、菜单、顶部栏、标签页等。
- `router/`：路由、白名单、系统路由和客户端路由。
- `store/`：Pinia 状态管理。
- `views/`：业务页面。
- `utils/`：工具方法。
- `locales/`：国际化配置。

后台管理功能应优先按现有 `views`、`api`、`router` 和组件组织方式扩展。面向移动端或用户侧功能时，应先评估 Snowy 现有 `client`、`mobile` 插件和前端路由/布局能否承载；若需新增独立应用，必须先由 Architect Agent 说明与现有管理端、后端插件、认证和接口契约的边界。

## 开发前必读

执行任何开发阶段前，Orchestrator 必须读取：

```text
docs/requirements/**
project/docs/**
project/README.md
```

涉及前端开发还必须读取目标模块附近的现有 `api`、`router`、`store`、`views`、组件和样式约定。涉及后端开发还必须读取目标插件附近的 `controller`、`service`、`mapper`、`entity`、`param`、`result`、`provider` 和 XML mapper 约定。
