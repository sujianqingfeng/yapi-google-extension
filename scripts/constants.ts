import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resolve = (...paths: string[]) => path.resolve(__dirname, ...paths)

export const ROOT = resolve('..') 