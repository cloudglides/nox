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
      throw new TypeError(`range() expects two numbers, got ${typeof min} and ${typeof max}`);
    }
    if (!isFinite(min) || !isFinite(max)) {
      throw new Error('range() bounds must be finite');
    }
    if (min > max) [min, max] = [max, min];
    return this.nextFloat() * (max - min) + min;
  }

  int(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError(`int() expects two numbers, got ${typeof min} and ${typeof max}`);
    }
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error('int() bounds must be integers');
    }
    if (min > max) [min, max] = [max, min];
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  bool(probability = 0.5) {
    if (typeof probability !== 'number') {
      throw new TypeError(`bool() expects number, got ${typeof probability}`);
    }
    if (probability < 0 || probability > 1) {
      throw new Error(`bool() probability must be [0, 1], got ${probability}`);
    }
    return this.nextFloat() < probability;
  }

  pick(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('pick() expects array');
    }
    if (arr.length === 0) {
      throw new Error('pick() array cannot be empty');
    }
    return arr[this.nextInt(arr.length)];
  }

  shuffle(arr, inPlace = false) {
    if (!Array.isArray(arr)) {
      throw new TypeError(`shuffle() expects array, got ${typeof arr}`);
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
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`batch() count must be positive integer, got ${count}`);
    }
    if (typeof fn !== 'function') {
      throw new TypeError(`batch() expects function, got ${typeof fn}`);
    }
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(fn(this));
    }
    return result;
  }

  floats(count) {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`floats() count must be positive integer, got ${count}`);
    }
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextFloat();
    }
    return result;
  }

  ints(count, max = 2147483647) {
    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`ints() count must be positive integer, got ${count}`);
    }
    if (!Number.isInteger(max) || max <= 0) {
      throw new Error(`ints() max must be positive integer, got ${max}`);
    }
    const result = new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = this.nextInt(max);
    }
    return result;
  }
}

export const rng = () => new RNG();
