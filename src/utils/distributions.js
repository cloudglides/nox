const TWO_PI = 2 * Math.PI;

export const normal = (rng, mean = 0, stddev = 1) => {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('First argument must be RNG instance');
    }
    if (typeof mean !== 'number') {
      throw new TypeError('mean must be a number');
    }
    if (typeof stddev !== 'number') {
      throw new TypeError('stddev must be a number');
    }
    if (stddev <= 0) {
      throw new RangeError('stddev must be positive');
    }
   
   let u1, u2;
   do {
     u1 = rng.nextFloat();
     u2 = rng.nextFloat();
   } while (u1 <= 0 || u2 <= 0);
   
   const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(TWO_PI * u2);
   return z0 * stddev + mean;
 };

export const exponential = (rng, lambda = 1) => {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('First argument must be RNG instance');
    }
    if (typeof lambda !== 'number') {
      throw new TypeError('lambda must be a number');
    }
    if (lambda <= 0) {
      throw new RangeError('lambda must be positive');
    }
   
   let u = rng.nextFloat();
   while (u === 0 || u === 1) {
     u = rng.nextFloat();
   }
   const result = -Math.log(1 - u) / lambda;
   return Number.isFinite(result) ? result : -Math.log(u) / lambda;
 };

export const poisson = (rng, lambda) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof lambda !== 'number') {
     throw new TypeError('lambda must be a number');
   }
   if (lambda <= 0) {
     throw new RangeError('lambda must be positive');
   }
  
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  
  do {
    k++;
    p *= rng.nextFloat();
  } while (p > L);
  
  return k - 1;
};

export const uniform = (rng, min, max) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof min !== 'number') {
     throw new TypeError('min must be a number');
   }
   if (typeof max !== 'number') {
     throw new TypeError('max must be a number');
   }
   if (min >= max) {
     throw new RangeError('min must be less than max');
   }
  
  return min + rng.nextFloat() * (max - min);
};
