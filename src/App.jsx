import './App.css'

const highlights = [
  {
    title: 'Simple setup',
    copy: 'Everything you need to say hello is already in place and ready to go.',
  },
  {
    title: 'Modern feel',
    copy: 'A calm, balanced layout that looks current without getting in the way.',
  },
  {
    title: 'Room to grow',
    copy: 'Add your ideas at your own pace and keep the friendly vibe intact.',
  },
]

function App() {
  return (
    <main className="hero">
      <section className="hero-card">
        <span className="hero-card__eyebrow">Hello there</span>
        <h1>A friendly hello world</h1>
        <p>
          Keep things light while you get started. This starter keeps the gentle gradients,
          soft edges, and space to share a clear message.
        </p>
        <div className="hero-card__actions">
          <a className="button button--primary" href="#say-hello">
            Say hello
          </a>
          <a className="button button--ghost" href="#learn-more">
            Learn more
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
