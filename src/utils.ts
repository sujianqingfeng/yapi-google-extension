
export const setItem = (key: string, value: any) => {
  chrome.storage.local.set({ [key]: value })
}

export const getItem = async <T = any>(key: string) => {
  const value = await chrome.storage.local.get(key)

  return value[key] as T ?? null
}

