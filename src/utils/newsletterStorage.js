const NEWSLETTER_STORAGE_KEY = 'newsletterEntries'

function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  return window.localStorage
}

export function loadNewsletterEntries() {
  const storage = getStorage()

  if (!storage) {
    return []
  }

  const stored = storage.getItem(NEWSLETTER_STORAGE_KEY)

  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Unable to parse stored newsletter entries', error)
    return []
  }
}

export function saveNewsletterEntries(entries) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(entries))
}

export { NEWSLETTER_STORAGE_KEY }
