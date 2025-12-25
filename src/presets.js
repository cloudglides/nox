import { RNG } from './rng.js';
import { PCG64 } from './generators/index.js';

export const deterministic = (seed) => {
  if (typeof seed !== 'number' && typeof seed !== 'bigint') {
    throw new TypeError('Deterministic mode requires explicit seed');
  }
  return new RNG(PCG64, seed);
};
