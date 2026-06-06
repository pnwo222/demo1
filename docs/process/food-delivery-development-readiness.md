# 外卖平台开发准备确认

## 阶段

ORCH-001：确认工程落位和开发前阻塞。

## 结论

- 工程目录采用用户指定结构：`project/frontend` 和 `project/backend`。
- 已创建最小 Vue 3 H5 前端骨架。
- 已创建最小 Java 后端编译入口。
- CI 应改为指向 `project/frontend` 和 `project/backend`。
- 数据库类型和 migration 工具仍未确认，因此真实 SQL migration 暂不生成。

## 当前工程结构

| 模块 | 路径 | 状态 |
| --- | --- | --- |
| 前端 | `project/frontend` | Vue 3 + Vite + TypeScript 最小骨架，`npm run build` 已通过 |
| 后端 | `project/backend` | Java 可编译入口，`javac` 已通过 |
| 设计/需求产物 | `docs/**`、`design-system/**` | 已生成 |

## 验证结果

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 前端依赖安装 | `npm install` in `project/frontend` | 通过 |
| 前端构建 | `npm run build` in `project/frontend` | 通过 |
| 后端编译 | `javac -encoding UTF-8 -d project/backend/out project/backend/src/main/java/com/demo/fooddelivery/FoodDeliveryServer.java` | 通过 |
| CI 路径 | `.github/workflows/ci.yml` | 已指向 `project/frontend` 和 `project/backend` |

## 版本锁定

当前 npm 源为内网 Verdaccio。已按该源可解析版本锁定：

- Vue：`3.5.13`
- Vite：`6.2.1`
- `@vitejs/plugin-vue`：`5.2.1`
- `vue-tsc`：`2.2.8`
- TypeScript：`5.8.2`

## 已解决阻塞

- `frontend/backend` 源码目录未确认：已改为 `project/frontend` 和 `project/backend`。
- CI 路径不匹配：已准备调整到 `project/` 子目录。
- `.gitignore` 忽略 `project/` 和阶段文档目录：已移除对应忽略项，保留依赖和构建输出忽略。

## 未解决阻塞

- 数据库类型未确认。
- migration 工具未确认。
- Java 后端框架未确认，本次仅提供 `javac` 可编译入口。
- 前端尚未引入路由、Pinia 和具体业务页面，后续按 FE-001 起分 slice 实现。

## 下一步

进入 Wave 0 后续任务：

- ARCH-001：输出 API Contract 和订单状态机契约。
- DATA-001：确认数据库选型后的 migration 方案。
- QA-001：输出主链路测试计划。
- SEC-001：输出支付回调和越权安全测试计划。
