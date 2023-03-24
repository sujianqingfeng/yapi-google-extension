
export interface YApiOptions {
  lang: 'js'|'ts'
  matchRe: string
  queryNotContain: string[]
  comment: boolean
  responseExtractPath: string
}

export interface Query {
  key: string
  required?: boolean
  remark?: string
}

export interface Response {
  key: string
  type: string
  remark?: string
  children?: Response[]
}

export type LevelTr = {
  level: number,
  el: Element
}

export type TrTree  = {
  el: Element,
  children?: TrTree[]
}

export type TextTree = {
  text: string[],
  children?: TextTree[]
}
 