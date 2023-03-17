import { defineConfig } from 'unocss'
import { presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ]
})