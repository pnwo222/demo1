# 外卖平台自动分配与并行开发计划

## 1. 自动分配准备

```text
当前阶段：自动分配准备
输入材料：
- AGENTS.md
- .codex/workflows/auto-dispatch-parallel-development.md
- docs/requirements/food-delivery-platform.md
- docs/prd/food-delivery-platform-prd.html
- docs/design/food-delivery-low-fidelity-prototype.html
- docs/design/food-delivery-figma-design-summary.md
- docs/architecture/food-delivery-technical-design.md
- docs/data/food-delivery-data-design.md
- docs/process/food-delivery-feature-slices.md

需求文档清单：
- docs/requirements/food-delivery-platform.md

PRD：
- docs/prd/food-delivery-platform-prd.html

设计稿：
- Figma: https://www.figma.com/design/Q0JsHmE1sJB2Y75xlGYJir
- docs/design/food-delivery-figma-design-summary.md

技术设计：
- docs/architecture/food-delivery-technical-design.md

数据设计：
- docs/data/food-delivery-data-design.md

当前分支：
- feature/food-delivery-prd

工作区状态：
- 当前分支相对 origin/feature/food-delivery-prd ahead 1。
- 存在既有工作区变更，Orchestrator 不回滚。
- 当前仓库已按用户指定创建 project/frontend 和 project/backend 最小工程骨架。

是否允许进入任务编排：
- 允许生成任务图。
- 允许进入 Wave 0 后续契约、数据、QA 和安全计划；数据库类型和 migration 工具确认前不写真实 SQL。
```

## 2. 仓库和 CI 现状

| 项 | 当前发现 | 影响 |
| --- | --- | --- |
| 前端目录 | `project/frontend` 已创建 | Vue 3 + Vite + TypeScript 最小骨架 |
| 后端目录 | `project/backend` 已创建 | Java 可编译入口 |
| CI | `.github/workflows/ci.yml` 引用 `project/frontend` 和 `project/backend/src/main/java/com/demo/fooddelivery/FoodDeliveryServer.java` | CI 已调整为 project 子目录 |
| 文档产物 | `docs/prd`、`docs/design`、`docs/architecture`、`docs/data`、`docs/process` | 已具备进入任务编排的输入 |
| 忽略规则 | `.gitignore` 忽略 `docs/*` 产物目录和 `design-system` | 如需提交流程产物，需要调整忽略规则或强制 add |

## 3. Feature Slice

任务图基于以下 slice：

- FS-01 商家浏览与配送范围
- FS-02 商品 SKU 与购物车
- FS-03 订单预览与后端重算金额
- FS-04 创建订单、库存锁定和费用快照
- FS-05 支付单与支付回调幂等
- FS-06 商家履约状态流转
- FS-07 配送任务与完成
- FS-08 取消、退款和退款回调
- FS-09 审计、异常订单和运营处理
- FS-10 质量门禁和安全回归

## 4. 任务图

### Wave 0：工程骨架、契约和测试计划

