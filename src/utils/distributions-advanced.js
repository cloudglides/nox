import { gamma } from './distributions-extra.js';

export function dirichlet(r, alpha) {
  if (!Array.isArray(alpha) || alpha.length === 0) {
    throw new TypeError('alpha must be a non-empty array');
  }
  
  const k = alpha.length;
  const samples = new Array(k);
  let sum = 0;

  for (let i = 0; i < k; i++) {
    if (typeof alpha[i] !== 'number' || alpha[i] <= 0) {
      throw new RangeError('all alpha values must be positive');
    }
    samples[i] = gamma(r, alpha[i], 1);
    sum += samples[i];
  }

  for (let i = 0; i < k; i++) {
    samples[i] /= sum;
  }

  return samples;
}

export function dirichlets(r, alpha, n) {
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const samples = new Array(n);
  for (let i = 0; i < n; i++) {
    samples[i] = dirichlet(r, alpha);
  }
  return samples;
}

export function mixture(r, distributions, weights) {
  if (!Array.isArray(distributions) || distributions.length === 0) {
    throw new TypeError('distributions must be a non-empty array');
  }
  if (!Array.isArray(weights) || weights.length !== distributions.length) {
    throw new TypeError('weights length must match distributions');
  }

  let sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    throw new RangeError('weights must sum to positive value');
  }

  const normalized = weights.map(w => w / sum);
  let u = r.nextFloat();
  let cumsum = 0;

  for (let i = 0; i < normalized.length; i++) {
    cumsum += normalized[i];
    if (u < cumsum) {
      return distributions[i](r);
    }
  }

  return distributions[distributions.length - 1](r);
}

export function mixtures(r, distributions, weights, n) {
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const samples = new Array(n);
  for (let i = 0; i < n; i++) {
    samples[i] = mixture(r, distributions, weights);
  }
  return samples;
}

export function studentT(r, df) {
  if (typeof df !== 'number' || df <= 0) {
    throw new RangeError('degrees of freedom must be positive');
  }

  const z = r.normal();
  const u = r.nextFloat();
  const chi2Val = -2 * Math.log(u) + (df - 1) * Math.log(1 - 2 * u / df);
  const v = Math.sqrt((df * chi2Val) / (df + z * z));

  return z / v;
}

export function studentTs(r, df, n) {
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const samples = new Array(n);
  for (let i = 0; i < n; i++) {
    samples[i] = studentT(r, df);
  }
  return samples;
}

export function betaBinomial(r, n, alpha, beta) {
  if (typeof n !== 'number' || n < 0 || n !== Math.floor(n)) {
    throw new RangeError('n must be a non-negative integer');
  }
  if (typeof alpha !== 'number' || alpha <= 0) {
    throw new RangeError('alpha must be positive');
  }
  if (typeof beta !== 'number' || beta <= 0) {
    throw new RangeError('beta must be positive');
  }

  const p = gamma(r, alpha, 1) / (gamma(r, alpha, 1) + gamma(r, beta, 1));
  let count = 0;

  for (let i = 0; i < n; i++) {
    if (r.nextFloat() < p) count++;
  }

  return count;
}
