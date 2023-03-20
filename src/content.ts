import { getItem, removeJsonStringQuotes, transformOptions } from './utils'
import { YAPI_KEY, DEFAULT_OPTIONS, isRequired } from './constants'
import type { Query, YApiOptions } from './types'

const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

const copyTextToClipboard = (text: string) => {
  const copyFrom = document.createElement('textarea')
  copyFrom.textContent = text
  document.body.appendChild(copyFrom)
  copyFrom.select()
  document.execCommand('copy')
  copyFrom.blur()
  document.body.removeChild(copyFrom)
}

const isMatchUrl = (url: string, matchRe: string) => {
  return new RegExp(matchRe).test(url)
}

const createIconElement = (text: string) => {
  const el = document.createElement('button')
  el.innerText = text
  return el
}

const createElementClick = (el: HTMLElement, onclick: () => void) => {
  el.onclick = onclick
}

const getTdTextFromTBody = (tBody: Element) => {
  const texts: string[][] = []
  tBody.querySelectorAll('tr')
    .forEach(tr => {
      const text: string[] = [] 
      tr.querySelectorAll('td')
        .forEach(td => {
          const innerText = td.innerText
          text.push(innerText)
        })
      texts.push(text)
    })

  return texts
}

const toQueryFromTdTexts = (texts: string[][]): Query[]  => {
  return texts.map(text => {
    const [key, required, _, remark] = text
    return {
      key,
      required: isRequired(required),
      remark
    } as Query
  })
}

const extractQueryFormQueryList = (queryList: Query[], notContainKeys: string[]) => {
  const result: Record<string, any> = {}
  queryList.filter(query => {
    return !notContainKeys.includes(query.key)
  }).forEach(query => {
    result[query.key] = ''
  })
  return result
}

const insertQuery = (options: YApiOptions) => {
  const queryEl = document.querySelector('.colQuery')
  console.log('queryEl ', queryEl)
  const iconEl = createIconElement('query')

  const onExtractQueryClick = () => {
    console.log('click icon')
    const tBodyEl = queryEl?.querySelector('.ant-table-tbody')
    if (!tBodyEl) {
      return
    }
    const texts =  getTdTextFromTBody(tBodyEl)
    const query = toQueryFromTdTexts(texts)
    const result = extractQueryFormQueryList(query, options.queryNotContain)
    const formatText = JSON.stringify(result, null, 2)
    copyTextToClipboard(removeJsonStringQuotes(formatText))
  }
  createElementClick(iconEl, onExtractQueryClick)
  queryEl?.insertBefore(iconEl, queryEl.firstChild)
}

const insertResponse = () => {
  const responseEl =  document.querySelector('.interface-title + .ant-table-wrapper')
  if (!responseEl) {
    return
  }
  
  const iconEl = createIconElement('response')

  const onExtractResponseClick = () => {
    const tBodyEl = responseEl.querySelector('.ant-table-tbody')
    if (!tBodyEl) {
      return
    }
    const collapseds = tBodyEl.querySelector('.ant-table-row-collapsed')

    const texts =  getTdTextFromTBody(tBodyEl)
    console.log('🚀 ~ file: content.ts:103 ~ onExtractResponseClick ~ texts:', texts)
    const query = toQueryFromTdTexts(texts)
    console.log('🚀 ~ file: content.ts:105 ~ onExtractResponseClick ~ query:', query)

  }
  createElementClick(iconEl, onExtractResponseClick)
  responseEl.insertBefore(iconEl, responseEl.firstChild)
}

const start = async (options: YApiOptions) => {
  const href =  location.href
  const matched = isMatchUrl(href, options.matchRe)
  // 没有匹配
  if (!matched) {
    return
  }
    
  await sleep()
  insertQuery(options)
  insertResponse()
}

getItem(YAPI_KEY).then((options) => {
  if (!options) {
    options = DEFAULT_OPTIONS
  }
  transformOptions(options)

  start(options)
})

