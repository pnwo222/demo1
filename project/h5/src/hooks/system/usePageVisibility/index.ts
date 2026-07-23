import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

export interface PageVisibilityOptions {
  /** 页面进入前台时的回调 */
  onShow?: () => void
  /** 页面进入后台时的回调 */
  onHide?: () => void
  /** 是否立即执行一次回调 */
  immediate?: boolean
}

export interface PageVisibilityReturn {
  /** 当前页面是否可见 */
  isVisible: Ref<boolean>
  /** 销毁监听器 */
  destroy: () => void
}

/**
 * 监听页面前后台切换
 * @param options 配置选项
 * @returns 页面可见性状态和控制方法
 */
export function usePageVisibility(options: PageVisibilityOptions = {}): PageVisibilityReturn {
  const { onShow, onHide, immediate = false } = options

  const isVisible = ref(!document.hidden)

  const handleVisibilityChange = () => {
    const visible = !document.hidden
    isVisible.value = visible

    if (visible) {
      onShow?.()
    }
    else {
      onHide?.()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 如果设置了立即执行，则执行一次回调
    if (immediate) {
      handleVisibilityChange()
    }
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  const destroy = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  return {
    isVisible,
    destroy,
  }
}

/**
 * 简化的页面可见性监听hook，专门用于登录页面
 * @param onHide 页面进入后台时的回调
 * @param onShow 页面进入前台时的回调
 */
export function useLoginPageVisibility(onHide?: () => void, onShow?: () => void) {
  return usePageVisibility({
    onHide,
    onShow,
    immediate: true,
  })
}
