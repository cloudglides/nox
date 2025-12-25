import { RNG } from './rng.js';
import { Xorshift64, PCG64, Splitmix64, Logistic } from './generators/index.js';

export const fast = (seed) => new RNG(Xorshift64, seed);

export const quality = (seed) => new RNG(PCG64, seed);

export const chaos = (seed) => new RNG(Logistic, seed);

export const deterministic = (seed) => {
  if (typeof seed !== 'number' && typeof seed !== 'bigint') {
    throw new TypeError('Deterministic mode requires explicit seed');
  }
  return new RNG(PCG64, seed);
};
