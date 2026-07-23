import type { IClientBanner } from '@/api/index/banner/types'
import { getBannerPageApi } from '@/api/index/banner'

export function useBanner() {
  const list = ref<IClientBanner[]>([])

  async function getBanner() {
    const res = await getBannerPageApi()
    list.value = res.records
  }

  getBanner()

  return {
    list,
    getBanner,
  }
}