```yaml
tasks:
  - task_id: ORCH-001
    title: 确认工程落位和开发前阻塞
    owner_agent: Orchestrator Agent
    scope: 确认 project/frontend 和 project/backend 目录、数据库类型、migration 工具、CI 命令
    input_artifacts:
      - docs/process/food-delivery-auto-dispatch-plan.md
    output_artifacts:
      - docs/process/food-delivery-development-readiness.md
    files_allowed:
      - docs/process/**
    dependencies: []
    blocking_rules:
      - 未确认源码目录前不允许进入代码开发
      - 未确认数据库类型前不生成 SQL migration
    local_checks:
      - git status --short --branch
    acceptance:
      - 阻塞项、负责人和解决方式明确
    risk_level: P1
    branch_or_worktree: feature/food-delivery/orchestrator

  - task_id: ARCH-001
    title: 输出 API Contract 和状态机契约
    owner_agent: Architect Agent
    scope: OpenAPI 草案、错误码、订单状态机 transition 表、幂等约定
    input_artifacts:
      - docs/architecture/food-delivery-technical-design.md
      - docs/process/food-delivery-feature-slices.md
    output_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/architecture/food-delivery-order-state-machine.md
    files_allowed:
      - docs/architecture/**
    dependencies: [ORCH-001]
    blocking_rules:
      - API contract 未稳定前，前后端只能基于 mock 并行
    local_checks:
      - 文档链接检查
    acceptance:
      - 每个核心 API 有请求、响应、错误码、权限和幂等说明
    risk_level: P0
    branch_or_worktree: feature/food-delivery/architecture-contract

  - task_id: DATA-001
    title: 明确数据库选型后的 migration 方案
    owner_agent: Data Agent
    scope: 将数据设计映射为具体数据库 migration 计划
    input_artifacts:
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - docs/data/food-delivery-migration-plan.md
    files_allowed:
      - docs/data/**
      - project/backend/**
    dependencies: [ORCH-001]
    blocking_rules:
      - 数据库类型未确认时不写真实 SQL
    local_checks:
      - migration dry run
    acceptance:
      - 表、索引、唯一约束、回滚路径明确
    risk_level: P0
    branch_or_worktree: feature/food-delivery/data-migration

  - task_id: QA-001
    title: 主链路测试计划和用例矩阵
    owner_agent: QA Agent
    scope: 下单、支付回调、状态机、库存并发、权限越权、回归测试
    input_artifacts:
      - docs/requirements/food-delivery-platform.md
      - docs/process/food-delivery-feature-slices.md
    output_artifacts:
      - docs/qa/food-delivery-test-plan.md
    files_allowed:
      - docs/qa/**
      - project/frontend/**
      - project/backend/**
    dependencies: [ARCH-001, DATA-001]
    blocking_rules:
      - P0/P1 测试用例缺失不允许进入集成
    local_checks:
      - 测试计划审查
    acceptance:
      - 每个 P0/P1 风险均有测试覆盖
    risk_level: P0
    branch_or_worktree: test/food-delivery/qa-plan

  - task_id: SEC-001
    title: 支付回调和越权安全测试计划
    owner_agent: Security Agent
    scope: 回调验签、金额校验、订单归属、商家归属、骑手任务归属、密钥和日志
    input_artifacts:
      - docs/architecture/food-delivery-technical-design.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - docs/security/food-delivery-threat-model.md
    files_allowed:
      - docs/security/**
    dependencies: [ARCH-001]
    blocking_rules:
      - 支付和退款相关 P0 风险未评审不允许合并
    local_checks:
      - threat model review
    acceptance:
      - 权限、回调、敏感数据和接口滥用风险有缓解措施
    risk_level: P0
    branch_or_worktree: test/food-delivery/security-plan
```

### Wave 1：基础浏览和购物车

