export const beta = (rng, alpha, beta) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof alpha !== 'number' || alpha <= 0) {
     throw new Error('alpha must be a positive number');
   }
   if (typeof beta !== 'number' || beta <= 0) {
     throw new Error('beta must be a positive number');
   }
   let u = rng.nextFloat();
   while (u === 0 || u === 1) {
     u = rng.nextFloat();
   }
   let v = rng.nextFloat();
   while (v === 0 || v === 1) {
     v = rng.nextFloat();
   }
   const uVal = -Math.log(u) / alpha;
   const vVal = -Math.log(v) / beta;
   return uVal / (uVal + vVal);
 };

export const gamma = (rng, shape, scale = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof shape !== 'number' || shape <= 0) {
     throw new Error('shape must be a positive number');
   }
   if (typeof scale !== 'number' || scale <= 0) {
     throw new Error('scale must be a positive number');
   }
   if (shape < 1) {
     return gamma(rng, shape + 1, scale) * Math.pow(rng.nextFloat(), 1 / shape);
   }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  let z, v, u, x;
  do {
    do {
      x = (rng.nextFloat() * 2 - 1);
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    u = rng.nextFloat();
    z = -Math.log(u);
  } while (u > 1 - 0.0331 * (x * x) * (x * x) && Math.log(z + Math.log(d)) > Math.log(d * (Math.log(v) + 1)));
  
  return d * v * scale;
};

export const chi2 = (rng, k) => {
   if (typeof k !== 'number' || k <= 0) {
     throw new Error('k must be a positive number');
   }
   return gamma(rng, k / 2, 2);
 };
