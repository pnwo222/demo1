# Snowy 框架总览缓存

本文件记录 `project/` 下 Snowy 框架的稳定结构和运行入口，供后续需求优先命中缓存，避免每次从零扫描。

## 核验来源

| 来源 | 说明 |
| --- | --- |
| `project/README.md` | 官方框架说明、启动方式、目录结构 |
| `project/pom.xml` | Maven 聚合模块、Java 版本、核心依赖 |
| `project/snowy-admin-web/package.json` | 前端脚本和依赖 |
| `project/h5/package.json` | H5 脚本、Vant 与移动端依赖 |
| `project/snowy-web-app/src/main/resources/application.properties` | 后端端口、数据源、Redis、Knife4j、扫描包 |
| `project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql` | 初始化表、字典、菜单和权限资源 |
| `project/snowy-plugin/**`、`project/snowy-plugin-api/**` | 插件实现和插件 API |
| `project/snowy-admin-web/src/**` | 前端 API、视图、路由、组件和工具 |

## 技术栈

| 层 | 技术和约束 |
| --- | --- |
| 后端 | Spring Boot 3.5.9、Spring Framework 6.2.15、JDK 17、Maven 聚合工程 |
| ORM/数据 | MyBatis-Plus 3.5.5、dynamic-datasource、Druid、MySQL 驱动，保留 PostgreSQL/Oracle/MSSQL/达梦/人大金仓示例配置 |
| 权限认证 | Sa-Token 1.44.0，权限注解常见为 `@SaCheckPermission` |
| API 文档 | Knife4j/OpenAPI，按 `vip.xiaonuo.auth/biz/client/dev/gen/mobile/sys` 分组扫描 |
| 前端 | Vue 3.5、Vite 6、Ant Design Vue 4、Pinia、Vue Router、Axios、Tailwind、Less |
| H5 | Vue 3.3、Vite 4、Vant 4、TypeScript、Pinia、Vue Router、Axios、UnoCSS、Less |
| 通用能力 | Hutool、EasyExcel、Easypoi、x-file-storage、短信/邮件/对象存储、WebSocket、定时任务 |

## 运行入口

| 类型 | 路径 | 说明 |
| --- | --- | --- |
| 前端入口 | `project/snowy-admin-web/` | 先 `npm install`，再 `npm run dev` |
| H5 入口 | `project/h5/` | 先 `pnpm install`，再 `pnpm dev`；默认路由 `/demo` |
| 后端入口 | `project/snowy-web-app/src/main/java/vip/xiaonuo/Application.java` | IDEA 使用 JDK 17 和 Maven 后运行 |
| 后端端口 | `project/snowy-web-app/src/main/resources/application.properties` | `server.port=82` |
| 数据库配置 | `project/snowy-web-app/src/main/resources/application.properties` | `spring.datasource.dynamic.datasource.master.*` |
| Redis 配置 | `project/snowy-web-app/src/main/resources/application.properties` | `spring.data.redis.*` 和 `sa-token.alone-redis.*` |
| 初始化 SQL | `project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql` | 表结构、字典、菜单、按钮权限和角色关系 |

## 后端模块

| 模块 | 职责 |
| --- | --- |
| `project/snowy-common/` | 公共注解、切面、缓存、枚举、异常、分页、实体基类、拦截器、工具类 |
| `project/snowy-plugin-api/` | 插件 API 契约，供跨插件调用 |
| `project/snowy-plugin/` | 插件实现，包含 auth、biz、client、dev、gen、mobile、sys |
| `project/snowy-web-app/` | 主启动、核心配置、资源配置、初始化 SQL |

后端典型 CRUD 分层为：

```text
controller
service / service/impl
mapper / mapper/mapping/*.xml
entity
param
result
enums
provider
```

常见约定：

