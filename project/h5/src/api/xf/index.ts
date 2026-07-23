import type { IGetXfListTodayParams, IGetXfListTodayResponse } from './types'
import { defHttp } from '@/utils/http'

export function getXfListTodayApi(params: IGetXfListTodayParams) {
  return defHttp.get<IGetXfListTodayResponse>({
    url: '/client/c/consume/today',
    params,
  })
}

export function getXfListHistoryApi(params: IGetXfListTodayParams) {
  return defHttp.get<IGetXfListTodayResponse>({
    url: '/client/c/consume/history',
    params,
  })
}
