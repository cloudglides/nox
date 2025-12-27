const TWO_PI = 2 * Math.PI;

export const normal = (rng, mean = 0, stddev = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof mean !== 'number' || typeof stddev !== 'number') {
     throw new TypeError('mean and stddev must be numbers');
   }
   if (stddev <= 0) {
     throw new Error('stddev must be positive');
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
   if (typeof lambda !== 'number' || lambda <= 0) {
     throw new Error('lambda must be a positive number');
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
  if (typeof lambda !== 'number' || lambda <= 0) {
    throw new Error('lambda must be a positive number');
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
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('min and max must be numbers');
  }
  if (min >= max) {
    throw new Error('min must be less than max');
  }
  
  return min + rng.nextFloat() * (max - min);
};
