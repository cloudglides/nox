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
     if (typeof n !== 'number' || !Number.isInteger(n) || n <= 0) {
       throw new Error('n must be positive integer');
     }
     const seeds = [];
     for (let i = 0; i < n; i++) {
       seeds.push(this.next());
     }
     return seeds;
   }
  }
  
  export const seedMultiple = (rngClasses, entropy = null) => {
   if (!Array.isArray(rngClasses) || rngClasses.length === 0) {
     throw new TypeError('rngClasses must be non-empty array');
   }
   const seq = new SeedSequence(entropy);
   const seeds = seq.spawn(rngClasses.length);
   return rngClasses.map((RngClass, i) => new RngClass(seeds[i]));
  };
