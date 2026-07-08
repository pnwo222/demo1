---
name: snowy-framework-bootstrap
description: Provide this repository's Snowy framework run guide before project workflow execution. Use when starting SDLC work, running the read-only environment checklist, reminding developers to confirm the existing framework can run, explaining frontend npm install/npm run dev steps, explaining IDEA Maven/JDK backend startup, or listing MySQL/Redis configuration files and required settings. Do not automatically install dependencies, build, start frontend/backend, or mutate the environment unless the user explicitly asks.
---

# Snowy Framework Run Guide

Use this skill before the first execution of the project workflow, when the global environment status is missing, or whenever a developer reports that the local Snowy framework can no longer run. The goal is to run the read-only environment checklist, list `✅`、`⚠️`、`❌` results, then give a clear developer self-check prompt. Checklist results must be line-broken under `检测：`, one item per line. Do not install dependencies, start services, build projects, import Maven, or mutate files except the ignored local status file unless the user explicitly asks.

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

Before Product/Design/Architect/Development stages, first run the read-only checklist, write `docs/workflow/local-environment-status.md`, then tell the developer:

```text
请根据上面的自检结果，确认当前 Snowy 框架能否在你的本机正常运行。

前端：
1. Git 可用
2. Node.js 可用，建议 18+；当前项目使用 npm 和 package-lock.json
3. npm 可用
4. 进入 project/snowy-admin-web
5. 执行 npm install
6. 执行 npm run dev
7. 打开 Vite 输出的本地地址，通常是 http://localhost:5173

后端：
1. 用 IntelliJ IDEA 打开 project/
2. 配置 Project SDK 为 JDK 17
3. 配置 Modules SDK 为 Project SDK 17
4. 配置 Java Compiler 字节码目标为 17
5. 在 IDEA 的 Maven 设置中配置 Maven home
6. Maven importer 和 runner 的 JDK/JRE 都选择 JDK 17
7. 确认数据库和 Redis 配置；如需修改数据库名，修改 `application.properties` 中 MySQL JDBC URL 的库名段
8. 确认开发电脑存在可用 MySQL CLI：先查 PATH，找不到时搜索常见安装目录中的 `mysql.exe`
9. 运行 snowy-web-app 的 Application.java
10. 启动后访问或检测 http://localhost:82
```

Do not run `npm install`, `npm run dev`, Maven import, backend startup, or build commands automatically unless the user explicitly requests execution. Read-only checks are allowed and required at the environment gate: command versions, executable path lookup, `node_modules` existence, and MySQL/Redis port reachability. Git branch/status belongs to the later branch confirmation stage, not the environment detection output.

## 环境检测输出布局

环境检测结果必须优先使用列表，不输出大段说明。`检测：` 后必须换行，每个检测项独占一行；禁止写成 `检测：✅ Git ...；✅ Node ...；⚠️ Java ...`。默认格式如下：

```text
阶段：开发环境检测
状态：<可继续/需人工确认/阻塞>
检测：
1. ✅ Git：<版本或路径>
2. ✅ Node.js：<版本>
3. ✅ npm：<版本>
4. ✅ 前端依赖：<node_modules 已存在/需执行 npm install>
5. ✅ MySQL CLI：<路径或版本>
6. ✅ MySQL 服务：<host:port 可达>
7. ✅ Redis 服务：<host:port 可达>
8. ⚠️ Java：<当前版本；要求 JDK 17；IDEA JDK 17 是否已确认>
9. ⚠️ Maven：<CLI 状态；IDEA Maven 是否已确认>
下一步：
请选择：
1. 环境通过，进入分支确认
2. 环境有警告但继续
3. 环境阻塞，先处理
4. 暂停
```

在该阶段，若状态为 `需确认`，只允许输出环境清单和环境选择项；不得输出当前分支确认选项；不得创建需求集成分支、worktree、需求状态文件，不得登记需求索引，也不得修改业务代码。

状态符号含义：

```text
✅ 通过：可自动检测通过，或已记录开发者确认。
⚠️ 需人工确认：CLI 未满足，但允许通过 IDEA 配置兜底，例如 JDK 17/Maven。
❌ 阻塞：必需项不可用，且没有可接受兜底方案。
```

## 必检环境项

| 分类 | 必检项 | 通过条件 |
| --- | --- | --- |
| 通用 | Git | `git --version` 成功 |
| 前端 | Node.js | `node --version` 成功，建议 18+ |
| 前端 | npm | `npm --version` 成功；本项目有 `package-lock.json`，默认使用 npm |
| 前端 | 前端依赖 | `project/snowy-admin-web/node_modules` 存在，或提示先执行 `npm install` |
| 后端 | JDK 17 | 命令行 `java -version` 为 17，或 IDEA Project SDK/Modules SDK/Java Compiler 为 17 |
| 后端 | Maven | `mvn --version` 成功，或 IDEA Maven home/importer/runner 已配置且 runner 使用 JDK 17 |
| 后端 | IntelliJ IDEA | 后端本地启动默认需要 IDEA 打开 `project/` |
| 数据库 | MySQL CLI | PATH 中 `mysql` 可用，或搜索到 `mysql.exe` 绝对路径并可执行 `--version` |
| 数据库 | MySQL 服务 | `application.properties` 中 MySQL host/port 可达 |
| 缓存 | Redis 服务 | `application.properties` 中 Redis host/port 可达 |

