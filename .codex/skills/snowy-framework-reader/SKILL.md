---
name: snowy-framework-reader
description: Read and map this repository's Snowy framework code and docs, build high-hit-rate framework caches, and identify reusable frontend/backend/API/permission/SQL patterns. Use when starting SDLC work, pre-reading project/, locating where a new requirement fits, updating project/docs/patterns, or deciding which Snowy modules and existing capabilities to reuse.
---

# Snowy Framework Reader

Use this skill to understand the current `project/` Snowy framework deeply enough that later requirements can reuse cached knowledge instead of rediscovering the framework from scratch.

This skill reads code and documentation only. Do not install dependencies, start services, run migrations, create branches, create worktrees, or modify business code.

## Required Inputs

Read these first, in order:

```text
AGENTS.md
.codex/workflows/multi-agent-sdlc.md
.codex/agents/orchestrator.md
project/docs/README.md
project/docs/framework-overview.md
project/docs/development-guidelines.md
project/docs/patterns/README.md
project/docs/patterns/*.md
project/README.md
project/pom.xml
project/snowy-admin-web/package.json
project/snowy-web-app/src/main/resources/application.properties
```

If the user provides a specific requirement, also read all files in:

```text
docs/requirements/**
docs/workflow/status.md
docs/workflow/requirements/<需求ID>.md
```

## Reading Strategy

Prefer cache first, then verify with source code.

1. Cache pass:
   - Read `project/docs/patterns/README.md`.
   - Select the relevant cache files by requirement type.
   - Record cache hit, partial hit, miss, or stale.
2. Framework map pass:
   - Read build and package entry files.
   - Map frontend, backend app, plugin implementation, plugin API, common module, SQL, config, assets.
3. Targeted code pass:
   - Read only the modules likely touched by the requirement.
   - Use `rg --files` and `rg` before broad file reads.
   - Compare cache claims against actual files.
4. Capability pass:
   - Identify existing framework functions that can be reused.
   - Identify extension points and ownership boundaries.
5. Cache update pass:
   - Update or create cache docs only when source code proves a reusable pattern or stale cache.
   - Do not update cache from guesses.

## Cache Selection

Use these default mappings:

| Requirement shape | Must read caches | Then verify in code |
| --- | --- | --- |
| Backend CRUD | `backend-crud-pattern.md`, `permission-sql-pattern.md`, `migration-sql-pattern.md` | target plugin `controller/service/mapper/entity/param/result` |
| Frontend admin page | `frontend-crud-pattern.md`, `permission-sql-pattern.md` | `snowy-admin-web/src/views`, `src/api`, `src/router`, components |
| Menu/button/API permission | `permission-sql-pattern.md` | `_sql/snowy_mysql.sql`, controller `@SaCheckPermission`, frontend `hasPerm` |
| Table, index, init SQL | `migration-sql-pattern.md` | `_sql/snowy_mysql.sql`, entity, mapper XML |
| New reusable pattern | `cache-update-rules.md` | actual changed files and nearby examples |
| Unknown/complex feature | all related caches | module map plus high-risk code paths |

## Source Scanning Checklist

Use `rg --files` to build a compact file map before opening files.

Frontend:

```text
project/snowy-admin-web/src/api/**
project/snowy-admin-web/src/views/**
project/snowy-admin-web/src/router/**
project/snowy-admin-web/src/store/**
project/snowy-admin-web/src/components/**
project/snowy-admin-web/src/utils/**
```

Backend:

```text
project/pom.xml
project/snowy-web-app/**
project/snowy-common/**
project/snowy-plugin/**
project/snowy-plugin-api/**
```

Data and config:

```text
project/snowy-web-app/src/main/resources/application.properties
project/snowy-web-app/src/main/resources/_sql/**
**/mapper/mapping/*.xml
```

High-value searches:

```text
rg -n "@RestController|@SaCheckPermission|@CommonLog|@Transactional" project/snowy-plugin project/snowy-web-app
rg -n "hasPerm\\(|baseRequest\\(|s-table|xn-form-container|xn-panel" project/snowy-admin-web/src
rg -n "SYS_RESOURCE|SYS_RELATION|DEV_DICT|CREATE TABLE" project/snowy-web-app/src/main/resources/_sql
rg -n "ServiceImpl<|BaseMapper<|CommonResult|CommonPageRequest|CommonException" project
```

## Framework Capability Inventory

When doing a full pre-read or cache refresh, maintain these cache documents if missing or stale:

```text
project/docs/patterns/framework-inventory.md
project/docs/patterns/module-map.md
project/docs/patterns/feature-capability-map.md
```

Recommended contents:

- `framework-inventory.md`: technologies, runtime modules, frontend structure, backend modules, config files, SQL locations, common utilities.
- `module-map.md`: plugin/module ownership, package roots, common file patterns, where new business code should go.
- `feature-capability-map.md`: existing capabilities such as auth, user/org/role, menu/resource permissions, dict, file/upload, notice, generator, client/mobile, logging, audit, config, Redis/MySQL usage.

If these files are created or updated, also update `project/docs/patterns/README.md`.

## Cache Hit Rules

Classify cache result explicitly:

```text
缓存读取：<files>
缓存命中：hit / partial / miss / stale
代码核验：<files checked>
复用能力：<capabilities>
需补读：<files or none>
缓存更新：none / updated <files> / needed but deferred
```

Definitions:

- `hit`: cache matches actual code and directly answers the requirement.
- `partial`: cache covers the pattern but not the target module or special rule.
- `miss`: no cache covers the needed framework behavior.
- `stale`: cache conflicts with actual code.

If `partial`, `miss`, or `stale`, read nearby actual code before giving technical guidance.

## Requirement Placement Output

For a specific requirement, output a concise placement summary:

```text
框架读取：
缓存：<hit/partial/miss/stale + files>
前端落点：<paths or none>
后端落点：<paths or none>
数据落点：<paths or none>
权限落点：<paths or none>
可复用能力：<existing Snowy capabilities>
需新增能力：<new modules/files>
风险：<permission/data/status/money/concurrency/etc.>
下一步：<PRD/UI/technical/development decision>
```

## Update Rules

Update cache docs when:

- Actual code contradicts a cache.
- A new module shows a reusable pattern.
- A requirement adds reusable frontend/backend/permission/SQL/test workflow.
- The framework structure changes.
- A repeated lookup was needed more than once.

Do not update cache docs when:

- The finding is one-off business logic.
- The code is not yet implemented.
- The pattern is uncertain or unverified.
- The update would copy large source files instead of summarizing reusable structure.

When updating cache docs, use UTF-8 and prefer `apply_patch`. Keep docs concise, Chinese by default, and include source file paths.

## Integration With Workflow State

For each requirement status file, record:

```text
缓存读取:
缓存命中:
代码核验:
缓存更新:
更新文件:
原因:
时间:
```

`docs/workflow/status.md` may keep the requirement index. Machine-specific environment findings stay in `docs/workflow/local-environment-status.md`.
