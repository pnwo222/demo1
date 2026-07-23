import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function setupRouterGuard(router: Router) {
  createProgressGuard(router)
  createDocumentTitleGuard(router)
}

/** 路由切换进度条 */
export function createProgressGuard(router: Router) {
  NProgress.configure({ showSpinner: false, parent: '#app' })

  router.beforeEach(() => {
    NProgress.start()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

/** 页面标题属于通用路由行为，不依赖登录或权限认证。 */
export function createDocumentTitleGuard(router: Router) {
  router.afterEach((to) => {
    document.title = (to.meta?.title as string) || import.meta.env.VITE_APP_TITLE
  })
}
