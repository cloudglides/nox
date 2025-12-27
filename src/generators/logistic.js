export class Logistic {
    constructor(seed = 0.5, r = 3.99) {
      if (typeof seed !== 'number' || seed < 0 || seed > 1) {
        throw new Error('seed must be between 0 and 1');
      }
      if (typeof r !== 'number' || r <= 0 || r > 4) {
        throw new Error('r must be between 0 and 4');
      }
      this.x = seed;
      this.r = r;
    }
  
    next() {
      this.x = this.r * this.x * (1 - this.x);
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
