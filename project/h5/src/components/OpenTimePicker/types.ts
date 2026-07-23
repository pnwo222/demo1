export interface OpenTimePickerOptions {
  /** 相同id弹窗只会出现一个 */
  id?: string
  value: any
  field: string
  props?: any
  type?: 1 | 2 | 3
  formatData?: (d: any) => any
  /** 关闭回调 */
  onClose?: () => void
  onConfirm?: (v: string) => void
  onReady?: (v: any) => void
  onSearch?: (v: string) => void
}

export interface OpenTimePickerOptionsStyle {
  width?: number
  height?: number
  top?: number
  left?: number
}
