export interface OpenApiPickerOptions {
  /** 相同id弹窗只会出现一个 */
  id?: string
  value: any
  field: string
  showLabelField?: string
  // 前端过滤
  filter?: boolean
  props?: any
  api?: Function
  resultField?: string
  labelField?: string
  valueField?: string
  showSearch?: boolean
  searchKeyField?: string
  autoFetch?: boolean
  emptyText?: string
  requiredSearchKeyword?: boolean
  formatData?: (d: any) => any
  /** 关闭回调 */
  onClose?: () => void
  onConfirm?: (v: any) => void
  onReady?: (v: any) => void
  onSearch?: (v: string) => void
}

export interface OpenApiPickerOptionsStyle {
  width?: number
  height?: number
  top?: number
  left?: number
}
