export function gradientDescent(f, df, x0, learningRate = 0.01, iterations = 100, tol = 1e-6) {
  if (typeof f !== 'function' || typeof df !== 'function') {
    throw new TypeError('f and df must be functions');
  }
  if (typeof x0 !== 'number') {
    throw new TypeError('x0 must be number');
  }

  let x = x0;
  const history = [x];

  for (let i = 0; i < iterations; i++) {
    const grad = df(x);
    const xNew = x - learningRate * grad;

    if (Math.abs(xNew - x) < tol) {
      history.push(xNew);
      return { x: xNew, iterations: i + 1, value: f(xNew), history };
    }

    x = xNew;
    history.push(x);
  }

  return { x, iterations, value: f(x), history };
}

export function momentumDescent(f, df, x0, learningRate = 0.01, momentum = 0.9, iterations = 100, tol = 1e-6) {
  if (typeof f !== 'function' || typeof df !== 'function') {
    throw new TypeError('f and df must be functions');
  }
  if (typeof x0 !== 'number') {
    throw new TypeError('x0 must be number');
  }

  let x = x0;
  let velocity = 0;
  const history = [x];

  for (let i = 0; i < iterations; i++) {
    const grad = df(x);
    velocity = momentum * velocity + learningRate * grad;
    const xNew = x - velocity;

    if (Math.abs(xNew - x) < tol) {
      history.push(xNew);
      return { x: xNew, iterations: i + 1, value: f(xNew), history };
    }

    x = xNew;
    history.push(x);
  }

  return { x, iterations, value: f(x), history };
}

export function adam(f, df, x0, learningRate = 0.001, iterations = 100, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, tol = 1e-6) {
  if (typeof f !== 'function' || typeof df !== 'function') {
    throw new TypeError('f and df must be functions');
  }
  if (typeof x0 !== 'number') {
    throw new TypeError('x0 must be number');
  }

  let x = x0;
  let m = 0;
  let v = 0;
  const history = [x];

  for (let t = 1; t <= iterations; t++) {
    const grad = df(x);
    
    m = beta1 * m + (1 - beta1) * grad;
    v = beta2 * v + (1 - beta2) * grad * grad;

    const mHat = m / (1 - Math.pow(beta1, t));
    const vHat = v / (1 - Math.pow(beta2, t));

    const xNew = x - learningRate * mHat / (Math.sqrt(vHat) + eps);

    if (Math.abs(xNew - x) < tol) {
      history.push(xNew);
      return { x: xNew, iterations: t, value: f(xNew), history };
    }

    x = xNew;
    history.push(x);
  }

  return { x, iterations, value: f(x), history };
}

export function simplex(f, vertices, maxIter = 1000, tol = 1e-6) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (!Array.isArray(vertices) || vertices.length < 2) {
    throw new TypeError('vertices must be array of points');
  }

  const n = vertices[0].length;
  let currentVertices = vertices.map(v => [...v]);

  for (let iter = 0; iter < maxIter; iter++) {
    const values = currentVertices.map(f);
    
    const sorted = currentVertices.map((v, i) => [v, values[i]])
      .sort((a, b) => a[1] - b[1]);

    if (sorted[sorted.length - 1][1] - sorted[0][1] < tol) {
      return { min: sorted[0][0], value: sorted[0][1], iterations: iter };
    }

    const best = sorted.slice(0, n).map(x => x[0]);
    const worst = sorted[sorted.length - 1][0];

    const centroid = new Array(n);
    for (let i = 0; i < n; i++) {
      centroid[i] = best.reduce((sum, v) => sum + v[i], 0) / n;
    }

    const reflected = centroid.map((x, i) => x + (x - worst[i]));
    const reflectedValue = f(reflected);

    if (reflectedValue < sorted[0][1]) {
      currentVertices = [...best, reflected];
    } else if (reflectedValue < sorted[n - 1][1]) {
      currentVertices = [...best, reflected];
    } else {
      const contracted = centroid.map((x, i) => x + 0.5 * (worst[i] - x));
      currentVertices = [...best, contracted];
    }
  }

  const values = currentVertices.map(f);
  const minIdx = values.indexOf(Math.min(...values));
  return { min: currentVertices[minIdx], value: values[minIdx], iterations: maxIter };
}

export function brent(f, a, b, tol = 1e-6, maxIter = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new RangeError('f(a) and f(b) must have opposite signs');
  }

  if (Math.abs(fa) < Math.abs(fb)) {
    [a, b] = [b, a];
    [fa, fb] = [fb, fa];
  }

  let c = a;
  let fc = fa;
  let d = b - a;
  let e = d;

  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(fc) < Math.abs(fb)) {
      a = b;
      b = c;
      c = a;
      fa = fb;
      fb = fc;
      fc = fa;
    }

    const tol1 = tol * Math.abs(b) + 1e-12;
    const xm = 0.5 * (c - b);

    if (Math.abs(xm) <= tol1 || Math.abs(fb) < 1e-14) {
      return { root: b, iterations: i + 1, residual: Math.abs(fb) };
    }

    if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
      let s = fb / fa;
      let p, q;

      if (Math.abs(a - c) < 1e-14) {
        p = 2 * xm * s;
        q = 1 - s;
      } else {
        q = fa / fc;
        const r = fb / fc;
        p = s * (2 * xm * q * (q - r) - (b - a) * (r - 1));
        q = (q - 1) * (r - 1) * (s - 1);
      }

      if (p > 0) q = -q;
      else p = -p;

      if (2 * p < 3 * xm * q - Math.abs(tol1 * q) && p < Math.abs(0.5 * e * q)) {
        e = d;
        d = p / q;
      } else {
        d = xm;
        e = d;
      }
    } else {
      d = xm;
      e = d;
    }

    a = b;
    fa = fb;
    b += Math.abs(d) > tol1 ? d : (xm > 0 ? tol1 : -tol1);
    fb = f(b);
  }

  return { root: b, iterations: maxIter, residual: Math.abs(fb) };
}
