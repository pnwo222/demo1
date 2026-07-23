import path from 'path'
import { viteVConsole } from 'vite-plugin-vconsole'

export function configVConsole(env: ViteEnv) {
  const { VITE_USE_VCONSOLE } = env
  return viteVConsole({
    entry: [path.resolve('src/main.ts')],
    // 本地运行是否显示
    localEnabled: VITE_USE_VCONSOLE,
    // test 包下 显示 vconsole
    enabled: VITE_USE_VCONSOLE,
    config: {
      maxLogNumber: 1000,
      theme: 'light',
    },
  })
}
