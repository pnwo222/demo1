import Compressor from 'compressorjs'
import dayjs from 'dayjs'
import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es'
import { isArray, isObject } from '@/utils/is'
import { getOrientation, isPcDevice } from './device'

export function camelize(str: string): string {
  const camelizeRE = /-(\w)/g
  return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

export function getAppCode() {
  return `${camelize(import.meta.env.VITE_APP_CODE || 'STORE_')}`
}

// px2vw
export function px2vw(px: number | string): string {
  // 在pc端或横屏下不转换
  if (isPcDevice() || !getOrientation()) {
    return String(px)
  }
  const designWidth = Number(process.env.VITE_VW_WIDTH)
  return `${(100 / designWidth) * Number(px)}vw`
}

/** 获取 url 后缀名 */
export interface IUrlSuffix {
  /** 后缀完整名字 例如：name.jpg */
  fullName: string
  /** 后缀文件名 例如：name */
  name: string
  /** 文件类型 例如：.jpg */
  suffix: string
  /** 文件类型名 例如：jpg */
  suffixName: string
  /** 排除后缀后的URL 例如：http://localhost:8000/img */
  url: string
}
export function getUrlSuffix(URL): IUrlSuffix {
  const last = URL.lastIndexOf('/')
  /** 截取文件名称和后缀 */
  const fullName = URL.substring(last + 1)
  /** 截取路径字符串 */
  const url = URL.substring(0, last)
  /** 截取文件名 */
  const name = fullName.substring(0, fullName.lastIndexOf('.'))
  /** 截取后缀 */
  const suffix = URL.substring(URL.lastIndexOf('.'))
  /** 截取后缀名 */
  const suffixName = URL.substring(URL.lastIndexOf('.') + 1)

  return {
    fullName,
    name,
    suffix,
    suffixName,
    url,
  }
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target)
    return source as T & U

  if (!source)
    return target as T & U

  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual)
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual)
        case 'concat':
          return sourceValue.concat(targetValue)
        case 'replace':
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObject(targetValue) && isObject(sourceValue))
      return deepMerge(sourceValue, targetValue, mergeArrays)

    return undefined
  })
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * 压缩图片，
 * jpg才受quality影响，
 * png可通过设置 maxWidth 来限制
 */
export async function compressor(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      // 默认 jpg：0.92，webp：0.8
      // quality: 0.8,
      // 图片最大宽度
      maxWidth: 1000,
      // png 超过5兆默认会压缩成jpg，设置为 Infinity 不生效
      // convertSize: 5000000,
      success: resolve,
      error: reject,
    })
  })
}

// 随机数
export function getRandom(num = 16) {
  const len = num
  const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }

  return pwd
}

export function getPwdConditions(password: string) {
  const conditions = {
    // length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~£€¥]/.test(password),
  }

  const metConditions = Object.values(conditions).filter(Boolean).length

  return metConditions
}

export function formatLatestTime(time: string) {
  if (!time) return ''

  const now = dayjs()
  const targetTime = dayjs(time)
  const diffMinutes = now.diff(targetTime, 'minute')
  const diffHours = now.diff(targetTime, 'hour')
  const diffDays = now.diff(targetTime, 'day')
  const diffWeeks = now.diff(targetTime, 'week')
  // const diffMonths = now.diff(targetTime, 'month')
  const diffYears = now.diff(targetTime, 'year')

  // 1小时内：X分钟前，最少显示1分钟前
  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)}分钟前`
  }
  // 当天内：X小时前
  else if (diffHours < 24) {
    return `${diffHours}小时前`
  }
  // 一周内：X天前
  else if (diffDays < 7) {
    return `${diffDays}天前`
  }
  // 当月内：X周前
  else if (diffWeeks < 4) {
    return `${diffWeeks}周前`
  }
  // 当年内：MM-DD格式
  else if (diffYears === 0) {
    return targetTime.format('MM-DD')
  }
  // 非当年：YYYY-MM-DD格式
  else {
    return targetTime.format('YYYY-MM-DD')
  }
}

/** 手机号校验 */
export function validatePhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function maskName(name: string) {
  if (!name) return ''
  if (name.length <= 1) return name
  return '*'.repeat(name.length - 1) + name.slice(-1)
}

// 手机号脱敏
export function maskPhone(phone: string) {
  if (!phone) return ''
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

// 身份证脱敏 只保留最后四位
export function maskIdCard(idCard: string) {
  if (!idCard) return ''
  return `**********${idCard.slice(-4)}`
}