```yaml
tasks:
  - task_id: FE-001
    title: 实现商家浏览和商家详情 H5
    owner_agent: Frontend Agent
    scope: FS-01 页面、路由、状态、移动端适配
    input_artifacts:
      - docs/design/food-delivery-figma-design-summary.md
      - docs/architecture/food-delivery-api-contract.md
    output_artifacts:
      - project/frontend/src/views/merchant/**
      - project/frontend/src/api/merchant.*
    files_allowed:
      - project/frontend/**
    dependencies: [ARCH-001, ORCH-001]
    blocking_rules:
      - 不实现后端可信校验，只消费 API 结果
    local_checks:
      - npm run lint
      - npm run typecheck
      - npm run build
    acceptance:
      - 商家列表、详情、休息和不可配送状态可验证
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-frontend

  - task_id: BE-001
    title: 实现商家和配送范围 API
    owner_agent: Backend Agent
    scope: FS-01 商家列表、详情、地址配送校验
    input_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - project/backend/src/main/java/**/merchant/**
      - project/backend/src/test/**
    files_allowed:
      - project/backend/**
    dependencies: [ARCH-001, DATA-001]
    blocking_rules:
      - 用户地址归属必须后端校验
    local_checks:
      - mvn test 或 ./gradlew test
      - API contract test
    acceptance:
      - 开放、休息、禁用、不可配送场景返回正确
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: FE-002
    title: 实现商品 SKU 和购物车 H5
    owner_agent: Frontend Agent
    scope: FS-02 商品卡、库存状态、购物车加减和金额预估
    input_artifacts:
      - docs/design/food-delivery-figma-design-summary.md
      - docs/architecture/food-delivery-api-contract.md
    output_artifacts:
      - project/frontend/src/views/shop/**
      - project/frontend/src/stores/cart.*
    files_allowed:
      - project/frontend/**
    dependencies: [FE-001, BE-001]
    blocking_rules:
      - 前端金额仅作为预估展示
    local_checks:
      - npm run lint
      - npm run typecheck
      - npm run build
    acceptance:
      - 可售 SKU 可加购，下架和低库存状态清晰
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-frontend

  - task_id: BE-002
    title: 实现商品 SKU 和购物车 API
    owner_agent: Backend Agent
    scope: FS-02 商品/SKU 查询、购物车 CRUD、用户归属校验
    input_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - project/backend/src/main/java/**/product/**
      - project/backend/src/main/java/**/cart/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-001, DATA-001]
    blocking_rules:
      - 购物车越权必须后端拦截
    local_checks:
      - mvn test 或 ./gradlew test
    acceptance:
      - 购物车同用户同 SKU 不重复行，跨用户不可访问
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-backend
```

### Wave 2：下单、金额和库存

```yaml
tasks:
  - task_id: FE-003
    title: 实现订单预览和确认订单页
    owner_agent: Frontend Agent
    scope: FS-03 确认订单、费用明细、后端重算金额、错误状态
    input_artifacts:
      - docs/design/food-delivery-figma-design-summary.md
      - docs/architecture/food-delivery-api-contract.md
    output_artifacts:
      - project/frontend/src/views/checkout/**
    files_allowed:
      - project/frontend/**
    dependencies: [FE-002, BE-002, BE-003]
    blocking_rules:
      - 不使用前端金额创建支付单
    local_checks:
      - npm run lint
      - npm run typecheck
      - npm run build
    acceptance:
      - 后端 preview 金额覆盖前端预估，金额变化有提示
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-frontend

  - task_id: BE-003
    title: 实现订单 preview 和费用计算
    owner_agent: Backend Agent
    scope: FS-03 后端重算金额、优惠、配送费、包装费、库存和地址校验
    input_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - project/backend/src/main/java/**/pricing/**
      - project/backend/src/main/java/**/order/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-002, DATA-001]
    blocking_rules:
      - 金额必须使用整数分或 BigDecimal
    local_checks:
      - mvn test 或 ./gradlew test
      - 金额精度单元测试
    acceptance:
      - 返回费用明细，库存/地址/营业校验失败有明确错误码
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: BE-004
    title: 实现创建订单、库存锁定和费用快照
    owner_agent: Backend Agent
    scope: FS-04 创建订单事务、幂等键、库存锁定、状态日志
    input_artifacts:
      - docs/architecture/food-delivery-order-state-machine.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - project/backend/src/main/java/**/order/**
      - project/backend/src/main/java/**/inventory/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-003, DATA-001, QA-001]
    blocking_rules:
      - 重复下单和库存并发测试未通过不允许集成
    local_checks:
      - mvn test 或 ./gradlew test
      - 库存并发测试
    acceptance:
      - 重复提交只生成一个订单，失败不产生半成品数据
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: DATA-002
    title: 实施订单和库存 migration
    owner_agent: Data Agent
    scope: FS-03/FS-04 所需订单、费用、库存、状态日志表
    input_artifacts:
      - docs/data/food-delivery-migration-plan.md
    output_artifacts:
      - project/backend/src/main/resources/db/migration/**
    files_allowed:
      - project/backend/src/main/resources/db/migration/**
      - docs/data/**
    dependencies: [DATA-001, BE-003]
    blocking_rules:
      - migration 必须可回滚或可兼容禁用
    local_checks:
      - migration dry run
    acceptance:
      - 表、索引、唯一约束创建成功，回滚策略记录
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-data
```

