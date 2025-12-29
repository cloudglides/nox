export const repeat = (count, fn) => {
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    throw new TypeError('count must be an integer');
  }
  if (count < 0) {
    throw new RangeError('count must be non-negative');
  }
  if (count === 0) {
    return [];
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = fn(i);
  }
  return result;
};

export const until = (fn, maxIterations = Infinity) => {
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  if (maxIterations !== Infinity && (typeof maxIterations !== 'number' || !Number.isInteger(maxIterations))) {
    throw new TypeError('maxIterations must be an integer or Infinity');
  }
  if (maxIterations <= 0) {
    throw new RangeError('maxIterations must be positive');
  }

  let iteration = 0;
  while (iteration < maxIterations) {
    const result = fn(iteration);
    if (result) return iteration;
    iteration++;
  }
  return -1;
};

export const times = (rng, count, fn) => {
  if (!rng || typeof rng.nextFloat !== 'function') {
    throw new TypeError('rng must be an RNG instance');
  }
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    throw new TypeError('count must be an integer');
  }
  if (count < 0) {
    throw new RangeError('count must be non-negative');
  }
  if (count === 0) {
    return [];
  }
  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = fn(rng, i);
  }
  return result;
};
