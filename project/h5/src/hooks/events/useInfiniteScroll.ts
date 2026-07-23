import type { Ref } from 'vue'
import { get, uniqueId } from 'lodash-es'
import { computed, nextTick, onMounted, ref } from 'vue'

export interface InfiniteScrollOptions {
  /** 数据加载函数 */
  loadData: (params: any) => Promise<any>
  formatData?: (data: any) => any
  maxNum?: number
  /** 请求参数 */
  params?: any
  /** 每页数量，默认 20 */
  pageSize?: number
  /** 初始页码，默认 1 */
  initialPage?: number
  /** 距离底部多少像素时触发加载，默认 50 */
  threshold?: number
  /** 是否自动加载第一页，默认 true */
  autoLoad?: boolean
  /** 是否启用加载更多，默认 true */
  enabled?: boolean
  /** 自定义滚动容器，默认 window */
  scrollContainer?: HTMLElement | null
  resultField: string
  /** 不是分页 */
  notPageList?: boolean
}

export interface InfiniteScrollState {
  /** 数据列表 */
  data: any[]
  /** 当前页码 */
  page: number
  /** 是否正在加载 */
  loading: boolean
  /** 是否正在加载更多 */
  loadingMore: boolean
  /** 是否还有更多数据 */
  hasMore: boolean
  /** 是否出错 */
  error: boolean
  /** 错误信息 */
  errorMessage: string
  /** 总数据量 */
  total: number
  /** 是否为空 */
  isEmpty: boolean
  /** 是否已初始化 */
  initialized: boolean
}

export interface InfiniteScrollActions {
  /** 刷新数据 */
  refresh: () => Promise<void>
  /** 加载更多 */
  loadMore: (query?: any) => Promise<void>
  /** 重置状态 */
  reset: () => void
  /** 手动设置数据 */
  setData: (data: any[]) => void
  /** 添加数据到列表 */
  addData: (data: any[]) => void
  /** 设置加载函数 */
  setFetch: (fetch: (params: any) => Promise<any>) => void
}

function getResult(data, resultField) {
  if (!resultField) {
    return data
  }
  return get(data, resultField)
}

export function useInfiniteScroll(
  options: InfiniteScrollOptions,
): [Ref<InfiniteScrollState>, InfiniteScrollActions] {
  const {
    // loadData,
    formatData,
    maxNum,
    params,
    pageSize = 20,
    initialPage = 0,
    autoLoad = true,
    enabled = true,
    resultField = 'list',
    notPageList = false,
  } = options

  function setFetch(fetch: (params: any) => Promise<any>) {
    options.loadData = fetch
  }

  // 状态管理
  const state = ref<InfiniteScrollState>({
    data: [],
    page: initialPage,
    loading: false,
    loadingMore: false,
    hasMore: true,
    error: false,
    errorMessage: '',
    total: 0,
    isEmpty: false,
    initialized: false,
  })

  // 计算属性
  const isEmpty = computed(() => !state.value.loading && state.value.data.length === 0)
  const isLoading = computed(() => state.value.loading || state.value.loadingMore)

  // 加载数据
  const loadDataInternal = async (isLoadMore = false, query?: any) => {
    try {
      if (isLoadMore) {
        state.value.loadingMore = true
      }
      else {
        state.value.loading = true
      }

      state.value.error = false
      state.value.errorMessage = ''

      const res = await options.loadData({
        // page: state.value.page,
        current: state.value.page,
        size: pageSize,
        ...params,
        ...query,
      })

      let result = res
      if (notPageList) {
        result = {
          list: res,
          total: res.length,
        }
      }

      state.value.hasMore = (state.value.data.length < (maxNum ? (Math.min(maxNum || 0, result.total)) : result.total)) && getResult(result, resultField).length
      if (state.value.hasMore) {
        if (isLoadMore) {
          // 加载更多时，追加数据
          // eslint-disable-next-line ts/no-use-before-define
          addData(formatData ? formatData(getResult(result, resultField)) : getResult(result, resultField))
        }
        else {
          // 刷新时，替换数据
          // eslint-disable-next-line ts/no-use-before-define
          setData(formatData ? formatData(getResult(result, resultField)) : getResult(result, resultField))
        }
      }

      console.log('result', state)

      state.value.total = result.total
      state.value.isEmpty = isEmpty.value
      state.value.initialized = true

      state.value.loading = false
      state.value.loadingMore = false
    }
    catch (error: any) {
      state.value.error = true
      state.value.errorMessage = error?.message || '加载失败'

      state.value.loading = false
      state.value.loadingMore = false
      state.value.hasMore = false
      console.error('InfiniteScroll loadData error:', error)
    }
    finally {
      console.log('loadDataInternal finally')
      // state.value.loading = false
      // state.value.loadingMore = false
    }
  }

  // 加载更多
  const loadMore = async (query?: any) => {
    // console.log('loadMore', state.value.loading, state.value.loadingMore)
    // if (!state.value.hasMore || isLoading.value || state.value.error) {
    //   return
    // }

    console.log('loadMore')

    console.log('[params]', params)

    state.value.page += 1
    await loadDataInternal(true, query)
  }

  // 刷新数据
  const refresh = async () => {
    state.value.page = initialPage
    state.value.hasMore = true
    state.value.error = false
    state.value.errorMessage = ''
    await loadDataInternal(false)
  }

  // 重置状态
  const reset = () => {
    state.value = {
      data: [],
      page: initialPage,
      loading: false,
      loadingMore: false,
      hasMore: true,
      error: false,
      errorMessage: '',
      total: 0,
      isEmpty: false,
      initialized: false,
    }
  }

  // 手动设置数据
  const setData = (data: any[]) => {
    state.value.data = data
    state.value.isEmpty = data.length === 0
  }

  // 添加数据到列表
  const addData = (data: any[]) => {
    data = data.map(item => ({ ...item, _id: uniqueId() }))
    state.value.data = [...state.value.data, ...data]
    state.value.isEmpty = state.value.data.length === 0
  }

  // 生命周期
  onMounted(() => {
    if (enabled) {
      if (autoLoad) {
        nextTick(() => {
          // refresh()
        })
      }
    }
  })

  // 返回状态和操作方法
  return [
    state,
    {
      refresh,
      loadMore,
      reset,
      setData,
      addData,
      setFetch,
    },
  ]
}
