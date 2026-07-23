import type { IClientArticle } from '@/api/index/news/types'
import { ref } from 'vue'
import { getNewsDetail } from '@/api/index/news'

export function useNewsDetail() {
  const newsDetail = ref<IClientArticle>()

  async function getDetail(id: string) {
    try {
      const res = await getNewsDetail({ id })
      newsDetail.value = res
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    newsDetail,
    getDetail,
  }
}
