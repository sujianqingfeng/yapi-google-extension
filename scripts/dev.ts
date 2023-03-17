import type{ InlineConfig } from 'vite'
import { createServer } from 'vite'
import config from './vite.config'

const server = await createServer(config as InlineConfig)

await server.listen()
server.printUrls()