export interface IGenerator {
  next(): number | bigint;
  nextInt(max?: number): number;
  nextFloat(): number;
}

export type GeneratorConstructor = new (seed?: number | bigint) => IGenerator;

export class RNG {
  gen: IGenerator;
  constructor(generator?: GeneratorConstructor | IGenerator, seed?: number | bigint);
  next(): any;
  nextInt(max?: number): number;
  nextFloat(): number;
  int(min: number, max: number): number;
  bool(probability?: number): boolean;
  range(min: number, max: number, step?: number): number;
  choice<T>(arr: T[]): T;
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
