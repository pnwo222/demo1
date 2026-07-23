import type { ILangArr } from './lang'
import { useStorage } from '@/hooks/system/useStorage'
import i18n, { getCurrentLang, importLocLang, messages } from '@/locales'
import { STORAGE_LANG_KEY } from '@/store/mutation-type'
import { langArr, langMap } from './lang'

// i18n
export const useI18n = i18n.global
/** 内置方法 t, setLocaleMessage */
export const { t, locale, setLocaleMessage } = useI18n

/** 所有语言类型 集合 */
export const LANG_ALL = langArr

/** 所有语言类型 map */
export const LANG_MAP = langMap

/** 获取 lang 目录下已配置的语言类型 集合 */
export function useLangList(): ILangArr[] {
  return messages.map((e) => {
    return {
      value: e,
      name: langMap[e].name,
      // 根据 langArr 的顺序排序
      sort: langArr.findIndex(m => m.value === e),
    }
  }).sort((a, b) => {
    return a.sort - b.sort
  })
}

/** 获取当前语言 function */
export const useCurrentLang = getCurrentLang

/** 当前语言 */
export const currentLang = ref<string>(getCurrentLang())

/** 切换语言 */
export async function useChangeLang(value: string) {
  await importLocLang(value)
  useStorage.ls.set(STORAGE_LANG_KEY, value)
}

watch(currentLang, (value: string) => {
  useChangeLang(value)
})
