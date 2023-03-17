import { getItem } from './utils'
import { YAPI_KEY, DEFAULT_OPTIONS } from './constants'
import type { YApiOptions } from './types'

const isMatchUrl = (url: string, matchRe: string) => {
  return new RegExp(matchRe).test(url)
}

const start = (options: YApiOptions) => {
  const href =  location.href
  const matched = isMatchUrl(href, options.matchRe)
  // 没有匹配
  if (!matched) {
    return
  }

  const queryEl =  document.querySelector('.colQuery')
  console.log('queryEl ', queryEl )
  
}

getItem(YAPI_KEY).then((options) => {
  if (!options) {
    options = DEFAULT_OPTIONS
  }

  start(options)
})

