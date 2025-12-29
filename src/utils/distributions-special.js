export const weibull = (rng, shape, scale = 1) => {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('First argument must be RNG instance');
    }
    if (typeof shape !== 'number') {
      throw new TypeError('shape must be a number');
    }
    if (shape <= 0) {
      throw new RangeError('shape must be positive');
    }
    if (typeof scale !== 'number') {
      throw new TypeError('scale must be a number');
    }
    if (scale <= 0) {
      throw new RangeError('scale must be positive');
    }
   let u = rng.nextFloat();
   while (u === 0 || u === 1) {
     u = rng.nextFloat();
   }
   return scale * Math.pow(-Math.log(1 - u), 1 / shape);
 };
 
 export const lognormal = (rng, mu, sigma) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof mu !== 'number') {
     throw new TypeError('mu must be a number');
   }
   if (typeof sigma !== 'number') {
     throw new TypeError('sigma must be a number');
   }
   if (sigma <= 0) {
     throw new RangeError('sigma must be positive');
   }
   let u1 = rng.nextFloat();
   while (u1 === 0 || u1 === 1) {
     u1 = rng.nextFloat();
   }
   const u2 = rng.nextFloat();
   const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
   return Math.exp(mu + sigma * z);
 };
 
 export const rayleigh = (rng, sigma = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof sigma !== 'number') {
     throw new TypeError('sigma must be a number');
   }
   if (sigma <= 0) {
     throw new RangeError('sigma must be positive');
   }
   let u = rng.nextFloat();
   while (u === 0 || u === 1) {
     u = rng.nextFloat();
   }
   return sigma * Math.sqrt(-2 * Math.log(u));
 };
 
 export const cauchy = (rng, median = 0, scale = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof median !== 'number') {
     throw new TypeError('median must be a number');
   }
   if (typeof scale !== 'number') {
     throw new TypeError('scale must be a number');
   }
   if (scale <= 0) {
     throw new RangeError('scale must be positive');
   }
   const u = rng.nextFloat();
   return median + scale * Math.tan(Math.PI * (u - 0.5));
 };
