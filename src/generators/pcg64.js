export class PCG64 {
  constructor(seed = 1n, inc = 1n) {
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

    const xorShifted = ((oldState >> 18n) ^ oldState) >> 27n;
    const rot = oldState >> 59n;
    const result = (xorShifted >> rot) | ((xorShifted << (64n - rot)) & ((1n << 64n) - 1n));
    
    return result;
  }

  nextInt(max = 2147483647) {
    const next = Number(this.next() >> 1n);
    return next % max;
  }

  nextFloat() {
    const val = this.next() & ((1n << 53n) - 1n);
    return Number(val) / 9007199254740992.0;
  }
}
