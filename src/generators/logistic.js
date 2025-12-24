export class Logistic {
  constructor(seed = 0.5, r = 3.99) {
    this.x = seed;
    this.r = r;
  }

  next() {
    this.x = this.r * this.x * (1 - this.x);
    return this.x;
  }

  nextInt(max = 2147483647) {
    return Math.floor(this.next() * max);
  }

  nextFloat() {
    return this.next();
  }
}
