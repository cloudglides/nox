let cryptoCache = null;
let cryptoCacheTime = 0;
let cryptoCacheBytes = 0;

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isBrowser = typeof window !== 'undefined';

let performanceImpl = typeof performance !== 'undefined' ? performance : null;
let randomBytesImpl = null;

// Only require in true Node environment
if (isNode && !isBrowser) {
  try {
    // Avoid static analysis by constructing module name dynamically
    const moduleName = ['perf', '_hooks'].join('');
    performanceImpl = require(moduleName).performance;
  } catch {}
  
  try {
    randomBytesImpl = require('crypto').randomBytes;
  } catch {}
}

export const fromPerformance = () => {
  try {
    if (performanceImpl && typeof performanceImpl.now === 'function') {
      const t = performanceImpl.now();
      return BigInt(Math.floor(t * 1000)) ^ BigInt(Math.floor(t * 1000000) % 1000000);
    }
  } catch {
    // fallback
  }
  return BigInt(Date.now());
};

export const fromMemory = () => {
  try {
    if (isNode && !isBrowser && typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      const total = mem.heapUsed + mem.external + mem.heapTotal;
      return BigInt(Math.floor(total)) ^ BigInt(Date.now());
    }
  } catch {
    // fallback
  }
  return BigInt(Date.now());
};

export const fromCrypto = (bytes = 8) => {
    if (typeof bytes !== 'number' || !Number.isInteger(bytes)) {
      throw new TypeError('bytes must be an integer');
    }
    if (bytes <= 0) {
      throw new RangeError('bytes must be positive');
    }
    
    try {
      const now = Date.now();
      
      if (cryptoCache && (now - cryptoCacheTime) < 100 && cryptoCacheBytes === bytes) {
        return cryptoCache;
      }
    
    let val = 0n;
    
    if (randomBytesImpl) {
      const buf = randomBytesImpl(Math.max(bytes, 8));
      for (let i = 0; i < buf.length; i++) {
        val = (val << 8n) | BigInt(buf[i]);
      }
    } else if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint8Array(Math.max(bytes, 8));
      crypto.getRandomValues(arr);
      for (let i = 0; i < arr.length; i++) {
        val = (val << 8n) | BigInt(arr[i]);
      }
    } else {
      return BigInt(Math.random() * Number.MAX_SAFE_INTEGER);
    }
    
    cryptoCache = val;
    cryptoCacheTime = now;
    cryptoCacheBytes = bytes;
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
   cryptoCacheBytes = 0;
 };
