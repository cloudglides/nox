import { rng, quality, MT19937, Xorshift64, Splitmix64, PCG64 } from '../src/index.js';

const ITERATIONS = 100000;

const profile = (name, fn) => {
  const start = performance.now();
  fn();
  const elapsed = performance.now() - start;
  const opsPerSec = (ITERATIONS / elapsed * 1000).toFixed(0);
  console.log(`${name}: ${elapsed.toFixed(2)}ms (${opsPerSec} ops/sec)`);
};

console.log(`\n=== Generating ${ITERATIONS} values ===\n`);

profile('RNG.nextFloat()', () => {
  const r = rng();
  for (let i = 0; i < ITERATIONS; i++) r.nextFloat();
});

profile('RNG.nextInt()', () => {
  const r = rng();
  for (let i = 0; i < ITERATIONS; i++) r.nextInt(100);
});

profile('RNG.int(1,100)', () => {
  const r = rng();
  for (let i = 0; i < ITERATIONS; i++) r.int(1, 100);
});

profile('RNG.bool()', () => {
  const r = rng();
  for (let i = 0; i < ITERATIONS; i++) r.bool();
});

console.log('\n=== Generator comparison (nextFloat) ===\n');

profile('Xorshift64', () => {
  const r = new Xorshift64(42);
  for (let i = 0; i < ITERATIONS; i++) r.nextFloat();
});

profile('Splitmix64', () => {
  const r = new Splitmix64(42);
  for (let i = 0; i < ITERATIONS; i++) r.nextFloat();
});

profile('PCG64', () => {
  const r = new PCG64(42n);
  for (let i = 0; i < ITERATIONS; i++) r.nextFloat();
});

profile('MT19937', () => {
  const r = new MT19937(42);
  for (let i = 0; i < ITERATIONS; i++) r.nextFloat();
});

console.log('\n=== Batch operations ===\n');

profile('floats(100) x1000', () => {
  const r = rng();
  for (let i = 0; i < 1000; i++) r.floats(100);
});

profile('ints(100, 100) x1000', () => {
  const r = rng();
  for (let i = 0; i < 1000; i++) r.ints(100, 100);
});

profile('shuffle([1..10]) x10000', () => {
  const r = rng();
  const arr = Array.from({ length: 10 }, (_, i) => i);
  for (let i = 0; i < 10000; i++) r.shuffle(arr);
});
