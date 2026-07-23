// 图书检索相关类型定义

// 请求参数类型
export interface IBookSearchParams {
  /** 检索字段：题名检索-title；责任人检索-author；isbn-检索isbn；元数据控制号检索-recordId；条码号检索-barcode */
  searchFiled: string
  /** 关键字 */
  searchWord: string
}

// 复本信息
export interface IItem {
  /** id */
  itemId: string
  /** 条码号 */
  barCode: string
  /** 财产号 */
  propNo: string
  /** 索书号 */
  callNo: string
  /** 馆藏地ID */
  locationId: string
  /** 馆藏地名称 */
  locationName: string
  /** 当前馆藏地名称 */
  curLocationName: string
  /** 书刊的借阅属性 */
  circAttr: string
  /** 书刊当前状态 */
  processType: string
  /** 年卷期 */
  yearVol: string
  /** 入藏时间 */
  inDate: string
  /** 校区 */
  campus: string
}

// 排序项
export interface IOrderItem {
  /** 排序列 */
  column: string
  /** 是否升序 */
  asc: boolean
}

// 图书检索结果项
export interface IClientBookSearch {
  /** 题名 */
  title: string
  /** 责任者 */
  author: string
  /** 出版社 */
  publisher: string
  /** 出版年 */
  publishYear: string
  /** 书刊的借阅属性 */
  circAttr: string
  /** 馆藏地名称 */
  locationName: string
  /** 摘要 */
  description: string
  /** 条码号集合 */
  barCodes: string[]
  /** 索书号 */
  callNos: string[]
  /** 电子复本信息集合 */
  eitems: string[]
  /** 复本信息集合 */
  items: IItem[]
}

// 分页图书检索结果
export interface IPageClientBookSearch {
  /** 记录列表 */
  records: IClientBookSearch[]
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

// 通用分页结果包装
export interface ICommonResultPageClientBookSearch {
  /** 状态码 */
  code: number
  /** 提示语 */
  msg: string
  /** 数据 */
  data: IPageClientBookSearch
}
