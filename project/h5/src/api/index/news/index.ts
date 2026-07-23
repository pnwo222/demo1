import type { IGetNewsPageParams, IGetNewsPageResponse } from './types'
import { defHttp } from '@/utils/http'

export function getNewsPage(params: IGetNewsPageParams) {
  return defHttp.get<IGetNewsPageResponse>({
    url: '/client/c/article/page',
    params,
  })
}

export function getNewsDetail(params: { id: string }) {
  return defHttp.get({
    url: '/client/c/article/detail',
    params,
  })
}
