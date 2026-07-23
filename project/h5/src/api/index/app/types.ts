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

/** 客户端应用类型 */
export interface IClientApp {
  /** 主键 */
  id: string
  /** 应用名称 */
  name: string
  /** 应用图标 */
  image: string
  /** 应用链接 */
  url: string
  /** 可见身份 */
  place?: string
  /** 展示状态，展示:ENABLE；隐藏:DISABLED */
  showStatus?: string
  /** 可用状态，可用:ENABLE；不可用:DISABLED */
  usedStatus?: string
  /** 优先级，越小越靠前 */
  priorityLevel: number
  /** 创建时间 */
  createTime?: string
}

/** 分页响应数据类型 */
export interface IPageClientApp {
  /** 数据记录 */
  records: IClientApp[]
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

/** 获取当前用户的应用分页请求参数类型 */
export interface IGetAppPageParams extends IPageParams {
  // 继承分页参数，暂无额外参数
}

/** 获取当前用户的应用分页响应类型 */
export type IGetAppPageResponse = IPageClientApp