### Wave 3：支付、履约和配送

```yaml
tasks:
  - task_id: FE-004
    title: 实现支付状态和订单跟踪页
    owner_agent: Frontend Agent
    scope: FS-05/FS-07 支付结果、订单详情、状态进度条
    input_artifacts:
      - docs/design/food-delivery-figma-design-summary.md
      - docs/architecture/food-delivery-api-contract.md
    output_artifacts:
      - project/frontend/src/views/order/**
      - project/frontend/src/api/order.*
    files_allowed:
      - project/frontend/**
    dependencies: [FE-003, BE-004, BE-005]
    blocking_rules:
      - 支付结果以后端订单状态为准
    local_checks:
      - npm run lint
      - npm run typecheck
      - npm run build
    acceptance:
      - 支付成功、重复回调后的订单状态展示正确
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-frontend

  - task_id: BE-005
    title: 实现支付单和支付回调幂等
    owner_agent: Backend Agent
    scope: FS-05 支付单创建、回调验签、金额校验、订单状态更新
    input_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/security/food-delivery-threat-model.md
    output_artifacts:
      - project/backend/src/main/java/**/payment/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-004, SEC-001, QA-001]
    blocking_rules:
      - 回调验签、金额校验和幂等测试缺失不允许集成
    local_checks:
      - mvn test 或 ./gradlew test
      - 支付回调幂等测试
    acceptance:
      - 重复回调无重复副作用，非法回调被拒绝并审计
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: BE-006
    title: 实现商家履约状态流转
    owner_agent: Backend Agent
    scope: FS-06 商家接单、制作中、待配送 API
    input_artifacts:
      - docs/architecture/food-delivery-order-state-machine.md
    output_artifacts:
      - project/backend/src/main/java/**/fulfillment/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-005]
    blocking_rules:
      - 商家归属和状态机非法跳转必须测试
    local_checks:
      - mvn test 或 ./gradlew test
    acceptance:
      - 商家只能处理自己订单，状态流转合法
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: BE-007
    title: 实现配送任务状态流转
    owner_agent: Backend Agent
    scope: FS-07 配送任务、骑手取餐、配送中、完成
    input_artifacts:
      - docs/architecture/food-delivery-order-state-machine.md
    output_artifacts:
      - project/backend/src/main/java/**/delivery/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-006]
    blocking_rules:
      - 骑手任务归属必须后端校验
    local_checks:
      - mvn test 或 ./gradlew test
    acceptance:
      - 骑手只能操作分配给自己的任务
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-backend
```

### Wave 4：退款、审计、门禁和发布准备

