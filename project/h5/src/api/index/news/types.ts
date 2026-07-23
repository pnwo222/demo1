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

/** 客户端文章类型 */
export interface IClientArticle {
  /** 主键 */
  id: string
  /** 标题 */
  title: string
  /** 封面图，多个用逗号隔开 */
  image?: string
  /** 内容 */
  content?: string
  /** 发布人id */
  publisherId?: string
  /** 发布人 */
  publisher?: string
  /** 展示模式 */
  displayMode?: string
  /** 展示状态，展示:ENABLE；隐藏:DISABLED */
  showStatus?: string
  /** 审核状态 */
  reviewStatus?: string
  /** 推荐状态，推荐:ENABLE；未推荐:DISABLED */
  adviseStatus?: string
  /** 推荐审核状态 */
  adviseReviewStatus?: string
  /** 排序 */
  sortCode?: number
  /** 创建时间 */
  createTime?: string
}

/** 分页响应数据类型 */
export interface IPageClientArticle {
  /** 数据记录 */
  records: IClientArticle[]
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

/** 获取当前用户的文章分页请求参数类型 */
export interface IGetNewsPageParams extends IPageParams {
  // 继承分页参数，暂无额外参数
}

/** 获取当前用户的文章分页响应类型 */
export type IGetNewsPageResponse = IPageClientArticle
