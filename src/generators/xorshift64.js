export class Xorshift64 {
  constructor(seed = 1) {
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
    const next = Number(this.next() >>> 1n);
    return next % max;
  }

  nextFloat() {
    return Number(this.next() >>> 11n) * (1.0 / 9007199254740992.0);
  }
}
