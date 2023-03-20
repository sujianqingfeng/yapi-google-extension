import type { YApiOptions } from './types'

export const setItem = (key: string, value: any) => {
  chrome.storage.local.set({ [key]: value })
}

export const getItem = async <T = any>(key: string) => {
  const value = await chrome.storage.local.get(key)

  return value[key] as T ?? null
}

export const transformOptions = (opts: YApiOptions) => {
  const { queryNotContain } = opts
  if (!Array.isArray(queryNotContain) && typeof queryNotContain === 'object' && queryNotContain !== null) {
    opts.queryNotContain = Object.values(queryNotContain)
  }
}

export const removeJsonStringQuotes = (str: string) => {
  return str.replace(/"([A-Za-z]+)"/g, (_: string, p1: string) => {
    return p1
  })
}

