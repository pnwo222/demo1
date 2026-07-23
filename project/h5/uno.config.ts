import { defineConfig, presetAttributify, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetRemToPx({
      baseFontSize: 4,
    }),
    presetUno(),
    presetAttributify(),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: [
    // dynamic shortcuts
    {
      'bg-circle': 'bg-cover bg-no-repeat bg-center b-rd-100%',
      'bg-range': 'bg-cover bg-no-repeat bg-center',
    },
  ],
})
