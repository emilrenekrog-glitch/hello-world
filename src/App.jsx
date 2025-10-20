import './App.css'

const highlights = [
  {
    title: 'Instant start',
    copy: 'Spin up a fresh project in seconds and keep moving forward fast.',
  },
  {
    title: 'Clean aesthetic',
    copy: 'Enjoy a calming layout that keeps the focus on what matters.',
  },
  {
    title: 'Friendly to build on',
    copy: 'Drop in new sections or components without redesigning from scratch.',
  },
]

function App() {
  return (
    <main className="hero">
      <section className="hero-card">
        <span className="hero-card__eyebrow">A warm welcome</span>
        <h1>Hello World</h1>
        <p>
          This refreshed starting point is simple, modern, and inviting—ready for you to
          tailor into something uniquely yours.
        </p>
        <div className="hero-card__actions">
          <a className="button button--primary" href="#get-started">
            Get started
          </a>
          <a className="button button--ghost" href="#tour">
            Take a tour
          </a>
        </div>
        <ul className="hero-card__highlights">
          {highlights.map((item) => (
            <li key={item.title}>
              <span className="highlight-title">{item.title}</span>
              <span className="highlight-copy">{item.copy}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
