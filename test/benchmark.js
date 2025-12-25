import { Xorshift64, Logistic, Tent, Splitmix64, PCG64, MT19937 } from '../src/index.js';
import { chiSquareTest, entropy, autocorrelation, runTest } from '../src/utils/statistics.js';

const SAMPLES = 10000;

const benchmarkGenerator = (name, GeneratorClass, seed) => {
  console.log(`\n=== ${name} ===`);
  
  const rng = new GeneratorClass(seed);
  const data = [];
  
  const start = performance.now();
  for (let i = 0; i < SAMPLES; i++) {
    data.push(rng.nextFloat());
  }
  const elapsed = performance.now() - start;
  
  const { chi2, histogram } = chiSquareTest(data, 20);
  const ent = entropy(data, 20);
  const autocorr = autocorrelation(data, 1);
  const runs = runTest(data);
  
  console.log(`Time: ${elapsed.toFixed(2)}ms (${(SAMPLES/elapsed*1000).toFixed(0)} ops/sec)`);
  console.log(`Chi2: ${chi2.toFixed(2)} (good: <31.4)`);
  console.log(`Entropy: ${ent.toFixed(4)} (max: ~${Math.log2(20).toFixed(4)})`);
  console.log(`Autocorr(lag=1): ${autocorr.toFixed(6)} (good: close to 0)`);
  console.log(`Runs: ${runs} (expect ~${Math.ceil(SAMPLES/2)})`);
};

benchmarkGenerator('Xorshift64', Xorshift64, 42);
benchmarkGenerator('Splitmix64', Splitmix64, 42);
benchmarkGenerator('PCG64', PCG64, 42);
benchmarkGenerator('MT19937', MT19937, 42);
benchmarkGenerator('Logistic', Logistic, 0.5);
benchmarkGenerator('Tent', Tent, 0.5);
