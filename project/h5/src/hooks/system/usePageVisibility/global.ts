import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 全局页面可见性状态
 */
export const globalPageVisibility = ref(!document.hidden)

/**
 * 全局页面可见性监听器
 * 可以在应用的任何地方使用，用于监听页面的前后台切换
 */
export function useGlobalPageVisibility() {
  const isVisible = globalPageVisibility
  
  const handleVisibilityChange = () => {
    globalPageVisibility.value = !document.hidden
  }
  
  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })
  
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
  
  return {
    isVisible,
  }
}

/**
 * 初始化全局页面可见性监听
 * 应该在应用启动时调用一次
 */
export function initGlobalPageVisibility() {
  const handleVisibilityChange = () => {
    globalPageVisibility.value = !document.hidden
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}