端口 `5173` 和 `82` 是启动后的验证项，不作为启动前硬性检测项。

## 开发环境 MySQL 指令门禁

这是全局开发环境检测的一部分，不跟随单个需求重复判断。

Snowy 后端开发和数据库维护可能需要对本地或远程 MySQL 执行 SQL，因此进入 PRD/UI/技术设计或开发前，必须确认开发电脑存在可用 MySQL CLI。CLI 可以来自 PATH 中的 `mysql`，也可以是搜索到的 `mysql.exe` 绝对路径。

检测命令：

```powershell
Get-Command mysql
where.exe mysql
mysql --version
```

PATH 找不到时，继续搜索常见安装目录：

```powershell
$paths = @(
  'C:\Program Files\MySQL',
  'C:\Program Files (x86)\MySQL',
  'C:\Program Files',
  'C:\Program Files (x86)',
  'C:\ProgramData\MySQL',
  'D:\mysql',
  'D:\MySQL',
  'D:\phpstudy_pro',
  'C:\phpstudy_pro'
)
foreach ($p in $paths) {
  if (Test-Path -LiteralPath $p) {
    Get-ChildItem -LiteralPath $p -Filter mysql.exe -Recurse -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty FullName
  }
}
```

找到后用绝对路径验证：

```powershell
& '<mysql.exe 绝对路径>' --version
```

如果 PATH 和搜索都未找到可执行 MySQL CLI，将 `docs/workflow/local-environment-status.md` 的本机环境状态记录为 `blocked_missing_mysql_cli`，不得进入任何需求的 PRD/UI/技术设计或开发阶段。

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
阶段：开发环境检测
状态：<可继续/需人工确认/阻塞>
检测：
1. ✅ Git：<版本>
2. ✅ Node.js：<版本>
3. ✅ npm：<版本>
4. ✅ 前端依赖：<node_modules 状态>
5. ✅ MySQL CLI：<路径或版本>
6. ✅ MySQL 服务：<host:port>
7. ✅ Redis 服务：<host:port>
8. ⚠️ Java：<CLI 版本与 IDEA JDK 17 确认状态>
9. ⚠️ Maven：<CLI 状态与 IDEA Maven 确认状态>
下一步：
请选择：
1. 环境通过，进入分支确认
2. 环境有警告但继续
3. 环境阻塞，先处理
4. 暂停
```

Only expand the full requirements/framework document list, MySQL/Redis property names, and IDEA step-by-step setup when the user asks for details or reports a concrete environment issue.

Status values:

- `prompted`: run guide was provided; environment execution is left to the developer.
- `blocked_until_developer_confirmed_ready`: run guide was provided, but the workflow must not continue until the developer confirms the development environment can run.
- `blocked_missing_mysql_cli`: the workflow checked PATH and common install directories, but did not find an executable MySQL CLI; it must stop at environment validation.
- `developer_confirmed_ready`: developer confirms the development environment can continue; warnings must be listed.
- `developer_reported_blocked`: developer reports a concrete environment issue.

## Workflow Gate

On the first project workflow execution, Orchestrator must provide this run prompt before Product Agent work. The workflow should not automatically install dependencies or start services. It must check the full environment checklist as part of the development environment gate. If the developer has not confirmed the environment can run, stop at `blocked_until_developer_confirmed_ready`; if a blocking item is missing, record the matching blocked status rather than moving to Product, UI, technical design, or development.

Persist developer-machine-specific environment results in `docs/workflow/local-environment-status.md`, including versions, absolute paths, ports, `node_modules` presence, Java CLI output, Maven CLI output, MySQL CLI path, MySQL reachability, Redis reachability, confirmation time, and warnings. This file is a local status file and MUST be ignored by Git. `docs/workflow/status.md` remains the committable project-level status and requirement index. When the developer replies "前后端已确认可运行" or an equivalent statement, confirm required tools and services, write the local result to `docs/workflow/local-environment-status.md`, and continue only if the local status is not blocked. Do not create per-requirement environment records from this skill; later PRD/UI/technical/development stages belong in `docs/workflow/requirements/<需求ID>.md`.

When this skill or any project workflow rule changes, check whether root workflow artifacts must also change: `PROJECT_WORKFLOW.md` and `PROJECT_WORKFLOW.png`. Update them in the same change when the public workflow description or diagram is affected; otherwise record that no update was needed.
