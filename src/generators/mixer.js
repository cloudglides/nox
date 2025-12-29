export class Mixer {
   constructor(rng1, rng2) {
     if (!rng1 || typeof rng1.next !== 'function') {
       throw new TypeError('rng1 must be a valid RNG instance');
     }
     if (!rng2 || typeof rng2.next !== 'function') {
       throw new TypeError('rng2 must be a valid RNG instance');
     }
     this.rng1 = rng1;
     this.rng2 = rng2;
   }
 
   next() {
     const v1 = this.rng1.next();
     const v2 = this.rng2.next();
     
     if (typeof v1 === 'bigint' && typeof v2 === 'bigint') {
       return v1 ^ v2;
     }
     
     const b1 = typeof v1 === 'bigint' ? v1 : BigInt(v1);
     const b2 = typeof v2 === 'bigint' ? v2 : BigInt(v2);
     return b1 ^ b2;
   }
 
   nextInt(max = 2147483647) {
      if (typeof max !== 'number' || !Number.isInteger(max)) {
        throw new TypeError('max must be an integer');
      }
      if (max <= 0) {
        throw new RangeError('max must be positive');
      }
     
     const v1 = this.rng1.nextInt(max);
     const v2 = this.rng2.nextInt(max);
     return (v1 + v2) % max;
   }
 
   nextFloat() {
     const f1 = this.rng1.nextFloat();
     const f2 = this.rng2.nextFloat();
     return Math.abs(f1 - f2) % 1.0;
   }
 }
