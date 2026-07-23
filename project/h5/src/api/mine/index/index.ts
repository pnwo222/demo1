import type { IGetBalanceParams, IGetBalanceResponse } from './balance-types'
import { defHttp } from '@/utils/http'

export function getBalanceApi(params: IGetBalanceParams) {
  return defHttp.get<IGetBalanceResponse>({
    url: '/client/c/consume/balance',
    params,
  })
}

// 当期预约
export function getVisitMyselfApi() {
  return defHttp.get({
    url: '/client/c/visit/myself',
  })
}
