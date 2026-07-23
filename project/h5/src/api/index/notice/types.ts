/** 分页请求参数类型 */
export interface IPageParams {
  /** 当前页码 */
  current?: number
  /** 每页条数 */
  size?: number
}

/** 排序项类型 */
export interface IOrderItem {
  /** 排序列 */
  column?: string
  /** 是否升序 */
  asc?: boolean
}

/** 客户端通知类型 */
export interface IClientNotice {
  /** 主键 */
  id: string
  /** 标题 */
  title: string
  /** 封面图 */
  image?: string
  /** 内容 */
  content?: string
  /** 摘要 */
  digest?: string
  /** 类型 */
  type?: string
  /** 发布位置 */
  place?: string
  /** 状态 */
  status?: string
  /** 备注 */
  remark?: string
  /** 排序 */
  sortCode?: string
  /** 创建时间 */
  createTime?: string
  /** 创建人 */
  createUser?: string
  /** 创建人名称 */
  createUserName?: string
  /** 更新时间 */
  updateTime?: string
  /** 更新人 */
  updateUser?: string
  /** 更新人名称 */
  updateUserName?: string
  /** 翻译映射 */
  transMap?: Record<string, any>
  /** 文件列表 */
  fileList?: Record<string, any>[]
}

/** 分页响应数据类型 */
export interface IPageClientNotice {
  /** 数据记录 */
  records: IClientNotice[]
  /** 总记录数 */
  total: number
  /** 每页大小 */
  size: number
  /** 当前页码 */
  current: number
  /** 排序信息 */
  orders: IOrderItem[]
  /** 是否优化计数SQL */
  optimizeCountSql: boolean
  /** 是否搜索计数 */
  searchCount: boolean
  /** 是否优化连接计数SQL */
  optimizeJoinOfCountSql: boolean
  /** 最大限制 */
  maxLimit: number
  /** 计数ID */
  countId: string
  /** 总页数 */
  pages: number
}

/** 获取当前用户的通知公告分页请求参数类型 */
export interface IGetNoticePageParams extends IPageParams {
  // 继承分页参数，暂无额外参数
}

/** 获取当前用户的通知公告分页响应类型 */
export type IGetNoticePageResponse = IPageClientNotice
