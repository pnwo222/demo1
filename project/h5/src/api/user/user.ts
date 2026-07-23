import type { IGetUserInfoParams, IGetUserInfoResponse } from './types'
import { defHttp } from '@/utils/http'

/** 获取用户信息 */
export function getUserInfo(params?: IGetUserInfoParams): Promise<IGetUserInfoResponse> {
  return defHttp.get({
    url: '/auth/c/getLoginUser',
    params,
  }, {
    ignoreCancelToken: true,
  })
}

export function getCat(data: any) {
  return defHttp.get({
    url: '/getCat',
    data,
  })
}

/** 身份选择 */
export function selectIdentity(params: {
  // 0 无 1.学生/校友；2.教职工
  identity: string
}) {
  return defHttp.get({
    url: '/auth/c/selectIdentity',
    params,
  })
}

// 社保二维码
export function getSbQrCode() {
  return defHttp.get({
    url: '/auth/c/feryy/getQrCode',
  })
}

// 申请社保卡
export function applySbCard(data: any) {
  return defHttp.post({
    url: '/client/c/applycard/add',
    data,
  })
}

// 激活
export function activateAccount(data: any) {
  return defHttp.post({
    url: '/auth/c/activateAccount',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

// /auth/c/activate/check
export function check() {
  return defHttp.post({
    url: '/auth/c/activate/check',
  }, {
    isTransformValidateResponse: true,
  })
}

// 更新用户信息
export function updateUserInfo(data: any) {
  return defHttp.post({
    url: '/client/c/userCenter/updateUserInfo',
    data,
  })
}
