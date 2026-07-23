import type { ConfigProviderTheme, ConfigProviderThemeVars } from 'vant'
import { useStorage } from '@/hooks/system/useStorage'
import { APP_THEME } from '@/store/mutation-type'
import { ETheme } from './types'

/**
 * vant 组件样式覆盖，不影响全局样式
 */
export const themeVars = reactive<ConfigProviderThemeVars>({

})

/** 当前主题 */
export const theme = ref<ConfigProviderTheme>(useStorage.ls.get(APP_THEME) || 'light')

/** 是否暗黑模式 */
export const isDark = (): boolean => theme.value === ETheme.DARK

/**
 * 切换主题
 * dark | light
 */
export function useTheme(value?: ETheme) {
  if (value)
    theme.value = value

  return { theme }
}

watch(theme, (value) => {
  document.querySelector('html')
    .setAttribute('data-theme', value)
  useStorage.ls.set(APP_THEME, value, null)
}, {
  immediate: true,
})
