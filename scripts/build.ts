import { buildContent, build } from './index'

const args = process.argv
const other = args.splice(2)

const isContent = other.length > 0 && other[0] === '--content'

if (isContent) {
  buildContent()
} else {
  build()
}

