let cryptoCache = null;
let cryptoCacheTime = 0;
let cryptoCacheBytes = 0;

export const fromPerformance = () => {
  try {
    if (typeof performance !== 'undefined' && performance.now) {
      const t = performance.now();
      return BigInt(Math.floor(t * 1000)) ^ BigInt(Math.floor(t * 1000000) % 1000000);
    }
  } catch {
    // fallback
  }
  return BigInt(Date.now());
};

export const fromMemory = () => {
  return BigInt(Date.now());
};

export const fromCrypto = (bytes = 8) => {
   try {
     const now = Date.now();
     
     if (cryptoCache && (now - cryptoCacheTime) < 100 && cryptoCacheBytes === bytes) {
       return cryptoCache;
     }
    
    let val = 0n;
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
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
