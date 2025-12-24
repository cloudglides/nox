export class Xorshift64 {
  constructor(seed?: number | bigint);
  next(): bigint;
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

export class Mixer {
  constructor(rng1: any, rng2: any);
  next(): bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export function seedFromTime(): bigint;
export function seedFromEntropy(entropy: string): bigint;

export function normal(rng: any, mean?: number, stddev?: number): number;
export function exponential(rng: any, lambda?: number): number;
export function poisson(rng: any, lambda: number): number;
export function uniform(rng: any, min: number, max: number): number;

export function beta(rng: any, alpha: number, beta: number): number;
export function gamma(rng: any, shape: number, scale?: number): number;
export function chi2(rng: any, k: number): number;

export function weibull(rng: any, shape: number, scale?: number): number;
export function lognormal(rng: any, mu: number, sigma: number): number;
export function rayleigh(rng: any, sigma?: number): number;
export function cauchy(rng: any, median?: number, scale?: number): number;

export function shuffle(arr: any[], rng: any): any[];
export function pick(arr: any[], rng: any): any;
export function sample(arr: any[], count: number, rng: any): any[];

export function fromPerformance(): bigint;
export function fromMemory(): bigint;
export function fromCrypto(bytes?: number): bigint;
export function combined(): bigint;

export function rotateBits(val: bigint, shift: number): bigint;
export function extractBits(val: bigint, start: number, length: number): bigint;
export function hammingWeight(val: bigint): number;
export function bitRange(val: bigint, min: number, max: number): bigint;

export function brownianMotion(rng: any, steps: number, dt?: number): number[];
export function ornsteinUhlenbeck(rng: any, steps: number, theta?: number, mu?: number, sigma?: number): number[];
export function geometricBrownian(rng: any, steps: number, mu?: number, sigma?: number, dt?: number): number[];

export interface ChiSquareResult {
  chi2: number;
  expected: number;
  histogram: number[];
}

export function chiSquareTest(data: number[], bins?: number): ChiSquareResult;
export function entropy(data: number[], bins?: number): number;
export function autocorrelation(data: number[], lag: number): number;
export function runTest(data: number[], threshold?: number): number;

export function perlin2D(rng: any, x: number, y: number, octaves?: number): number;
export function valueNoise(rng: any, x: number, y: number, scale?: number): number;

export function weightedPick(arr: any[], weights: number[], rng: any): any;
export function weightedSample(arr: any[], weights: number[], count: number, rng: any): any[];
export function reservoirSample(stream: any[], k: number, rng: any): any[];
