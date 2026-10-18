import type { IncomingMessage, ServerResponse } from 'node:http'

import Anthropic from '@anthropic-ai/sdk'
import { loadEnv, type Connect, type Plugin } from 'vite'

import { runAiPicks } from './aiPicks.ts'
import { AssistantRequestError } from './errors.ts'
import { runAssistantTurn } from './recordsAssistant.ts'

export const ASSISTANT_PATH = '/api/records-assistant'
export const AI_PICKS_PATH = '/api/ai-picks'
const MAX_BODY_BYTES = 30 * 1024 * 1024

type Handler = (body: unknown, client: Anthropic) => Promise<unknown>
const routes: Record<string, Handler> = {
  [ASSISTANT_PATH]: runAssistantTurn,
  [AI_PICKS_PATH]: runAiPicks,
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new AssistantRequestError(413, 'Request too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

/**
 * Serves Thriver's AI endpoints from the Vite dev and preview servers, keeping the Anthropic
 * API key on the server. Reads ANTHROPIC_API_KEY from the environment or .env.local (never
 * exposed to the browser: it has no VITE_ prefix); without it, the SDK falls back to other
 * credential sources such as an `ant auth login` profile.
 */
export function recordsAssistantPlugin(): Plugin {
  let client: Anthropic | null = null

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const handler = req.url ? routes[req.url] : undefined
    if (!handler) return next()
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' })
    void (async () => {
      try {
        const body: unknown = JSON.parse(await readBody(req))
        if (!client) throw new AssistantRequestError(503, 'Assistant is not configured')
        send(res, 200, await handler(body, client))
      } catch (error) {
        if (error instanceof AssistantRequestError)
          return send(res, error.status, { error: error.message })
        if (error instanceof SyntaxError) return send(res, 400, { error: 'Invalid JSON' })
        if (error instanceof Anthropic.AuthenticationError) {
          return send(res, 503, { error: 'Assistant is not configured: invalid API key' })
        }
        if (error instanceof Anthropic.RateLimitError) {
          return send(res, 429, { error: 'The assistant is busy, please try again shortly' })
        }
        if (error instanceof Anthropic.APIError) {
          console.error('[thriver-ai] API error', error.status, error.message)
          return send(res, 502, { error: 'The assistant could not answer right now' })
        }
        if (error instanceof Error && /credentials|api key/i.test(error.message)) {
          return send(res, 503, { error: 'Assistant is not configured' })
        }
        console.error('[thriver-ai]', error)
        send(res, 500, { error: 'Something went wrong' })
      }
    })()
  }

  return {
    name: 'thriver-ai-endpoints',
    configResolved(config) {
      const apiKey = loadEnv(config.mode, config.envDir || process.cwd(), '').ANTHROPIC_API_KEY
      try {
        client = new Anthropic(apiKey ? { apiKey } : {})
      } catch {
        client = null
      }
    },
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
