# nox

Unpredictable random number generator library with multiple algorithms and distributions.

## Install

```bash
npm install nox
pnpm add nox
```

## Usage

```javascript
import { Xorshift64, normal, shuffle } from 'nox';

const rng = new Xorshift64(42);

rng.nextFloat();
normal(rng, 0, 1);
shuffle([1, 2, 3], rng);
```

## Generators

Xorshift64, Splitmix64, PCG64, Logistic, Tent, Mixer

## Distributions

Basic: `normal`, `exponential`, `poisson`, `uniform`

Advanced: `beta`, `gamma`, `chi2`, `weibull`, `lognormal`, `rayleigh`, `cauchy`

Stochastic: `brownianMotion`, `ornsteinUhlenbeck`, `geometricBrownian`

## Utilities

Sampling: `shuffle`, `pick`, `sample`, `weightedPick`, `weightedSample`, `reservoirSample`

Combinatorics: `combinations`, `permutations`, `kPermutations`, `randomCombination`, `randomPermutation`

Categorical: `categorical`, `multinomial`, `categorical2D`

State: `saveState`, `restoreState`, `cloneGenerator`

Seeding: `SeedSequence`, `seedMultiple`

Noise: `perlin2D`, `valueNoise`

Stats: `chiSquareTest`, `entropy`, `autocorrelation`, `runTest`

## Benchmark

```bash
pnpm bench
```

## API

See `docs/API.md` for full reference.

## License

ISC

