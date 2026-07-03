---
name: snowy-framework-bootstrap
description: Provide this repository's Snowy framework run guide before project workflow execution. Use when starting SDLC work, reminding developers to confirm the existing framework can run, explaining frontend npm install/npm run dev steps, explaining IDEA Maven/JDK backend startup, or listing MySQL/Redis configuration files and required settings. Do not automatically install, build, start, or verify the environment unless the user explicitly asks.
---

# Snowy Framework Run Guide

Use this skill before the first execution of the project workflow, when the global environment status is missing, or whenever a developer reports that the local Snowy framework can no longer run. The goal is to give a clear developer self-check prompt, not to run environment validation automatically.

## Required Inputs

Read these files first:

```text
AGENTS.md
docs/workflow/status.md
project/docs/README.md
project/docs/framework-overview.md
project/docs/development-guidelines.md
project/README.md
project/snowy-admin-web/package.json
project/snowy-web-app/src/main/resources/application.properties
```

## Framework Mapping

- Frontend: `project/snowy-admin-web/`
- Backend root: `project/`
- Backend app: `project/snowy-web-app/`
- Backend entry class: `project/snowy-web-app/src/main/java/vip/xiaonuo/Application.java`
- Backend default port: `82`
- Frontend dev server: Vite, usually `http://localhost:5173`
- Snowy frontend config may point browser clients at `http://localhost:81`

## Developer Prompt

Before Product/Design/Architect/Development stages, tell the developer:

```text
请先确认当前 Snowy 框架能否在你的本机正常运行。

前端：
1. 进入 project/snowy-admin-web
2. 执行 npm install
3. 执行 npm run dev
4. 打开 Vite 输出的本地地址，通常是 http://localhost:5173

后端：
1. 用 IntelliJ IDEA 打开 project/
2. 配置 Project SDK 为 JDK 17
3. 配置 Modules SDK 为 Project SDK 17
4. 配置 Java Compiler 字节码目标为 17
5. 在 IDEA 的 Maven 设置中配置 Maven home
6. Maven importer 和 runner 的 JDK/JRE 都选择 JDK 17
7. 确认数据库和 Redis 配置；如需修改数据库名，修改 `application.properties` 中 MySQL JDBC URL 的库名段
8. 确认开发电脑存在 `mysql` 指令：`Get-Command mysql`、`where.exe mysql` 或 `mysql --version`
9. 运行 snowy-web-app 的 Application.java
10. 启动后访问或检测 http://localhost:82
```

Do not run `npm install`, `npm run dev`, Maven import, backend startup, or port checks automatically unless the user explicitly requests execution. The `mysql` command check is part of the environment gate and may be executed when the workflow is validating whether it can continue.

## 开发环境 MySQL 指令门禁

这是全局开发环境检测的一部分，不跟随单个需求重复判断。

Snowy 后端开发和数据库维护可能需要对本地或远程 MySQL 执行 SQL，因此进入 PRD/UI/技术设计或开发前，必须确认开发电脑存在 `mysql` 指令。

检测命令：

```powershell
Get-Command mysql
where.exe mysql
mysql --version
```

如果未找到 `mysql`，将 `docs/workflow/status.md` 的全局状态记录为 `blocked_missing_mysql_cli`，不得进入任何需求的 PRD/UI/技术设计或开发阶段。

## Frontend Commands

Run manually from PowerShell or IDEA terminal:

```powershell
cd project/snowy-admin-web
npm install
npm run dev
```

Optional build check, only when the developer wants a production build:

```powershell
cd project/snowy-admin-web
npm run build
```

## Backend IDEA Setup

Tell the developer to configure IDEA:

1. Open `D:\www\www\chg\demo\project`.
2. `File > Project Structure > Project`
   - SDK: JDK 17.
   - Language level: `17`.
   - If only JDK 1.8 or `<No SDK>` is available, choose `Add SDK > Download JDK`, version `17`, vendor `Eclipse Temurin` or `JetBrains Runtime`.
3. `File > Project Structure > Modules`
   - Set every module SDK to `Project SDK 17`, especially `snowy-common`, `snowy-plugin`, `snowy-plugin-api`, and `snowy-web-app`.
4. `Settings > Build, Execution, Deployment > Compiler > Java Compiler`
   - Set project and module bytecode target to `17`.
