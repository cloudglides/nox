import { Xorshift64, seedFromTime, seedFromEntropy } from '../src/index.js';

const rng = new Xorshift64(42);

console.log('Int:', rng.nextInt(100));
console.log('Float:', rng.nextFloat());
console.log('Int:', rng.nextInt(100));

const rng2 = new Xorshift64(seedFromEntropy('test'));
console.log('\nWith entropy seed:');
console.log('Int:', rng2.nextInt(100));
console.log('Float:', rng2.nextFloat());
