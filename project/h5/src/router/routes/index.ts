import type { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from './basic'

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/demo',
}

export const DemoRoute: RouteRecordRaw = {
  path: '/demo',
  name: 'Demo',
  component: () => import('@/views/demo/index.vue'),
  meta: {
    title: 'H5 组件演示',
  },
}

export const basicRoutes: RouteRecordRaw[] = [
  RootRoute,
  DemoRoute,
  PAGE_NOT_FOUND_ROUTE,
]
