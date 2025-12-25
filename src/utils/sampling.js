export const weightedPick = (arr, weights, rng) => {
  if (arr.length === 0) throw new Error('Array cannot be empty');
  if (arr.length !== weights.length) throw new Error('Array and weights must have same length');
  
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) throw new Error('Weights must sum to positive value');
  
  let rand = rng.nextFloat() * total;
  
  for (let i = 0; i < arr.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return arr[i];
  }
  
  return arr[arr.length - 1];
};

export const weightedSample = (arr, weights, count, rng) => {
  const result = [];
  const remaining = [...arr];
  const remainingWeights = [...weights];
  
  for (let i = 0; i < count && remaining.length > 0; i++) {
    const idx = weightedPickIndex(remainingWeights, rng);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
    remainingWeights.splice(idx, 1);
  }
  
  return result;
};

const weightedPickIndex = (weights, rng) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = rng.nextFloat() * total;
  
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return i;
  }
  
  return weights.length - 1;
};

export const reservoirSample = (stream, k, rng) => {
  if (k <= 0) throw new Error('k must be positive');
  if (!stream || stream.length === 0) throw new Error('Stream cannot be empty');
  
  const reservoir = stream.slice(0, Math.min(k, stream.length));
  
  for (let i = k; i < stream.length; i++) {
    const j = rng.nextInt(i + 1);
    if (j < k) {
      reservoir[j] = stream[i];
    }
  }
  
  return reservoir;
};
