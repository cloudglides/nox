import { useState } from 'react'
import { rng, deterministic, normal, exponential, meanTest, varianceTest, kolmogorovSmirnovTest } from '@cloudglides/nox'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('basic')
  const [results, setResults] = useState({})

  const runBasic = () => {
    const r = rng()
    setResults({
      float: r.nextFloat().toFixed(6),
      int: r.int(1, 100),
      bool: r.bool(0.5),
      range: r.range(10, 20, 2),
      choice: r.choice(['apple', 'banana', 'cherry'])
    })
  }

  const runBatch = () => {
    const r = rng()
    setResults({
      floats: r.floats(5).map(x => x.toFixed(4)).join(', '),
      ints: r.ints(5, 100).join(', '),
      bools: r.bools(5).join(', ')
    })
  }

  const runDistributions = () => {
    const r = rng()
    const samples = r.floats(100)
    setResults({
      normal: Array.from({length: 5}, () => normal(r).toFixed(4)).join(', '),
      exponential: Array.from({length: 5}, () => exponential(r).toFixed(4)).join(', ')
    })
  }

  const runStats = () => {
    const r = rng()
    const data = r.floats(1000)
    const mean = meanTest(data)
    const variance = varianceTest(data)
    const ks = kolmogorovSmirnovTest(data)
    setResults({
      mean: mean.mean.toFixed(6),
      variance: variance.variance.toFixed(6),
      ksPass: ks.pass_0_05 ? 'PASS' : 'FAIL'
    })
  }

  const runDeterministic = () => {
    const r1 = deterministic(42)
    const seq1 = r1.floats(5)
    const r2 = deterministic(42)
    const seq2 = r2.floats(5)
    setResults({
      seq1: seq1.map(x => x.toFixed(4)).join(', '),
      seq2: seq2.map(x => x.toFixed(4)).join(', '),
      identical: JSON.stringify(seq1) === JSON.stringify(seq2) ? 'YES' : 'NO'
    })
  }

  return (
    <div className="app">
      <header>
        <h1>nox - RNG Demo</h1>
        <p>Unpredictable random number generator with multiple algorithms</p>
      </header>

      <div className="tabs">
        <button className={tab === 'basic' ? 'active' : ''} onClick={() => setTab('basic')}>
          Basic
        </button>
        <button className={tab === 'batch' ? 'active' : ''} onClick={() => setTab('batch')}>
          Batch
        </button>
        <button className={tab === 'distributions' ? 'active' : ''} onClick={() => setTab('distributions')}>
          Distributions
        </button>
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>
          Statistics
        </button>
        <button className={tab === 'deterministic' ? 'active' : ''} onClick={() => setTab('deterministic')}>
          Deterministic
        </button>
      </div>

      <div className="content">
        {tab === 'basic' && (
          <div className="section">
            <h2>Basic RNG Operations</h2>
            <button onClick={runBasic} className="action-btn">Run</button>
            <div className="results">
              {results.float && (
                <div>
                  <p><strong>nextFloat():</strong> {results.float}</p>
                  <p><strong>int(1, 100):</strong> {results.int}</p>
                  <p><strong>bool(0.5):</strong> {results.bool ? 'true' : 'false'}</p>
                  <p><strong>range(10, 20, 2):</strong> {results.range}</p>
                  <p><strong>choice():</strong> {results.choice}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'batch' && (
          <div className="section">
            <h2>Batch Operations</h2>
            <button onClick={runBatch} className="action-btn">Run</button>
            <div className="results">
              {results.floats && (
                <div>
                  <p><strong>floats(5):</strong> [{results.floats}]</p>
                  <p><strong>ints(5, 100):</strong> [{results.ints}]</p>
                  <p><strong>bools(5):</strong> [{results.bools}]</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'distributions' && (
          <div className="section">
            <h2>Statistical Distributions</h2>
            <button onClick={runDistributions} className="action-btn">Run</button>
            <div className="results">
              {results.normal && (
                <div>
                  <p><strong>Normal(0, 1):</strong> [{results.normal}]</p>
                  <p><strong>Exponential(1):</strong> [{results.exponential}]</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="section">
            <h2>Statistical Tests</h2>
            <button onClick={runStats} className="action-btn">Run on 1000 samples</button>
            <div className="results">
              {results.mean && (
                <div>
                  <p><strong>Mean (expected 0.5):</strong> {results.mean}</p>
                  <p><strong>Variance (expected 0.083333):</strong> {results.variance}</p>
                  <p><strong>KS Test (α=0.05):</strong> {results.ksPass}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'deterministic' && (
          <div className="section">
            <h2>Deterministic Mode</h2>
            <button onClick={runDeterministic} className="action-btn">Run with seed=42</button>
            <div className="results">
              {results.seq1 && (
                <div>
                  <p><strong>Sequence 1:</strong> [{results.seq1}]</p>
                  <p><strong>Sequence 2:</strong> [{results.seq2}]</p>
                  <p><strong>Identical:</strong> {results.identical}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer>
        <p>Visit <a href="https://github.com/cloudglides/nox" target="_blank" rel="noreferrer">GitHub</a> | <a href="https://npmjs.com/package/@cloudglides/nox" target="_blank" rel="noreferrer">npm</a></p>
      </footer>
    </div>
  )
}