```yaml
tasks:
  - task_id: BE-008
    title: 实现取消、退款和退款回调幂等
    owner_agent: Backend Agent
    scope: FS-08 取消订单、释放库存、退款单、退款回调
    input_artifacts:
      - docs/architecture/food-delivery-api-contract.md
      - docs/security/food-delivery-threat-model.md
    output_artifacts:
      - project/backend/src/main/java/**/refund/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-004, BE-005, SEC-001]
    blocking_rules:
      - 重复退款和退款金额错误测试未通过不允许集成
    local_checks:
      - mvn test 或 ./gradlew test
      - 退款回调幂等测试
    acceptance:
      - 取消和退款只在允许状态发生，重复回调无重复资金副作用
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: BE-009
    title: 实现审计日志和异常订单处理
    owner_agent: Backend Agent
    scope: FS-09 高风险操作审计、异常订单查询和处理
    input_artifacts:
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - project/backend/src/main/java/**/audit/**
      - project/backend/src/main/java/**/abnormal/**
    files_allowed:
      - project/backend/**
    dependencies: [BE-004, BE-005, BE-006, BE-007, BE-008]
    blocking_rules:
      - P0/P1 操作必须有审计记录
    local_checks:
      - mvn test 或 ./gradlew test
    acceptance:
      - 支付、退款、取消、状态流转、越权拦截均可追踪
    risk_level: P1
    branch_or_worktree: ../worktrees/food-delivery-backend

  - task_id: QA-002
    title: 执行主链路 E2E 和回归验证
    owner_agent: QA Agent
    scope: FS-10 下单、支付、履约、配送、退款、权限、异常状态
    input_artifacts:
      - docs/qa/food-delivery-test-plan.md
    output_artifacts:
      - docs/qa/food-delivery-test-report.md
    files_allowed:
      - docs/qa/**
      - project/frontend/**
      - project/backend/**
    dependencies: [FE-004, BE-009]
    blocking_rules:
      - P0/P1 测试失败不允许合并
    local_checks:
      - E2E smoke
      - API contract test
      - mobile viewport check
    acceptance:
      - 验收标准逐条通过或记录风险接受
    risk_level: P0
    branch_or_worktree: ../worktrees/food-delivery-qa

  - task_id: REVIEW-001
    title: 高风险审查和合并前评审
    owner_agent: Reviewer Agent
    scope: Bug、Security、Performance、Maintainability、QA 汇总审查
    input_artifacts:
      - 所有任务 diff
      - docs/qa/food-delivery-test-report.md
      - docs/security/food-delivery-threat-model.md
    output_artifacts:
      - docs/review/food-delivery-review-report.md
    files_allowed:
      - docs/review/**
    dependencies: [QA-002]
    blocking_rules:
      - P0 必须修复
      - P1 合并前应修复
    local_checks:
      - review checklist
    acceptance:
      - 审查结论和残余风险明确
    risk_level: P0
    branch_or_worktree: feature/food-delivery/review

  - task_id: DEVOPS-001
    title: CI/CD、灰度、监控和回滚方案
    owner_agent: DevOps Agent
    scope: FS-10 CI 门禁、环境变量、Feature Flag、告警、回滚
    input_artifacts:
      - docs/architecture/food-delivery-technical-design.md
      - docs/data/food-delivery-data-design.md
    output_artifacts:
      - docs/release/food-delivery-release-plan.md
      - .github/workflows/ci.yml
    files_allowed:
      - docs/release/**
      - .github/workflows/**
    dependencies: [QA-002, REVIEW-001]
    blocking_rules:
      - CI 未通过不进入最终合并
    local_checks:
      - CI dry run
      - secret scan
    acceptance:
      - 灰度、监控、告警、回滚和发布后观察明确
    risk_level: P0
    branch_or_worktree: chore/food-delivery/devops-release
```

## 5. 依赖 DAG

```text
ORCH-001
  -> ARCH-001
  -> DATA-001

ARCH-001 + DATA-001
  -> QA-001
  -> SEC-001
  -> BE-001

BE-001
  -> FE-001
  -> BE-002

FE-001 + BE-002
  -> FE-002
  -> BE-003

BE-003 + DATA-001
  -> FE-003
  -> BE-004
  -> DATA-002

BE-004 + SEC-001 + QA-001
  -> BE-005
  -> BE-008

BE-005
  -> FE-004
  -> BE-006

BE-006 -> BE-007
BE-004 + BE-005 + BE-006 + BE-007 + BE-008 -> BE-009
FE-004 + BE-009 -> QA-002 -> REVIEW-001 -> DEVOPS-001
```

## 6. 并行 Wave

| Wave | 目标 | 任务 |
| --- | --- | --- |
| Wave 0 | 开发准备和契约 | ORCH-001、ARCH-001、DATA-001、QA-001、SEC-001 |
| Wave 1 | 商家、商品、购物车 | FE-001、BE-001、FE-002、BE-002 |
| Wave 2 | 订单预览、订单创建、库存锁定 | FE-003、BE-003、BE-004、DATA-002 |
| Wave 3 | 支付、商家履约、配送 | FE-004、BE-005、BE-006、BE-007 |
| Wave 4 | 退款、审计、质量门禁、发布 | BE-008、BE-009、QA-002、REVIEW-001、DEVOPS-001 |

## 7. 分支和 Worktree 策略

推荐在确认源码目录后创建独立 worktree：

