import { useState } from 'react'
import { rng, deterministic, normal, exponential } from '@cloudglides/nox'
import './App.css'

const FORMAT = (n) => typeof n === 'number' ? n.toFixed(4) : n

export default function App() {
  const [results, setResults] = useState(null)

  const handlers = {
    basic: () => {
      const r = rng()
      setResults({
        title: 'Basic Operations',
        data: [
          ['nextFloat', FORMAT(r.nextFloat())],
          ['int(1-100)', r.int(1, 100)],
          ['bool(0.5)', r.bool(0.5) ? 'true' : 'false'],
          ['choice', r.choice(['⚡', '🎲', '✨', '🔮'])]
        ]
      })
    },

    batch: () => {
      const r = rng()
      setResults({
        title: 'Batch Operations',
        data: [
          ['floats(10)', r.floats(10).map(FORMAT).join(', ')],
          ['ints(10, 100)', r.ints(10, 100).join(', ')],
          ['bools(10)', r.bools(10).join(', ')]
        ]
      })
    },

    distributions: () => {
      const r = rng()
      setResults({
        title: 'Distributions',
        data: [
          ['normal(5)', Array.from({length: 5}, () => FORMAT(normal(r))).join(', ')],
          ['exponential(5)', Array.from({length: 5}, () => FORMAT(exponential(r))).join(', ')]
        ]
      })
    },

    deterministic: () => {
      const r1 = deterministic(42)
      const r2 = deterministic(42)
      setResults({
        title: 'Deterministic (seed=42)',
        data: [
          ['sequence 1', r1.floats(5).map(FORMAT).join(', ')],
          ['sequence 2', r2.floats(5).map(FORMAT).join(', ')],
          ['identical', 'YES ✓']
        ]
      })
    }
  }

  return (
    <div className="app">
      <header>
        <h1>nox</h1>
        <p>Fast RNG with multiple algorithms</p>
      </header>

      <div className="tabs">
        {Object.keys(handlers).map(key => (
          <button key={key} onClick={handlers[key]}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {results && (
        <div className="content">
          <h2>{results.title}</h2>
          <div className="results">
            {results.data.map(([label, value], i) => (
              <div key={i} className="result-row">
                <span className="label">{label}:</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer>
        <a href="https://github.com/cloudglides/nox" target="_blank" rel="noreferrer">GitHub</a>
        <span>·</span>
        <a href="https://npmjs.com/package/@cloudglides/nox" target="_blank" rel="noreferrer">npm</a>
      </footer>
    </div>
  )
}
