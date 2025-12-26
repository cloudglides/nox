export class Xorshift64 {
  constructor(seed = 1) {
    if (typeof seed !== 'number' && typeof seed !== 'bigint') {
      throw new TypeError('Seed must be a number or bigint');
    }
    this.state = BigInt(seed);
    if (this.state === 0n) this.state = 1n;
  }

  next() {
    let x = this.state;
    x ^= x << 13n;
    x ^= x >> 7n;
    x ^= x << 17n;
    this.state = x;
    return x;
  }

  nextInt(max = 2147483647) {
    if (max <= 0) {
      throw new Error('max must be positive');
    }
    
    let val = this.next() & 0x7fffffffffffffffn;
    const limit = (0xffffffffffffffffn / BigInt(max)) * BigInt(max);
    
    while (val >= limit) {
      val = this.next() & 0x7fffffffffffffffn;
    }
    
    return Number(val % BigInt(max));
  }

  nextFloat() {
    const val = this.next() & ((1n << 53n) - 1n);
    return Number(val) / 9007199254740992.0;
  }
}
