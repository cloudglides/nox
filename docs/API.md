# API Reference

## Generators

### Xorshift64

Fast bitwise operations, period 2^64-1.

```javascript
const rng = new Xorshift64(seed);
rng.next();         // bigint
rng.nextInt(max);   // number [0, max)
rng.nextFloat();    // number [0, 1)
```

### Splitmix64

Proven mixing function with excellent distribution.

```javascript
const rng = new Splitmix64(seed);
```

### PCG64

Modern, fast generator with state-based design.

```javascript
const rng = new PCG64(seed, inc);
```

### Logistic

Chaotic logistic map.

```javascript
const rng = new Logistic(seed=0.5, r=3.99);
```

### Tent

Tent map chaos.

```javascript
const rng = new Tent(seed=0.5, mu=2);
```

### Mixer

Combine two generators.

```javascript
const rng = new Mixer(rng1, rng2);
```

## Distributions

### Standard Distributions

- `normal(rng, mean=0, stddev=1)` - Normal distribution
- `exponential(rng, lambda=1)` - Exponential distribution
- `poisson(rng, lambda)` - Poisson distribution
- `uniform(rng, min, max)` - Uniform distribution

### Beta/Gamma Family

- `beta(rng, alpha, beta)` - Beta distribution
- `gamma(rng, shape, scale=1)` - Gamma distribution
- `chi2(rng, k)` - Chi-square distribution

### Special Distributions

- `weibull(rng, shape, scale=1)` - Weibull distribution
- `lognormal(rng, mu, sigma)` - Lognormal distribution
- `rayleigh(rng, sigma=1)` - Rayleigh distribution
- `cauchy(rng, median=0, scale=1)` - Cauchy distribution

## Stochastic Processes

- `brownianMotion(rng, steps, dt=1)` - Brownian motion
- `ornsteinUhlenbeck(rng, steps, theta=0.1, mu=0, sigma=1)` - Mean-reverting
- `geometricBrownian(rng, steps, mu=0.05, sigma=0.2, dt=0.01)` - Exponential growth

## Sampling

### Basic Sampling

- `shuffle(arr, rng)` - Fisher-Yates shuffle
- `pick(arr, rng)` - Random element
- `sample(arr, count, rng)` - Sample without replacement

### Weighted Sampling

- `weightedPick(arr, weights, rng)` - Pick with probabilities
- `weightedSample(arr, weights, count, rng)` - Sample with weights
- `reservoirSample(stream, k, rng)` - Reservoir sampling

### Categorical

- `categorical(rng, categories, probabilities)` - Discrete selection
- `multinomial(rng, n, categories, probabilities)` - Counts
- `categorical2D(rng, matrix)` - 2D probabilities

## Combinatorics

- `combinations(arr, k)` - All k-combinations
- `permutations(arr)` - All permutations
- `kPermutations(arr, k)` - All k-permutations
- `randomCombination(arr, k, rng)` - Random k-combination
- `randomPermutation(arr, rng)` - Random permutation

## Entropy & Seeding

### Entropy Sources

- `fromPerformance()` - High-resolution timer
- `fromMemory()` - Memory state
- `fromCrypto(bytes=8)` - Cryptographic random
- `combined()` - XOR of all sources

### Seed Management

- `seedFromTime()` - Seed from current time
- `seedFromEntropy(string)` - Hash-based seed
- `SeedSequence(entropy)` - Sequence manager
- `seedMultiple(classes, entropy)` - Seed multiple RNGs
- `saveState(rng)` - Snapshot state
- `restoreState(rng, snapshot)` - Restore state
- `cloneGenerator(rng)` - Deep copy

## Bit Operations

- `rotateBits(val, shift)` - Rotate bits
- `extractBits(val, start, length)` - Extract range
- `hammingWeight(val)` - Count set bits
- `bitRange(val, min, max)` - Extract bits [min, max)

## Noise

- `perlin2D(rng, x, y, octaves=1)` - Perlin noise
- `valueNoise(rng, x, y, scale=1)` - Value noise

## Statistics

- `chiSquareTest(data, bins=10)` - Chi-square goodness-of-fit
- `entropy(data, bins=10)` - Shannon entropy
- `autocorrelation(data, lag)` - Lag autocorrelation
- `runTest(data, threshold=0.5)` - Runs test
