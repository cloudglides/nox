export const chiSquareTest = (data, bins = 10) => {
   if (!Array.isArray(data) || data.length === 0) {
     throw new Error('Data must be non-empty array');
   }
   if (bins <= 0 || !Number.isInteger(bins)) {
     throw new Error('Bins must be positive integer');
   }
   
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
   if (!Array.isArray(data) || data.length === 0) {
     throw new Error('Data must be non-empty array');
   }
   if (bins <= 0) {
     throw new Error('Bins must be positive');
   }
   
   const histogram = new Array(bins).fill(0);
   for (const val of data) {
     const idx = Math.floor(val * bins);
     histogram[Math.min(idx, bins - 1)]++;
   }
   
   let ent = 0;
   for (const count of histogram) {
     if (count > 0) {
       const pi = count / data.length;
       ent -= pi * Math.log2(pi);
     }
   }
   return ent;
 };

export const autocorrelation = (data, lag) => {
  if (lag < 0 || lag >= data.length) throw new Error('Lag out of range');
  if (data.length < 2) throw new Error('Need at least 2 data points');
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  let c0 = 0;
  let cl = 0;
  
  for (let i = 0; i < data.length; i++) {
    c0 += (data[i] - mean) ** 2;
  }
  
  if (c0 === 0) return 0;
  
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

export const kolmogorovSmirnovTest = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be non-empty array');
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  let maxD = 0;
  
  for (let i = 0; i < sorted.length; i++) {
    const empirical = (i + 1) / sorted.length;
    const theoretical = sorted[i];
    maxD = Math.max(maxD, Math.abs(empirical - theoretical));
  }
  
  const criticalValues = {
    0.10: 1.224 / Math.sqrt(data.length),
    0.05: 1.358 / Math.sqrt(data.length),
    0.01: 1.627 / Math.sqrt(data.length)
  };
  
  return {
    statistic: maxD,
    pass_0_10: maxD < criticalValues[0.10],
    pass_0_05: maxD < criticalValues[0.05],
    pass_0_01: maxD < criticalValues[0.01]
  };
};

export const meanTest = (data, expectedMean = 0.5) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be non-empty array');
  }
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, v) => a + (v - mean) ** 2, 0) / data.length;
  const stdDev = Math.sqrt(variance);
  const tStat = (mean - expectedMean) / (stdDev / Math.sqrt(data.length));
  
  return {
    mean,
    variance,
    stdDev,
    tStatistic: tStat,
    expectedMean
  };
};

export const varianceTest = (data, expectedVariance = 1 / 12) => {
   if (!Array.isArray(data) || data.length === 0) {
     throw new Error('Data must be non-empty array');
   }
   if (data.length < 2) {
     throw new Error('Data must have at least 2 elements');
   }
   
   const mean = data.reduce((a, b) => a + b, 0) / data.length;
   const sampleVariance = data.reduce((a, v) => a + (v - mean) ** 2, 0) / (data.length - 1);
   const chi2 = (data.length - 1) * sampleVariance / expectedVariance;
   
   return {
     variance: sampleVariance,
     expectedVariance,
     chi2Statistic: chi2,
     degreesOfFreedom: data.length - 1
     };
     };

     export const skewness = (data) => {
     if (!Array.isArray(data) || data.length < 3) {
     throw new Error('Data must be array with at least 3 elements');
     }

     const n = data.length;
     const mean = data.reduce((a, b) => a + b, 0) / n;
     const m2 = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
     const m3 = data.reduce((sum, x) => sum + (x - mean) ** 3, 0) / n;
     const std = Math.sqrt(m2);

     if (std === 0) return 0;
     return m3 / (std ** 3);
     };

     export const kurtosis = (data) => {
     if (!Array.isArray(data) || data.length < 4) {
     throw new Error('Data must be array with at least 4 elements');
     }

     const n = data.length;
     const mean = data.reduce((a, b) => a + b, 0) / n;
     const m2 = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;
     const m4 = data.reduce((sum, x) => sum + (x - mean) ** 4, 0) / n;
     const std = Math.sqrt(m2);

     if (std === 0) return 0;
     return m4 / (std ** 4) - 3;
     };

     export const median = (data) => {
     if (!Array.isArray(data) || data.length === 0) {
     throw new Error('Data must be non-empty array');
     }

     const sorted = [...data].sort((a, b) => a - b);
     const mid = Math.floor(sorted.length / 2);

     if (sorted.length % 2 === 1) {
     return sorted[mid];
     }
     return (sorted[mid - 1] + sorted[mid]) / 2;
     };

     export const quantile = (data, q) => {
     if (!Array.isArray(data) || data.length === 0) {
     throw new Error('Data must be non-empty array');
     }
     if (typeof q !== 'number' || q < 0 || q > 1) {
     throw new RangeError('Quantile must be between 0 and 1');
     }

     const sorted = [...data].sort((a, b) => a - b);
     const idx = q * (sorted.length - 1);
     const lower = Math.floor(idx);
     const upper = Math.ceil(idx);
     const weight = idx % 1;

     if (lower === upper) return sorted[lower];
     return sorted[lower] * (1 - weight) + sorted[upper] * weight;
     };
