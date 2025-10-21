import './App.css'
import Layout from './components/Layout'

function App() {
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
          <Layout className="connect-content">
            <div className="section-header">
              <p className="section-eyebrow">Stay in the loop</p>
              <h2>Simple email capture for any PHP host</h2>
              <p>
                Deploy the accompanying <code>index.php</code> file on a PHP-enabled server to
                collect newsletter signups without any external dependencies or custom APIs.
              </p>
            </div>
            <div className="connect-note">
              <p>
                The standalone PHP page validates each submission and appends the email with a
                timestamp to <code>emails.txt</code>. Review the file later or adapt the storage
                block to forward signups to your preferred service.
              </p>
              <p>
                Want the addresses in version control instead? Replace the file write with the
                GitHub API snippet documented inside <code>index.php</code> to push each signup to
                a repository of your choice.
              </p>
            </div>
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
