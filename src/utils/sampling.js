export const weightedPick = (arr, weights, rng) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new TypeError('arr must be a non-empty array');
  }
  if (!Array.isArray(weights) || weights.length === 0) {
    throw new TypeError('weights must be a non-empty array');
  }
  if (arr.length !== weights.length) {
    throw new Error('arr and weights must have same length');
  }
  if (!rng || typeof rng.nextFloat !== 'function') {
    throw new TypeError('rng must be an RNG instance');
  }
  
  const total = weights.reduce((a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new TypeError('All weights must be numbers');
    }
    return a + b;
  }, 0);
  
  if (total <= 0) {
    throw new Error('Weights must sum to positive value');
  }
  
  let rand = rng.nextFloat() * total;
  
  for (let i = 0; i < arr.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return arr[i];
  }
  
  return arr[arr.length - 1];
};

export const weightedSample = (arr, weights, count, rng) => {
   if (!Array.isArray(arr) || arr.length === 0) {
     throw new TypeError('arr must be a non-empty array');
   }
   if (!Array.isArray(weights) || weights.length === 0) {
     throw new TypeError('weights must be a non-empty array');
   }
   if (arr.length !== weights.length) {
     throw new Error('arr and weights must have same length');
   }
   if (typeof count !== 'number' || !Number.isInteger(count)) {
     throw new TypeError('count must be an integer');
   }
   if (count <= 0) {
     return [];
   }
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('rng must be an RNG instance');
   }
   
   const result = [];
   const len = arr.length;
   if (count >= len) {
     return [...arr];
   }
   
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
   if (!Array.isArray(stream) || stream.length === 0) {
     throw new TypeError('stream must be a non-empty array');
   }
   if (typeof k !== 'number' || !Number.isInteger(k)) {
     throw new TypeError('k must be an integer');
   }
   if (k <= 0) {
     throw new RangeError('k must be positive');
   }
   if (k > stream.length) {
     throw new RangeError('k cannot exceed stream length');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('rng must be an RNG instance');
   }
   
   const reservoir = stream.slice(0, k);
   
   for (let i = k; i < stream.length; i++) {
     const j = rng.nextInt(i + 1);
     if (j < k) {
       reservoir[j] = stream[i];
     }
   }
   
   return reservoir;
 };
