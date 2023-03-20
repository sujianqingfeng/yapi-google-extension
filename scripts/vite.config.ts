import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'types/auto-imports.d.ts',
      imports: [
        'vue',
        {
          '@vueuse/core': ['useVModels', 'useClipboard']
        }
      ],
      dirs: ['src/composables'],
      vueTemplate: true,
      eslintrc: {
        enabled: true
      }
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        }),
      ],
      dts: 'types/components.d.ts',
      dirs: ['src/components'],
    }),
  ],
})