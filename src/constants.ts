import type { YApiOptions } from './types'

export const YAPI_KEY = 'yapi_options'

export const DEFAULT_OPTIONS: YApiOptions = {
  lang: 'ts',
  matchRe: '/project/\\d+/interface/api/\\d+',
  queryNotContain: ['page', 'limit', 'sort', 'order', 'offset']
}

export const isRequired = (text: string): boolean => {
  return text === '是'
}

