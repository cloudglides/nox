export const shuffle = (arr, rng) => {
  if (!Array.isArray(arr)) throw new TypeError('First argument must be array');
  if (!rng) throw new Error('RNG required');
  
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pick = (arr, rng) => {
  if (!Array.isArray(arr)) throw new TypeError('First argument must be array');
  if (arr.length === 0) throw new Error('Array cannot be empty');
  if (!rng) throw new Error('RNG required');
  
  return arr[rng.nextInt(arr.length)];
};

export const sample = (arr, count, rng) => {
  if (!Array.isArray(arr)) throw new TypeError('First argument must be array');
  if (count <= 0) throw new Error('Sample count must be positive');
  if (count > arr.length) throw new Error('Sample count exceeds array length');
  if (!rng) throw new Error('RNG required');
  
  const copy = shuffle(arr, rng);
  return copy.slice(0, count);
};
