import type { App } from 'vue'

const { VITE_USE_I18N } = process.env as ViteEnv

export async function registerPlugins(app: App) {
  // 加载 i18n
  if (VITE_USE_I18N) {
    const { installI18n } = await import('@/locales')
    installI18n(app)
  }
}
