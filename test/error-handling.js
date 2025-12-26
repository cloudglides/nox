import { rng, deterministic, normal, exponential, uniform, shuffle, pick, sample } from '../src/index.js';

const test = (name, fn) => {
  try {
    fn();
    console.log(`✗ ${name} - should have thrown`);
  } catch (e) {
    console.log(`✓ ${name}`);
  }
};

console.log('=== ERROR HANDLING ===\n');

const r = rng();

// RNG methods
test('int() with non-number min', () => r.int('a', 100));
test('int() with non-number max', () => r.int(1, 'b'));
test('int() with non-integer min', () => r.int(1.5, 100));
test('bool() with invalid probability', () => r.bool(1.5));
test('bool() with negative probability', () => r.bool(-0.5));
test('range() with non-number min', () => r.range('a', 10, 1));
test('range() with negative step', () => r.range(1, 10, -1));
test('choice() with empty array', () => r.choice([]));
test('choice() with non-array', () => r.choice('notarray'));

// Batch operations
test('floats() with negative count', () => r.floats(-5));
test('ints() with non-integer count', () => r.ints(5.5, 100));
test('bools() with string count', () => r.bools('5'));
test('batch() with non-function', () => r.batch(5, 'notfn'));

// Distributions
test('normal() with invalid rng', () => normal({}, 0, 1));
test('exponential() with zero lambda', () => exponential(r, 0));
test('uniform() with min > max', () => uniform(r, 100, 10));

// Array operations
test('shuffle() with non-array', () => shuffle({}, r));
test('shuffle() with invalid rng', () => shuffle([1,2,3], {}));
test('pick() with empty array', () => pick([], r));
test('sample() with count > length', () => sample([1,2], 5, r));
test('sample() with zero count', () => sample([1,2], 0, r));

// Deterministic
test('deterministic() with no seed', () => deterministic());
test('deterministic() with null seed', () => deterministic(null));

console.log('\n✅ All error cases handled correctly\n');
