export class PCG64 {
   constructor(seed = 1n, inc = 1n) {
     if (typeof seed !== 'number' && typeof seed !== 'bigint') {
       throw new TypeError('Seed must be a number or bigint');
     }
     if (typeof inc !== 'number' && typeof inc !== 'bigint') {
       throw new TypeError('inc must be a number or bigint');
     }
     this.state = 0n;
     this.inc = ((typeof inc === 'number' ? BigInt(inc) : inc) << 1n) | 1n;
     this.step();
     this.state += (typeof seed === 'number' ? BigInt(seed) : seed);
     this.step();
   }

  step() {
    this.state = (this.state * 6364136223846793005n + this.inc) & ((1n << 64n) - 1n);
  }

  next() {
    const oldState = this.state;
    this.step();

    const M = 0x2545F4914F6CDD1Dn;
    const x = (oldState >> 18n) ^ oldState;
    const rot = oldState >> 59n;
    const rotated = (x >> rot) | ((x << (64n - rot)) & ((1n << 64n) - 1n));
    const result = ((rotated * M) & ((1n << 64n) - 1n)) ^ (rotated >> 29n);
    
    return result;
  }

  nextInt(max = 2147483647) {
     if (typeof max !== 'number' || !Number.isInteger(max)) {
       throw new TypeError('max must be an integer');
     }
     if (max <= 0) {
       throw new RangeError('max must be positive');
     }
    
    if (max < 65536) {
      return Number(this.next() & 0xFFFFn) % max;
    }
    
    const maxBig = BigInt(max);
    const limit = ((1n << 64n) / maxBig) * maxBig;
    
    let val = this.next();
    while (val >= limit) {
      val = this.next();
    }
    
    return Number(val % maxBig);
  }

  nextFloat() {
    const val = this.next() & 0x1FFFFFFFFFFFFFn;
    return Number(val) * (1.0 / 9007199254740992.0);
  }
}
