export interface IGenerator {
  next(): number | bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export type GeneratorConstructor = new (seed?: number | bigint) => IGenerator;

export class RNG {
   gen: IGenerator;
   constructor(generator?: GeneratorConstructor | IGenerator, seed?: number | bigint);
   next(): number | bigint;
   nextInt(max?: number): number;
   nextFloat(): number;
  int(min: number, max: number): number;
  bool(probability?: number): boolean;
  range(min: number, max: number, step?: number): number;
  choice<T>(arr: T[]): T;
  batch<T>(count: number, fn: (rng: RNG, index: number) => T): T[];
  floats(count: number): number[];
  ints(count: number, max?: number): number[];
  bools(count: number, probability?: number): boolean[];
}

export function rng(): RNG;
export function deterministic(seed: number | bigint): RNG;

export function normal(rng: RNG | IGenerator, mean?: number, stddev?: number): number;
export function exponential(rng: RNG | IGenerator, lambda?: number): number;
export function uniform(rng: RNG | IGenerator, min: number, max: number): number;
export function poisson(rng: RNG | IGenerator, lambda: number): number;

export function shuffle<T>(arr: T[], rng: RNG | IGenerator, inPlace?: boolean): T[];
export function pick<T>(arr: T[], rng: RNG | IGenerator): T;
export function sample<T>(arr: T[], count: number, rng: RNG | IGenerator): T[];

export function saveState(rng: RNG): any;
export function restoreState(rng: RNG, snapshot: any): void;
export function cloneGenerator(rng: RNG): RNG;

export function weightedPick<T>(arr: T[], weights: number[], rng: RNG | IGenerator): T;
export function weightedSample<T>(arr: T[], weights: number[], count: number, rng: RNG | IGenerator): T[];
export function reservoirSample<T>(stream: T[], k: number, rng: RNG | IGenerator): T[];

export interface TestResult {
  mean?: number;
  variance?: number;
  stdDev?: number;
  tStatistic?: number;
  expectedMean?: number;
  expectedVariance?: number;
  chi2Statistic?: number;
  degreesOfFreedom?: number;
}

export interface KSTestResult {
  statistic: number;
  pass_0_10: boolean;
  pass_0_05: boolean;
  pass_0_01: boolean;
}

export function meanTest(data: number[], expectedMean?: number): TestResult;
export function varianceTest(data: number[], expectedVariance?: number): TestResult;
export function kolmogorovSmirnovTest(data: number[]): KSTestResult;

export class Xorshift64 {
  constructor(seed?: number | bigint);
  next(): bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class Splitmix64 {
  constructor(seed?: number | bigint);
  next(): bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class PCG64 {
  constructor(seed?: bigint, inc?: bigint);
  next(): bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class MT19937 {
  constructor(seed?: number);
  next(): number;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class Logistic {
  constructor(seed?: number, r?: number);
  next(): number;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class Tent {
  constructor(seed?: number, mu?: number);
  next(): number;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export class Mixer {
   constructor(rng1: IGenerator, rng2: IGenerator);
   next(): bigint;
   nextInt(max?: number): number;
   nextFloat(): number;
}

export function beta(rng: RNG | IGenerator, alpha: number, beta: number): number;
export function gamma(rng: RNG | IGenerator, shape: number, scale?: number): number;
export function chi2(rng: RNG | IGenerator, k: number): number;
export function weibull(rng: RNG | IGenerator, shape: number, scale?: number): number;
export function lognormal(rng: RNG | IGenerator, mu: number, sigma: number): number;
export function rayleigh(rng: RNG | IGenerator, sigma?: number): number;
export function cauchy(rng: RNG | IGenerator, median?: number, scale?: number): number;

export function brownianMotion(rng: RNG | IGenerator, steps: number, dt?: number): number[];
export function ornsteinUhlenbeck(rng: RNG | IGenerator, steps: number, theta?: number, mu?: number, sigma?: number): number[];
export function geometricBrownian(rng: RNG | IGenerator, steps: number, mu?: number, sigma?: number, dt?: number): number[];

export function perlin2D(rng: RNG | IGenerator, x: number, y: number, octaves?: number): number;
export function valueNoise(rng: RNG | IGenerator, x: number, y: number, scale?: number): number;

export function categorical<T>(rng: RNG | IGenerator, categories: T[], probabilities: number[]): T;
export function multinomial(rng: RNG | IGenerator, n: number, categories: any[], probabilities: number[]): Record<string, number>;
export function categorical2D(rng: RNG | IGenerator, matrix: number[][]): [number, number];

export function combinations<T>(arr: T[], k: number): T[][];
export function permutations<T>(arr: T[]): T[][];
export function kPermutations<T>(arr: T[], k: number): T[][];
export function randomCombination<T>(arr: T[], k: number, rng: RNG | IGenerator): T[];
export function randomPermutation<T>(arr: T[], rng: RNG | IGenerator): T[];

export function rotateBits(val: bigint, shift: number | bigint): bigint;
export function extractBits(val: bigint, start: number, length: number): bigint;
export function hammingWeight(val: bigint): number;
export function bitRange(val: bigint, min: number, max: number): bigint;

export class SeedSequence {
   constructor(entropy?: null | string | number | bigint);
   next(): bigint;
   spawn(n?: number): bigint[];
}

export function seedMultiple(rngClasses: (new (seed?: number | bigint) => IGenerator)[], entropy?: null | string | number | bigint): IGenerator[];
export function seedFromTime(): bigint;
export function seedFromEntropy(entropy: string): bigint;

export function chiSquareTest(data: number[], bins?: number): { chi2: number; expected: number; histogram: number[] };
export function entropy(data: number[], bins?: number): number;
export function autocorrelation(data: number[], lag: number): number;
export function runTest(data: number[], threshold?: number): number;
