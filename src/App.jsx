import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'

const CONTACT_ENDPOINT = (() => {
  const configuredEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT
  if (typeof configuredEndpoint === 'string' && configuredEndpoint.trim() !== '') {
    return configuredEndpoint.trim()
  }

  return '/contact-submit.php'
})()

const createInitialFormState = () => ({ name: '', email: '', message: '' })
const createInitialStatusState = () => ({ state: 'idle', message: '' })

const submitContactForm = async ({ name, email, message }) => {
  const body = new URLSearchParams()
  body.set('name', name)
  body.set('email', email)
  body.set('message', message)

  let response

  try {
    response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    })
  } catch (error) {
    console.error('Network error while submitting contact form', error)
    throw new Error('We could not submit your message. Please check your connection and try again.')
  }

  let payload = null
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      payload = await response.json()
    } catch (error) {
      console.error('Failed to parse contact submission response', error)
    }
  }

  if (!response.ok) {
    const messageFromServer = payload?.message
    throw new Error(messageFromServer || 'We could not save your message. Please try again later.')
  }

  if (payload?.success === false) {
    throw new Error(payload.message || 'We could not save your message. Please try again later.')
  }

  return {
    success: true,
    message: payload?.message || 'Thanks! We received your message and will be in touch soon.',
  }
}

function App() {
  const [formData, setFormData] = useState(createInitialFormState)
  const [status, setStatus] = useState(createInitialStatusState)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))

    if (status.state !== 'idle') {
      setStatus(createInitialStatusState())
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) {
      return
    }

    setStatus(createInitialStatusState())

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    }

    if (!trimmedData.name || !trimmedData.email || !trimmedData.message) {
      setStatus({
        state: 'error',
        message: 'Please fill out every field so we can follow up.',
      })
      setFormData(trimmedData)
      return
    }

    setIsSaving(true)
    setFormData(trimmedData)

    try {
      const result = await submitContactForm(trimmedData)

      setStatus({
        state: 'success',
        message: result.message,
      })
      setFormData(createInitialFormState())
    } catch (error) {
      console.error('Failed to submit contact form', error)
      const fallbackMessage =
        error instanceof Error && error.message
          ? error.message
          : 'We could not save your message. Please try again later.'

      setStatus({
        state: 'error',
        message: fallbackMessage,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page">
      <header className="site-header">
        <Layout as="nav" className="site-nav">
          <a href="#home" className="brand" aria-label="Back to home">
            BluePlanet
          </a>
          <div className="nav-links" role="navigation">
            <a href="#vision">Vision</a>
            <a href="#initiatives">Initiatives</a>
            <a href="#voices">Voices</a>
            <a href="#contact">Contact</a>
          </div>
        </Layout>
      </header>

      <main>
        <section id="home" className="earth-hero">
          <Layout className="hero-content">
            <p className="hero-eyebrow">Protecting our only home</p>
            <h1 className="hero-title">Hello, World!</h1>
            <p className="hero-subtitle">
              Join explorers, scientists, and advocates who are reimagining how we care for
              our planet. Discover initiatives that restore ecosystems and empower
              communities.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#initiatives">
                Explore initiatives
              </a>
              <a className="button button-secondary" href="#vision">
                Learn more
              </a>
            </div>
            <div className="hero-stat" aria-live="polite">
              <span className="stat-value">142</span>
              <span className="stat-label">Active restoration projects worldwide</span>
            </div>
          </Layout>
        </section>

        <section id="vision" className="section">
          <Layout>
            <div className="section-header">
              <p className="section-eyebrow">Our mission</p>
              <h2>Thriving communities through resilient ecosystems</h2>
              <p>
                We combine data, design, and on-the-ground partnerships to protect the natural
                systems that sustain life. From coral reefs to urban forests, our teams work
                alongside local leaders to create lasting environmental impact.
              </p>
            </div>
          </Layout>
        </section>

        <section id="initiatives" className="section section-alt">
          <Layout>
            <div className="section-header">
              <p className="section-eyebrow">What we do</p>
              <h2>Global initiatives that move the needle</h2>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <h3>Climate-smart cities</h3>
                <p>
                  Deploying sensor networks and green roofs to cool dense neighborhoods while
                  improving air quality for millions of residents.
                </p>
              </article>
              <article className="feature-card">
                <h3>Ocean guardians</h3>
                <p>
                  Mobilizing coastal communities with real-time data and adaptive policy tools
                  to safeguard marine biodiversity hotspots.
                </p>
              </article>
              <article className="feature-card">
                <h3>Regenerative agriculture</h3>
                <p>
                  Partnering with farmers to restore soil health, capture carbon, and increase
                  food security through sustainable practices.
                </p>
              </article>
            </div>
          </Layout>
        </section>

        <section id="voices" className="section">
          <Layout>
            <div className="section-header">
              <p className="section-eyebrow">Voices from the field</p>
              <h2>Stories of resilience</h2>
            </div>
            <div className="testimonial-list">
              <figure className="testimonial-card">
                <blockquote>
                  “The partnership equipped us with the tools to restore mangroves faster than
                  ever. Our coastline is thriving again.”
                </blockquote>
                <figcaption>
                  <span className="testimonial-name">María Santos</span>
                  <span className="testimonial-role">Coastal Steward, Philippines</span>
                </figcaption>
              </figure>
              <figure className="testimonial-card">
                <blockquote>
                  “By integrating climate data into city planning, our neighborhoods are
                  cooler, greener, and more connected.”
                </blockquote>
                <figcaption>
                  <span className="testimonial-name">Jordan Blake</span>
                  <span className="testimonial-role">Urban Designer, Chicago</span>
                </figcaption>
              </figure>
            </div>
          </Layout>
        </section>

        <section id="contact" className="section section-alt contact-section">
          <Layout className="contact-grid">
            <div className="contact-intro">
              <p className="section-eyebrow">Contact us</p>
              <h2>Ready to collaborate?</h2>
              <p>
                Share a challenge, an idea, or a location where we can help ecosystems
                flourish. Our team will reach out within two business days to continue the
                conversation.
              </p>
            </div>
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSaving}
            >
              <fieldset className="contact-fieldset" disabled={isSaving}>
                <legend className="sr-only">Send us a message</legend>
                <div className="input-group">
                  <label htmlFor="contact-name">Full name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-message">How can we help?</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    placeholder="Share the project details or the ecosystem you want to support."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button className="button button-primary" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving message…' : 'Send message'}
                </button>
                <p
                  className="form-status"
                  data-status={status.state}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {status.message}
                </p>
              </fieldset>
            </form>
          </Layout>
        </section>

      </main>

      <footer className="site-footer">
        <Layout className="footer-content">
          <p>© {new Date().getFullYear()} BluePlanet Initiative. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </Layout>
      </footer>
    </div>
  )
}

export default App
