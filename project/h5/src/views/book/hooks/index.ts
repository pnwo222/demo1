import { createModal } from '@/components/OpenModal'
import router from '@/router'
import BookDetail from '@/views/book/components/BookDetail/index.vue'
import FilterBox from '@/views/book/components/FilterBox/index.vue'

export function useBookDetail() {
  const { open: openDetail, close: closeDetail } = createModal({
    title: '书籍信息',
    content: BookDetail,
  })

  router.beforeEach(() => {
    closeDetail()
  })

  return {
    openDetail,
    closeDetail,
  }
}

export function useBookFilter(cb) {
  const { open: openFilter } = createModal({
    title: '全部筛选',
    content: FilterBox,
    onConfirm: (value: any) => {
      cb(value)
    },
  })

  return {
    openFilter,
  }
}
