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

/** 客户端模块类型 */
export interface IClientModule {
  /** 主键 */
  id: string
  /** 模块名称 */
  name: string
  /** 可见身份 */
  place: string
  /** 展示状态，展示:ENABLE；隐藏:DISABLED */
  showStatus: string
  /** 展示模版，数字几，就是几个图片 */
  displayMode: string
  /** 图片地址集合 */
  imageList: string
  /** 优先级，越小越靠前 */
  priorityLevel: number
  /** 创建时间 */
  createTime: string
}

/** 分页响应数据类型 */
export interface IPageClientModule {
  /** 数据记录 */
  records: IClientModule[]
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

/** 获取首页模块分页请求参数类型 */
export interface IGetModulePageParams extends IPageParams {
  // 继承分页参数，暂无额外参数
}

/** 获取首页模块分页响应类型 */
export type IGetModulePageResponse = IPageClientModule
