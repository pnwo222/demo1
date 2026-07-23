import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export function configResolveComponents() {
  return Components({
    dts: true,
    resolvers: [VantResolver()],
    types: [],
  })
}
