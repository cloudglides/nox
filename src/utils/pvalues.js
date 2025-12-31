export function tTestPValue(t, df, twoTailed = true) {
  if (typeof t !== 'number' || typeof df !== 'number') {
    throw new TypeError('t and df must be numbers');
  }

  const tAbs = Math.abs(t);
  let p = 2 * (1 - tCDF(tAbs, df));
  
  return twoTailed ? p : p / 2;
}

export function zTestPValue(z, twoTailed = true) {
  if (typeof z !== 'number') {
    throw new TypeError('z must be number');
  }

  const zAbs = Math.abs(z);
  const p = 2 * (1 - normalCDF(zAbs));
  
  return twoTailed ? p : p / 2;
}

export function fTestPValue(f, df1, df2) {
  if (typeof f !== 'number' || typeof df1 !== 'number' || typeof df2 !== 'number') {
    throw new TypeError('f, df1, df2 must be numbers');
  }

  if (f < 0) return 1;
  
  const alpha = df2 / (df1 * f + df2);
  return 1 - incompleteBeta(alpha, df2 / 2, df1 / 2);
}

export function chi2PValue(chi2, df) {
  if (typeof chi2 !== 'number' || typeof df !== 'number') {
    throw new TypeError('chi2 and df must be numbers');
  }

  if (chi2 < 0) return 1;
  
  return 1 - incompleteBeta(chi2 / (chi2 + 1), 1, df / 2);
}

export function uTestPValue(u, n1, n2) {
  if (typeof u !== 'number' || typeof n1 !== 'number' || typeof n2 !== 'number') {
    throw new TypeError('u, n1, n2 must be numbers');
  }

  const mean = (n1 * n2) / 2;
  const std = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = Math.abs((u - mean) / std);
  
  return 2 * (1 - normalCDF(z));
}

export function pearsonPValue(r, n) {
  if (typeof r !== 'number' || typeof n !== 'number') {
    throw new TypeError('r and n must be numbers');
  }

  if (Math.abs(r) >= 1) return 0;
  
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const df = n - 2;
  
  return tTestPValue(t, df, true);
}

function normalCDF(z) {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function tCDF(t, df) {
  const x = df / (df + t * t);
  return 1 - incompleteBeta(x, df / 2, 0.5);
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

function incompleteBeta(x, a, b, maxIter = 100) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  let sum = 1;
  let term = 1;
  
  for (let i = 1; i <= maxIter; i++) {
    term *= (a + b - 1) * x / ((a + i - 1) * (1 - x / (a + i)));
    const nextSum = sum + term;
    
    if (Math.abs(nextSum - sum) < 1e-14) {
      break;
    }
    sum = nextSum;
  }
  
  return sum * Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b)) / a;
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
