export function bisection(f, a, b, tol = 1e-6, maxIter = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }
  if (a >= b) {
    throw new RangeError('a must be less than b');
  }

  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) {
    throw new RangeError('f(a) and f(b) must have opposite signs');
  }

  let c, fc;
  for (let i = 0; i < maxIter; i++) {
    c = (a + b) / 2;
    fc = f(c);

    if (Math.abs(fc) < tol || Math.abs(b - a) / 2 < tol) {
      return { root: c, iterations: i + 1, residual: Math.abs(fc) };
    }

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  return { root: c, iterations: maxIter, residual: Math.abs(fc) };
}

export function newtonRaphson(f, df, x0, tol = 1e-6, maxIter = 100) {
  if (typeof f !== 'function' || typeof df !== 'function') {
    throw new TypeError('f and df must be functions');
  }
  if (typeof x0 !== 'number') {
    throw new TypeError('x0 must be number');
  }

  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const dfx = df(x);

    if (Math.abs(dfx) < 1e-14) {
      throw new RangeError('derivative too close to zero');
    }

    const xNew = x - fx / dfx;

    if (Math.abs(xNew - x) < tol) {
      return { root: xNew, iterations: i + 1, residual: Math.abs(f(xNew)) };
    }

    x = xNew;
  }

  return { root: x, iterations: maxIter, residual: Math.abs(f(x)) };
}

export function secant(f, x0, x1, tol = 1e-6, maxIter = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof x0 !== 'number' || typeof x1 !== 'number') {
    throw new TypeError('x0 and x1 must be numbers');
  }

  let xPrev = x0;
  let xCurr = x1;
  let fPrev = f(xPrev);
  let fCurr = f(xCurr);

  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(fCurr - fPrev) < 1e-14) {
      throw new RangeError('denominator too close to zero');
    }

    const xNext = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);

    if (Math.abs(xNext - xCurr) < tol) {
      return { root: xNext, iterations: i + 1, residual: Math.abs(f(xNext)) };
    }

    xPrev = xCurr;
    xCurr = xNext;
    fPrev = fCurr;
    fCurr = f(xCurr);
  }

  return { root: xCurr, iterations: maxIter, residual: Math.abs(fCurr) };
}

export function falsePosition(f, a, b, tol = 1e-6, maxIter = 100) {
  if (typeof f !== 'function') {
    throw new TypeError('f must be function');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('a and b must be numbers');
  }

  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) {
    throw new RangeError('f(a) and f(b) must have opposite signs');
  }

  for (let i = 0; i < maxIter; i++) {
    const c = a - (fa * (b - a)) / (fb - fa);
    const fc = f(c);

    if (Math.abs(fc) < tol) {
      return { root: c, iterations: i + 1, residual: Math.abs(fc) };
    }

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  const c = a - (fa * (b - a)) / (fb - fa);
  return { root: c, iterations: maxIter, residual: Math.abs(f(c)) };
}

export function fixedPoint(g, x0, tol = 1e-6, maxIter = 100) {
  if (typeof g !== 'function') {
    throw new TypeError('g must be function');
  }
  if (typeof x0 !== 'number') {
    throw new TypeError('x0 must be number');
  }

  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const xNew = g(x);

    if (Math.abs(xNew - x) < tol) {
      return { root: xNew, iterations: i + 1, residual: Math.abs(xNew - x) };
    }

    x = xNew;
  }

  return { root: x, iterations: maxIter, residual: Math.abs(g(x) - x) };
}
