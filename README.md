# nox

[![npm version](https://img.shields.io/npm/v/nox.svg)](https://www.npmjs.com/package/nox)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

Unpredictable random number generator with multiple algorithms, distributions, and utilities.

## Install

```bash
npm install nox
pnpm add nox
yarn add nox
```

## Quick Start

```javascript
import { rng } from 'nox';

const r = rng();

r.int(1, 100);           // Random int [1, 100]
r.nextFloat();           // Random float [0, 1)
r.bool(0.3);             // 30% true
r.pick([1, 2, 3]);       // Random element
r.shuffle([1, 2, 3]);    // Shuffled array
r.range(10, 20);         // Random float [10, 20]
```

## Presets

```javascript
import { rng, quality, deterministic, fast, chaos } from 'nox';

rng();              // Default (PCG64 + entropy)
quality(seed);      // PCG64 (best quality)
deterministic(42);  // Fixed seed, reproducible
fast(seed);         // Xorshift64 (fastest)
chaos(seed);        // Logistic map (chaotic)
```

## Distributions

```javascript
import { rng, normal, exponential, poisson } from 'nox';

const r = rng();

normal(r, mean=0, stddev=1);
exponential(r, lambda=1);
poisson(r, lambda=5);
uniform(r, 0, 1);
beta(r, alpha=2, beta=5);
gamma(r, shape=2, scale=1);
```

## Batch Operations

```javascript
const r = rng();

r.floats(1000);           // Array of 1000 floats
r.ints(100, 50);          // Array of 100 ints [0, 50)
r.batch(50, (rng) => {    // Custom batch
  return rng.int(1, 10);
});
```

## Sampling & Combinatorics

```javascript
import { rng, shuffle, weightedPick, randomCombination } from 'nox';

const r = rng();

shuffle([1, 2, 3], r);
weightedPick(['a', 'b'], [0.7, 0.3], r);
randomCombination([1, 2, 3, 4, 5], 2, r);
```

## State Management

```javascript
import { rng, saveState, restoreState } from 'nox';

const r = rng();
const snapshot = saveState(r);

r.nextFloat();
restoreState(r, snapshot);
r.nextFloat(); // Same value
```

## Reproducibility

```javascript
import { deterministic } from 'nox';

const r = deterministic(42);
// Will always produce same sequence
```

## Generators

- **PCG64** - Best quality, recommended
- **Xorshift64** - Fast, good enough
- **Splitmix64** - Fast, mixing-based
- **Logistic** - Chaotic map
- **Tent** - Tent map
- **Mixer** - Combine generators

## Features

- 6 different RNG algorithms
- 15+ distributions (normal, exponential, beta, gamma, weibull, etc.)
- Stochastic processes (Brownian, Ornstein-Uhlenbeck, etc.)
- Noise generation (Perlin2D, ValueNoise)
- Weighted sampling and combinatorics
- State snapshots
- TypeScript support
- Zero dependencies
- Production-ready

## Examples

See [docs/EXAMPLES.md](./docs/EXAMPLES.md) for practical patterns.

## API Reference

See [docs/API.md](./docs/API.md) for full documentation.

## Benchmarks

```bash
pnpm bench
```

## License

ISC
