import { ref, shallowRef } from 'vue'

type AnyObject = Record<string, unknown>

export interface InfiniteListPage {
  current: number
  size: number
}

export interface UseInfiniteListOptions<TItem, TParams extends AnyObject, TResult> {
  service: (params: TParams & InfiniteListPage) => Promise<TResult>
  initialParams?: TParams
  pageSize?: number
  immediate?: boolean
  getItems?: (result: TResult) => TItem[]
  getTotal?: (result: TResult) => number | undefined
  getHasMore?: (
    result: TResult,
    context: { current: number, size: number, pageItems: TItem[], total?: number },
  ) => boolean
}

function defaultItems<TResult, TItem>(result: TResult): TItem[] {
  const data = result as AnyObject
  return (data?.records || data?.list || data?.items || []) as TItem[]
}

function defaultTotal<TResult>(result: TResult): number | undefined {
  const data = result as AnyObject
  const total = data?.total
  return typeof total === 'number' ? total : undefined
}

export function useInfiniteList<
  TItem,
  TParams extends AnyObject = AnyObject,
  TResult = AnyObject,
>(options: UseInfiniteListOptions<TItem, TParams, TResult>) {
  const size = options.pageSize ?? 10
  const params = shallowRef<TParams>({ ...(options.initialParams || {}) } as TParams)
  const current = ref(1)
  const items = shallowRef<TItem[]>([])
  const loading = ref(false)
  const refreshing = ref(false)
  const finished = ref(false)
  const initialized = ref(false)
  const error = ref('')
  const requesting = ref(false)
  const pendingRefresh = ref(false)
  const lastFailedReset = ref(false)

  async function request(reset = false) {
    if (requesting.value) {
      if (reset)
        pendingRefresh.value = true
      return
    }
    if (!reset && finished.value)
      return

    requesting.value = true
    error.value = ''
    if (reset && initialized.value)
      refreshing.value = true
    else
      loading.value = true

    const requestPage = reset ? 1 : current.value
    try {
      const result = await options.service({
        ...(params.value as AnyObject),
        current: requestPage,
        size,
      } as TParams & InfiniteListPage)
      const pageItems = options.getItems
        ? options.getItems(result)
        : defaultItems<TResult, TItem>(result)
      const total = options.getTotal
        ? options.getTotal(result)
        : defaultTotal(result)

      if (reset)
        items.value = [...pageItems]
      else
        items.value.push(...pageItems)

      const hasMore = options.getHasMore
        ? options.getHasMore(result, { current: requestPage, size, pageItems, total })
        : total !== undefined
          ? items.value.length < total
          : pageItems.length >= size

      finished.value = !hasMore
      current.value = hasMore ? requestPage + 1 : requestPage
      initialized.value = true
      lastFailedReset.value = false
    }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : '加载失败，请点击重试'
      lastFailedReset.value = reset
    }
    finally {
      loading.value = false
      refreshing.value = false
      requesting.value = false
      if (pendingRefresh.value) {
        pendingRefresh.value = false
        await refresh()
      }
    }
  }

  async function loadMore() {
    await request(false)
  }

  async function refresh() {
    finished.value = false
    current.value = 1
    await request(true)
  }

  async function retry() {
    if (lastFailedReset.value || !items.value.length)
      await refresh()
    else
      await loadMore()
  }

  async function setParams(next: Partial<TParams>, refreshNow = true) {
    params.value = {
      ...(params.value as AnyObject),
      ...(next as AnyObject),
    } as TParams
    if (refreshNow)
      await refresh()
  }

  function reset() {
    current.value = 1
    items.value = []
    loading.value = false
    refreshing.value = false
    finished.value = false
    initialized.value = false
    error.value = ''
    pendingRefresh.value = false
    lastFailedReset.value = false
  }

  if (options.immediate !== false)
    void refresh()

  return {
    items,
    loading,
    refreshing,
    finished,
    initialized,
    error,
    current,
    size,
    params,
    loadMore,
    refresh,
    retry,
    setParams,
    reset,
  }
}
