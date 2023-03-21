import { getItem, transformOptions } from './utils'
import { YAPI_KEY, DEFAULT_OPTIONS, isRequired, COL_TITLE_SELECTOR, COL_TITLE, TBODY_SELECTOR  } from './constants'
import type { Query, YApiOptions, Response, TextTree, TrTree, LevelTr } from './types'

const sleep = (time = 1000) => new Promise(resolve => setTimeout(resolve, time))

const createQueryElement = (selection: string) => {
  return (el: Element) => {
    return el.querySelectorAll(selection)
  }
}

const queryAllTr = createQueryElement('tr')
const queryAllTd = createQueryElement('td') 

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

const getInnerTextFromCellElement = (el: Element) => {
  return (el as HTMLTableCellElement).innerText
}

const getTdTextFromTBody = (tBody: Element) => {
  const texts: (string)[][] = []
  queryAllTr(tBody)
    .forEach(tr => {
      const text: string[] = [] 
      queryAllTd(tr) 
        .forEach(td => {
          const innerText = getInnerTextFromCellElement(td) 
          text.push(innerText)
        })
      texts.push(text)
    })

  return texts
}

const getRowLevel = (cls: string) => {
  const result = cls.match(/ant-table-row-level-(\d)/)
  if (result && result.length > 1) {
    return +result[1]
  }
  return null
}

const getLevelTrFromTBody = (tBody: Element) => {
  const trs = queryAllTr(tBody) 
  const levels: LevelTr[] = [] 
  trs.forEach(tr => {
    const cls = Array.from(tr.classList).find(className => className.includes('ant-table-row-level'))
    const level = getRowLevel(cls as string)
    if (level === null) {
      return
    }
    levels.push({
      level,
      el: tr
    })
  })
  return levels
}

const toTrTree = (levelTrs: LevelTr[]) => {
  let i = 0
  const result: TrTree[] = []

  while (i < levelTrs.length) {
    const { level, el } = levelTrs[i]

    const item: TrTree = {
      el
    }

    let nextIndex = i + 1
    let nextTr = levelTrs[nextIndex]

    while (nextTr && level < nextTr.level) {
      nextIndex++
      nextTr = levelTrs[nextIndex]
    }

    if (nextIndex - i > 1) {
      item.children = toTrTree(levelTrs.slice(i + 1, nextIndex))
    }
    
    result.push(item)
    i = nextIndex
  }
  return result
}

const getTextTreeFormTrTree = (trTree: TrTree[]) => {
  const result: TextTree[] = []
  trTree.forEach(tr => {
    const { el, children } = tr
    const text: string[] = [] 

    queryAllTd(el).forEach(td => {
      const innerText = getInnerTextFromCellElement(td)
      text.push(innerText)
    })
    const item: TextTree = {
      text
    }

    if (children) {
      item.children = getTextTreeFormTrTree(children)
    }
    result.push(item)
  })
  return result
}

const toResponseFromTextTree = (textTree: TextTree[]) => {
  const result: Response[] = []
  textTree.map(item => {
    const { text, children } = item
    const [key, type, , , remark] = text
    
    const response: Response = {
      key,
      type,
      remark
    }
    result.push(response)
    if (children) {
      response.children = toResponseFromTextTree(children)
    }
  })

  return result
}

const getType = (type: string) => {
  switch (type) {
    case 'String':
    case 'string':
    case 'LocalDateTime':
      return 'string'

    case 'boolean':
      return 'boolean'

    case 'Long':
    case 'long':
    case 'int':
    case 'Integer':
    case 'integer':
      return 'number'

    default:
      return 'any'
  }
}

const extractResponseTypeFromResponseList = (responseList: Response[]) => {
  const getStr = (response: Response): string => {
    const { key, type, children, remark } = response
    if (children) {
      const isArray = type.endsWith('[]')
      return `${key}: {
        ${children.map(getStr).join('\n')}
      }${  isArray ? '[]' : ''}`
    }
    if (key) {
      const comment = remark ? `  // ${remark}\n` : ''
      return `${comment  }${key}: ${getType(type)}`
    }
    return ''
  }

  const str = `
  {
    ${responseList.map(getStr).join('\n  ')}
  }
  `
  return str
}

