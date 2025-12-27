export class Tent {
   constructor(seed = 0.5, mu = 1.95) {
     if (typeof seed !== 'number' || seed < 0 || seed > 1) {
       throw new Error('seed must be between 0 and 1');
     }
     if (typeof mu !== 'number' || mu <= 0 || mu > 2) {
       throw new Error('mu must be between 0 and 2');
     }
     this.x = Math.max(0.00001, Math.min(0.99999, seed));
     this.mu = mu;
   }
 
   next() {
     if (this.x < 0.5) {
       this.x = this.mu * this.x;
     } else {
       this.x = this.mu * (1 - this.x);
     }
     this.x = Math.max(0.00001, Math.min(0.99999, this.x));
     return this.x;
   }
 
   nextInt(max = 2147483647) {
     if (max <= 0) {
       throw new Error('max must be positive');
     }
     if (!Number.isInteger(max)) {
       throw new TypeError('max must be an integer');
     }
     const limit = Math.floor(1 / max) * max;
     let val;
     do {
       val = Math.floor(this.next() * Number.MAX_SAFE_INTEGER);
     } while (val >= limit);
     return val % max;
   }
 
   nextFloat() {
     return this.next();
   }
 }
