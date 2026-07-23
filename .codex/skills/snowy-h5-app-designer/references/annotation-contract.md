# H5 原型标注契约

## 共享核心

- 行为核心：`assets/h5-prototype-framework/shared/annotation-core.js`
- 统一主题：`assets/h5-prototype-framework/shared/annotation-theme.css`
- 视觉基准：Snowy 后管标注工具栏、气泡、节点高亮、评论输入、详情编辑和页面需求。
- H5 只允许增加安全区、窄屏和软键盘适配，不得创建独立 `h5-annotation-*` 组件或样式。
- `validate_h5_prototype.py` 对生成目录中的共享核心和统一主题执行 SHA-256 对比；修改即失败。

## 数据

每条标注至少包含：

```json
{
  "id": "stable-id",
  "index": 1,
  "scope": "page:home",
  "pageId": "home",
  "targetKey": "home-banner",
  "title": "Banner 跳转限制",
  "content": "仅允许跳转已配置的校内页面。",
  "source": "requirement",
  "automatic": true
}
```

- `scope=global`：顶部栏、底部导航、全局入口等跨页节点。
- `scope=page:<page-id>`：页面内容、当前页面 Popup、Dialog、ActionSheet 和业务浮层。
- `targetKey` 对应稳定的 `data-annotation-key`，不得依赖易漂移的 `nth-child`。

## 行为

1. 自动标注气泡默认可见，标注模式默认关闭。
2. 开启标注后，鼠标/触控命中任意业务 DOM 节点时显示独立高亮覆盖层，不修改目标样式或布局。
3. 捕获并阻止业务 `pointerdown`、`mousedown`、`pointerup`、`mouseup`、`click`、`dblclick`、`contextmenu`；选中行为只用于标注。
4. 选择节点后在点击位置附近显示多行评论输入；无内容时发送按钮禁用。
5. `Esc` 取消草稿并退出标注模式。
6. 标注气泡放在目标节点内部右上角的可见区域，滚动、裁切、Popup 和安全区变化时重新定位。
7. 点击气泡展示详情；标题和内容在点击编辑图标后才进入编辑态。
8. 用户新增、修改、删除即时写入 `localStorage`。
9. 自动标注保持不可变基线；删除用户修改恢复基线，隐藏自动标注不破坏基线。
10. “另存为”将当前标注覆盖状态和页面需求描述嵌入导出 HTML。

## 移动端适配

- 工具栏固定在顶部安全区内并保持紧凑，不遮挡返回按钮和页面标题。
- 在窄屏上使用图标按钮；活动状态显示图标和短文字。
- 评论输入避开软键盘和视口边缘，必要时向上定位。
- 弹窗、底部选择器和右侧 Popup 的内容也能选中标注。
- 标注 UI 的 `z-index` 高于业务浮层，详情弹窗高于标注气泡。

## 禁止

- 不允许把 A 页标注显示在 B 页相同 DOM 位置。
- 不允许只让预设 class 或标签可标注。
- 不允许标注模式下触发路由、下拉、开关、上传、提交或宿主调用。
- 不允许自动标注使用“这是筛选区”“这里是列表”等泛化说明。
- 不允许复制模板中的日期范围、状态枚举、上传限制等示例作为新需求规则。
