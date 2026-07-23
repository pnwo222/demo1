import viewport from 'postcss-px-to-viewport-8-plugin'

export function createViewport(viteEnv: ViteEnv) {
  const { VITE_VW_WIDTH } = viteEnv

  return viewport({
    unitToConvert: 'px',
    viewportWidth: VITE_VW_WIDTH,
    unitPrecision: 6,
    propList: ['*'],
    viewportUnit: 'vw',
    fontViewportUnit: 'vw',
    selectorBlackList: ['ignore'],
    minPixelValue: 1,
    replace: true,
    // exclude: [],
    landscapeUnit: 'px',
    landscape: true,
    landscapeWidth: 100,
  })
}
