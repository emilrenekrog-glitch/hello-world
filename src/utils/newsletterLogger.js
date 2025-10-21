const NEWSLETTER_LOG_STORAGE_KEY = 'newsletterSignupsLog'

function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  return window.localStorage
}

function formatLogLine({ email, submittedAt }) {
  return `[${submittedAt}] ${email}`
}

export function appendNewsletterLogEntry(entry) {
  const storage = getStorage()
  const logLine = formatLogLine(entry)

  if (!storage) {
    console.warn('Local storage is unavailable; unable to persist newsletter signup.')
    return { saved: false, logLine }
  }

  try {
    const existingLog = storage.getItem(NEWSLETTER_LOG_STORAGE_KEY)
    const nextLog = existingLog ? `${existingLog}\n${logLine}` : logLine
    storage.setItem(NEWSLETTER_LOG_STORAGE_KEY, nextLog)
    return { saved: true, logLine }
  } catch (error) {
    console.warn('Unable to persist newsletter signup to the private log.', error)
    return { saved: false, logLine }
  }
}

export function loadNewsletterLog() {
  const storage = getStorage()

  if (!storage) {
    return ''
  }

  return storage.getItem(NEWSLETTER_LOG_STORAGE_KEY) || ''
}

export function downloadNewsletterLog(filename = 'newsletter-signups.log') {
  if (typeof window === 'undefined') {
    console.warn('Cannot download the newsletter log outside of a browser context.')
    return false
  }

  const logContents = loadNewsletterLog()

  if (!logContents) {
    return false
  }

  const blob = new Blob([`${logContents}\n`], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = filename
  window.document.body.appendChild(link)
  link.click()
  window.document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return true
}

export { NEWSLETTER_LOG_STORAGE_KEY }
