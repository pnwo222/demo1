import type { CreateStorageParams } from './storageCache'
import { storePrefixKey } from '@/setting/globalSetting'
import { DEFAULT_CACHE_TIME, enableStorageEncryption } from '@/setting/storageSetting'
import { createStorage as create } from './storageCache'

export type Options = Partial<CreateStorageParams>

function createOptions(storage: Storage, options: Options = {}): Options {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: storePrefixKey,
    ...options,
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export function createStorage(storage: Storage = sessionStorage, options: Options = {}) {
  return create(createOptions(storage, options))
}

export function createSessionStorage(options: Options = {}) {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export function createLocalStorage(options: Options = {}) {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export default WebStorage
