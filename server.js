import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = Number(process.env.PORT || 8787)
const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase()
const openAiModel = process.env.OPENAI_MODEL || 'gpt-5-mini'
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

app.use(cors())
app.use(express.json({ limit: '2mb' }))

const buildInitialPrompt = (request) => `
You are a senior frontend game developer who specializes in HTML5 mini games.

User request:
${request}

Follow these rules exactly:
- Write only one complete HTML file.
- Include all CSS and JavaScript inside that HTML file.
- Never use markdown code fences such as \`\`\`html or \`\`\`.
- Return pure HTML text only, with no explanation, filename, or extra prose.
- The response must start with <!DOCTYPE html> and be a fully runnable HTML document.
- If the game needs keyboard controls, register keydown/keyup handlers on window or document.
- Do not use location.reload() inside the game.
`

const buildRevisionPrompt = (request, currentCode) => `
You are a senior frontend game developer improving the existing HTML5 mini game code based on the user's follow-up request.

[Current code you have written so far]
${currentCode}

[Additional modification request]
${request}

Follow these rules exactly:
- Rewrite the entire immediately runnable HTML code from start to finish.
- Do not return partial code, diffs, patches, or explanations.
- Write only one complete HTML file.
- Include all CSS and JavaScript inside that HTML file.
- Never use markdown code fences such as \`\`\`html or \`\`\`.
- Return pure HTML text only, with no explanation, filename, or extra prose.
- The response must start with <!DOCTYPE html> and be a fully runnable HTML document.
- If the game needs keyboard controls, register keydown/keyup handlers on window or document.
- Do not use location.reload() inside the game.
`

const buildAssetPrompt = (assets) => {
  if (!Array.isArray(assets) || !assets.length) return ''

  const safeAssets = assets.slice(0, 8).map((asset, index) => {
    return {
      id: `asset_${index + 1}`,
      name: String(asset.name || `asset_${index + 1}`).slice(0, 80),
      role: String(asset.role || 'item').slice(0, 30),
      dataUrl: String(asset.dataUrl || ''),
    }
  }).filter((asset) => asset.dataUrl.startsWith('data:image/'))

  if (!safeAssets.length) return ''

  return `

[Embedded image assets]
Use these images directly in the single HTML output. Do not replace them with external URLs.
${safeAssets.map((asset) => {
  return `- ${asset.id}: role=${asset.role}, name=${asset.name}, dataUrl=${asset.dataUrl}`
}).join('\n')}

Asset rules:
- Keep every needed image embedded in the returned HTML using the provided dataUrl values.
- Use background assets as visual backdrops without hiding UI.
- Use player, enemy, item, and UI assets as real game objects when relevant.
- If drawing on canvas, load assets with Image() and draw them with drawImage after load.
`
}

const buildGamePrompt = ({ request, currentCode, assets }) => {
  const assetPrompt = buildAssetPrompt(assets)
  return currentCode
    ? `${buildRevisionPrompt(request, currentCode)}${assetPrompt}`
    : `${buildInitialPrompt(request)}${assetPrompt}`
}

const buildMetadataPrompt = ({ request, currentCode, html }) => `
You are summarizing a generated HTML5 mini game for a builder UI.

User request:
${request}

Previous code existed: ${currentCode ? 'yes' : 'no'}

Generated HTML:
${html.slice(0, 12000)}

Return compact JSON only. Do not use markdown.
Schema:
{
  "title": "short Korean game title, max 18 characters",
  "summary": "Korean summary of what changed, max 80 characters",
  "mode": "creation | revision | repair"
}
`

const cleanGeneratedHtml = (text) => {
  return String(text || '')
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

const parseMetadata = (text, fallback) => {
  try {
    const cleaned = String(text || '')
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()
    const data = JSON.parse(cleaned)

    return {
      title: String(data.title || fallback.title).slice(0, 28),
      summary: String(data.summary || fallback.summary).slice(0, 140),
      mode: ['creation', 'revision', 'repair'].includes(data.mode) ? data.mode : fallback.mode,
    }
  } catch {
    return fallback
  }
}

const getErrorStatus = (error) => {
  return error?.status || error?.response?.status || error?.code
}

const generateWithOpenAI = async (prompt) => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is missing. Create a .env file from .env.example.')
    error.status = 500
    throw error
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await client.responses.create({
    model: openAiModel,
    input: prompt,
    max_output_tokens: 12000,
  })

  return response.output_text
}

const generateWithGemini = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is missing. Add it to .env or switch AI_PROVIDER.')
    error.status = 500
    throw error
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: geminiModel })
  const result = await model.generateContent(prompt)
  const response = await result.response

  return response.text()
}

const generateHtml = async (prompt) => {
  if (provider === 'openai') {
    return generateWithOpenAI(prompt)
  }

  if (provider === 'gemini') {
    return generateWithGemini(prompt)
  }

  const error = new Error(`Unsupported AI_PROVIDER: ${provider}. Use "gemini" or "openai".`)
  error.status = 500
  throw error
}

const generateMetadata = async ({ request, currentCode, html }) => {
  const fallback = {
    title: currentCode ? '수정된 미니 게임' : '새 미니 게임',
    summary: currentCode ? '요청을 반영해 게임을 수정했습니다.' : '요청에 맞춰 새 게임을 생성했습니다.',
    mode: currentCode ? 'revision' : 'creation',
  }

  try {
    const prompt = buildMetadataPrompt({ request, currentCode, html })
    const text = await generateHtml(prompt)
    return parseMetadata(text, fallback)
  } catch {
    return fallback
  }
}

app.post('/api/generate-game', async (req, res) => {
  const request = String(req.body?.request || '').trim()
  const currentCode = String(req.body?.currentCode || '')
  const assets = Array.isArray(req.body?.assets) ? req.body.assets : []

  if (!request) {
    return res.status(400).json({ error: 'request is required.' })
  }

  try {
    const prompt = buildGamePrompt({ request, currentCode, assets })
    const html = cleanGeneratedHtml(await generateHtml(prompt))

    if (!html || !/^<!doctype html>/i.test(html)) {
      return res.status(502).json({
        error: 'The model did not return a complete runnable HTML document.',
      })
    }

    const metadata = await generateMetadata({ request, currentCode, html })

    res.json({ html, metadata })
  } catch (error) {
    const status = Number(getErrorStatus(error)) || 500
    const safeStatus = status >= 400 && status < 600 ? status : 500
    const message = error?.message || `${provider} request failed.`

    res.status(safeStatus).json({
      error: message,
      status: safeStatus,
    })
  }
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (error) => {
    if (error) {
      res.status(404).send('Build the client first with npm run build.')
    }
  })
})

app.listen(port, () => {
  console.log(`AI Mini Game Maker API listening on http://localhost:${port} with ${provider}`)
})
