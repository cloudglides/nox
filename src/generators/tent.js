export class Tent {
  constructor(seed = 0.5, mu = 2) {
    this.x = seed;
    this.mu = mu;
  }

  next() {
    this.x = this.mu * (this.x < 0.5 ? this.x : 1 - this.x);
    return this.x;
  }

  nextInt(max = 2147483647) {
    return Math.floor(this.next() * max);
  }

  nextFloat() {
    return this.next();
  }
}
