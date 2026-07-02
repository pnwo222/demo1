---
name: snowy-framework-bootstrap
description: Provide this repository's Snowy framework run guide before project workflow execution. Use when starting SDLC work, reminding developers to confirm the existing framework can run, explaining frontend npm install/npm run dev steps, explaining IDEA Maven/JDK backend startup, or listing MySQL/Redis configuration files and required settings. Do not automatically install, build, start, or verify the environment unless the user explicitly asks.
---

# Snowy Framework Run Guide

Use this skill before the first execution of the project workflow, and whenever a developer needs to confirm the local Snowy framework can run. The goal is to give a clear developer self-check prompt, not to run environment validation automatically.

## Required Inputs

Read these files first:

```text
AGENTS.md
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
7. 确认数据库和 Redis 配置后，运行 snowy-web-app 的 Application.java
8. 启动后访问或检测 http://localhost:82
```

Do not run `npm install`, `npm run dev`, Maven import, backend startup, or port checks automatically unless the user explicitly requests execution.

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
2. Developer-edit mode:
   - Tell the developer to edit `application.properties` directly.
   - Ask the developer to rerun the frontend/backend manually after editing.

## Completion Report

After using this skill, report:

```text
Snowy framework run prompt:
Read requirements:
Read framework docs:
Frontend run steps:
Backend IDEA steps:
Backend config file:
Required MySQL settings:
Required Redis settings:
Developer self-check:
Status:
Next step:
```

Status values:

- `prompted`: run guide was provided; environment execution is left to the developer.
- `developer_confirmed_ready`: developer confirms frontend and backend can run.
- `developer_reported_blocked`: developer reports a concrete environment issue.

## Workflow Gate

On the first project workflow execution, Orchestrator must provide this run prompt before Product Agent work. The workflow should not automatically execute environment validation. If the developer has not confirmed the framework can run, record this as a developer self-check pending item rather than running scripts by default.
