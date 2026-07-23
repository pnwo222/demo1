import type { App } from 'vue'
import { px2vw } from '@/utils'

/** 注册全局参数 */
export function registerGlobalProperties(app: App) {
  // 内联样式 px 转 vw
  app.config.globalProperties.px2vw = px2vw
  // 引入 assets 下的图片
  app.config.globalProperties.requireImage = function (url: string): string {
    return new URL(`/src/assets/${url}`, import.meta.url).href
  }
}