const toQueryFromTdTexts = (texts: string[][]): Query[]  => {
  return texts.map(text => {
    const [key, required, , remark] = text
    return {
      key,
      required: isRequired(required as string),
      remark
    } as Query
  })
}

const extractQueryFormQueryList = (queryList: Query[], notContainKeys: string[]) => {
  const filterList =  queryList.filter(query => {
    return !notContainKeys.includes(query.key)
  })
  
  return `
    {
      ${filterList .map(item => {
    const { key, remark }  = item
    const comment = remark ? `  // ${remark}\n` : ''
    return `${comment}  ${key}: ''` 
  }).join(',\n')}
    }
  `
}

const extractBodyFormTextTree = (textTrees: TextTree[]): string => {
  return `
  {
    ${textTrees.map(item => {
    const { text, children } = item 
    const [key,,,, remark] = text
    if (children) {
      return `${key}:${extractBodyFormTextTree(children)}}`
    }
    const comment = `// ${remark}\n`
    return `${comment}  ${key}: ''` 
  }).join(',\n')}
  }
  `
}

const unfoldField = async (el: Element) => {
  const collapsed = el.querySelectorAll('.ant-table-row-collapsed')
  if (collapsed.length === 0) {
    return
  }
  collapsed.forEach(el => {
    (el as HTMLElement).click()
  })

  await sleep()
  unfoldField(el)
  await sleep()
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
    const copyText = extractQueryFormQueryList(query, options.queryNotContain)
    copyTextToClipboard(copyText)
  }
  createElementClick(iconEl, onExtractQueryClick)
  queryEl?.insertBefore(iconEl, queryEl.firstChild)
}

// response
const insertResponse = () => {
  const responseEl =  document.querySelector('.interface-title + .ant-table-wrapper')
  if (!responseEl) {
    return
  }
  
  const iconEl = createIconElement('response')

  const onExtractResponseClick = async () => {
    const tBodyEl = responseEl.querySelector('.ant-table-tbody')
    if (!tBodyEl) {
      return
    }
    await unfoldField(tBodyEl)

    const levels = getLevelTrFromTBody(tBodyEl)
    const treeTrs = toTrTree(levels)
    const textTree = getTextTreeFormTrTree(treeTrs)
    const response = toResponseFromTextTree(textTree)
    const copyText = extractResponseTypeFromResponseList(response)
    copyTextToClipboard(copyText)

  }
  createElementClick(iconEl, onExtractResponseClick)
  responseEl.insertBefore(iconEl, responseEl.firstChild)
}

const insertBody = () => {
  const titles =  document.querySelectorAll(COL_TITLE_SELECTOR)
  const bodyTitleEl = Array.from(titles).find(el => {
    const innerText =  (el as HTMLDivElement).innerText
    return innerText.includes(COL_TITLE) 
  })

  if (!bodyTitleEl) {
    return
  }
  const sibling =  bodyTitleEl.nextSibling as Element
  if (!sibling) {
    return
  }

  const iconEl = createIconElement('body')

  const onExtractBodyClick = async () => {
    const tBodyEl = sibling.querySelector(TBODY_SELECTOR)
    if (!tBodyEl) {
      return
    }
    await unfoldField(tBodyEl)

    const levels = getLevelTrFromTBody(tBodyEl)
    const treeTrs = toTrTree(levels)
    const textTree = getTextTreeFormTrTree(treeTrs)
    console.log('🚀 ~ file: content.ts:310 ~ onExtractBodyClick ~ textTree:', textTree)
    const copyText = extractBodyFormTextTree(textTree)
    copyTextToClipboard(copyText)

  }
  createElementClick(iconEl, onExtractBodyClick)
  sibling.insertBefore(iconEl, sibling.firstChild)
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
  insertBody()
  insertResponse()
}

getItem(YAPI_KEY).then((options) => {
  if (!options) {
    options = DEFAULT_OPTIONS
  }
  transformOptions(options)

  start(options)
})
