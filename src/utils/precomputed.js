export class WeightedDistribution {
  constructor(items, weights) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new TypeError('items must be non-empty array');
    }
    if (!Array.isArray(weights) || weights.length !== items.length) {
      throw new TypeError('weights length must match items');
    }

    this.items = items;
    this.cumsum = new Array(items.length);
    let total = 0;

    for (let i = 0; i < weights.length; i++) {
      if (typeof weights[i] !== 'number' || weights[i] < 0) {
        throw new RangeError('all weights must be non-negative numbers');
      }
      total += weights[i];
      this.cumsum[i] = total;
    }

    if (total <= 0) {
      throw new RangeError('weights must sum to positive value');
    }

    this.total = total;
  }

  pick(rng) {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('rng must be an RNG instance');
    }

    const rand = rng.nextFloat() * this.total;
    let left = 0, right = this.cumsum.length;

    while (left < right) {
      const mid = (left + right) >> 1;
      if (rand < this.cumsum[mid]) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return this.items[left];
  }

  sample(rng, n) {
    if (typeof n !== 'number' || n < 1) {
      throw new RangeError('n must be positive integer');
    }

    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      result[i] = this.pick(rng);
    }
    return result;
  }
}

export class CategoricalDistribution {
  constructor(probabilities) {
    if (!Array.isArray(probabilities) || probabilities.length === 0) {
      throw new TypeError('probabilities must be non-empty array');
    }

    this.cumsum = new Array(probabilities.length);
    let total = 0;

    for (let i = 0; i < probabilities.length; i++) {
      if (typeof probabilities[i] !== 'number' || probabilities[i] < 0) {
        throw new RangeError('all probabilities must be non-negative');
      }
      total += probabilities[i];
      this.cumsum[i] = total;
    }

    if (Math.abs(total - 1) > 1e-10) {
      for (let i = 0; i < this.cumsum.length; i++) {
        this.cumsum[i] /= total;
      }
    }

    this.n = probabilities.length;
  }

  sample(rng) {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('rng must be an RNG instance');
    }

    const u = rng.nextFloat();
    let left = 0, right = this.cumsum.length;

    while (left < right) {
      const mid = (left + right) >> 1;
      if (u < this.cumsum[mid]) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  samples(rng, n) {
    if (typeof n !== 'number' || n < 1) {
      throw new RangeError('n must be positive integer');
    }

    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      result[i] = this.sample(rng);
    }
    return result;
  }
}

export class NormalDistribution {
  constructor(mean = 0, stddev = 1) {
    if (typeof mean !== 'number') {
      throw new TypeError('mean must be number');
    }
    if (typeof stddev !== 'number' || stddev <= 0) {
      throw new RangeError('stddev must be positive');
    }

    this.mean = mean;
    this.stddev = stddev;
    this.hasSpare = false;
    this.spare = 0;
  }

  sample(rng) {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('rng must be an RNG instance');
    }

    if (this.hasSpare) {
      this.hasSpare = false;
      return this.spare * this.stddev + this.mean;
    }

    this.hasSpare = true;
    const u1 = rng.nextFloat();
    const u2 = rng.nextFloat();
    const mag = Math.sqrt(-2 * Math.log(u1 > 1e-10 ? u1 : 1e-10));
    
    this.spare = Math.sin(2 * Math.PI * u2) * mag;
    return Math.cos(2 * Math.PI * u2) * mag * this.stddev + this.mean;
  }

  samples(rng, n) {
    if (typeof n !== 'number' || n < 1) {
      throw new RangeError('n must be positive integer');
    }

    const result = new Array(n);
    for (let i = 0; i < n; i++) {
      result[i] = this.sample(rng);
    }
    return result;
  }
}
