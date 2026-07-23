import type { IClientNotice } from '@/api/index/notice/types'
import { ref } from 'vue'
import { getNoticeDetail } from '@/api/index/notice'

export function useNoticeDetail() {
  const noticeDetail = ref<IClientNotice>()
  async function getDetail(id: string) {
    try {
      const res = await getNoticeDetail({ id })
      try {
        res.fileList = JSON.parse(res.fileList)
      }
      catch (error) {
        res.fileList = []
      }
      noticeDetail.value = res
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    noticeDetail,
    getDetail,
  }
}
