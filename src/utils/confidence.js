export function bootstrapCI(r, data, statistic, level = 0.95, n = 1000) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof statistic !== 'function') {
    throw new TypeError('statistic must be function');
  }
  if (typeof level !== 'number' || level <= 0 || level >= 1) {
    throw new RangeError('level must be in (0, 1)');
  }

  const samples = new Array(n);
  const size = data.length;

  for (let i = 0; i < n; i++) {
    const resample = new Array(size);
    for (let j = 0; j < size; j++) {
      resample[j] = data[r.nextInt(size)];
    }
    samples[i] = statistic(resample);
  }

  samples.sort((a, b) => a - b);

  const alpha = 1 - level;
  const lower = Math.floor(alpha / 2 * n);
  const upper = Math.ceil((1 - alpha / 2) * n);

  return {
    lower: samples[lower],
    upper: samples[upper],
    estimate: statistic(data),
    level
  };
}

export function meanCI(data, stddev, level = 0.95, variance = null) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof level !== 'number' || level <= 0 || level >= 1) {
    throw new RangeError('level must be in (0, 1)');
  }

  const n = data.length;
  const mean = data.reduce((a, b) => a + b, 0) / n;

  if (variance !== null) {
    if (typeof variance !== 'number' || variance <= 0) {
      throw new RangeError('variance must be positive');
    }
    const se = Math.sqrt(variance / n);
    const z = invNormal((1 + level) / 2);
    return {
      mean,
      lower: mean - z * se,
      upper: mean + z * se,
      level
    };
  }

  if (typeof stddev !== 'number' || stddev <= 0) {
    throw new RangeError('stddev must be positive');
  }

  const se = stddev / Math.sqrt(n);
  const df = n - 1;
  const t = invT((1 + level) / 2, df);

  return {
    mean,
    lower: mean - t * se,
    upper: mean + t * se,
    level,
    df
  };
}

export function proportionCI(successes, n, level = 0.95, method = 'wilson') {
  if (typeof successes !== 'number' || successes < 0 || successes > n) {
    throw new RangeError('successes must be in [0, n]');
  }
  if (typeof n !== 'number' || n <= 0) {
    throw new RangeError('n must be positive');
  }
  if (typeof level !== 'number' || level <= 0 || level >= 1) {
    throw new RangeError('level must be in (0, 1)');
  }

  const p = successes / n;
  const z = invNormal((1 + level) / 2);
  const z2 = z * z;

  if (method === 'wilson') {
    const center = (successes + z2 / 2) / (n + z2);
    const margin = z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n)) / (1 + z2 / n);
    return {
      estimate: p,
      lower: Math.max(0, center - margin),
      upper: Math.min(1, center + margin),
      level
    };
  }

  if (method === 'normal') {
    const se = Math.sqrt(p * (1 - p) / n);
    return {
      estimate: p,
      lower: Math.max(0, p - z * se),
      upper: Math.min(1, p + z * se),
      level
    };
  }

  throw new RangeError(`unknown method: ${method}`);
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

function invT(p, df) {
  const t = invNormal(p);
  const t2 = t * t;
  const g = (0.196 * t2 * t2 + 0.196 * t2 + 0.55) * (Math.exp(-0.0008 * t2 * t2 - 0.24 * t2 - 1.2)) + t * (1 + 0.0000092 * t2 * t2 + 0.00014 * t2);
  return t + g / df;
}
