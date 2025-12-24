import { Xorshift64, Logistic, seedFromEntropy, normal, exponential } from '../src/index.js';

const xor = new Xorshift64(42);
console.log('Xorshift64:', xor.nextInt(100), xor.nextFloat());

const log = new Logistic(0.5, 3.99);
console.log('Logistic:', log.nextFloat(), log.nextInt(100));

const rng = new Xorshift64(seedFromEntropy('chaos'));
console.log('Distributions:', normal(rng), exponential(rng));
