export const normal = (rng, mean = 0, stddev = 1) => {
  let u1, u2;
  do {
    u1 = rng.nextFloat();
    u2 = rng.nextFloat();
  } while (u1 <= 0 || u2 <= 0);
  
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stddev + mean;
};

export const exponential = (rng, lambda = 1) => {
  if (lambda <= 0) throw new Error('Lambda must be positive');
  
  let u = rng.nextFloat();
  while (u === 0 || u === 1) {
    u = rng.nextFloat();
  }
  return -Math.log(1 - u) / lambda;
};

export const poisson = (rng, lambda) => {
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
  return min + rng.nextFloat() * (max - min);
};
