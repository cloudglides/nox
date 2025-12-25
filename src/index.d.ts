export class RNG {
  constructor(generator?: any, seed?: number | bigint);
  next(): any;
  nextInt(max?: number): number;
  nextFloat(): number;
  int(min: number, max: number): number;
  bool(probability?: number): boolean;
}

export function rng(): RNG;
export function deterministic(seed: number | bigint): RNG;

export function normal(rng: RNG, mean?: number, stddev?: number): number;
export function exponential(rng: RNG, lambda?: number): number;
export function uniform(rng: RNG, min: number, max: number): number;
export function poisson(rng: RNG, lambda: number): number;

export function shuffle(arr: any[], rng: RNG): any[];
export function pick(arr: any[], rng: RNG): any;
export function sample(arr: any[], count: number, rng: RNG): any[];

export function saveState(rng: RNG): any;
export function restoreState(rng: RNG, snapshot: any): void;
export function cloneGenerator(rng: RNG): RNG;

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
  constructor(rng1: any, rng2: any);
  next(): bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}
