# nox

Simple, unpredictable random number generator.

## Install

```bash
npm install nox
```

## Quick Start

```javascript
import { rng, deterministic } from 'nox';

const r = rng();

r.nextFloat();      // 0.742...
r.nextInt(100);     // 47
r.int(1, 100);      // 73
r.bool(0.3);        // true/false (30% chance)
r.range(10, 20, 2); // Pick from range: 10, 12, 14, 16, 18, 20
r.choice([1, 2, 3]); // Pick one element
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

For reproducible results or specific generator properties:

```javascript
import { RNG, PCG64, MT19937, Xorshift64, Splitmix64 } from 'nox';

const r = new RNG(PCG64, seed);      // PCG64 (default, fast, high quality)
const r = new RNG(MT19937, seed);    // MT19937 (Mersenne Twister)
const r = new RNG(Xorshift64, seed); // Xorshift64 (simple, fast)
const r = new RNG(Splitmix64, seed); // Splitmix64 (statistical mixing)
```

## License

ISC
