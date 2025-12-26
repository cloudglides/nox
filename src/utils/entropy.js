let cryptoCache = null;
let cryptoCacheTime = 0;

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

let performanceImpl = null;
let randomBytesImpl = null;

let initializing = false;

const initializeNodeModules = async () => {
  if (initializing) return;
  initializing = true;
  
  if (isNode) {
    try {
      const mod = await import('./entropy-node.js');
      performanceImpl = mod.getPerformance();
      randomBytesImpl = mod.getRandomBytes();
    } catch {
      // modules not available
    }
  }
};

if (isNode) {
  initializeNodeModules();
}

if (typeof performance !== 'undefined') {
  performanceImpl = performance;
}

export const fromPerformance = () => {
  try {
    const perf = performanceImpl;
    if (perf) {
      const t = perf.now();
      return BigInt(Math.floor(t * 1000)) ^ BigInt(Math.floor(t * 1000000) % 1000000);
    }
  } catch {
    // fallback
  }
  return BigInt(Date.now());
};

export const fromMemory = () => {
  try {
    if (isNode && typeof process !== 'undefined' && process.memoryUsage) {
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
  try {
    const now = Date.now();
    
    if (cryptoCache && (now - cryptoCacheTime) < 100) {
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
