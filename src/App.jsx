import { useState } from 'react'

import './App.css'
import Layout from './components/Layout'
import {
  appendNewsletterLogEntry,
  downloadNewsletterLog,
  NEWSLETTER_LOG_STORAGE_KEY,
} from './utils/newsletterLogger'

function App() {
  const [email, setEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState(
    'No signups captured yet. Entries are logged privately.',
  )

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return
    }

    const newEntry = { email: trimmedEmail, submittedAt: new Date().toISOString() }
    const { saved, logLine } = appendNewsletterLogEntry(newEntry)

    if (!saved) {
      setStatusMessage(
        'We could not record your signup. Please allow browser storage and try again.',
      )
      return
    }

    console.info('Captured newsletter signup in private log:', logLine)
    setEmail('')
    setStatusMessage(
      `Thanks for signing up! Your email is stored privately in the "${NEWSLETTER_LOG_STORAGE_KEY}" log.`,
    )
  }

  function handleDownloadLog() {
    const downloaded = downloadNewsletterLog()

    if (downloaded) {
      setStatusMessage('A private signup log has been downloaded to your device.')
    } else {
      setStatusMessage('No log entries available to download just yet.')
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
            <a href="#connect">Connect</a>
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

        <section id="connect" className="section section-alt">
          <Layout className="newsletter">
            <div className="section-header">
              <p className="section-eyebrow">Stay in the loop</p>
              <h2>Monthly insights for a healthier planet</h2>
              <p>
                Subscribe to receive field notes, research highlights, and opportunities to
                support the work happening across our global network.
              </p>
            </div>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" className="button button-primary">
                Sign up
              </button>
            </form>
            <p className="newsletter-storage-note">
              {`Entries stay on this device only and are stored privately using the "${NEWSLETTER_LOG_STORAGE_KEY}" log key.`}
            </p>
            <button
              type="button"
              className="button button-secondary newsletter-download-log"
              onClick={handleDownloadLog}
            >
              Download signup log
            </button>
            <p className="newsletter-status" aria-live="polite">
              {statusMessage}
            </p>
          </Layout>
        </section>
      </main>

      <footer className="site-footer">
        <Layout className="footer-content">
          <p>© {new Date().getFullYear()} BluePlanet Initiative. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </Layout>
      </footer>
    </div>
  )
}

export default App
