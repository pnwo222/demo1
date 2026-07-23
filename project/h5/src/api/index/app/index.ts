import type { IGetAppPageParams, IGetAppPageResponse } from './types'
import { defHttp } from '@/utils/http'

/** 获取当前用户的应用分页 */
export function getAppPage(params?: IGetAppPageParams): Promise<IGetAppPageResponse> {
  return defHttp.get({
    url: '/client/c/app/page',
    params,
  }, {
    ignoreCancelToken: true,
  })
}
