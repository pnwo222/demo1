import type { IGetAccessListParams, IGetAccessListResponse } from './types'
import { defHttp } from '@/utils/http'

export function getAccessListApi(params: IGetAccessListParams) {
  return defHttp.get<IGetAccessListResponse>({
    url: '/client/c/access/list',
    params,
  })
}
