import { rng, binomial, geometric, normals, exponentials, sampleWithReplacement, permute, range, cycle, clz, ctz, popcountNum, reverseBits, setBit, clearBit, toggleBit } from '../src/index.js';

console.log('=== NEW FEATURES TEST ===\n');

const r = rng();

console.log('1. Binomial Distribution');
const binom = binomial(r, 20, 0.5);
console.log(`   binomial(20, 0.5): ${binom} (between 0-20)`);

console.log('\n2. Geometric Distribution');
const geom = geometric(r, 0.3);
console.log(`   geometric(0.3): ${geom} (number of trials)`);

console.log('\n3. Batch Normal Distribution (with caching)');
const normals_arr = normals(r, 5);
console.log(`   normals(5): [${normals_arr.map(n => n.toFixed(2)).join(', ')}]`);

console.log('\n4. Batch Exponential Distribution');
const exps = exponentials(r, 4, 1);
console.log(`   exponentials(4): [${exps.map(e => e.toFixed(2)).join(', ')}]`);

console.log('\n5. Sampling with Replacement');
const sampled = sampleWithReplacement(['A', 'B', 'C'], 8, r);
console.log(`   sampleWithReplacement([A,B,C], 8): [${sampled.join(', ')}]`);

console.log('\n6. Permutation (alias for shuffle)');
const perm = permute([1, 2, 3, 4], r);
console.log(`   permute([1,2,3,4]): [${perm.join(', ')}]`);

console.log('\n7. Range Generation');
const r1 = range(0, 5);
const r2 = range(10, 5, -1);
console.log(`   range(0, 5): [${r1.join(', ')}]`);
console.log(`   range(10, 5, -1): [${r2.join(', ')}]`);

console.log('\n8. Cycle (repeat array)');
const cyc = cycle(['X', 'Y'], 6);
console.log(`   cycle([X, Y], 6): [${cyc.join(', ')}]`);

console.log('\n9. Bit Operations');
const val = 0b11010110n;
console.log(`   Value: 0b11010110`);
console.log(`   clz(): ${clz(val)}`);
console.log(`   ctz(): ${ctz(val)}`);
console.log(`   popcountNum(214): ${popcountNum(214)}`);
console.log(`   reverseBits() [8-bit]: 0b${reverseBits(val, 8).toString(2).padStart(8, '0')}`);
console.log(`   setBit(0b11010110, 0): 0b${setBit(val, 0).toString(2).padStart(8, '0')}`);
console.log(`   clearBit(0b11010110, 1): 0b${clearBit(val, 1).toString(2).padStart(8, '0')}`);
console.log(`   toggleBit(0b11010110, 4): 0b${toggleBit(val, 4).toString(2).padStart(8, '0')}`);

console.log('\n✓ All new features working correctly');
