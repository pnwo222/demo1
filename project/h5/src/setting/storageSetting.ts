/**
 * storage 全局配置
 */

import { isProdMode } from '@/utils/env'

/** 默认 localStorage 过期时间 秒, null 即不过期 */
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

/** 生产环境打开 storage 加密 */
export const enableStorageEncryption = isProdMode()

/** storage 使用的 AES 加密 key 和 iv 16位 */
export const cacheCipher = {
  key: '12487854512nbpin',
  iv: 'nbpin12487854512',
}
