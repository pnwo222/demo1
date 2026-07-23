import type { IClientApp } from '@/api/index/app/types'
import { ref } from 'vue'
import { getAppPage } from '@/api/index/app'
import { requireImage } from '@/utils/require'

export function useApp(isMore = false) {
  const appList = ref<IClientApp[]>([])

  const getAppList = async () => {
    try {
      const res = await getAppPage()

      const more = [
        {
          id: 'more',
          name: '更多',
          image: requireImage('image/index/icon-5@2x.png'),
          url: '',
          priorityLevel: 9999,
        },
      ]

      if (isMore) {
        appList.value = [
          ...res.records,
        ]
      }
      else {
        appList.value = [
          ...res.records.filter((_, i) => i < 4),
          // ...res.records.filter((_, i) => i < 2),
          ...(res.records.length >= 5 ? more : []),
        ]
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  getAppList()

  return {
    appList,
    getAppList,
  }
}
