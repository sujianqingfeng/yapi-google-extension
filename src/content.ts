import { getItem } from './utils'
import { YAPI_KEY, DEFAULT_OPTIONS } from './constants'
import type { YApiOptions } from './types'

const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

const isMatchUrl = (url: string, matchRe: string) => {
  return new RegExp(matchRe).test(url)
}

const createIconElement = () => {
  const el = document.createElement('button')
  el.innerText = 'xxx'
  return el
}

const createElementClick = (el: HTMLElement, onclick: () => void) => {
  el.onclick = onclick
}

const insertQuery = () => {

  const queryEl = document.querySelector('.colQuery')
  console.log('queryEl ', queryEl)
  const iconEl = createIconElement()
  createElementClick(iconEl, () => {
    console.log('click icon')
    const tBodyEl = queryEl?.querySelector('.ant-table-tbody')
    console.log('🚀 ~ file: content.ts:29 ~ createElementClick ~ tBodyEl:', tBodyEl)
  })

  queryEl?.insertBefore(iconEl, queryEl.firstChild)
}

const start = async (options: YApiOptions) => {
  const href =  location.href
  const matched = isMatchUrl(href, options.matchRe)
  // 没有匹配
  if (!matched) {
    return
  }
    
  await sleep()
  insertQuery()
}

getItem(YAPI_KEY).then((options) => {
  if (!options) {
    options = DEFAULT_OPTIONS
  }

  start(options)
})

