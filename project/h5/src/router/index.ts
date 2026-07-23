import { createRouter, createWebHashHistory } from 'vue-router'
import { basicRoutes } from './routes'

// 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: basicRoutes,
  strict: true,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  },
})

// 导出路由实例，并在 `main.ts` 挂载
export default router
