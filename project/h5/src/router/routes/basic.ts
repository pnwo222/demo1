import type { RouteRecordRaw } from 'vue-router'
import { EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '@/router/constant'

export const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: EXCEPTION_COMPONENT,
  meta: {
    title: '页面不存在',
  },
}
