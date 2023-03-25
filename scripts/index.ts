import type { InlineConfig } from 'vite'
import { build as viteBuild } from 'vite'
import fse from 'fs-extra'
import config from './vite.config'

import path from 'path'
import { ROOT } from './constants'

const buildVue = () => {
  return viteBuild(config as InlineConfig)
}

export const buildContent = () => {
  return viteBuild({
    build: {
      emptyOutDir: false,
      lib: {
        entry: path.resolve(ROOT, 'src/content.ts'),
        formats: ['es'],
        fileName: 'content'
      }
    }
  })
}

export const build = async () => {
  await buildVue()
  await buildContent()
  fse.copySync(path.resolve(ROOT, 'manifest.json'), path.resolve(ROOT, 'dist/manifest.json'))
  fse.copySync(path.resolve(ROOT, 'src/content.css'), path.resolve(ROOT, 'dist/content.css'))
}

