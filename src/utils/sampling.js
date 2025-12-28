export const weightedPick = (arr, weights, rng) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new RangeError('arr must be a non-empty array');
    }
    if (!Array.isArray(weights) || weights.length === 0) {
      throw new RangeError('weights must be a non-empty array');
    }
    if (arr.length !== weights.length) {
      throw new RangeError('arr and weights must have same length');
    }
    if (!rng || typeof rng.nextFloat !== 'function') {
      throw new TypeError('rng must be an RNG instance');
    }
    
    let total = 0;
    for (let i = 0; i < weights.length; i++) {
      if (typeof weights[i] !== 'number') {
        throw new TypeError('All weights must be numbers');
      }
      total += weights[i];
    }
    
    if (total <= 0) {
      throw new RangeError('Weights must sum to positive value');
    }
   
   let rand = rng.nextFloat() * total;
   let cumsum = 0;
   
   for (let i = 0; i < arr.length; i++) {
     cumsum += weights[i];
     if (rand < cumsum) return arr[i];
   }
   
   return arr[arr.length - 1];
 };

export const weightedSample = (arr, weights, count, rng) => {
     if (!Array.isArray(arr) || arr.length === 0) {
       throw new RangeError('arr must be a non-empty array');
     }
     if (!Array.isArray(weights) || weights.length === 0) {
       throw new RangeError('weights must be a non-empty array');
     }
     if (arr.length !== weights.length) {
       throw new RangeError('arr and weights must have same length');
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
    
    const len = arr.length;
    if (count >= len) {
      return [...arr];
    }
    
    const remaining = [...arr];
    const remainingWeights = [...weights];
    const result = [];
    
    for (let i = 0; i < count; i++) {
      const idx = weightedPickIndexRange(remainingWeights, i, rng);
      result.push(remaining[i + idx]);
      
      const temp = remaining[i];
      remaining[i] = remaining[i + idx];
      remaining[i + idx] = temp;
      
      const tempW = remainingWeights[i];
      remainingWeights[i] = remainingWeights[i + idx];
      remainingWeights[i + idx] = tempW;
    }
    
    return result;
    };

    const weightedPickIndexRange = (weights, start, rng) => {
    let total = 0;
    for (let i = start; i < weights.length; i++) {
     total += weights[i];
    }
    let rand = rng.nextFloat() * total;
    for (let i = start; i < weights.length; i++) {
     rand -= weights[i];
     if (rand <= 0) return i - start;
    }
    return weights.length - start - 1;
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
