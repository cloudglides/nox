import { RNG } from './rng.js';
import { PCG64 } from './generators/index.js';

export const deterministic = (seed) => {
  if (seed === null || seed === undefined) {
    throw new TypeError('Deterministic mode requires an explicit seed');
  }
  if (typeof seed !== 'number' && typeof seed !== 'bigint') {
    throw new TypeError('Seed must be a number or bigint');
  }
  if (typeof seed === 'number' && !Number.isFinite(seed)) {
    throw new Error('Seed must be a finite number');
  }
  return new RNG(PCG64, seed);
};
