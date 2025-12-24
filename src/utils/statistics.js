export const chiSquareTest = (data, bins = 10) => {
  const histogram = new Array(bins).fill(0);
  for (const val of data) {
    const idx = Math.floor(val * bins);
    histogram[Math.min(idx, bins - 1)]++;
  }
  
  const expected = data.length / bins;
  let chi2 = 0;
  for (const count of histogram) {
    chi2 += ((count - expected) ** 2) / expected;
  }
  
  return { chi2, expected, histogram };
};

export const entropy = (data, bins = 10) => {
  const histogram = new Array(bins).fill(0);
  for (const val of data) {
    const idx = Math.floor(val * bins);
    histogram[Math.min(idx, bins - 1)]++;
  }
  
  let ent = 0;
  const p = 1 / data.length;
  for (const count of histogram) {
    if (count > 0) {
      const pi = count / data.length;
      ent -= pi * Math.log2(pi);
    }
  }
  return ent;
};

export const autocorrelation = (data, lag) => {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  let c0 = 0;
  let cl = 0;
  
  for (let i = 0; i < data.length; i++) {
    c0 += (data[i] - mean) ** 2;
  }
  
  for (let i = 0; i < data.length - lag; i++) {
    cl += (data[i] - mean) * (data[i + lag] - mean);
  }
  
  return cl / c0;
};

export const runTest = (data, threshold = 0.5) => {
  const binary = data.map(v => v > threshold ? 1 : 0);
  let runs = 1;
  for (let i = 1; i < binary.length; i++) {
    if (binary[i] !== binary[i - 1]) runs++;
  }
  return runs;
};
