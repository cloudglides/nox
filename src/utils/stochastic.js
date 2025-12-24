export const brownianMotion = (rng, steps, dt = 1) => {
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
  const path = [1];
  for (let i = 0; i < steps; i++) {
    const drift = (mu - 0.5 * sigma * sigma) * dt;
    const diffusion = sigma * Math.sqrt(dt) * (rng.nextFloat() * 2 - 1);
    const nextVal = path[i] * Math.exp(drift + diffusion);
    path.push(nextVal);
  }
  return path;
};
