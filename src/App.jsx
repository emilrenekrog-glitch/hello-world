import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    if (status !== 'idle') {
      setStatus('idle')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus('success')
    setFormData({ name: '', email: '', message: '' })
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
              <dl className="contact-details">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:hello@blueplanet.org">hello@blueplanet.org</a>
                  </dd>
                </div>
                <div>
                  <dt>Headquarters</dt>
                  <dd>Seattle, Washington</dd>
                </div>
              </dl>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <fieldset className="contact-fieldset">
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
                <button className="button button-primary" type="submit">
                  Send message
                </button>
                <p
                  className="form-status"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {status === 'success' && 'Thanks! We will be in touch soon.'}
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
