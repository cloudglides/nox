import { PCG64 } from './generators/index.js';
import { combined } from './utils/entropy.js';

export class RNG {
  constructor(generator = null, seed = null) {
    if (generator === null) {
      seed = seed || combined();
      this.gen = new PCG64(seed);
    } else if (typeof generator === 'function') {
      this.gen = new generator(seed || combined());
    } else if (typeof generator === 'object' && generator !== null) {
      this.gen = generator;
    } else {
      throw new TypeError('Generator must be a constructor function or instance');
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
      throw new TypeError('int() requires two number arguments');
    }
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new TypeError('int() arguments must be integers');
    }
    if (min > max) [min, max] = [max, min];
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  bool(probability = 0.5) {
    if (typeof probability !== 'number') {
      throw new TypeError('probability must be a number');
    }
    if (probability < 0 || probability > 1) {
      throw new RangeError('probability must be between 0 and 1');
    }
    return this.nextFloat() < probability;
  }

  range(min, max, step = 1) {
    if (typeof min !== 'number' || typeof max !== 'number' || typeof step !== 'number') {
      throw new TypeError('min, max, and step must be numbers');
    }
    if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(step)) {
      throw new Error('min, max, and step must be integers');
    }
    if (step <= 0) {
      throw new Error('step must be positive');
    }
    if (min > max) {
      throw new Error('min must be less than or equal to max');
    }
    
    const count = Math.floor((max - min) / step) + 1;
    const idx = this.nextInt(count);
    return min + idx * step;
  }

  choice(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new TypeError('choice() requires non-empty array');
    }
    return arr[this.nextInt(arr.length)];
  }
}

export const rng = () => new RNG();
