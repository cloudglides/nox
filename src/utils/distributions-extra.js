export const beta = (rng, alpha, beta) => {
  const u = -Math.log(rng.nextFloat()) / alpha;
  const v = -Math.log(rng.nextFloat()) / beta;
  return u / (u + v);
};

export const gamma = (rng, shape, scale = 1) => {
  if (shape < 1) {
    return gamma(rng, shape + 1, scale) * Math.pow(rng.nextFloat(), 1 / shape);
  }
  
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  
  let z, v, u;
  do {
    do {
      const x = (rng.nextFloat() * 2 - 1);
      v = 1 + c * x;
    } while (v <= 0);
    
    v = v * v * v;
    u = rng.nextFloat();
    z = -Math.log(u);
  } while (u > 1 - 0.0331 * (x * x) * (x * x) && Math.log(z + Math.log(d)) > Math.log(d * (Math.log(v) + 1)));
  
  return d * v * scale;
};

export const chi2 = (rng, k) => {
  return gamma(rng, k / 2, 2);
};
