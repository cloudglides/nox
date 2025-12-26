export const shuffle = (arr, rng, inPlace = false) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('First argument must be array');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('RNG instance required');
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
    throw new Error('Array cannot be empty');
  }
  if (!rng || typeof rng.nextInt !== 'function') {
    throw new TypeError('RNG instance required');
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
     throw new Error('Sample count must be positive');
   }
   if (count > arr.length) {
     throw new Error('Sample count exceeds array length');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('RNG instance required');
   }
   
   const copy = [...arr];
   const len = copy.length;
   for (let i = len - 1; i >= len - count; i--) {
     const j = rng.nextInt(i + 1);
     const temp = copy[i];
     copy[i] = copy[j];
     copy[j] = temp;
   }
   return copy.slice(len - count);
 };
