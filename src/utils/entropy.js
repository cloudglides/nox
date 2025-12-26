import { performance } from 'perf_hooks';
import { randomBytes } from 'crypto';

let cryptoCache = null;
let cryptoCacheTime = 0;

export const fromPerformance = () => {
  const t = performance.now();
  return BigInt(Math.floor(t * 1000)) ^ BigInt(Math.floor(t * 1000000) % 1000000);
};

export const fromMemory = () => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const mem = process.memoryUsage();
    const total = mem.heapUsed + mem.external + mem.heapTotal;
    return BigInt(Math.floor(total)) ^ BigInt(Date.now());
  }
  return BigInt(Date.now());
};

export const fromCrypto = (bytes = 8) => {
  try {
    const now = Date.now();
    if (cryptoCache && (now - cryptoCacheTime) < 100) {
      return cryptoCache;
    }
    
    const buf = randomBytes(Math.max(bytes, 8));
    let val = 0n;
    for (let i = 0; i < buf.length; i++) {
      val = (val << 8n) | BigInt(buf[i]);
    }
    
    cryptoCache = val;
    cryptoCacheTime = now;
    return val;
  } catch {
    return BigInt(Math.random() * Number.MAX_SAFE_INTEGER);
  }
};

export const combined = () => {
  const perf = fromPerformance();
  const mem = fromMemory();
  const crypto = fromCrypto();
  
  let mix = perf ^ mem ^ crypto;
  mix = mix ^ (mix >> 33n);
  mix = (mix * 0xff51afd7ed558ccdn) & ((1n << 64n) - 1n);
  
  return mix !== 0n ? mix : 1n;
};

export const clearCryptoCache = () => {
  cryptoCache = null;
  cryptoCacheTime = 0;
};
