/** 余额信息响应类型 */
export interface IBalanceResponse {
  /** 物理卡号（卡序列号） */
  wlkh: string
  /** 账号类型 */
  zhlx: string
  /** 账号类型名称 */
  zhlxmc: string
  /** 账号余额 */
  ye1: string
  /** 卡上余额 */
  ye2: string
  /** 卡类型 */
  klx: string
}

/** 获取余额请求参数类型 */
export interface IGetBalanceParams {
  // 暂无额外参数，可根据实际需求添加
}

/** 获取余额响应类型 */
export interface IGetBalanceResponse {
  records: IBalanceResponse[]
}
