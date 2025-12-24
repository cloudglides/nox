export const normal = (rng, mean = 0, stddev = 1) => {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = rng.nextFloat();
  while (u2 === 0) u2 = rng.nextFloat();
  
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * stddev + mean;
};

export const exponential = (rng, lambda = 1) => {
  const u = rng.nextFloat();
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
