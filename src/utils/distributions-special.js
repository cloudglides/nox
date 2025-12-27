export const weibull = (rng, shape, scale = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof shape !== 'number' || shape <= 0) {
     throw new Error('shape must be a positive number');
   }
   if (typeof scale !== 'number' || scale <= 0) {
     throw new Error('scale must be a positive number');
   }
   const u = rng.nextFloat();
   return scale * Math.pow(-Math.log(1 - u), 1 / shape);
 };
 
 export const lognormal = (rng, mu, sigma) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof mu !== 'number') {
     throw new TypeError('mu must be a number');
   }
   if (typeof sigma !== 'number' || sigma <= 0) {
     throw new Error('sigma must be a positive number');
   }
   const u1 = rng.nextFloat();
   const u2 = rng.nextFloat();
   const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
   return Math.exp(mu + sigma * z);
 };
 
 export const rayleigh = (rng, sigma = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof sigma !== 'number' || sigma <= 0) {
     throw new Error('sigma must be a positive number');
   }
   const u = rng.nextFloat();
   return sigma * Math.sqrt(-2 * Math.log(u));
 };
 
 export const cauchy = (rng, median = 0, scale = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof median !== 'number') {
     throw new TypeError('median must be a number');
   }
   if (typeof scale !== 'number' || scale <= 0) {
     throw new Error('scale must be a positive number');
   }
   const u = rng.nextFloat();
   return median + scale * Math.tan(Math.PI * (u - 0.5));
 };
