export function cdf(x, distribution = 'uniform', ...params) {
  if (typeof x !== 'number') {
    throw new TypeError('x must be a number');
  }

  switch (distribution.toLowerCase()) {
    case 'uniform': {
      const [min = 0, max = 1] = params;
      if (x < min) return 0;
      if (x > max) return 1;
      return (x - min) / (max - min);
    }
    
    case 'normal': {
      const [mu = 0, sigma = 1] = params;
      const z = (x - mu) / sigma;
      return 0.5 * (1 + erf(z / Math.sqrt(2)));
    }
    
    case 'exponential': {
      const [lambda = 1] = params;
      if (x < 0) return 0;
      return 1 - Math.exp(-lambda * x);
    }
    
    case 'poisson': {
      const [lambda = 1] = params;
      if (x < 0) return 0;
      const k = Math.floor(x);
      let sum = 0;
      const expNeg = Math.exp(-lambda);
      let term = expNeg;
      
      for (let i = 0; i <= k; i++) {
        sum += term;
        if (i < k) term *= lambda / (i + 1);
      }
      return sum;
    }
    
    case 'beta': {
      const [a = 1, b = 1] = params;
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return incompleteBeta(x, a, b);
    }
    
    default:
      throw new RangeError(`unknown distribution: ${distribution}`);
  }
}

export function ppf(p, distribution = 'uniform', ...params) {
  if (typeof p !== 'number' || p < 0 || p > 1) {
    throw new RangeError('p must be in [0, 1]');
  }

  switch (distribution.toLowerCase()) {
    case 'uniform': {
      const [min = 0, max = 1] = params;
      return min + p * (max - min);
    }
    
    case 'normal': {
      const [mu = 0, sigma = 1] = params;
      return mu + sigma * invNormal(p);
    }
    
    case 'exponential': {
      const [lambda = 1] = params;
      if (p === 0) return 0;
      if (p === 1) return Infinity;
      return -Math.log(1 - p) / lambda;
    }
    
    case 'beta': {
      const [a = 1, b = 1] = params;
      if (p === 0) return 0;
      if (p === 1) return 1;
      return invIncompleteBeta(p, a, b);
    }
    
    default:
      throw new RangeError(`unknown distribution: ${distribution}`);
  }
}

export function sf(x, distribution = 'uniform', ...params) {
  if (typeof x !== 'number') {
    throw new TypeError('x must be a number');
  }
  
  return 1 - cdf(x, distribution, ...params);
}

function erf(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + p * absX);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;

  return sign * (1 - (a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) * Math.exp(-absX * absX));
}

function invNormal(p) {
  if (p <= 0.5) {
    const t = Math.sqrt(-2 * Math.log(p));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    return -(t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
  } else {
    const t = Math.sqrt(-2 * Math.log(1 - p));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
  }
}

function incompleteBeta(x, a, b) {
  const maxIterations = 100;
  const epsilon = 1e-10;
  
  let sum = 1;
  let term = 1;
  
  for (let i = 1; i <= maxIterations; i++) {
    term *= (a + b - 1) * x / ((a + i - 1) * (1 - x / (a + i)));
    const nextSum = sum + term;
    
    if (Math.abs(nextSum - sum) < epsilon) {
      break;
    }
    sum = nextSum;
  }
  
  return sum * Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b)) / a;
}

function invIncompleteBeta(p, a, b) {
  let x = 0.5;
  
  for (let i = 0; i < 20; i++) {
    const fx = incompleteBeta(x, a, b) - p;
    const absX = Math.log(x / (1 - x));
    const denom = (Math.exp(a * absX - logBeta(a, b)) * Math.exp(b * Math.log(1 - x))) / (a + b);
    const dx = fx / denom;
    
    x = Math.max(0.001, Math.min(0.999, x - dx));
    
    if (Math.abs(dx) < 1e-10) break;
  }
  
  return x;
}

function logBeta(a, b) {
  return logGamma(a) + logGamma(b) - logGamma(a + b);
}

function logGamma(x) {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  const g = 7;
  const z = x - 1;
  let sum = 0.99999999999980993;
  
  for (let i = 0; i < coefficients.length; i++) {
    sum += coefficients[i] / (z + i + 1);
  }
  
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(z + g + 0.5) - (z + g + 0.5) + Math.log(sum);
}
