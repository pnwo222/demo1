import fs from 'fs'

export function createOptimizeDeps() {
  const optimizeDepsElementPlusIncludes = ['vant/es']
  fs.readdirSync('node_modules/vant/es').forEach((dirname) => {
    if (fs.existsSync(`node_modules/vant/es/${dirname}/style/index.mjs`)) {
      optimizeDepsElementPlusIncludes.push(
        `vant/es/${dirname}/style/index`,
      )
    }
  })

  return optimizeDepsElementPlusIncludes
}
