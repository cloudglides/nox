export class LinearInterpolator {
  constructor(x, y) {
    if (!Array.isArray(x) || !Array.isArray(y)) {
      throw new TypeError('x and y must be arrays');
    }
    if (x.length !== y.length || x.length < 2) {
      throw new RangeError('x and y must have same length >= 2');
    }

    const sorted = x.map((xi, i) => [xi, y[i]]).sort((a, b) => a[0] - b[0]);
    this.x = sorted.map(p => p[0]);
    this.y = sorted.map(p => p[1]);
  }

  evaluate(xVal) {
    if (typeof xVal === 'number') {
      return this._interpolate(xVal);
    }
    if (Array.isArray(xVal)) {
      return xVal.map(x => this._interpolate(x));
    }
    throw new TypeError('xVal must be number or array');
  }

  _interpolate(xVal) {
    if (xVal < this.x[0] || xVal > this.x[this.x.length - 1]) {
      throw new RangeError(`xVal must be in [${this.x[0]}, ${this.x[this.x.length - 1]}]`);
    }

    let i = 0;
    while (i < this.x.length - 1 && this.x[i + 1] < xVal) {
      i++;
    }

    const x0 = this.x[i];
    const x1 = this.x[i + 1];
    const y0 = this.y[i];
    const y1 = this.y[i + 1];

    return y0 + (y1 - y0) * (xVal - x0) / (x1 - x0);
  }
}

export class CubicSplineInterpolator {
  constructor(x, y) {
    if (!Array.isArray(x) || !Array.isArray(y)) {
      throw new TypeError('x and y must be arrays');
    }
    if (x.length !== y.length || x.length < 3) {
      throw new RangeError('x and y must have same length >= 3');
    }

    const sorted = x.map((xi, i) => [xi, y[i]]).sort((a, b) => a[0] - b[0]);
    this.x = sorted.map(p => p[0]);
    this.y = sorted.map(p => p[1]);

    this._computeSplines();
  }

  _computeSplines() {
    const n = this.x.length;
    const h = new Array(n - 1);
    const alpha = new Array(n - 1);

    for (let i = 0; i < n - 1; i++) {
      h[i] = this.x[i + 1] - this.x[i];
    }

    for (let i = 1; i < n - 1; i++) {
      alpha[i] = (3 / h[i]) * (this.y[i + 1] - this.y[i]) - (3 / h[i - 1]) * (this.y[i] - this.y[i - 1]);
    }

    const l = new Array(n);
    const mu = new Array(n);
    const z = new Array(n);

    l[0] = 1;
    mu[0] = 0;
    z[0] = 0;

    for (let i = 1; i < n - 1; i++) {
      l[i] = 2 * (this.x[i + 1] - this.x[i - 1]) - h[i - 1] * mu[i - 1];
      mu[i] = h[i] / l[i];
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    l[n - 1] = 1;
    z[n - 1] = 0;

    this.c = new Array(n);
    this.b = new Array(n - 1);
    this.d = new Array(n - 1);

    this.c[n - 1] = 0;

    for (let i = n - 2; i >= 0; i--) {
      this.c[i] = z[i] - mu[i] * this.c[i + 1];
      this.b[i] = (this.y[i + 1] - this.y[i]) / h[i] - h[i] * (this.c[i + 1] + 2 * this.c[i]) / 3;
      this.d[i] = (this.c[i + 1] - this.c[i]) / (3 * h[i]);
    }
  }

  evaluate(xVal) {
    if (typeof xVal === 'number') {
      return this._interpolate(xVal);
    }
    if (Array.isArray(xVal)) {
      return xVal.map(x => this._interpolate(x));
    }
    throw new TypeError('xVal must be number or array');
  }

  _interpolate(xVal) {
    if (xVal < this.x[0] || xVal > this.x[this.x.length - 1]) {
      throw new RangeError(`xVal must be in [${this.x[0]}, ${this.x[this.x.length - 1]}]`);
    }

    let i = 0;
    while (i < this.x.length - 1 && this.x[i + 1] < xVal) {
      i++;
    }

    const dx = xVal - this.x[i];
    return this.y[i] + this.b[i] * dx + this.c[i] * dx * dx + this.d[i] * dx * dx * dx;
  }
}

export function lagrangeInterpolation(x, y, xVal) {
  if (!Array.isArray(x) || !Array.isArray(y)) {
    throw new TypeError('x and y must be arrays');
  }
  if (x.length !== y.length || x.length === 0) {
    throw new RangeError('x and y must have same non-zero length');
  }

  if (typeof xVal === 'number') {
    return _lagrange(x, y, xVal);
  }
  if (Array.isArray(xVal)) {
    return xVal.map(x => _lagrange(x, y, x));
  }
  throw new TypeError('xVal must be number or array');
}

function _lagrange(x, y, xVal) {
  let result = 0;
  const n = x.length;

  for (let i = 0; i < n; i++) {
    let term = y[i];
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        term *= (xVal - x[j]) / (x[i] - x[j]);
      }
    }
    result += term;
  }

  return result;
}

export function polynomialFit(x, y, degree) {
  if (!Array.isArray(x) || !Array.isArray(y)) {
    throw new TypeError('x and y must be arrays');
  }
  if (x.length !== y.length || x.length <= degree) {
    throw new RangeError('need at least degree+1 points');
  }
  if (typeof degree !== 'number' || degree < 1) {
    throw new RangeError('degree must be positive integer');
  }

  const n = x.length;
  const A = new Array(degree + 1);

  for (let i = 0; i <= degree; i++) {
    A[i] = new Array(degree + 2);
    for (let j = 0; j <= degree; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += Math.pow(x[k], i + j);
      }
      A[i][j] = sum;
    }

    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += y[k] * Math.pow(x[k], i);
    }
    A[i][degree + 1] = sum;
  }

  for (let i = 0; i <= degree; i++) {
    let maxRow = i;
    for (let k = i + 1; k <= degree; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    [A[i], A[maxRow]] = [A[maxRow], A[i]];

    for (let k = i + 1; k <= degree; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j <= degree + 1; j++) {
        A[k][j] -= factor * A[i][j];
      }
    }
  }

  const coeffs = new Array(degree + 1);
  for (let i = degree; i >= 0; i--) {
    coeffs[i] = A[i][degree + 1];
    for (let j = i + 1; j <= degree; j++) {
      coeffs[i] -= A[i][j] * coeffs[j];
    }
    coeffs[i] /= A[i][i];
  }

  return coeffs;
}
