import { rng, deterministic } from '../src/index.js';
import { 
  weightedPick, 
  reservoirSample,
  meanTest,
  varianceTest,
  kolmogorovSmirnovTest
} from '../src/index.js';

console.log('=== Batch Operations ===');
const r = rng();

const floats = r.floats(5);
console.log('Batch floats:', floats);

const ints = r.ints(5, 100);
console.log('Batch ints:', ints);

const bools = r.bools(5, 0.3);
console.log('Batch bools:', bools);

const custom = r.batch(3, (rng, i) => ({ id: i, val: rng.nextFloat() }));
console.log('Custom batch:', custom);

console.log('\n=== Utility Methods ===');
console.log('Range (10-20, step 2):', r.range(10, 20, 2));
console.log('Choice:', r.choice(['apple', 'banana', 'cherry']));

console.log('\n=== Weighted Sampling ===');
const items = ['A', 'B', 'C'];
const weights = [0.5, 0.3, 0.2];
console.log('Weighted pick:', weightedPick(items, weights, r));

console.log('\n=== Reservoir Sampling ===');
const stream = Array.from({ length: 100 }, (_, i) => i);
const sample = reservoirSample(stream, 5, r);
console.log('Reservoir sample:', sample);

console.log('\n=== Statistical Tests ===');
const testData = r.floats(1000);

const mean = meanTest(testData);
console.log('Mean test:', {
  computed: mean.mean.toFixed(4),
  expected: mean.expectedMean.toFixed(4),
  tStat: mean.tStatistic.toFixed(4)
});

const variance = varianceTest(testData);
console.log('Variance test:', {
  computed: variance.variance.toFixed(6),
  expected: variance.expectedVariance.toFixed(6),
  chi2: variance.chi2Statistic.toFixed(4)
});

const ks = kolmogorovSmirnovTest(testData);
console.log('KS test:', {
  statistic: ks.statistic.toFixed(6),
  pass_0_05: ks.pass_0_05
});

console.log('\n=== Deterministic Reproducibility ===');
const d1 = deterministic(12345);
const seq1 = d1.floats(5);

const d2 = deterministic(12345);
const seq2 = d2.floats(5);

console.log('Sequence 1:', seq1);
console.log('Sequence 2:', seq2);
console.log('Identical:', JSON.stringify(seq1) === JSON.stringify(seq2));
