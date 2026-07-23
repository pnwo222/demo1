# H5 实际业务页面模式索引

生成 H5 原型或开发新页面时，先按需求类型命中本索引，再读取对应源码。实际业务页面的结构和信息密度优先于通用 Demo。

## 页面模式

| 模式 | 优先参考 | 可复用要点 |
| --- | --- | --- |
| 综合首页/门户 | `src/views/index/index.vue`、`src/views/index/modules/**` | 学校入口、顶部背景、Banner、应用宫格、公告、模块和资讯的组合顺序 |
| 应用宫格/更多应用 | `src/views/index/modules/app/index.vue`、`more.vue` | 图标宫格、分组、更多入口、点击跳转 |
| 图文资讯列表 | `src/views/news/index.vue`、`activity/index.vue`、`index/components/List/**` | 多种封面比例、标题摘要、来源时间、加载更多和空态 |
| 图文详情 | `src/views/news/detail.vue`、`activity/detail.vue`、`notice/detail.vue` | 标题、元信息、富文本、附件或底部操作 |
| 公告列表/滚动公告 | `src/views/notice/index.vue`、`index/modules/notice/index.vue` | 公告摘要、时间、未读/重点状态、详情入口 |
| 搜索页 | `src/views/book/search/index.vue`、`modules/history/index.vue` | 搜索框、搜索历史、清空、联想和结果跳转 |
| 带筛选的卡片列表 | `src/views/book/list/index.vue`、`components/FilterBox/index.vue` | 固定筛选头、开关、筛选数量、卡片结果、加载与空态 |
| 复杂内容详情 | `src/views/book/list/detail.vue`、`components/BookDetail/index.vue` | 封面、主信息、可借状态、馆藏明细、操作与说明 |
| 排行/推荐 | `src/views/book/list/rank.vue`、`book/tj/index.vue` | 排名视觉、分类切换、推荐理由和卡片信息 |
| 记录列表 | `src/views/xf/index.vue`、`mj/index.vue`、`yy/index.vue`、`book/record/index.vue` | 时间筛选、汇总信息、状态标签、分组记录、详情入口 |
| 记录详情 | `src/views/xf/detail.vue`、`yy/detail.vue` | 业务编号、状态、分组字段、只读详情和取消/再次操作 |
| 分组表单 | `src/views/yy/form.vue`、`mine/info.vue`、`xymp/form.vue` | `van-cell-group` 分组、右对齐输入、选择器、校验、底部固定主按钮 |
| 多步骤办理 | `src/views/signCard/index.vue`、`step1.vue`、`step2.vue`、`result.vue` | 办理说明、步骤推进、证件拍摄、确认承诺、提交和成功/失败结果 |
| 校园码/动态凭证 | `src/views/code/index.vue`、`components/mycard/**` | 卡面切换、二维码刷新倒计时、身份差异、异常提示和关联预约 |
| 个人中心 | `src/views/mine/index.vue`、`mine/info.vue` | 用户头部、身份切换、余额/卡状态、功能分组和编辑态 |
| 业务卡片/可保存海报 | `src/views/xymp/index.vue` | 品牌背景、个人信息、头像、保存为图片和宿主下载能力 |
| 认证历史参考 | `src/views/sys/user/**` | 登录、身份选择、绑卡和结果页；默认运行时不得自动恢复 |

## 选型规则

1. 一个需求页面可组合两个相邻模式，但必须指定主参考页面。
2. 记录列表不使用桌面表格；使用卡片、Cell、时间轴或分组列表。
3. 表单以真实 `van-cell-group + van-field` 结构为准；长表单按业务主题分组。
4. 页面存在底部主操作时，参考 `mine/info.vue` 或 `xymp/form.vue` 处理安全区。
5. 涉及选择器时读取实际 `createApiPicker`、`createDatePicker`、`createTimePicker` 用法。
6. 涉及图片、证件或二维码时读取实际媒体组件，不用文字占位。
7. 历史页面中的学校名称、接口数据和认证判断只能作为结构参考，不能写进新需求。

## 样式观察

- 实际页面大量使用白色内容区、浅灰页面背景、8px 圆角和 10/12/16/20/24px 间距。
- 表单字段通常右对齐，选择字段只读并带箭头。
- 列表页常使用固定筛选头或顶部统计，内容在其下滚动。
- 主操作常为圆角蓝色块按钮，并为底部安全区留出空间。
- 状态以颜色标签、点状提示或局部色块表达，不把所有状态做成同一种 Tag。
- 品牌、卡证、校园码等主题页允许使用需求提供的真实图片和背景，不套通用卡片。
