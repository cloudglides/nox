import { seedFromTime, seedFromEntropy } from './seed.js';
import { fromPerformance, fromMemory, fromCrypto, combined } from './entropy.js';

export class SeedSequence {
  constructor(entropy = null) {
    if (entropy === null) {
      this.seed = combined();
    } else if (typeof entropy === 'string') {
      this.seed = seedFromEntropy(entropy);
    } else if (typeof entropy === 'bigint' || typeof entropy === 'number') {
      this.seed = BigInt(entropy);
    } else {
      this.seed = entropy;
    }
    this.counter = 0n;
  }

  next() {
    const val = this.seed ^ BigInt(this.counter);
    this.counter += 1n;
    return val;
  }

  spawn(n = 1) {
     if (typeof n !== 'number' || !Number.isInteger(n)) {
       throw new TypeError('n must be an integer');
     }
     if (n <= 0) {
       throw new RangeError('n must be positive');
     }
     const seeds = [];
     for (let i = 0; i < n; i++) {
       seeds.push(this.next());
     }
     return seeds;
   }
  }
  
  export const seedMultiple = (rngClasses, entropy = null) => {
    if (!Array.isArray(rngClasses)) {
      throw new TypeError('rngClasses must be an array');
    }
    if (rngClasses.length === 0) {
      throw new RangeError('rngClasses cannot be empty');
    }
    const seq = new SeedSequence(entropy);
    const seeds = seq.spawn(rngClasses.length);
    return rngClasses.map((RngClass, i) => new RngClass(seeds[i]));
   };
