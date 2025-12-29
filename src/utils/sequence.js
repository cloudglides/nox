export const shuffle = (arr, rng, inPlace = false) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('First argument must be array');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('Second argument must be RNG instance');
   }
   
   const target = inPlace ? arr : [...arr];
   const len = target.length;
   for (let i = len - 1; i > 0; i--) {
     const j = rng.nextInt(i + 1);
     if (i !== j) {
       const temp = target[i];
       target[i] = target[j];
       target[j] = temp;
     }
   }
   return target;
 };

export const pick = (arr, rng) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('First argument must be array');
   }
   if (arr.length === 0) {
     throw new RangeError('Array cannot be empty');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('Second argument must be RNG instance');
   }
   
   return arr[rng.nextInt(arr.length)];
 };

export const sample = (arr, count, rng) => {
      if (!Array.isArray(arr)) {
        throw new TypeError('First argument must be array');
      }
      if (typeof count !== 'number' || !Number.isInteger(count)) {
        throw new TypeError('Sample count must be an integer');
      }
      if (count <= 0) {
        throw new RangeError('Sample count must be positive');
      }
      if (count > arr.length) {
        throw new RangeError('Sample count exceeds array length');
      }
      if (!rng || typeof rng.nextInt !== 'function') {
        throw new TypeError('Second argument must be RNG instance');
      }
     
     const copy = [...arr];
     const len = copy.length;
     for (let i = len - 1; i > len - count - 1; i--) {
       const j = rng.nextInt(i + 1);
       const temp = copy[i];
       copy[i] = copy[j];
       copy[j] = temp;
     }
     return copy.slice(len - count);
   };

export const sampleWithReplacement = (arr, count, rng) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be array');
  }
  if (arr.length === 0) {
    throw new RangeError('Array cannot be empty');
  }
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    throw new TypeError('Sample count must be an integer');
  }
  if (count <= 0) {
    throw new RangeError('Sample count must be positive');
  }
  if (!rng || typeof rng.nextInt !== 'function') {
    throw new TypeError('rng must be an RNG instance');
  }

  const result = new Array(count);
  const len = arr.length;
  for (let i = 0; i < count; i++) {
    result[i] = arr[rng.nextInt(len)];
  }
  return result;
};

export const permute = (arr, rng) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be array');
  }
  if (!rng || typeof rng.nextInt !== 'function') {
    throw new TypeError('Second argument must be RNG instance');
  }
  return shuffle(arr, rng, false);
};

export const range = (start, end, step = 1) => {
  if (typeof start !== 'number' || !Number.isInteger(start)) {
    throw new TypeError('start must be an integer');
  }
  if (typeof end !== 'number' || !Number.isInteger(end)) {
    throw new TypeError('end must be an integer');
  }
  if (typeof step !== 'number' || !Number.isInteger(step)) {
    throw new TypeError('step must be an integer');
  }
  if (step === 0) {
    throw new RangeError('step cannot be zero');
  }

  const result = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  return result;
};

export const cycle = (arr, count) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('First argument must be array');
  }
  if (arr.length === 0) {
    throw new RangeError('Array cannot be empty');
  }
  if (typeof count !== 'number' || !Number.isInteger(count)) {
    throw new TypeError('count must be an integer');
  }
  if (count <= 0) {
    throw new RangeError('count must be positive');
  }

  const result = new Array(count);
  const len = arr.length;
  for (let i = 0; i < count; i++) {
    result[i] = arr[i % len];
  }
  return result;
};
