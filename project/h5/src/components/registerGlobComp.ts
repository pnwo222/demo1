/**
 * 全局组件注册
 * components目录下的组件会自动注册
 */
import type { App } from 'vue'
import Empty from '@/components/Empty/index.vue'
import { SvgIcon } from '@/icons'

export function registerGlobComp(app: App) {
  app.use(SvgIcon)
  app.component('Empty', Empty)
}
