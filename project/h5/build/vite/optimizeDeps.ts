import fs from 'fs'

/**
 * 本地依赖预加载 防止 vite reload
 * 可以往 optimizeDeps 中添加
 */
export function createOptimizeDeps() {
  const optimizeDeps = ['vant/es', 'lodash-es']

  // 获取vant目录
  fs.readdirSync('node_modules/vant/es').forEach((dirname) => {
    if (fs.existsSync(`node_modules/vant/es/${dirname}/style/index.mjs`)) {
      optimizeDeps.push(
        `vant/es/${dirname}/style/index`,
      )
    }
  })

  return optimizeDeps
}
