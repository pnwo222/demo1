import type { PluginOption } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { configAutoImport } from './autoImport'
import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
// import { configMockPlugin } from './mock'
import { configResolveComponents } from './resolveComponent'
import { configSvgIconsPlugin } from './svgSprite'
import { configVConsole } from './vconsole'
import { configVisualizerConfig } from './visualizer'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    // VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_UNOCSS,
    VITE_USE_VCONSOLE,
    VITE_USE_REPORT,
    // VITE_LEGACY_BROWSER,
  } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    vueJsx(),
  ]

  // 使用 UnoCSS
  VITE_USE_UNOCSS && vitePlugins.push(UnoCSS())

  // 组件自动引入
  vitePlugins.push(configResolveComponents())

  // vue 类型自动引入
  vitePlugins.push(configAutoImport())

  // 使用 vconsole
  VITE_USE_VCONSOLE && vitePlugins.push(configVConsole(viteEnv))

  // 视图依赖分析文件
  VITE_USE_REPORT && vitePlugins.push(configVisualizerConfig())

  // @vitejs/plugin-legacy
  VITE_LEGACY && isBuild && vitePlugins.push(legacy({
    targets: ['chrome >= 51'],
  }))

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin())

  // 使用mock
  // VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  if (isBuild) {
    // gzip压缩
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE))
  }

  return vitePlugins
}
