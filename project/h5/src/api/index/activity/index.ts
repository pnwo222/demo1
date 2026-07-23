import type { IGetActivityPageParams, IGetActivityPageResponse } from './types'
import { defHttp } from '@/utils/http'

export function getActivityPage(params: IGetActivityPageParams) {
  return defHttp.get<IGetActivityPageResponse>({
    url: '/client/c/activity/page',
    params,
  })
}

export function getActivityDetail(params: { id: string }) {
  return defHttp.get({
    url: '/client/c/activity/detail',
    params,
  })
}
