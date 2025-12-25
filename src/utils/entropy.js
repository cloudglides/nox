import { performance } from 'perf_hooks';
import { randomBytes } from 'crypto';

export const fromPerformance = () => {
  return BigInt(Math.floor(performance.now() * 1000));
};

export const fromMemory = () => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage();
    return BigInt(Math.floor(mem.heapUsed + mem.external));
  }
  return BigInt(0);
};

export const fromCrypto = (bytes = 8) => {
  try {
    const buf = randomBytes(bytes);
    let val = 0n;
    for (let i = 0; i < buf.length; i++) {
      val = (val << 8n) | BigInt(buf[i]);
    }
    return val;
  } catch {
    return BigInt(0);
  }
};

export const combined = () => {
  const perf = fromPerformance();
  const mem = fromMemory();
  const crypto = fromCrypto();
  
  const mix = (perf ^ mem ^ crypto) ^ (perf + BigInt(Date.now()));
  return mix !== 0n ? mix : 1n;
};
