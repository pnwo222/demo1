import type { IGetNoticePageParams, IGetNoticePageResponse } from './types'
import { defHttp } from '@/utils/http'

export function getNoticePage(params: IGetNoticePageParams) {
  return defHttp.get<IGetNoticePageResponse>({
    url: '/client/c/notice/page',
    params,
  })
}

export function getNoticeDetail(params: { id: string }) {
  return defHttp.get({
    url: '/client/c/notice/detail',
    params,
  })
}
