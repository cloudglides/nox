import { Xorshift64, Splitmix64, PCG64 } from './generators/index.js';
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

  range(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Range bounds must be numbers');
    }
    if (min > max) [min, max] = [max, min];
    return this.nextFloat() * (max - min) + min;
  }

  int(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Range bounds must be numbers');
    }
    if (min > max) [min, max] = [max, min];
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  bool(probability = 0.5) {
    if (probability < 0 || probability > 1) {
      throw new Error('Probability must be [0, 1]');
    }
    return this.nextFloat() < probability;
  }

  pick(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Array cannot be empty');
    }
    return arr[this.nextInt(arr.length)];
  }

  shuffle(arr, inPlace = false) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Must be array');
    }
    const target = inPlace ? arr : [...arr];
    for (let i = target.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      const temp = target[i];
      target[i] = target[j];
      target[j] = temp;
    }
    return target;
  }

  batch(count, fn) {
    if (count <= 0) throw new Error('Count must be positive');
    if (typeof fn !== 'function') throw new TypeError('Second arg must be function');
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(fn(this));
    }
    return result;
  }

  floats(count) {
    if (count <= 0) throw new Error('Count must be positive');
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextFloat();
    }
    return result;
  }

  ints(count, max = 2147483647) {
    if (count <= 0) throw new Error('Count must be positive');
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextInt(max);
    }
    return result;
  }
}

export const rng = () => new RNG();
