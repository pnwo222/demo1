---
name: snowy-h5-app-designer
description: Design, generate, annotate, validate, implement, review, or extend mobile H5 applications and multi-file HTML prototypes using this repository's project/h5 framework, real business pages under src/views, Vant components, local components, routing conventions, UI baseline, mock strategy, and historical authentication reference. Use for new H5 apps, H5 pages, H5 prototypes, annotated requirement prototypes, mobile form/list/detail flows, route design, or deciding how a mobile requirement should reuse project/h5.
---

# Snowy H5 应用设计与开发

以 `project/h5/` 的实际代码和 `/demo` 为事实来源。不要把后管页面缩放成 H5，也不要从空白 Vue 项目重新搭建。

## 必读顺序

1. `project/docs/h5-framework-overview.md`
2. `project/docs/h5-development-guidelines.md`
3. `project/docs/patterns/h5-routing-auth-pattern.md`
4. `project/docs/patterns/h5-ui-component-pattern.md`
5. `references/actual-page-patterns.md`
6. 与需求最接近的 `project/h5/src/views/` 实际业务页面
7. `project/h5/src/views/demo/`
8. 与需求最接近的 `project/h5/src/components/`

设计 H5 原型时必须读取：

- `references/prototype-blueprint-template.md`
- `references/annotation-contract.md`
- `references/prototype-checklist.md`

开发或审查代码时读 `references/implementation-checklist.md`。

## 执行流程

### 1. 建立需求映射

逐页列出页面名称、路由、入口、返回路径、展示字段、录入字段、状态、按钮、异常、数据来源、mock、认证要求、宿主能力和组件复用关系。不得用“其他字段”“相关状态”“通用页面”压缩明确需求。

### 2. 选择组件

按以下顺序：

1. 与需求最接近的 `project/h5/src/views/` 实际页面及其私有组件
2. `project/h5/src/components/`
3. `/demo` 中已验证的组件组合
4. Vant 官方组件
5. 新增页面级组件
6. 确认跨页面复用后再新增全局组件

不得只看 `/demo` 后生成通用卡片。新组件需沿用匹配业务页面的页面结构、信息密度、媒体比例、色彩、间距、字体、圆角、表单和浮层结构。

### 3. 处理路由与认证

- 显式登记业务路由，不自动扫描历史 `routes/modules`。
- 默认不启用认证。
- 涉及登录、Token、身份选择或宿主 App 时，先读取历史认证参考，再确认新的接口和生命周期。
- 不得因为历史源码存在就自动恢复 `/login`、`/auth` 或 Token 守卫。

### 4. 设计 UI

- 以 375px 为主视口，验证 320/390/414px。
- 使用 Vant 的移动端信息架构，不照搬 Snowy 后管表格和抽屉。
- 真实展示图片、文件、状态、列表项和表单控件。
- 所有可点击元素实现对应交互。
- 覆盖加载、正常、空、错误、禁用、成功和权限差异。
- 设备能力提供权限说明、取消路径和失败状态。

### 5. 生成 H5 HTML 原型

1. 使用 `references/prototype-blueprint-template.md` 建立逐页蓝图，保留原始需求、字段、状态、交互、异常、权限、设备能力和来源。
2. 从 `references/actual-page-patterns.md` 选择最接近的真实业务页面，不得用一个万能列表或万能表单替代不同页面。
3. 执行：

```powershell
node .codex/skills/snowy-h5-app-designer/assets/h5-prototype-framework/build-prototype.mjs <输出目录>
```

4. 在复制后的 `pages/` 中按蓝图新增或修改页面组件，在 `prototype-contract.json` 中逐页登记需求、路由、参考源码、字段、交互和自动标注。
5. 保留 `shared/annotation-core.js` 和 `shared/annotation-theme.css`。它们是与后管标注视觉/交互对齐的受保护共享核心，不得复制后重画、改类名或覆盖样式；自动标注必须来自当前需求，不能复制模板示例规则。
6. 原型必须是多文件目录。`index.html` 只负责依赖和入口引用，页面、样式、数据、标注运行时分别维护。
7. 生成后运行：

```powershell
python .codex/skills/snowy-h5-app-designer/scripts/validate_h5_blueprint.py <蓝图.md>
python .codex/skills/snowy-h5-app-designer/scripts/validate_h5_prototype.py <原型目录>
```

8. 使用移动端浏览器逐页验证 320/375/390/414px、主路径、弹层、表单、媒体、返回、自动标注和用户新增标注。

### 6. 实现代码

- 使用 Vue 3 Composition API、`<script setup lang="ts">` 和 TypeScript。
- 页面放在 `src/views/<feature>/`，页面私有组件放在其 `components/`。
- API 放在 `src/api/<feature>/`，请求走 `src/utils/http/`。
- 接口不可用时同步维护 mock，不在页面中写死线上响应。
- 样式使用 Less；局部样式优先 scoped。
- 不修改无关历史业务源码。

### 7. 验证

```powershell
cd project/h5
pnpm lint
pnpm build
```

浏览器验证目标路由、刷新、表单、选择器、弹层、返回、空状态和移动端宽度。报告未验证的相机、宿主 JSSDK 或远程接口能力。

## 缓存更新

新增可复用组件或页面模式，或路由、认证、主题、请求、目录结构和 `/demo` 发生变化时，更新 `project/docs/patterns/h5-*.md`，并判断 H5 框架文档和本 skill 是否需要同步。

## 原型硬性规则

- 页面风格以最接近的 `project/h5/src/views/` 实际业务页面为主，`/demo` 只补充组件用法。
- 首页门户、卡片列表、搜索筛选、记录列表、图文详情、表单、多步骤流程、结果页、校园码/卡片和个人中心必须使用各自页面模式。
- 字段、按钮、状态和说明来自需求；框架惯例和推断项必须标记来源。
- HTML 原型中的所有可见操作必须有效，不能只做视觉外壳。
- 自动标注只标注约束、枚举、状态语义、敏感数据、权限、校验、设备限制和容易误解的业务规则。
- 标注必须支持选择任意业务 DOM 节点；标注模式开启时阻止业务点击、下拉、切换、提交和链接跳转，`Esc` 退出。
- 全局标注用于顶部栏、底部导航等跨页区域；页面标注只在对应页面显示。弹窗、Popup、ActionSheet 等挂载到 `body` 的节点也必须可标注。
- 标注默认可见、标注模式默认关闭；用户新增/修改内容写入 `localStorage`，刷新不丢失；“另存为”把当前标注状态嵌入导出的 HTML。
- H5 与后管标注必须使用统一工具栏、SVG 图标、气泡、节点高亮、评论输入、详情编辑和页面需求主题。H5 只允许增加窄屏、安全区和软键盘适配，不允许建立 `h5-annotation-*` 平行样式。
- 自动标注保留不可变基线：删除用户修改时恢复原内容，删除用户新增时彻底移除。
- 原型未通过蓝图校验、静态校验和浏览器逐页检查，不得宣称完成。
