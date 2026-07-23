import type { IUserInfo } from '@/api/user/types'

export interface IUserInfoExtends extends IUserInfo {
  /** 未脱敏的手机号 */
  realPhone?: string

  /** 姓名 */
  realName?: string

  /** 录取年份 */
  year?: string

  /** 是否已认证 */
  isCheck?: boolean

  /** 入职年份 */
  tYear?: string

}
