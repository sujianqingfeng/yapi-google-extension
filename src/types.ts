
export interface YApiOptions {
  lang: 'js'|'ts',
  matchRe: string
}

export interface Query {
  key: string
  required?: boolean
  remark?: string
}