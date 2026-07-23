import type { IClientActivity } from '@/api/index/activity/types'
import { ref } from 'vue'
import { getActivityDetail } from '@/api/index/activity'

export function useActivityDetail() {
  const activityDetail = ref<IClientActivity>()

  async function getDetail(id: string) {
    try {
      const res = await getActivityDetail({ id })
      activityDetail.value = res
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    activityDetail,
    getDetail,
  }
}
