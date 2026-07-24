import { describe, expect, it, vi } from 'vitest'
import { useInfiniteList } from '@/hooks/events/useInfiniteList'

interface Item {
  id: number
}

interface Result {
  records: Item[]
  total: number
}

describe('useInfiniteList', () => {
  it('loads pages and marks the list as finished', async () => {
    const service = vi.fn(async ({ current, size }) => ({
      records: Array.from(
        { length: current === 1 ? size : 1 },
        (_, index) => ({ id: (current - 1) * size + index + 1 }),
      ),
      total: 4,
    }))
    const list = useInfiniteList<Item, Record<string, never>, Result>({
      service,
      pageSize: 3,
      immediate: false,
      getItems: result => result.records,
      getTotal: result => result.total,
    })

    await list.loadMore()
    expect(list.items.value).toHaveLength(3)
    expect(list.finished.value).toBe(false)

    await list.loadMore()
    expect(list.items.value).toHaveLength(4)
    expect(list.finished.value).toBe(true)
    expect(service).toHaveBeenCalledTimes(2)
  })

  it('keeps the current items when append loading fails and retries', async () => {
    let fail = false
    const service = vi.fn(async ({ current }) => {
      if (fail)
        throw new Error('加载失败')
      return {
        records: [{ id: current }],
        total: 2,
      }
    })
    const list = useInfiniteList<Item, Record<string, never>, Result>({
      service,
      pageSize: 1,
      immediate: false,
      getItems: result => result.records,
      getTotal: result => result.total,
    })

    await list.loadMore()
    fail = true
    await list.loadMore()
    expect(list.items.value).toEqual([{ id: 1 }])
    expect(list.error.value).toBe('加载失败')

    fail = false
    await list.retry()
    expect(list.items.value).toEqual([{ id: 1 }, { id: 2 }])
    expect(list.error.value).toBe('')
  })

  it('retries a failed refresh as a refresh when items already exist', async () => {
    let requestCount = 0
    const service = vi.fn(async (params: InfiniteListTestParams) => {
      requestCount += params.current
      if (requestCount === 2)
        throw new Error('刷新失败')
      return {
        records: [{ id: requestCount }],
        total: 1,
      }
    })
    const list = useInfiniteList<Item, Record<string, never>, Result>({
      service,
      immediate: false,
      getItems: result => result.records,
      getTotal: result => result.total,
    })

    await list.loadMore()
    await list.refresh()
    await list.retry()

    expect(service.mock.calls.map(([params]) => params.current)).toEqual([1, 1, 1])
    expect(list.error.value).toBe('')
    expect(list.items.value).toEqual([{ id: 3 }])
  })

  it('queues a refresh while another request is running', async () => {
    let resolveFirst: (value: Result) => void = () => {}
    const firstResult = new Promise<Result>((resolve) => {
      resolveFirst = resolve
    })
    const service = vi.fn()
      .mockReturnValueOnce(firstResult)
      .mockResolvedValueOnce({ records: [{ id: 9 }], total: 1 })
    const list = useInfiniteList<Item, Record<string, never>, Result>({
      service,
      immediate: false,
      getItems: result => result.records,
      getTotal: result => result.total,
    })

    const loading = list.loadMore()
    await list.refresh()
    resolveFirst({ records: [{ id: 1 }], total: 2 })
    await loading

    expect(service).toHaveBeenCalledTimes(2)
    expect(list.items.value).toEqual([{ id: 9 }])
    expect(list.finished.value).toBe(true)
  })
})

interface InfiniteListTestParams {
  current: number
  size: number
}
