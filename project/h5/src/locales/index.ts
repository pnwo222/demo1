import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { useStorage } from '@/hooks/system/useStorage'
import { STORAGE_LANG_KEY } from '@/store/mutation-type'

const JSON = import.meta.glob('./lang/*.json')

/** lang 目录下的所有 key 示例: ['zh', 'en', 'jp'] */
export const messages = []
for (const key in JSON) {
  const KEY = key.replace(/.\/lang\//, '').replace(/.json/, '')
  messages.push(KEY)
}

/** 获取当前语言 */
export const getCurrentLang = (): string => useStorage.ls.get(STORAGE_LANG_KEY) || 'zh'

const i18n: any = createI18n({
  legacy: false, // 使用 Composition API 模式，则需要将其设置为false
  globalInjection: true, // 全局生效$t
  locale: '', // 默认cn翻译
  messages: {},
})

export default i18n

/** 懒加载语言json, 只有在切换语言时才会 加载json */
export async function importLocLang(langKey) {
  const lang = await import(`./lang/${langKey}.json`)
  i18n.global.setLocaleMessage(langKey, lang)
  i18n.global.locale.value = langKey
}

export async function installI18n(app: App) {
  app.use(i18n)
  importLocLang(getCurrentLang())
}
