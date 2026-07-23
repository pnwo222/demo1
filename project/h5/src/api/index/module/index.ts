import type { IGetModulePageParams, IGetModulePageResponse } from './types'
import { defHttp } from '@/utils/http'

/** 获取当前用户的首页模块分页 */
export function getModulePage(params?: IGetModulePageParams): Promise<IGetModulePageResponse> {
  return defHttp.get({
    url: '/client/c/module/page',
    params,
  }, {
    ignoreCancelToken: true,
  })
}