- Controller 使用 `@RestController`、`@Validated`、`@Operation`，返回 `CommonResult`。
- 写操作常配 `@CommonLog`；权限控制常配 `@SaCheckPermission`。
- Service 实现常继承 `ServiceImpl<Mapper, Entity>`，事务方法使用 `@Transactional(rollbackFor = Exception.class)`。
- 分页使用 `CommonPageRequest.defaultPage()` 和 MyBatis-Plus `Page`。
- 实体通常继承 `CommonEntity`，逻辑删除字段由全局配置 `DELETE_FLAG` 控制。
- Mapper XML 放在 Java 包内的 `mapper/mapping/*.xml`，由 `mybatis-plus.mapper-locations` 扫描。

## 前端模块

| 路径 | 职责 |
| --- | --- |
| `project/snowy-admin-web/src/api/` | API client，按 auth/biz/client/dev/gen/mobile/sys 分组 |
| `project/snowy-admin-web/src/views/` | 页面视图，目录和后端插件分组基本对应 |
| `project/snowy-admin-web/src/router/` | 路由基础配置 |
| `project/snowy-admin-web/src/store/` | Pinia 状态 |
| `project/snowy-admin-web/src/components/` | 通用组件，如 `STable`、`XnPanel`、`XnFormContainer`、上传组件 |
| `project/snowy-admin-web/src/utils/` | 请求、权限、工具函数 |
| `project/snowy-admin-web/src/config/` | 全局配置、图标等 |

前端典型管理页约定：

- 页面容器优先复用 `xn-panel`。
- 列表优先复用 `s-table`。
- 抽屉/弹窗表单优先复用 `xn-form-container`。
- API client 使用 `baseRequest`，例如 `const request = (url, ...arg) => baseRequest('/dev/slideshow/' + url, ...arg)`。
- 按钮权限使用 `hasPerm('permissionCode')` 或 `hasPerm([...], 'and')`。
- 字典展示和选项使用 `tool.dictList`、`$TOOL.dictTypeData`、`$TOOL.dictTypeColor`。

## H5 模块

| 路径 | 职责 |
| --- | --- |
| `project/h5/src/views/demo/` | H5 UI、组件和交互金标 |
| `project/h5/src/components/` | 选择器、上传、弹窗、进度、空态和设备组件 |
| `project/h5/src/router/` | 显式路由与通用进度守卫 |
| `project/h5/src/utils/http/` | 移动端 Axios 封装 |
| `project/h5/mock/` | H5 mock |

H5 默认无业务认证。历史认证链路只记录在 `h5-routing-auth-pattern.md`，需求未明确时不得自动恢复。

## 数据和权限入口

| 类型 | 主要位置 | 说明 |
| --- | --- | --- |
| 业务表 | `_sql/snowy_mysql.sql` | `CREATE TABLE` 和初始化数据集中维护 |
| 字典 | `_sql/snowy_mysql.sql` 的 `DEV_DICT` | 如状态、类型、展示位置 |
| 菜单/按钮 | `_sql/snowy_mysql.sql` 的 `SYS_RESOURCE` | 菜单路由、组件路径、按钮权限码 |
| 关系 | `_sql/snowy_mysql.sql` 的 `SYS_RELATION` | 角色、资源、用户等授权关系 |
| 后端接口权限 | Controller 的 `@SaCheckPermission` | 与资源/API 权限保持一致 |
| 前端按钮权限 | `hasPerm` | 与 `SYS_RESOURCE` 按钮权限码保持一致 |

## 缓存使用建议

- 简单后台 CRUD：先读 `backend-crud-pattern.md`、`frontend-crud-pattern.md`、`permission-sql-pattern.md`、`migration-sql-pattern.md`，再用本文件定位模块。
- 需求包含现有能力关键词时，先读 `feature-capability-map.md`，再只补读对应模块代码。
- H5 页面或原型：先读 `h5-routing-auth-pattern.md`、`h5-ui-component-pattern.md`，再核验 `/demo`。
- 如果新增了可复用模块或现有能力发生变化，需要同步更新本文件和 `feature-capability-map.md`。
