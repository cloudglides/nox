export const weightedPick = (arr, weights, rng) => {
  const total = weights.reduce((a, b) => a + b, 0);
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
  const reservoir = stream.slice(0, k);
  
  for (let i = k; i < stream.length; i++) {
    const j = rng.nextInt(i + 1);
    if (j < k) {
      reservoir[j] = stream[i];
    }
  }
  
  return reservoir;
};
