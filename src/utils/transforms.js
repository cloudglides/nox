export function zscore(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  let variance = 0;

  for (let i = 0; i < data.length; i++) {
    variance += (data[i] - mean) ** 2;
  }

  const stddev = Math.sqrt(variance / data.length);

  if (stddev === 0) {
    throw new RangeError('cannot z-score data with zero variance');
  }

  return data.map(x => (x - mean) / stddev);
}

export function standardize(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  return data.map(x => x - mean);
}

export function minMaxScale(data, min = 0, max = 1) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('min and max must be numbers');
  }

  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const range = dataMax - dataMin;

  if (range === 0) {
    throw new RangeError('cannot scale data with zero range');
  }

  return data.map(x => ((x - dataMin) / range) * (max - min) + min);
}

export function logTransform(data, base = Math.E) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }
  if (typeof base !== 'number' || base <= 0 || base === 1) {
    throw new RangeError('base must be positive number != 1');
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] <= 0) {
      throw new RangeError('all values must be positive');
    }
  }

  const logBase = Math.log(base);
  return data.map(x => Math.log(x) / logBase);
}

export function sqrtTransform(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i] < 0) {
      throw new RangeError('all values must be non-negative');
    }
  }

  return data.map(x => Math.sqrt(x));
}

export function rank(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }

  const indexed = data.map((val, i) => [val, i]);
  indexed.sort((a, b) => a[0] - b[0]);

  const ranks = new Array(data.length);
  let i = 0;

  while (i < indexed.length) {
    let j = i;
    while (j < indexed.length && indexed[j][0] === indexed[i][0]) {
      j++;
    }

    const rank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[indexed[k][1]] = rank;
    }

    i = j;
  }

  return ranks;
}

export function robustScale(data, center = 'median', scale = 'iqr') {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be non-empty array');
  }

  let centerVal;
  if (center === 'median') {
    const sorted = [...data].sort((a, b) => a - b);
    centerVal = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  } else if (center === 'mean') {
    centerVal = data.reduce((a, b) => a + b, 0) / data.length;
  } else {
    throw new RangeError('center must be "median" or "mean"');
  }

  let scaleVal;
  if (scale === 'iqr') {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    scaleVal = q3 - q1;
  } else if (scale === 'mad') {
    const centered = data.map(x => Math.abs(x - centerVal));
    const sorted = [...centered].sort((a, b) => a - b);
    scaleVal = sorted[Math.floor(sorted.length / 2)];
  } else {
    throw new RangeError('scale must be "iqr" or "mad"');
  }

  if (scaleVal === 0) {
    throw new RangeError('scale value is zero');
  }

  return data.map(x => (x - centerVal) / scaleVal);
}
