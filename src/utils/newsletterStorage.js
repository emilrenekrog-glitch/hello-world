const API_ENDPOINT = '/api/newsletter'

export const NEWSLETTER_FILE_PATH = 'data/newsletter-signups.json'

async function parseJsonResponse(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    console.warn('Unable to parse API response as JSON', error)
    return null
  }
}

export async function loadNewsletterEntries() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    const data = await parseJsonResponse(response)

    if (!response.ok) {
      const message = data && typeof data.message === 'string' ? data.message : 'Failed to load newsletter entries.'
      throw new Error(message)
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Unable to load newsletter entries from the API', error)
    throw error
  }
}

export async function saveNewsletterEntry(email) {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    const message = data && typeof data.message === 'string' ? data.message : 'Failed to save newsletter entry.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Unexpected response from the newsletter API.')
  }

  return data
}

export { API_ENDPOINT }
