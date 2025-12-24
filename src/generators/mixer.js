export class Mixer {
  constructor(rng1, rng2) {
    this.rng1 = rng1;
    this.rng2 = rng2;
  }

  next() {
    return this.rng1.next() ^ this.rng2.next();
  }

  nextInt(max = 2147483647) {
    const v1 = this.rng1.nextInt(max);
    const v2 = this.rng2.nextInt(max);
    return (v1 + v2) % max;
  }

  nextFloat() {
    return (this.rng1.nextFloat() + this.rng2.nextFloat()) / 2;
  }
}
