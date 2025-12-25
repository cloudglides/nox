# Examples

## Quick Start

```javascript
import { rng, quality, deterministic } from 'nox';

const r = rng();
console.log(r.int(1, 100));
console.log(r.nextFloat());
```

## Dice Roll

```javascript
import { rng } from 'nox';

const dice = rng();
const roll = dice.int(1, 6);
```

## Random Choice

```javascript
const r = rng();
const colors = ['red', 'green', 'blue'];
const chosen = r.pick(colors);
```

## Shuffle Array

```javascript
const r = rng();
const deck = [1, 2, 3, 4, 5];
const shuffled = r.shuffle(deck);
```

## Reproducible Results

```javascript
import { deterministic } from 'nox';

const r = deterministic(42);
console.log(r.nextFloat()); // Always 0.531250000122241
```

## Bulk Generation

```javascript
const r = rng();
const values = r.floats(1000);
const ints = r.ints(100, 10);
```

## Distributions

```javascript
import { rng, normal, exponential } from 'nox';

const r = rng();
const gaussian = normal(r, mean=0, stddev=1);
const waiting = exponential(r, lambda=0.5);
```

## Weighted Selection

```javascript
import { rng, weightedPick } from 'nox';

const r = rng();
const items = ['common', 'rare', 'epic'];
const weights = [70, 25, 5];
const loot = weightedPick(items, weights, r);
```

## Batch Generation

```javascript
const r = rng();
const values = r.batch(100, (rng) => rng.int(1, 10));
```

## Boolean Random

```javascript
const r = rng();
if (r.bool(0.3)) {
  // 30% chance
}
```

## Range

```javascript
const r = rng();
const value = r.range(10.5, 20.5); // Float in range
const count = r.int(5, 15);         // Int in range
```

## State Snapshot

```javascript
import { rng, saveState, restoreState } from 'nox';

const r = rng();
const checkpoint = saveState(r);

r.nextFloat();

restoreState(r, checkpoint);
r.nextFloat(); // Same value as before
```

## Multiple Independent RNGs

```javascript
import { quality, deterministic } from 'nox';

const rng1 = quality(seed1);
const rng2 = quality(seed2);
```

## Combinatorial

```javascript
import { rng, randomCombination, randomPermutation } from 'nox';

const r = rng();
const items = [1, 2, 3, 4, 5];

const combo = randomCombination(items, 3, r);
const perm = randomPermutation(items, r);
```
