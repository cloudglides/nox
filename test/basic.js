import { rng, quality, deterministic, normal, exponential } from '../src/index.js';

const r = rng();
console.log('Default RNG:', r.int(1, 100), r.bool());

const q = quality(42);
console.log('Quality:', q.range(10, 20));

const d = deterministic(123);
console.log('Deterministic:', d.pick([1, 2, 3, 4, 5]));

const arr = [1, 2, 3, 4, 5];
console.log('Shuffle:', r.shuffle(arr));

const r2 = quality(42);
console.log('Dists:', normal(r2), exponential(r2));
