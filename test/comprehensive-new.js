import { rng, deterministic, normal, exponential, poisson, uniform } from '../src/index.js';
import { shuffle, pick, sample } from '../src/index.js';
import { PCG64, Xorshift64, Splitmix64, MT19937 } from '../src/index.js';

const assert = (condition, msg) => {
  if (!condition) {
    throw new Error(`✗ ${msg}`);
  }
  console.log(`✓ ${msg}`);
};

console.log('\n=== BASIC OPERATIONS ===');
const r = rng();
assert(typeof r.nextFloat() === 'number', 'nextFloat returns number');
assert(r.nextFloat() >= 0 && r.nextFloat() <= 1, 'nextFloat in [0,1]');
assert(typeof r.nextInt(100) === 'number', 'nextInt returns number');
assert(r.int(1, 10) >= 1 && r.int(1, 10) <= 10, 'int in range');
assert(typeof r.bool() === 'boolean', 'bool returns boolean');

console.log('\n=== DETERMINISTIC ===');
const d1 = deterministic(12345);
const d2 = deterministic(12345);
const seq1 = d1.floats(100);
const seq2 = d2.floats(100);
assert(seq1.length === 100, 'deterministic generates correct count');
assert(JSON.stringify(seq1) === JSON.stringify(seq2), 'same seed produces same sequence');

console.log('\n=== GENERATORS ===');
const gens = [
  { name: 'PCG64', Gen: PCG64 },
  { name: 'Xorshift64', Gen: Xorshift64 },
  { name: 'Splitmix64', Gen: Splitmix64 },
  { name: 'MT19937', Gen: MT19937 }
];

for (const {name, Gen} of gens) {
  const g = new Gen(42);
  const vals = Array.from({length: 1000}, () => g.nextFloat());
  const mean = vals.reduce((a, b) => a + b) / 1000;
  assert(mean > 0.3 && mean < 0.7, `${name} mean ${mean.toFixed(3)} reasonable`);
  assert(vals.every(v => v >= 0 && v <= 1), `${name} values in [0,1]`);
}

console.log('\n=== DISTRIBUTIONS ===');
const r2 = rng();
const normal5 = Array.from({length: 1000}, () => normal(r2));
assert(normal5.length === 1000, 'normal generates correct count');
const hasNegative = normal5.some(v => v < 0);
const hasPositive = normal5.some(v => v > 0);
assert(hasNegative && hasPositive, 'normal has both positive and negative values');

const exp5 = Array.from({length: 100}, () => exponential(r2));
assert(exp5.every(v => v >= 0), 'exponential all positive');

const poi = Array.from({length: 100}, () => poisson(r2, 5));
assert(poi.every(v => Number.isInteger(v) && v >= 0), 'poisson returns non-negative integers');

const uni = uniform(r2, 10, 20);
assert(uni >= 10 && uni <= 20, 'uniform in range');

console.log('\n=== ARRAY OPERATIONS ===');
const r3 = rng();
const arr = [1,2,3,4,5];
const shuffled = shuffle(arr, r3);
assert(shuffled.length === 5, 'shuffle preserves length');
assert(shuffled.some((v, i) => v !== arr[i]), 'shuffle actually shuffles');

const picked = pick(arr, r3);
assert(arr.includes(picked), 'pick returns array element');

const sampled = sample(arr, 3, r3);
assert(sampled.length === 3, 'sample returns correct count');
assert(sampled.every(v => arr.includes(v)), 'sample contains array elements');

console.log('\n=== BATCH OPERATIONS ===');
const r4 = rng();
const floats = r4.floats(100);
assert(floats.length === 100, 'floats correct length');
assert(floats.every(v => typeof v === 'number'), 'floats all numbers');

const ints = r4.ints(50, 100);
assert(ints.length === 50, 'ints correct length');
assert(ints.every(v => v >= 0 && v < 100), 'ints in range');

const bools = r4.bools(50);
assert(bools.length === 50, 'bools correct length');
assert(bools.every(v => typeof v === 'boolean'), 'bools all booleans');

console.log('\n=== EDGE CASES ===');
const r5 = rng();
try {
  r5.int(1, 1);
  assert(r5.int(1, 1) === 1, 'int(1,1) returns 1');
} catch (e) {
  assert(false, 'int(1,1) should not throw');
}

try {
  shuffle([], r5);
  assert(true, 'shuffle([]) doesnt crash');
} catch (e) {
  assert(false, 'shuffle([]) shouldnt throw');
}

const r6 = rng();
const batch = r6.batch(5, (rng, i) => i * rng.nextInt(10));
assert(batch.length === 5, 'batch with custom function');

console.log('\n=== PERFORMANCE CHECK ===');
const r7 = rng();
const start = performance.now();
for (let i = 0; i < 1000000; i++) {
  r7.nextFloat();
}
const elapsed = performance.now() - start;
console.log(`✓ 1M nextFloat in ${elapsed.toFixed(0)}ms (${(1000000/elapsed|0).toLocaleString()}/sec)`);

const r8 = rng();
const start2 = performance.now();
for (let i = 0; i < 100000; i++) {
  normal(r8);
}
const elapsed2 = performance.now() - start2;
console.log(`✓ 100k normal in ${elapsed2.toFixed(0)}ms (${(100000/elapsed2|0).toLocaleString()}/sec)`);

console.log('\n✅ All tests passed\n');