5. `Settings > Build, Execution, Deployment > Build Tools > Maven`
   - Confirm Maven home path.
   - Set Maven importer JDK to JDK 17.
   - Set Maven runner JRE to JDK 17.
6. Wait until Maven import/indexing finishes.
7. Run `project/snowy-web-app/src/main/java/vip/xiaonuo/Application.java`.

If Maven dependency resolution is cached after a failed download, the developer can use IDEA Maven panel `Reload All Maven Projects` and enable force update, or run Maven with `-U` from a correctly configured Maven/JDK environment.

## Backend Configuration Files

Primary backend configuration:

```text
project/snowy-web-app/src/main/resources/application.properties
```

Required MySQL settings:

```properties
spring.datasource.dynamic.datasource.master.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.dynamic.datasource.master.url=jdbc:mysql://localhost:3306/snowy?...
spring.datasource.dynamic.datasource.master.username=root
spring.datasource.dynamic.datasource.master.password=123456
```

To change only the database name, edit only the path segment after host and port in the JDBC URL:

```properties
# before
spring.datasource.dynamic.datasource.master.url=jdbc:mysql://localhost:3306/snowy?...

# after, for database name demo
spring.datasource.dynamic.datasource.master.url=jdbc:mysql://localhost:3306/demo?...
```

Do not change host, port, username, password, or query parameters when the developer only asks to modify the database name.

Required Redis settings:

```properties
spring.data.redis.database=1
spring.data.redis.host=127.0.0.1
spring.data.redis.port=6379
spring.data.redis.password=
```

Other runtime settings to mention:

```properties
server.port=82
snowy.config.common.front-url=http://localhost:81
snowy.config.common.backend-url=http://localhost:82
```

SQL initialization file:

```text
project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql
```

## Configuration Modes

Support two modes:

1. Ask-and-update mode:
   - Ask the developer for MySQL host, port, database, username, password.
   - Ask the developer for Redis host, port, database, password.
   - Update `application.properties` only after the developer provides values and asks Codex to edit the file.
   - If the developer only says to change the database name, ask only for the new database name and update only `spring.datasource.dynamic.datasource.master.url`.
2. Developer-edit mode:
   - Tell the developer to edit `application.properties` directly.
   - For database name only, tell the developer to change `jdbc:mysql://host:port/<database>?...`.
   - Ask the developer to rerun the frontend/backend manually after editing.

## Completion Report

After using this skill, report the concise version by default:

```text
Snowy 自检提示已给出。
前端：cd project/snowy-admin-web; npm install; npm run dev
后端：IDEA 打开 project/，JDK/Maven 用 17，运行 Application.java
配置：project/snowy-web-app/src/main/resources/application.properties
状态：blocked_until_developer_confirmed_ready 或 blocked_missing_mysql_cli，等待开发者确认可运行并安装 mysql 指令
记录：docs/workflow/status.md
```

Only expand the full requirements/framework document list, MySQL/Redis property names, and IDEA step-by-step setup when the user asks for details or reports a concrete environment issue.

Status values:

- `prompted`: run guide was provided; environment execution is left to the developer.
- `blocked_until_developer_confirmed_ready`: run guide was provided, but the workflow must not continue until the developer confirms frontend and backend can run.
- `blocked_missing_mysql_cli`: the workflow checked the development environment and did not find the `mysql` command; it must stop at environment validation.
- `developer_confirmed_ready`: developer confirms frontend and backend can run.
- `developer_reported_blocked`: developer reports a concrete environment issue.

## Workflow Gate

On the first project workflow execution, Orchestrator must provide this run prompt before Product Agent work. The workflow should not automatically install dependencies or start services. It must check the `mysql` command as part of the development environment gate. If the developer has not confirmed the framework can run, stop at `blocked_until_developer_confirmed_ready`; if `mysql` is missing, stop at `blocked_missing_mysql_cli` rather than moving to Product, UI, technical design, or development.

Persist only the global environment status in `docs/workflow/status.md`. When the developer replies "前后端已确认可运行" or an equivalent statement, confirm `mysql` is available before updating that file to `developer_confirmed_ready`; mark frontend/backend confirmation and MySQL command detection as confirmed, and record confirmation source and time. Do not create per-requirement stage records from this skill; later PRD/UI/technical/development stages belong in `docs/workflow/requirements/<需求ID>.md`.
