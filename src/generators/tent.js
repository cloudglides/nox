export class Tent {
  constructor(seed = 0.5, mu = 1.95) {
    this.x = Math.max(0.00001, Math.min(0.99999, seed));
    this.mu = mu;
  }

  next() {
    if (this.x < 0.5) {
      this.x = this.mu * this.x;
    } else {
      this.x = this.mu * (1 - this.x);
    }
    this.x = Math.max(0.00001, Math.min(0.99999, this.x));
    return this.x;
  }

  nextInt(max = 2147483647) {
    return Math.floor(this.next() * max);
  }

  nextFloat() {
    return this.next();
  }
}
