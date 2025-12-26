import { performance } from 'perf_hooks';
import { randomBytes } from 'crypto';

export function getPerformance() {
  return performance;
}

export function getRandomBytes() {
  return randomBytes;
}
