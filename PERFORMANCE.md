# Performance Benchmarks

Benchmarks run on Node.js v20.19.6 on modern hardware.

## RNG Operations (per second)

| Operation | Rate |
|-----------|------|
| `nextFloat()` | 2.5M |
| `nextInt(100)` | 2.8M |
| `int(1, 100)` | 1.8M |
| `bool()` | 3.5M |
| `choice()` | 1.5M |

## Batch Operations

| Operation | Rate |
|-----------|------|
| `floats(1000)` | 2.5k/sec |
| `ints(1000, 100)` | 2.2k/sec |
| `bools(1000)` | 2.8k/sec |

## Distributions

| Distribution | Rate |
|--------------|------|
| `normal()` | 1.0M |
| `exponential()` | 1.5M |
| `uniform()` | 3.5M |
| `poisson()` | 0.8M |

## Sequence Operations

| Operation | Rate |
|-----------|------|
| `shuffle(100)` | 14k/sec |
| `sample(100, 50)` | 25k/sec |
| `pick()` | 1.5M |

## Generators

All generators show similar performance characteristics:
- **PCG64**: Fast, cryptographic quality
- **Xorshift64**: Fastest, good distribution  
- **Splitmix64**: Very fast, good avalanche
- **MT19937**: Good period, slower output

## Optimization History

### v1.1.5
- 17% faster `nextFloat()` (division → multiplication)
- 53% faster `nextInt()` (fast path for small max)
- Pre-allocated arrays in batch operations
- Removed unnecessary array copies in sampling

### v1.1.4
- Fixed unbiased distribution in `nextInt()`
- Improved variance calculations

### v1.1.3
- Browser compatibility fixes

## Tips for Best Performance

1. **Reuse RNG instance**: Creating new RNG is cheaper than recreating distributions
2. **Batch operations**: Use `.floats(n)` instead of loop with `.nextFloat()`
3. **Small ranges**: `nextInt()` fast-paths for `max < 65536`
4. **Avoid shuffling large arrays**: Use reservoir sampling or weighted sampling instead
5. **Cache distribution parameters**: Pre-compute lambda, mean, stddev if used repeatedly
