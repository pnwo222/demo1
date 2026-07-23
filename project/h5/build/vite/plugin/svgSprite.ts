import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function configSvgIconsPlugin() {
  const svgIconsPlugin = createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
    symbolId: 'icon-[name]',
  })
  return svgIconsPlugin
}
