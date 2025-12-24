export const weibull = (rng, shape, scale = 1) => {
  const u = rng.nextFloat();
  return scale * Math.pow(-Math.log(1 - u), 1 / shape);
};

export const lognormal = (rng, mu, sigma) => {
  const u1 = rng.nextFloat();
  const u2 = rng.nextFloat();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.exp(mu + sigma * z);
};

export const rayleigh = (rng, sigma = 1) => {
  const u = rng.nextFloat();
  return sigma * Math.sqrt(-2 * Math.log(u));
};

export const cauchy = (rng, median = 0, scale = 1) => {
  const u = rng.nextFloat();
  return median + scale * Math.tan(Math.PI * (u - 0.5));
};
