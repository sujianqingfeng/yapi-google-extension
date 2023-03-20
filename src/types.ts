
export interface YApiOptions {
  lang: 'js'|'ts'
  matchRe: string
  queryNotContain: string[]
}

export interface Query {
  key: string
  required?: boolean
  remark?: string
}