import AutoImport from 'unplugin-auto-import/vite'

export function configAutoImport() {
  return AutoImport({
    include: [
      /\.ts?$/,
      /\.[tj]sx?$/,
      /\.vue$/,
      /\.vue\?vue/,
    ],
    imports: [
      'vue',
      'vue-router',
      'vitest',
    ],
    dts: true,
  })
}
