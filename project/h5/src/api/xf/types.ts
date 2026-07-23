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

/** 消费记录类型 */
export interface IClientXf {
  /** 数据主键 */
  id: string
  /** 支付流水号 */
  payId: string
  /** 人员主键 */
  userId: string
  /** 支付时间（yyyy-MM-dd HH:mm:ss） */
  payTime: string
  payDate?: string
  /** 支付金额 */
  payAmount: string
  /** 支付类型 */
  payType: string
  /** 支付设备号 */
  payDevices: string
  /** 支付商户 */
  payMerchant: string
  /** 备注 */
  notes: string
}

/** 分页响应数据类型 */
export interface IPageClientXf {
  /** 数据记录 */
  records: IClientXf[]
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

/** 获取消费记录列表请求参数类型 */
export interface IGetXfListTodayParams {
  /** 开始时间（yyyy-MM-dd HH:mm:ss） */
  beginTime: string
  /** 结束时间（yyyy-MM-dd HH:mm:ss） */
  endTime: string
}

/** 获取消费记录列表响应类型 */
export type IGetXfListTodayResponse = IPageClientXf
