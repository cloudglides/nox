# API

## Core

### `rng()`
Create a random number generator with automatic entropy.

```javascript
const r = rng();
r.nextFloat();  // [0, 1)
r.nextInt(100); // [0, 100)
r.int(1, 100);  // [1, 100]
r.bool(0.3);    // true 30% of time
```

### `deterministic(seed)`
Create a generator with fixed seed for reproducibility.

```javascript
const r = deterministic(42);
// Always same sequence
```

## Distributions

```javascript
import { rng, normal, exponential, uniform, poisson } from 'nox';

const r = rng();
normal(r, mean=0, stddev=1);
exponential(r, lambda=1);
uniform(r, 0, 1);
poisson(r, lambda=5);
```

## Sampling

```javascript
import { rng, shuffle, pick, sample } from 'nox';

const r = rng();
shuffle([1, 2, 3], r);         // Shuffled copy
pick(['a', 'b', 'c'], r);      // Random element
sample([1, 2, 3, 4, 5], 3, r); // 3 elements without replacement
```

## State

```javascript
import { rng, saveState, restoreState } from 'nox';

const r = rng();
const snapshot = saveState(r);

r.nextFloat();
restoreState(r, snapshot);
r.nextFloat(); // Same as before
```

## Generators

Advanced: use specific generators directly.

```javascript
import { PCG64, MT19937, Xorshift64 } from 'nox';

new PCG64(seed);      // Best quality (default)
new MT19937(seed);    // Classic, very fast
new Xorshift64(seed); // Fast, good quality
```
