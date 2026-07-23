import type { ConfigEnv, UserConfig } from 'vite'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import { loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import { createOptimizeDeps } from './build/vite/optimizeDeps'
import { createVitePlugins } from './build/vite/plugin'
import { createProxy } from './build/vite/proxy'
import { createViewport } from './build/vite/viewport'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const isBuild = command === 'build'

  const viteEnv = wrapperEnv(env)

  const { VITE_PROXY, VITE_PORT } = viteEnv

  return {
    base: env.VITE_PUBLIC_PATH,
    define: {
      'process.env': JSON.stringify(viteEnv),
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          createViewport(viteEnv),
        ],
      },
    },

    build: {
      outDir: env.VITE_APP_CODE,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 2048,
      reportCompressedSize: false,
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            // 'vue': ['vue', 'pinia', 'vue-router'],
            'vue-i18n': ['vue-i18n'],
            'compressorjs': ['compressorjs'],
          },
        },
      },
    },

    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    server: {
      host: true,
      // https: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },

    optimizeDeps: {
      include: [
        ...createOptimizeDeps(),
      ],
    },
  }
}
