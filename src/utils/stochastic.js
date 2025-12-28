export const brownianMotion = (rng, steps, dt = 1) => {
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('First argument must be RNG instance');
    }
    if (typeof steps !== 'number' || !Number.isInteger(steps)) {
      throw new TypeError('steps must be an integer');
    }
    if (steps <= 0) {
      throw new RangeError('steps must be positive');
    }
    if (typeof dt !== 'number') {
      throw new TypeError('dt must be a number');
    }
    if (dt <= 0) {
      throw new RangeError('dt must be positive');
    }
   const path = [0];
   for (let i = 0; i < steps; i++) {
     const drift = -0.5 * dt;
     const diffusion = Math.sqrt(dt) * (rng.nextFloat() * 2 - 1);
     const nextVal = path[i] + drift + diffusion;
     path.push(nextVal);
   }
   return path;
 };
 
 export const ornsteinUhlenbeck = (rng, steps, theta = 0.1, mu = 0, sigma = 1) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof steps !== 'number' || !Number.isInteger(steps)) {
     throw new TypeError('steps must be an integer');
   }
   if (steps <= 0) {
     throw new RangeError('steps must be positive');
   }
   if (typeof theta !== 'number') {
     throw new TypeError('theta must be a number');
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
   const path = [mu];
   for (let i = 0; i < steps; i++) {
     const drift = theta * (mu - path[i]);
     const diffusion = sigma * (rng.nextFloat() * 2 - 1);
     const nextVal = path[i] + drift + diffusion;
     path.push(nextVal);
   }
   return path;
 };
 
 export const geometricBrownian = (rng, steps, mu = 0.05, sigma = 0.2, dt = 0.01) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof steps !== 'number' || !Number.isInteger(steps)) {
     throw new TypeError('steps must be an integer');
   }
   if (steps <= 0) {
     throw new RangeError('steps must be positive');
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
   if (typeof dt !== 'number') {
     throw new TypeError('dt must be a number');
   }
   if (dt <= 0) {
     throw new RangeError('dt must be positive');
   }
   const path = [1];
   for (let i = 0; i < steps; i++) {
     const drift = (mu - 0.5 * sigma * sigma) * dt;
     const diffusion = sigma * Math.sqrt(dt) * (rng.nextFloat() * 2 - 1);
     const nextVal = path[i] * Math.exp(drift + diffusion);
     path.push(nextVal);
   }
   return path;
 };
