import type { IGetBannerPageParams, IPageClientBanner } from './types'
import { defHttp } from '@/utils/http'

// 获取轮播图分页
export function getBannerPageApi(params?: IGetBannerPageParams) {
  return defHttp.get<IPageClientBanner>({
    url: '/client/c/banner/page',
    params,
  })
}
