# nox

Simple, unpredictable random number generator.

## Install

```bash
npm install nox
```

## Usage

```javascript
import { rng, deterministic } from 'nox';

const r = rng();

r.nextFloat();    // 0.742...
r.nextInt(100);   // 47
r.int(1, 100);    // 73
r.bool(0.3);      // true/false (30% chance)
```

## Reproducible

```javascript
import { deterministic } from 'nox';

const r = deterministic(42);
// Always same sequence
```

## Distributions

```javascript
import { rng, normal, exponential, uniform, poisson } from 'nox';

const r = rng();

normal(r, mean=0, stddev=1);
exponential(r, lambda=1);
uniform(r, min=0, max=1);
poisson(r, lambda=5);
```

## Sampling

```javascript
import { rng, shuffle, pick, sample } from 'nox';

const r = rng();

shuffle([1, 2, 3], r);
pick(['a', 'b', 'c'], r);
sample([1, 2, 3, 4, 5], 3, r);
```

## State

```javascript
import { rng, saveState, restoreState } from 'nox';

const r = rng();
const snapshot = saveState(r);

r.nextFloat();
restoreState(r, snapshot);
r.nextFloat(); // Same value
```

## Generators

Use specific generators if needed:

```javascript
import { PCG64, MT19937, Xorshift64 } from 'nox';

const r = new PCG64(seed);
const r = new MT19937(seed);
const r = new Xorshift64(seed);
```

## License

ISC
