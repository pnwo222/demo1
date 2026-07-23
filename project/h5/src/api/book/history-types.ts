// 用户当前借阅信息相关类型定义

// 排序项
export interface IOrderItem {
  /** 排序列 */
  column: string
  /** 是否升序 */
  asc: boolean
}

// 用户当前借阅信息
export interface IClientBook {
  /** 借阅ID */
  loanId: string
  /** 用户ID */
  userId: string
  /** 用户所属成员馆代码 */
  userLibCode: string
  /** 用户所属馆名称 */
  userLibName: string
  /** 应还日期 */
  normReturnDate: string
  /** 续借次数 */
  renewTimes: number
  /** 催还次数 */
  recallTimes: number
  /** 借出日期 */
  loanDate: string
  /** 馆藏地id */
  locationId: number
  /** 馆藏地名称 */
  locationName: string
  /** 图书所属分馆代码 */
  itemLibCode: string
  /** 图书所属分馆名称 */
  itemLibName: string
  /** 借书流通台id */
  loanDeskId: string
  /** 借书流通台名称 */
  loanDeskName: string
  /** 附件 */
  attachment: string
  /** 续借日期 */
  renewDate: string
  /** 操作类型 0表示借阅 1表示续借 2表示催还 */
  loanType: string
  /** 题名 */
  title: string
  /** 作者 */
  author: string
  /** 出版社 */
  publisher: string
  /** isbn */
  isbn: string
  /** 出版年 */
  publishYear: string
  /** isbn10位 */
  isbn10: string
  /** isbn13位 */
  isbn13: string
  /** 图书条码号 */
  barcode: string
  /** 元数据记录号 */
  recordId: string
}

// 分页用户借阅信息结果
export interface IPageClientBook {
  /** 记录列表 */
  records: IClientBook[]
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
export interface ICommonResultPageClientBook {
  /** 状态码 */
  code: number
  /** 提示语 */
  msg: string
  /** 数据 */
  data: IPageClientBook
}
