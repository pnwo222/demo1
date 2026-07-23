export interface ModalOptions {
  /** 相同id弹窗只会出现一个 */
  id?: string
  /** 标题 */
  title?: string
  /** 自定义 宽 高 位置 */
  style?: OptionsStyle
  /** render/defineComponent/defineAsyncComponent/ */
  content: any
  data?: any
  /** 关闭回调 */
  onClose?: () => void
  /** 确定回调 */
  onConfirm?: (v: any) => void
}

export interface OptionsStyle {
  width?: number
  height?: number
  top?: number
  left?: number
}
