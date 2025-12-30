export function diff(data, order = 1) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof order !== 'number' || order < 1) {
    throw new RangeError('order must be positive integer');
  }

  let result = [...data];
  
  for (let o = 0; o < order; o++) {
    const prev = result;
    result = new Array(prev.length - 1);
    for (let i = 0; i < prev.length - 1; i++) {
      result[i] = prev[i + 1] - prev[i];
    }
  }

  return result;
}

export function lag(data, lags = 1) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof lags !== 'number' || lags < 1) {
    throw new RangeError('lags must be positive integer');
  }

  const result = new Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    result[i] = i < lags ? null : data[i - lags];
  }

  return result;
}

export function shift(data, periods = 1) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof periods !== 'number') {
    throw new RangeError('periods must be integer');
  }

  const result = new Array(data.length);
  
  if (periods > 0) {
    for (let i = 0; i < data.length; i++) {
      result[i] = i < periods ? null : data[i - periods];
    }
  } else if (periods < 0) {
    for (let i = 0; i < data.length; i++) {
      result[i] = i < -periods ? null : data[i - periods];
    }
  } else {
    return [...data];
  }

  return result;
}

export function sma(data, window) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof window !== 'number' || window < 1) {
    throw new RangeError('window must be positive integer');
  }

  const result = new Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result[i] = null;
    } else {
      let sum = 0;
      for (let j = i - window + 1; j <= i; j++) {
        sum += data[j];
      }
      result[i] = sum / window;
    }
  }

  return result;
}

export function ema(data, window) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof window !== 'number' || window < 1) {
    throw new RangeError('window must be positive integer');
  }

  const alpha = 2 / (window + 1);
  const result = new Array(data.length);
  
  result[0] = data[0];
  
  for (let i = 1; i < data.length; i++) {
    result[i] = alpha * data[i] + (1 - alpha) * result[i - 1];
  }

  return result;
}

export function acf(data, maxLag = 40) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof maxLag !== 'number' || maxLag < 1) {
    throw new RangeError('maxLag must be positive integer');
  }

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const centered = data.map(x => x - mean);

  let c0 = 0;
  for (let i = 0; i < data.length; i++) {
    c0 += centered[i] * centered[i];
  }

  const result = new Array(Math.min(maxLag + 1, data.length));
  result[0] = 1;

  for (let k = 1; k < result.length; k++) {
    let ck = 0;
    for (let i = 0; i < data.length - k; i++) {
      ck += centered[i] * centered[i + k];
    }
    result[k] = ck / c0;
  }

  return result;
}

export function pacf(data, maxLag = 40) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof maxLag !== 'number' || maxLag < 1) {
    throw new RangeError('maxLag must be positive integer');
  }

  const correlations = acf(data, maxLag);
  const result = [1];

  for (let k = 1; k < correlations.length; k++) {
    let numerator = correlations[k];
    
    for (let j = 1; j < k; j++) {
      numerator -= result[j] * correlations[k - j];
    }

    let denominator = 1;
    for (let j = 1; j < k; j++) {
      denominator -= result[j] * correlations[j];
    }

    result.push(numerator / denominator);
  }

  return result;
}
