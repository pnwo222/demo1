import type { IClientModulExtends } from './types'
import { ref } from 'vue'
import { getModulePage } from '@/api/index/module'

export function useModule() {
  const moduleList = ref<IClientModulExtends[]>([])
  const getModulePageData = async () => {
    getModulePage().then((res) => {
      moduleList.value = res.records.map((e) => {
        return {
          ...e,
          list: JSON.parse(e.imageList),
        }
      })
    })
  }

  getModulePageData()

  return {
    moduleList,
    getModulePageData,
  }
}
