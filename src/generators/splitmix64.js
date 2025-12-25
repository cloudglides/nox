export class Splitmix64 {
  constructor(seed = 1) {
    this.state = BigInt(seed);
  }

  next() {
    let z = (this.state += 0x9e3779b97f4a7c15n);
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
    z = z ^ (z >> 27n);
    return z;
  }

  nextInt(max = 2147483647) {
    const next = Number(this.next() >>> 1n);
    return next % max;
  }

  nextFloat() {
    const val = this.next() & ((1n << 53n) - 1n);
    return Number(val) / 9007199254740992.0;
  }
}
