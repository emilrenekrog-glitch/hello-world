import { createServer } from 'node:http'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIRECTORY = path.resolve(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIRECTORY, 'newsletter-signups.json')
const PORT = Number.parseInt(process.env.PORT ?? '3001', 10)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function ensureDataFile() {
  await mkdir(DATA_DIRECTORY, { recursive: true })

  try {
    await access(DATA_FILE, constants.F_OK)
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      throw error
    }

    await writeFile(DATA_FILE, JSON.stringify([], null, 2) + '\n', 'utf8')
  }
}

async function readEntries() {
  const data = await readFile(DATA_FILE, 'utf8')
  const parsed = JSON.parse(data)

  if (!Array.isArray(parsed)) {
    throw new Error('Stored newsletter entries are not an array')
  }

  return parsed
}

async function writeEntries(entries) {
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2) + '\n', 'utf8')
}

async function appendEntry(email) {
  const trimmedEmail = email.trim()

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    const error = new Error('Please provide a valid email address.')
    error.statusCode = 400
    throw error
  }

  const entries = await readEntries()

  const isDuplicate = entries.some((entry) => entry.email.toLowerCase() === trimmedEmail.toLowerCase())

  if (isDuplicate) {
    const error = new Error('This email is already subscribed.')
    error.statusCode = 409
    throw error
  }

  const newEntry = { email: trimmedEmail, submittedAt: new Date().toISOString() }
  entries.push(newEntry)

  await writeEntries(entries)

  return newEntry
}

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let totalLength = 0

    request.on('data', (chunk) => {
      totalLength += chunk.length

      if (totalLength > 1024 * 64) {
        reject(new Error('Request body too large.'))
        request.destroy()
        return
      }

      chunks.push(chunk)
    })

    request.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'))
    })

    request.on('error', (error) => {
      reject(error)
    })
  })
}

await ensureDataFile()

const server = createServer(async (request, response) => {
  setCorsHeaders(response)

  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host}`)

  if (url.pathname !== '/api/newsletter') {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'Not found' }))
    return
  }

  if (request.method === 'GET') {
    try {
      const entries = await readEntries()
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(entries))
    } catch (error) {
      console.error('Failed to read newsletter entries', error)
      response.writeHead(500, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message: 'Unable to load newsletter entries.' }))
    }

    return
  }

  if (request.method === 'POST') {
    try {
      const rawBody = await readRequestBody(request)

      let payload

      try {
        payload = JSON.parse(rawBody || '{}')
      } catch (error) {
        const badRequestError = new Error('Body must be valid JSON.')
        badRequestError.statusCode = 400
        throw badRequestError
      }

      const email = typeof payload.email === 'string' ? payload.email : ''

      const newEntry = await appendEntry(email)

      response.writeHead(201, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(newEntry))
    } catch (error) {
      const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500
      const message =
        statusCode === 500 ? 'Unable to save your email at this time. Please try again later.' : error.message

      if (statusCode === 500) {
        console.error('Failed to save newsletter entry', error)
      }

      response.writeHead(statusCode, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ message }))
    }

    return
  }

  response.writeHead(405, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'Method not allowed' }))
})

server.listen(PORT, () => {
  console.log(`Newsletter API listening on http://localhost:${PORT}`)
  console.log(`Saving entries to ${DATA_FILE}`)
})
