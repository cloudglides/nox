import { useState } from 'react'
import {
  rng, deterministic, normal, exponential, poisson, uniform,
  shuffle, sample, pick, weightedPick,
  meanTest, varianceTest, kolmogorovSmirnovTest,
  cohensD, correlation, cramersV,
  bootstrapCI, meanCI,
  tTest, welchTTest, oneWayAnova,
  LinearRegression, MultipleRegression,
  diff, lag, sma, ema, acf,
  matrixAdd, matrixMul, determinant, matrixInverse,
  trapezoidal, simpsons, numericalDerivative,
  LinearInterpolator, CubicSplineInterpolator,
  bisection, newtonRaphson, brent,
  rk4,
  svd, qr, cholesky,
  zscore, standardize, minMaxScale,
  sum, mean, min, max, unique,
  dirichlet, mixture,
  gradientDescent, adam
} from '@cloudglides/nox'
import './App.css'

const FORMAT = (n) => typeof n === 'number' ? n.toFixed(4) : n

export default function App() {
  const [results, setResults] = useState(null)

  const handlers = {
    basics: () => {
      const r = rng()
      setResults({
        title: 'Basic Operations',
        data: [
          ['nextFloat', FORMAT(r.nextFloat())],
          ['int(1-100)', r.int(1, 100)],
          ['bool(0.5)', r.bool(0.5) ? 'true' : 'false'],
          ['choice', r.choice(['A', 'B', 'C', 'D'])],
          ['range(1-10, step 2)', r.range(1, 10, 2).join(', ')]
        ]
      })
    },

    distributions: () => {
      const r = rng()
      const normals = Array.from({length: 5}, () => FORMAT(normal(r)))
      const exponentials = Array.from({length: 5}, () => FORMAT(exponential(r)))
      const dir = dirichlet(r, [1, 2, 3]).map(FORMAT)
      setResults({
        title: 'Distributions',
        data: [
          ['normal(5)', normals.join(', ')],
          ['exponential(5)', exponentials.join(', ')],
          ['poisson(λ=3)', [poisson(r, 3), poisson(r, 3), poisson(r, 3)].join(', ')],
          ['dirichlet[1,2,3]', dir.join(', ')]
        ]
      })
    },

    sampling: () => {
      const r = rng()
      const arr = [1, 2, 3, 4, 5]
      const weights = [0.1, 0.2, 0.3, 0.2, 0.2]
      setResults({
        title: 'Sampling Methods',
        data: [
          ['shuffle', shuffle(arr, r).join(', ')],
          ['sample(3)', sample(arr, 3, r).join(', ')],
          ['pick', pick(arr, r)],
          ['weightedPick', weightedPick(arr, weights, r)],
          ['unique', unique([1, 2, 2, 3, 3, 3]).join(', ')]
        ]
      })
    },

    statistics: () => {
      const r = rng()
      const data = r.floats(100).map(x => x * 10)
      const mean_val = mean(data)
      const std = Math.sqrt(data.reduce((s, x) => s + (x - mean_val) ** 2, 0) / data.length)
      
      const data2 = r.floats(50).map(x => x * 8)
      const d = cohensD(data, data2)
      const corr = correlation(data.slice(0, 50), data2.slice(0, 50))
      
      setResults({
        title: 'Statistics & Effect Sizes',
        data: [
          ['mean', FORMAT(mean_val)],
          ['min', FORMAT(min(data))],
          ['max', FORMAT(max(data))],
          ["Cohen's d", FORMAT(d)],
          ['correlation', FORMAT(corr)],
          ['KS-test', FORMAT(kolmogorovSmirnovTest(data.map(x => x / 10)))]
        ]
      })
    },

    hypothesis: () => {
      const r = rng()
      const group1 = r.floats(30).map(x => 5 + x * 2)
      const group2 = r.floats(30).map(x => 5.5 + x * 2)
      
      const t_result = tTest(group1, group2)
      const w_result = welchTTest(group1, group2)
      
      const groups = [group1, group2]
      const anova = oneWayAnova(groups)
      
      setResults({
        title: 'Hypothesis Testing',
        data: [
          ['t-test (t, df)', `${FORMAT(t_result.t)}, ${t_result.df}`],
          ["Welch's t-test", FORMAT(w_result.t)],
          ['ANOVA (F, df)', `${FORMAT(anova.f)}, ${anova.dfB}/${anova.dfW}`],
          ['meanCI(group1)', `[${FORMAT(meanCI(group1, 1).lower)}, ${FORMAT(meanCI(group1, 1).upper)}]`]
        ]
      })
    },

    regression: () => {
      const x = [1, 2, 3, 4, 5]
      const y = [2.1, 3.9, 6.2, 7.8, 10.1]
      
      const model = new LinearRegression(x, y)
      
      const xMulti = [[1, 2], [2, 3], [3, 4], [4, 5]]
      const yMulti = [2, 5, 9, 13]
      const modelMulti = new MultipleRegression(xMulti, yMulti)
      
      setResults({
        title: 'Regression Models',
        data: [
          ['Linear: slope', FORMAT(model.slope)],
          ['Linear: intercept', FORMAT(model.intercept)],
          ['Linear: R²', FORMAT(model.rSquared)],
          ['Linear: RMSE', FORMAT(model.rmse)],
          ['Multiple R²', FORMAT(modelMulti.rSquared)],
          ['Multiple adj-R²', FORMAT(modelMulti.adjRSquared)]
        ]
      })
    },

    timeseries: () => {
      const r = rng()
      const ts = Array.from({length: 20}, (_, i) => 10 + i * 0.5 + (r.nextFloat() - 0.5) * 2)
      
      const diffed = diff(ts, 1)
      const lagged = lag(ts, 2).slice(2)
      const sma_vals = sma(ts, 3).filter(x => x !== null)
      const ema_vals = ema(ts, 3)
      const acf_vals = acf(ts, 5)
      
      setResults({
        title: 'Time Series Analysis',
        data: [
          ['original (first 5)', ts.slice(0, 5).map(FORMAT).join(', ')],
          ['diff(order=1)', diffed.slice(0, 5).map(FORMAT).join(', ')],
          ['SMA(window=3)', sma_vals.slice(0, 5).map(FORMAT).join(', ')],
          ['EMA(window=3)', ema_vals.slice(0, 5).map(FORMAT).join(', ')],
          ['ACF (lag 0-2)', acf_vals.slice(0, 3).map(FORMAT).join(', ')]
        ]
      })
    },

    matrix: () => {
      const A = [[1, 2], [3, 4]]
      const B = [[5, 6], [7, 8]]
      
      const sum = matrixAdd(A, B)
      const prod = matrixMul(A, B)
      const det = determinant(A)
      const inv = matrixInverse(A)
      
      setResults({
        title: 'Matrix Operations',
        data: [
          ['A+B[0][0]', FORMAT(sum[0][0])],
          ['A*B[0][0]', FORMAT(prod[0][0])],
          ['det(A)', FORMAT(det)],
          ['inv(A)[0][1]', FORMAT(inv[0][1])],
          ['trace(A)', FORMAT(1 + 4)]
        ]
      })
    },

    decomposition: () => {
      const A = [[1, 2], [3, 4]]
      
      const {U, S, VT} = svd(A, 10)
      const {Q, R} = qr(A)
      
      try {
        const L = cholesky([[4, 2], [2, 3]])
        setResults({
          title: 'Matrix Decompositions',
          data: [
            ['SVD S[0]', FORMAT(S[0])],
            ['SVD S[1]', FORMAT(S[1])],
            ['QR R[0][0]', FORMAT(R[0][0])],
            ['QR R[0][1]', FORMAT(R[0][1])],
            ['Cholesky L[0][0]', FORMAT(L[0][0])],
            ['Cholesky L[1][0]', FORMAT(L[1][0])]
          ]
        })
      } catch {
        setResults({
          title: 'Matrix Decompositions',
          data: [
            ['SVD S[0]', FORMAT(S[0])],
            ['QR R[0][0]', FORMAT(R[0][0])],
            ['Cholesky', 'Not positive definite']
          ]
        })
      }
    },

    integration: () => {
      const f = (x) => Math.sin(x)
      const a = 0, b = Math.PI
      
      const trap = trapezoidal(f, a, b, 100)
      const simp = simpsons(f, a, b, 100)
      const deriv1 = numericalDerivative(f, 1)
      const deriv2 = numericalDerivative(Math.cos, 0)
      
      setResults({
        title: 'Numerical Integration & Derivatives',
        data: [
          ['∫sin(x) [0,π] exact', '2.0000'],
          ['∫sin(x) trapezoidal', FORMAT(trap)],
          ['∫sin(x) Simpson', FORMAT(simp)],
          ['d/dx sin(x) at x=1', FORMAT(deriv1)],
          ['d/dx cos(x) at x=0', FORMAT(deriv2)]
        ]
      })
    },

    interpolation: () => {
      const x = [0, 1, 2, 3, 4]
      const y = [0, 1, 4, 9, 16]
      
      const linear = new LinearInterpolator(x, y)
      const cubic = new CubicSplineInterpolator(x, y)
      
      const x_interp = 1.5
      const y_linear = linear.evaluate(x_interp)
      const y_cubic = cubic.evaluate(x_interp)
      
      setResults({
        title: 'Interpolation',
        data: [
          ['x points', x.join(', ')],
          ['y points', y.join(', ')],
          [`Linear at x=${x_interp}`, FORMAT(y_linear)],
          [`Cubic spline at x=${x_interp}`, FORMAT(y_cubic)],
          ['Expected (x²) at 1.5', FORMAT(1.5 * 1.5)]
        ]
      })
    },

    rootfinding: () => {
      const f = (x) => x ** 2 - 4
      const df = (x) => 2 * x
      
      const bisect = bisection(f, 1, 3, 1e-6)
      const newton = newtonRaphson(f, df, 3, 1e-6)
      const brentResult = brent(f, 1, 3, 1e-6)
      
      setResults({
        title: 'Root Finding Methods',
        data: [
          ['f(x) = x² - 4, root is x=2'],
          ['bisection: root', FORMAT(bisect.root)],
          ['bisection: iterations', bisect.iterations],
          ['Newton-Raphson: root', FORMAT(newton.root)],
          ['Newton-Raphson: iterations', newton.iterations],
          ['Brent: root', FORMAT(brentResult.root)],
          ['Brent: iterations', brentResult.iterations]
        ]
      })
    },

    ode: () => {
      const dydt = (t, y) => -y
      const y0 = 1
      const result = rk4(dydt, y0, 0, 2, 0.1)
      
      const analytical = Math.exp(-2)
      
      setResults({
        title: 'ODE Solver (dy/dt = -y, y(0)=1)',
        data: [
          ['Solver method', 'RK4 (4th order)'],
          ['Time steps', result.t.length],
          ['t values', result.t.slice(0, 5).map(FORMAT).join(', ')],
          ['y values', result.y.slice(0, 5).map(FORMAT).join(', ')],
          ['y(2) numerical', FORMAT(result.y[result.y.length - 1])],
          ['y(2) analytical', FORMAT(analytical)]
        ]
      })
    },

    transforms: () => {
      const r = rng()
      const data = r.floats(20).map(x => x * 10 + 5)
      
      const z = zscore(data)
      const std = standardize(data)
      const scaled = minMaxScale(data)
      
      setResults({
        title: 'Data Transformations',
        data: [
          ['original: mean', FORMAT(mean(data))],
          ['original: min', FORMAT(min(data))],
          ['original: max', FORMAT(max(data))],
          ['z-score: mean', FORMAT(mean(z).toFixed(10))],
          ['z-score: std', FORMAT(Math.sqrt(z.reduce((s, x) => s + x * x, 0) / z.length))],
          ['minmax: min', FORMAT(min(scaled))],
          ['minmax: max', FORMAT(max(scaled))]
        ]
      })
    },

    optimization: () => {
      const f = (x) => (x - 3) ** 2 + 2
      const df = (x) => 2 * (x - 3)
      
      const gd = gradientDescent(f, df, 0, 0.1, 100, 1e-6)
      const adamResult = adam(f, df, 0, 0.1, 100, 0.9, 0.999, 1e-8, 1e-6)
      
      setResults({
        title: 'Optimization Methods',
        data: [
          ['Minimize: f(x) = (x-3)² + 2, min at x=3'],
          ['Gradient Descent x', FORMAT(gd.x)],
          ['Gradient Descent iterations', gd.iterations],
          ['Gradient Descent value', FORMAT(gd.value)],
          ['Adam x', FORMAT(adamResult.x)],
          ['Adam iterations', adamResult.iterations],
          ['Adam value', FORMAT(adamResult.value)]
        ]
      })
    }
  }

  const categoryGroups = {
    'Core': ['basics', 'distributions', 'sampling'],
    'Statistics': ['statistics', 'hypothesis'],
    'Modeling': ['regression', 'timeseries'],
    'Numerics': ['integration', 'interpolation', 'rootfinding', 'ode'],
    'Linear Algebra': ['matrix', 'decomposition'],
    'Advanced': ['optimization', 'transforms']
  }

  return (
    <div className="app">
      <header>
        <h1>nox</h1>
        <p>Comprehensive RNG and Numerical Computing Library</p>
      </header>

      <div className="tabs-container">
        {Object.entries(categoryGroups).map(([category, items]) => (
          <div key={category} className="category">
            <h3>{category}</h3>
            <div className="tabs">
              {items.map(key => (
                <button key={key} onClick={handlers[key]}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>
          </div>
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
