import { Xorshift64, Logistic, normal, exponential } from '../src/index.js';

const xor = new Xorshift64(42);
console.log('Xorshift64:', xor.nextInt(100), xor.nextFloat());

const log = new Logistic(0.5, 3.99);
console.log('Logistic:', log.nextFloat(), log.nextInt(100));

const rng1 = new Xorshift64(99);
const rng2 = new Xorshift64(88);
console.log('Distributions:', normal(rng1), exponential(rng2));
