import visualizer from 'rollup-plugin-visualizer'

// 生成视图依赖分析文件
export function configVisualizerConfig() {
  return visualizer()
}
