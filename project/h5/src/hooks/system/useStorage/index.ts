import type { Ref } from 'vue'
import { debounceFilter, pausableWatch } from '@vueuse/core'
import { createLocalStorage, createSessionStorage } from '@/utils/cache'

export interface UseStorageOptions {
  /** 是否覆盖值 */
  overWrite: boolean
}

/** 设置 storage */
export const useStorage = {
  ls: createLocalStorage(),
  ss: createSessionStorage(),
}

/** 双向绑定 local storage */
export function getLocalStorage<T extends (string | number | boolean | object | null)>(key: string, defaultData?: any, options?: UseStorageOptions): Ref<T> {
  return getStorage(key, 'ls', defaultData, options)
}

/** 双向绑定 session storage */
export function getSessionStorage<T extends (string | number | boolean | object | null)>(key: string, defaultData?: any, options?: UseStorageOptions): Ref<T> {
  return getStorage(key, 'ss', defaultData, options)
}

export function getStorage<T extends (string | number | boolean | object | null)>(key: string, type = 'ls', defaultData?: any, options?: UseStorageOptions): Ref<T> {
  const { overWrite } = options || {}

  const data = ref(defaultData || null)
  const { pause: pauseWatch, resume: resumeWatch } = pausableWatch(
    data,
    () => {
      useStorage[type].set(key, data.value)
    },
    { flush: 'pre', deep: true, eventFilter: debounceFilter(300) },
  )

  update()

  return data

  function update() {
    pauseWatch()
    try {
      const value = useStorage[type].get(key)
      if ((defaultData && !value) || (defaultData && overWrite))
        useStorage[type].set(key, defaultData)

      data.value = useStorage[type].get(key)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      resumeWatch()
    }
  }
}
