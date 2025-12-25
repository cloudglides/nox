import { PCG64 } from './generators/index.js';
import { combined } from './utils/entropy.js';

export class RNG {
  constructor(generator = null, seed = null) {
    if (generator === null) {
      seed = seed || combined();
      this.gen = new PCG64(seed);
    } else if (typeof generator === 'function') {
      this.gen = new generator(seed || combined());
    } else {
      this.gen = generator;
    }
  }

  next() {
    return this.gen.next();
  }

  nextInt(max = 2147483647) {
    return this.gen.nextInt(max);
  }

  nextFloat() {
    return this.gen.nextFloat();
  }

  int(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('int() needs two numbers');
    }
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error('int() needs integers');
    }
    if (min > max) [min, max] = [max, min];
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  bool(probability = 0.5) {
    if (typeof probability !== 'number' || probability < 0 || probability > 1) {
      throw new Error('bool() needs probability [0, 1]');
    }
    return this.nextFloat() < probability;
  }
}

export const rng = () => new RNG();
