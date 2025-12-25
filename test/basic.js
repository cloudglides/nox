import { rng, deterministic, normal, exponential, shuffle } from '../src/index.js';

const r = rng();
console.log('Default:', r.int(1, 100), r.bool());

const d = deterministic(42);
console.log('Deterministic:', d.nextFloat());

const arr = [1, 2, 3, 4, 5];
console.log('Shuffle:', shuffle(arr, r));

const r2 = rng();
console.log('Distributions:', normal(r2), exponential(r2));
