import type { IDepartment, IVisitApplyParams, IVisitPageResponse } from './types'

import { defHttp } from '@/utils/http'

/** 获取访客申请时的学校部门列表 */
export function getDepart(params?: Record<string, any>) {
  return defHttp.get({
    url: '/client/c/visit/depart/page',
    params,
  })
}

/** 发起访客申请 */
export function apply(params) {
  return defHttp.post({
    url: '/client/c/visit/apply',
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/** 获取用户访客记录列表 */
export function getVisitPage(params?: Record<string, any>) {
  return defHttp.get<IVisitPageResponse>({
    url: '/client/c/visit/page',
    params,
  }, {
    simpleCancel: true,
  })
}

export function geTeacher(params?: Record<string, any>) {
  return defHttp.get({
    url: '/client/c/teacher/page',
    params,
  })
}
