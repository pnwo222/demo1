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

/** 门禁记录类型 */
export interface IClientAccess {
  /** 通行记录id */
  id: number
  /** 设备序列号 */
  deviceSn: string
  /** 设备名称 */
  deviceName: string
  /** 设备位置信息 */
  deviceLocation: string
  /** 所属区域名称 */
  areaName: string
  /** 事件类型 */
  eventType: string
  /** 通行状态(0.未通过 1.通过) */
  passState: string
  /** 拒绝通行原因 */
  reason: string
  /** 部门名称 */
  departName: string
  /** 人员id */
  userId: string
  /** 用户名 */
  userName: string
  /** 工号 */
  workId: string
  /** 验证方式 */
  authenType: number
  /** 验证方式 */
  authenTypeStr: string
  /** 识别时间（yyyy-MM-dd HH:mm:ss） */
  authenTime: string
  /** 现场照片地址 */
  capPhotoUrl: string
}

/** 分页响应数据类型 */
export interface IPageClientAccess {
  /** 数据记录 */
  records: IClientAccess[]
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

/** 获取门禁记录列表请求参数类型 */
export interface IGetAccessListParams {
  /** 开始时间（yyyy-MM-dd HH:mm:ss） */
  beginTime: string
  /** 结束时间（yyyy-MM-dd HH:mm:ss） */
  endTime: string
}

/** 获取门禁记录列表响应类型 */
export type IGetAccessListResponse = IPageClientAccess
