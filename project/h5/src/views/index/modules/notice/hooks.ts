import type { IClientNotice } from '@/api/index/notice/types'
import { chunk } from 'lodash-es'
import { ref } from 'vue'
import { getNoticePage } from '@/api/index/notice'

export function useNotice(autoLoad = true) {
  const noticeList = ref<IClientNotice[][]>([])

  const getNoticeList = async () => {
    try {
      const res = await getNoticePage({
        current: 1,
        size: 20,
      })

      noticeList.value = chunk(res.records, 2)
    }
    catch (error) {
      console.error(error)
    }
  }

  if (autoLoad) {
    getNoticeList()
  }

  return {
    noticeList,
    getNoticeList,
  }
}
