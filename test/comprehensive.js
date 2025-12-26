import { 
  rng, 
  deterministic,
  RNG,
  PCG64,
  normal,
  exponential,
  shuffle,
  pick,
  sample,
  saveState,
  restoreState,
  cloneGenerator,
  weightedPick,
  reservoirSample,
  meanTest,
  varianceTest,
  kolmogorovSmirnovTest
} from '../src/index.js';

console.log('=== Comprehensive nox Test Suite ===\n');

console.log('1. Core RNG Methods');
const r = rng();
console.log(`  nextFloat(): ${r.nextFloat().toFixed(6)}`);
console.log(`  nextInt(100): ${r.nextInt(100)}`);
console.log(`  int(1, 100): ${r.int(1, 100)}`);
console.log(`  bool(0.7): ${r.bool(0.7)}`);

console.log('\n2. Utility Methods');
console.log(`  range(5, 15, 3): ${r.range(5, 15, 3)}`);
console.log(`  choice(['red', 'blue', 'green']): ${r.choice(['red', 'blue', 'green'])}`);

console.log('\n3. Batch Operations');
const floats = r.floats(3).map(x => x.toFixed(6));
console.log(`  floats(3): [${floats.join(', ')}]`);
const ints = r.ints(3, 10);
console.log(`  ints(3, 10): [${ints.join(', ')}]`);
const bools = r.bools(3, 0.5);
console.log(`  bools(3): [${bools.join(', ')}]`);

console.log('\n4. Sequence Operations');
const arr = [1, 2, 3, 4, 5];
console.log(`  shuffle(${JSON.stringify(arr)}): ${JSON.stringify(shuffle([...arr], r))}`);
console.log(`  pick(['a','b','c']): ${pick(['a','b','c'], r)}`);
console.log(`  sample([1,2,3,4,5], 3): ${JSON.stringify(sample([...arr], 3, r))}`);

console.log('\n5. Statistical Distributions');
const r2 = rng();
console.log(`  normal(0, 1): ${normal(r2).toFixed(6)}`);
console.log(`  exponential(1): ${exponential(r2).toFixed(6)}`);

console.log('\n6. State Management');
const r3 = rng();
const val1 = r3.nextFloat();
const state = saveState(r3);
const val2 = r3.nextFloat();
restoreState(r3, state);
const val2_restored = r3.nextFloat();
console.log(`  State restored correctly: ${val2 === val2_restored}`);

console.log('\n7. Generator Cloning');
const orig = deterministic(12345);
const origSeq = orig.floats(3);
const cloned = cloneGenerator(orig);
const clonedSeq = cloned.floats(3);
console.log(`  Clone has same sequence: ${JSON.stringify(origSeq) === JSON.stringify(clonedSeq)}`);

console.log('\n8. Weighted Sampling');
const items = ['A', 'B', 'C'];
const weights = [0.6, 0.3, 0.1];
console.log(`  weightedPick(['A','B','C'], [0.6,0.3,0.1]): ${weightedPick(items, weights, rng())}`);

console.log('\n9. Reservoir Sampling');
const largeStream = Array.from({length: 1000}, (_, i) => i);
const sample5 = reservoirSample(largeStream, 5, rng());
console.log(`  reservoirSample(0..999, k=5): [${sample5.join(', ')}]`);

console.log('\n10. Statistical Tests');
const testData = rng().floats(500);
const meanRes = meanTest(testData);
const varRes = varianceTest(testData);
const ksRes = kolmogorovSmirnovTest(testData);
console.log(`  Mean: ${meanRes.mean.toFixed(6)} (expected: 0.5)`);
console.log(`  Variance: ${varRes.variance.toFixed(6)} (expected: 0.083333)`);
console.log(`  KS Test passes (α=0.05): ${ksRes.pass_0_05}`);

console.log('\n11. Deterministic Mode');
const d1 = deterministic(42);
const seq1 = d1.ints(5, 100);
const d2 = deterministic(42);
const seq2 = d2.ints(5, 100);
console.log(`  Sequences identical: ${JSON.stringify(seq1) === JSON.stringify(seq2)}`);
console.log(`  Sequence: ${JSON.stringify(seq1)}`);

console.log('\n12. Custom Generators');
const custom = new RNG(PCG64, 999n);
console.log(`  Custom PCG64 RNG initialized: ${custom.nextFloat().toFixed(6)}`);

console.log('\n✓ All tests completed successfully');
