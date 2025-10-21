import { useState } from 'react'

const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submitEmail = async (event) => {
    event.preventDefault()
    const trimmed = email.trim()

    if (!trimmed) {
      setStatus('error')
      setMessage('Please enter your email address to join the list.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const body = new URLSearchParams({ email: trimmed }).toString()
      const response = await fetch('/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'application/json',
        },
        body,
      })

      const isJson = response.headers.get('content-type')?.includes('application/json')
      let payload

      if (isJson) {
        payload = await response.json()
      } else {
        const text = await response.text()
        payload = {
          success: response.ok,
          message: text || "Thanks! You're signed up.",
        }
      }

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'Unable to subscribe right now.')
      }

      setStatus('success')
      setMessage(payload.message || "Thanks! You're signed up.")
      setEmail('')
    } catch (error) {
      console.error(error)
      setStatus('error')

      let friendlyMessage = 'We could not submit your email right now. Please try again soon.'

      if (error instanceof Error && error.message && error.message !== 'Failed to fetch') {
        friendlyMessage = error.message
      }

      setMessage(friendlyMessage)
    }
  }

  const isSubmitting = status === 'submitting'
  const feedbackClassNames = ['newsletter-feedback']

  if (status === 'success') {
    feedbackClassNames.push('newsletter-feedback--success')
  }

  if (status === 'error') {
    feedbackClassNames.push('newsletter-feedback--error')
  }

  const feedbackClassName = feedbackClassNames.join(' ')

  return (
    <form className="newsletter-form" onSubmit={submitEmail} noValidate>
      <div className="newsletter-field">
        <label htmlFor="newsletter-email" className="newsletter-label">
          Email address
        </label>
        <div className="newsletter-input-wrapper">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <button type="submit" className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Sign up'}
          </button>
        </div>
      </div>
      <p className="newsletter-disclaimer">
        We send a single email each month. No spam, no surprises.
      </p>
      {message ? (
        <p role="status" className={feedbackClassName} aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  )
}

export default NewsletterForm
