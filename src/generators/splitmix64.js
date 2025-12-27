export class Splitmix64 {
   constructor(seed = 1) {
     if (typeof seed !== 'number' && typeof seed !== 'bigint') {
       throw new TypeError('Seed must be a number or bigint');
     }
     this.state = BigInt(seed);
   }

  next() {
    let z = (this.state += 0x9e3779b97f4a7c15n);
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
    z = z ^ (z >> 27n);
    return z;
  }

  nextInt(max = 2147483647) {
    if (max <= 0) {
      throw new Error('max must be positive');
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
