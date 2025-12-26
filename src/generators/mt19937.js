export class MT19937 {
  constructor(seed = 5489) {
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;
    this.UPPER_MASK = 0x80000000;
    this.LOWER_MASK = 0x7fffffff;

    this.mt = new Array(this.N);
    this.mti = this.N + 1;

    this.init(seed);
  }

  init(seed) {
    const s = typeof seed === 'bigint' ? Number(seed) : seed;
    this.mt[0] = (s >>> 0) & 0xffffffff;
    
    for (let i = 1; i < this.N; i++) {
      const x = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
      this.mt[i] = (((((x & 0xffff0000) >>> 16) * 1812433253) << 16) + (x & 0xffff) * 1812433253) + i;
      this.mt[i] = this.mt[i] >>> 0;
    }
  }

  twist() {
    for (let i = 0; i < this.N - this.M; i++) {
      const y = (this.mt[i] & this.UPPER_MASK) | (this.mt[i + 1] & this.LOWER_MASK);
      this.mt[i] = this.mt[i + this.M] ^ (y >>> 1) ^ (y & 1 ? this.MATRIX_A : 0);
    }
    for (let i = this.N - this.M; i < this.N - 1; i++) {
      const y = (this.mt[i] & this.UPPER_MASK) | (this.mt[i + 1] & this.LOWER_MASK);
      this.mt[i] = this.mt[i + (this.M - this.N)] ^ (y >>> 1) ^ (y & 1 ? this.MATRIX_A : 0);
    }
    const y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ (y & 1 ? this.MATRIX_A : 0);
    this.mti = 0;
  }

  next() {
    if (this.mti >= this.N) {
      this.twist();
    }

    let y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  nextInt(max = 2147483647) {
     if (max <= 0) {
       throw new Error('max must be positive');
     }
     
     if (max < 65536) {
       return (this.next() & 0xFFFF) % max;
     }
    
    const limit = Math.floor((0x100000000 / max)) * max;
    let val;
    
    do {
      val = this.next();
    } while (val >= limit);
    
    return val % max;
  }

  nextFloat() {
    const a = this.next() >>> 5;
    const b = this.next() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }
}
