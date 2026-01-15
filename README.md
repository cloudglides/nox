<p align="center"><img width="447" height="293" alt="logo" src="https://github.com/user-attachments/assets/9db55aaf-4929-4f8f-8683-d6f988c12cfc" /></p>







<h1 align="center">Nox</h1>
<p align="center">
  <a href="#install">Install</a> •
  <a href="#quick-start">Quick start</a> •
  <a href="#reproducible">API reference</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@cloudglides/nox">NPM</a> •
  <a href="https://github.com/cloudglides/nox">GitHub</a>
</p>

<p align="center">
  Simple, unpredictable random number generator.
</p>


## Install

```bash
npm install @cloudglides/nox
```

## Quick Start

```javascript
import { rng, deterministic } from '@cloudglides/nox';

const r = rng();

r.nextFloat();      // 0.742...
r.nextInt(100);     // 47
r.int(1, 100);      // 73
r.bool(0.3);        // true/false (30% chance)
r.range(10, 20, 2); // Pick from range: 10, 12, 14, 16, 18, 20
r.choice([1, 2, 3]); // Pick one element

// Batch operations
r.floats(5);        // [0.123, 0.456, ...]
r.ints(5, 100);     // [47, 82, 23, ...]
r.bools(5);         // [true, false, true, ...]
```

## Reproducible

```javascript
import { deterministic } from '@cloudglides/nox';

const r = deterministic(42);
// Always same sequence
```

## Distributions

```javascript
import { rng, normal, exponential, uniform, poisson } from '@cloudglides/nox';

const r = rng();

normal(r, mean=0, stddev=1);
exponential(r, lambda=1);
uniform(r, min=0, max=1);
poisson(r, lambda=5);
```

## Sampling

```javascript
import { rng, shuffle, pick, sample } from '@cloudglides/nox';

const r = rng();

shuffle([1, 2, 3], r);
pick(['a', 'b', 'c'], r);
sample([1, 2, 3, 4, 5], 3, r);
```

## State

```javascript
import { rng, saveState, restoreState } from '@cloudglides/nox';

const r = rng();
const snapshot = saveState(r);

r.nextFloat();
restoreState(r, snapshot);
r.nextFloat(); // Same value
```

## Weighted Sampling

```javascript
import { rng, weightedPick, reservoirSample } from '@cloudglides/nox';

const r = rng();
const items = ['A', 'B', 'C'];
const weights = [0.5, 0.3, 0.2];

weightedPick(items, weights, r);        // Pick with probabilities
reservoirSample(stream, k, r);          // Sample k from large stream
```

## Statistical Tests

```javascript
import { rng, meanTest, varianceTest, kolmogorovSmirnovTest } from '@cloudglides/nox';

const r = rng();
const data = r.floats(1000);

const mean = meanTest(data);            // Test mean ≈ 0.5
const variance = varianceTest(data);    // Test variance ≈ 1/12
const ks = kolmogorovSmirnovTest(data); // Test uniform distribution
```

## Generators

For reproducible results or specific generator properties:

```javascript
import { RNG, PCG64, MT19937, Xorshift64, Splitmix64 } from '@cloudglides/nox';

const r = new RNG(PCG64, seed);      // PCG64 (default, fast, high quality)
const r = new RNG(MT19937, seed);    // MT19937 (Mersenne Twister)
const r = new RNG(Xorshift64, seed); // Xorshift64 (simple, fast)
const r = new RNG(Splitmix64, seed); // Splitmix64 (statistical mixing)
```

## License

ISC
