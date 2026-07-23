// 轮播图分页请求参数类型（暂无参数，预留扩展）
export interface IGetBannerPageParams {}

// 排序项类型
export interface IOrderItem {
  column?: string
  asc?: boolean
}

// 轮播图单条数据类型
export interface IClientBanner {
  id: string
  title: string
  image: string
  isJump: string
  jumpUrl: string
  beginTime: string
  endTime: string
  priorityLevel: number
  remark: string
  showStatus: string
  deleteFlag: string
  createTime: string
  createUser: string
  updateTime: string
  updateUser: string
}

// 轮播图分页数据类型
export interface IPageClientBanner {
  records: IClientBanner[]
  total: number
  size: number
  current: number
  orders: IOrderItem[]
  optimizeCountSql: any
  searchCount: any
  optimizeJoinOfCountSql: boolean
  maxLimit: number
  countId: string
  pages: number
}

// 获取轮播图分页响应类型
export interface IGetBannerPageResponse {
  code: number
  msg: string
  data: IPageClientBanner
}
