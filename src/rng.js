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
    const range = max - min + 1;
    return min + this.nextInt(range);
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
      throw new TypeError('min, max, and step must be integers');
    }
    if (step <= 0) {
      throw new RangeError('step must be positive');
    }
    if (min > max) {
      throw new RangeError('min must be less than or equal to max');
    }

    const result = [];
    for (let i = min; i <= max; i += step) {
      result.push(i);
    }
    return result;
  }

  choice(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('choice() requires array');
    }
    const len = arr.length;
    if (len === 0) {
      throw new RangeError('choice() requires non-empty array');
    }
    return arr[this.nextInt(len)];
  }

  batch(count, fn) {
    if (typeof count !== 'number' || !Number.isInteger(count)) {
      throw new TypeError('count must be an integer');
    }
    if (count < 0) {
      throw new RangeError('count must be non-negative');
    }
    if (count === 0) {
      return [];
    }
    if (typeof fn !== 'function') {
      throw new TypeError('fn must be a function');
    }

    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = fn(this, i);
    }
    return result;
  }

  floats(count) {
    if (typeof count !== 'number' || !Number.isInteger(count)) {
      throw new TypeError('count must be an integer');
    }
    if (count < 0) {
      throw new RangeError('count must be non-negative');
    }
    if (count === 0) {
      return [];
    }

    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextFloat();
    }
    return result;
  }

  ints(count, max = 2147483647) {
    if (typeof count !== 'number' || !Number.isInteger(count)) {
      throw new TypeError('count must be an integer');
    }
    if (count < 0) {
      throw new RangeError('count must be non-negative');
    }
    if (count === 0) {
      return [];
    }

    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextInt(max);
    }
    return result;
  }

  bools(count, probability = 0.5) {
    if (typeof count !== 'number' || !Number.isInteger(count)) {
      throw new TypeError('count must be an integer');
    }
    if (count < 0) {
      throw new RangeError('count must be non-negative');
    }
    if (count === 0) {
      return [];
    }

    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.bool(probability);
    }
    return result;
  }
}

export const rng = () => new RNG();



