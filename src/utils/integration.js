export function trapezoidal(f, a, b, n = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be positive integer');
  }

  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;

  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }

  return h * sum;
}

export function simpsons(f, a, b, n = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }
  if (typeof n !== 'number' || n < 2 || n % 2 !== 0) {
    throw new RangeError('n must be even integer >= 2');
  }

  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    const coeff = i % 2 === 0 ? 2 : 4;
    sum += coeff * f(a + i * h);
  }

  return (h / 3) * sum;
}

export function adaptiveSimpson(f, a, b, tol = 1e-6, depth = 0, maxDepth = 50) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }

  const c = (a + b) / 2;
  const h = b - a;
  const fa = f(a);
  const fb = f(b);
  const fc = f(c);

  const S = (h / 6) * (fa + 4 * fc + fb);
  const fd = f((a + c) / 2);
  const fe = f((c + b) / 2);

  const left = (h / 12) * (fa + 4 * fd + fc);
  const right = (h / 12) * (fc + 4 * fe + fb);

  if (depth >= maxDepth || Math.abs(left + right - S) <= 15 * tol) {
    return left + right + (left + right - S) / 15;
  }

  return adaptiveSimpson(f, a, c, tol / 2, depth + 1, maxDepth) +
         adaptiveSimpson(f, c, b, tol / 2, depth + 1, maxDepth);
}

export function gaussQuadrature(f, a, b, n = 5) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }

  const weights = getGaussWeights(n);
  const nodes = getGaussNodes(n);

  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = ((b - a) * nodes[i] + (b + a)) / 2;
    sum += weights[i] * f(x);
  }

  return ((b - a) / 2) * sum;
}

function getGaussWeights(n) {
  const weights = {
    1: [2],
    2: [1, 1],
    3: [0.5555555556, 0.8888888889, 0.5555555556],
    4: [0.3478548451, 0.6521451549, 0.6521451549, 0.3478548451],
    5: [0.2369268851, 0.4786286705, 0.5688888889, 0.4786286705, 0.2369268851]
  };

  return weights[n] || weights[5];
}

function getGaussNodes(n) {
  const nodes = {
    1: [0],
    2: [-0.5773502692, 0.5773502692],
    3: [-0.7745966692, 0, 0.7745966692],
    4: [-0.8611363116, -0.3399810436, 0.3399810436, 0.8611363116],
    5: [-0.9061798459, -0.5384693101, 0, 0.5384693101, 0.9061798459]
  };

  return nodes[n] || nodes[5];
}

export function numericalDerivative(f, x, h = 1e-5) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof x !== 'number') {
    throw new TypeError('x must be number');
  }

  return (f(x + h) - f(x - h)) / (2 * h);
}

export function numericalSecondDerivative(f, x, h = 1e-5) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof x !== 'number') {
    throw new TypeError('x must be number');
  }

  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