| Owner | Worktree | Branch |
| --- | --- | --- |
| Frontend Agent | `../worktrees/food-delivery-frontend` | `feature/food-delivery/frontend-h5` |
| Backend Agent | `../worktrees/food-delivery-backend` | `feature/food-delivery/backend-api` |
| Data Agent | `../worktrees/food-delivery-data` | `feature/food-delivery/data-migration` |
| QA Agent | `../worktrees/food-delivery-qa` | `test/food-delivery/qa` |
| Security Agent | 当前仓库或独立分支 | `test/food-delivery/security` |
| Review/DevOps | 当前仓库或独立分支 | `chore/food-delivery/release-gates` |

并行写入规则：

- Frontend Agent 只写 `project/frontend/**`。
- Backend Agent 只写 `project/backend/**`。
- Data Agent 只写 migration 目录和 `docs/data/**`。
- QA Agent 可写 `docs/qa/**`、测试目录和 E2E 目录。
- Security Agent 可写 `docs/security/**` 和安全测试配置。
- 公共 contract 由 Architect 或 Backend 维护，Frontend 只消费。

## 8. 集成策略

1. Wave 0 文档和契约完成后，创建 integration branch：`feature/food-delivery/integration`。
2. 低风险文档和前端展示任务可先进入 integration。
3. P0 任务单独 PR：
   - BE-003 金额计算。
   - BE-004 创建订单和库存锁定。
   - BE-005 支付回调。
   - BE-008 退款回调。
4. 每个任务合入前必须提供：
   - diff 摘要。
   - 本地检查结果。
   - 风险和残余问题。
   - 是否越界修改。
5. integration branch 运行完整 CI、API contract、E2E、安全扫描。
6. P0/P1 Review 问题修复后，创建面向主分支的最终 PR。

## 9. 质量门禁

前端：

- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `npm run build`
- 移动端 375px、390x844、768px smoke。

后端：

- `mvn test` 或 `./gradlew test`
- Integration Test
- API Contract Test
- 状态机测试
- 支付/退款回调幂等测试
- 库存并发测试

数据：

- migration dry run
- rollback 或兼容验证
- 索引和唯一约束验证
- 订单费用一致性检查

安全和发布：

- SAST
- SCA
- Secret Scan
- DAST
- 权限越权测试
- 支付和退款回调伪造测试
- Feature Flag、灰度和回滚演练

当前 CI 注意：

- `.github/workflows/ci.yml` 已引用 `project/frontend` 和 `project/backend`。
- 若继续使用该 CI，必须先创建对应工程目录或调整 CI。

## 10. 风险与阻塞

| 阻塞或风险 | 等级 | 处理 |
| --- | --- | --- |
| `project/frontend` 和 `project/backend` 仅为最小骨架，业务框架细节待确认 | P2 | 后续 FE/BE 任务逐步完善 |
| 数据库类型和 migration 工具未确认 | P1 | DATA-001 确认后再写 SQL |
| CI 已调整到 project 子目录 | P2 | 后续 DEVOPS-001 增强完整门禁 |
| 支付、退款、库存和状态机均为高风险链路 | P0 | 单独 PR、强制 Review、QA/Security 前置 |
| `.gitignore` 忽略 docs 产物目录 | P2 | 若这些产物需提交，需要调整忽略规则或使用强制 add |
| 工作区已有变更和删除项 | P2 | 集成前由 Orchestrator 汇总，不擅自回滚 |

## 11. 状态板初始值

```text
Slice：FS-01..FS-10
Wave：Wave 0
任务总数：22
进行中：0
已完成：0
阻塞：数据库类型和 migration 工具未确认；业务框架细节待确认
风险：P0 支付、退款、金额、库存、权限、状态机
下一次集成点：Wave 0 契约、数据 migration 计划、QA/Security 计划完成后
```

## 12. 下一阶段

阶段 6 的任务编排产物已生成。进入实际并行开发前，建议先执行 ORCH-001，确认：

- Vue 3 H5 已落位到 `project/frontend`。
- Java 后端已落位到 `project/backend`。
- 数据库类型和 migration 工具。
- CI 已调整到 `project/frontend` 和 `project/backend`。


