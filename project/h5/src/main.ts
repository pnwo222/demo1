import { createApp } from 'vue'
import { registerGlobComp } from '@/components/registerGlobComp'
import { initGlobalPageVisibility } from '@/hooks/system/usePageVisibility/global'
import { setupRouterGuard } from '@/router/guard'
import { setupStore } from '@/store'
import App from './App.vue'
import { registerPlugins } from './components/registerPlugins'
import { registerGlobalProperties } from './globalProperties'
import router from './router'

import './shims-core.d'
// import 'vant/lib/index.css'
import 'virtual:uno.css'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

// Vant 桌面端适配
import '@vant/touch-emulator'
// svg
import 'virtual:svg-icons-register'

import './app.less'

console.log('[MODE]:', import.meta.env.MODE)

async function bootstrap() {
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 注册全局组件
  registerGlobComp(app)

  registerPlugins(app)

  // globalProperties 全局方法
  registerGlobalProperties(app)

  // 初始化全局页面可见性监听
  initGlobalPageVisibility()

  setupRouterGuard(router)

  app.use(router)

  app.mount('#app')
}

bootstrap()
