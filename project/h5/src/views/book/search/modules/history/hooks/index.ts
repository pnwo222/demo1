import { getLocalStorage } from '@/hooks/system/useStorage'

const list = getLocalStorage<{
  value: string
  type: string
}[]>('book-search-history', [])
export function useHistory() {
  const hasHistory = computed(() => list.value && list.value.length > 0)

  function save(value: string, type: string) {
    const item = list.value.find(item => item?.value === value)
    if (item) {
      list.value.splice(list.value.indexOf(item), 1)
    }
    list.value.unshift({
      value,
      type,
    })
  }

  function clear() {
    list.value = []
  }

  return {
    list,
    hasHistory,
    save,
    clear,
  }
}
