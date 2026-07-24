# H5 去重业务场景索引

生成 H5 原型或开发新页面时，先按需求类型命中本索引，再读取对应 Skill 样本源码。真实业务页面的结构和信息密度优先于通用 Demo。

下表中的业务页面路径默认指向：

`assets/reference-business-scenes/views/...`

组件与组合式方法会明确使用 `assets/reference-business-scenes/components/...` 或 `assets/reference-business-scenes/composables/...`。

这些样本按页面模式去重，不参与 H5 框架运行，也不保证脱离原项目后可独立编译。只读取其布局结构、信息密度、字段组织和交互方式；其中的学校名称、接口、认证判断和业务数据不得复制到新项目。业务图片不归档，新原型按当前需求选择真实素材或使用明确占位。

## 页面模式

| 模式 | 优先参考 | 可复用要点 |
| --- | --- | --- |
| 综合首页/门户 | `index/index.vue`、`index/modules/app/index.vue`、`index/modules/banner/index.vue` | 顶部品牌区、Banner、应用宫格和业务模块的组合顺序 |
| 图文资讯列表与详情 | `news/index.vue`、`news/detail.vue` | 封面、标题摘要、来源时间、加载更多、富文本详情 |
| 滚动分页列表 | `views/infinite-list/index.vue`、`components/CommonInfiniteList/index.vue`、`composables/useInfiniteList.ts` | 分页加载、下拉刷新、完成、空态、失败重试和并发保护 |
| 搜索与历史 | `book/search/index.vue` | 搜索框、历史、清空、联想和结果跳转 |
| 筛选卡片列表与复杂详情 | `book/list/index.vue`、`book/components/FilterBox/index.vue`、`book/list/detail.vue` | 固定筛选、结果卡片、馆藏明细、状态和操作 |
| 记录列表与详情 | `xf/index.vue`、`xf/detail.vue` | 时间筛选、汇总、分组记录、业务编号和只读详情 |
| 分组业务表单 | `yy/form.vue`、`yy/detail.vue` | Cell/Form 分组、选择器、校验、确认和详情回看 |
| 多步骤办理 | `signCard/index.vue`、`step1.vue`、`step2.vue`、`result.vue` | 说明、步骤推进、证件拍摄、承诺、提交和结果 |
| 校园码/动态凭证 | `code/index.vue`、`code/components/mycard/` | 卡面切换、二维码、倒计时、身份差异和异常提示 |
| 个人中心 | `mine/index.vue`、`mine/info.vue`、`mine/index.less` | 用户头部、身份状态、功能分组和资料编辑 |
| 业务卡片/海报 | `xymp/index.vue` | 品牌背景、个人信息、头像和宿主保存能力 |
| 历史认证参考 | `sys/user/login.vue`、`sys/user/auth.vue`、`sys/user/account/index.vue` | 登录、身份选择和账号设置；默认运行时不得自动恢复 |

## 选型规则

1. 一个需求页面可组合两个相邻模式，但必须指定主参考页面。
2. 记录列表不使用桌面表格；使用卡片、Cell、时间轴或分组列表。
3. 表单以真实 `van-cell-group + van-field` 结构为准；长表单按业务主题分组。
4. 页面存在底部主操作时，参考 `mine/info.vue` 或 `xymp/form.vue` 处理安全区。
5. 涉及选择器时读取实际 `createApiPicker`、`createDatePicker`、`createTimePicker` 用法。
6. 涉及图片、证件或二维码时读取实际媒体组件，不用文字占位。
7. 历史页面中的学校名称、接口数据和认证判断只能作为结构参考，不能写进新需求。
8. 分页、记录流和搜索结果先复用 Skill 内置滚动列表组件与方法，不从 `/demo` 反推实现。

## 样式观察

- 实际页面大量使用白色内容区、浅灰页面背景、8px 圆角和 10/12/16/20/24px 间距。
- 表单字段通常右对齐，选择字段只读并带箭头。
- 列表页常使用固定筛选头或顶部统计，内容在其下滚动。
- 主操作常为圆角蓝色块按钮，并为底部安全区留出空间。
- 状态以颜色标签、点状提示或局部色块表达，不把所有状态做成同一种 Tag。
- 品牌、卡证、校园码等主题页允许使用需求提供的真实图片和背景，不套通用卡片。
