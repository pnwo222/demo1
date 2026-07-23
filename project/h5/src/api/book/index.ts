import type { IClientBook, ICommonResultPageClientBook } from './history-types'
import type { IBookSearchParams, ICommonResultPageClientBookSearch } from './search-types'

import { defHttp } from '@/utils/http'

export function getBookSearchApi(params: IBookSearchParams) {
  return defHttp.get<ICommonResultPageClientBookSearch>({
    url: '/client/c/book/search',
    params,
  })
}

// 获取用户当前借阅信息
export function getBookBorrowNowApi(params) {
  return defHttp.get<ICommonResultPageClientBook>({
    url: '/client/c/book/borrowNow',
    params,
  })
}

// 获取用户历史借阅信息
export function getBookBorrowHisApi(params) {
  return defHttp.get<ICommonResultPageClientBook>({
    url: '/client/c/book/borrowHis',
    params,
  })
}

// 获取新书推荐列表，给前20本
export function getBookNewListApi(params) {
  return defHttp.get<ICommonResultPageClientBook>({
    url: '/client/c/book/newList',
    params,
  })
}

// 获取图书借阅排行榜，给前20本
export function getBookRankListApi(params) {
  return defHttp.get<ICommonResultPageClientBook>({
    url: '/client/c/book/borrowList',
    params,
  })
}
