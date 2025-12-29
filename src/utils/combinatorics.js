export const combinations = (arr, k) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('arr must be an array');
   }
   if (typeof k !== 'number' || !Number.isInteger(k)) {
     throw new TypeError('k must be an integer');
   }
   if (k <= 0) {
     throw new RangeError('k must be positive');
   }
   if (k > arr.length) {
     throw new RangeError('k cannot exceed array length');
   }

   if (k === 1) return arr.map(x => [x]);
   if (k === arr.length) return [arr];

   const result = [];
   const combine = (start, current) => {
     if (current.length === k) {
       result.push([...current]);
       return;
     }
     for (let i = start; i < arr.length; i++) {
       current.push(arr[i]);
       combine(i + 1, current);
       current.pop();
     }
   };

   combine(0, []);
   return result;
 };

export const permutations = (arr) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('arr must be an array');
   }
   if (arr.length <= 1) return [arr];

   const result = [];
   const permute = (arr, start) => {
     if (start === arr.length - 1) {
       result.push([...arr]);
       return;
     }
     for (let i = start; i < arr.length; i++) {
       [arr[start], arr[i]] = [arr[i], arr[start]];
       permute(arr, start + 1);
       [arr[start], arr[i]] = [arr[i], arr[start]];
     }
   };

   permute([...arr], 0);
   return result;
 };

export const kPermutations = (arr, k) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('arr must be an array');
   }
   if (typeof k !== 'number' || !Number.isInteger(k)) {
     throw new TypeError('k must be an integer');
   }
   if (k <= 0) {
     throw new RangeError('k must be positive');
   }
   if (k > arr.length) {
     throw new RangeError('k cannot exceed array length');
   }
   if (k === 1) return arr.map(x => [x]);

   const result = [];
   const perm = (available, current) => {
     if (current.length === k) {
       result.push([...current]);
       return;
     }
     for (let i = 0; i < available.length; i++) {
       const item = available[i];
       const remaining = available.slice(0, i).concat(available.slice(i + 1));
       perm(remaining, [...current, item]);
     }
   };

   perm(arr, []);
   return result;
 };

export const randomCombination = (arr, k, rng) => {
    if (!Array.isArray(arr)) {
      throw new TypeError('arr must be an array');
    }
    if (typeof k !== 'number' || !Number.isInteger(k)) {
      throw new TypeError('k must be an integer');
    }
    if (k <= 0) {
      throw new RangeError('k must be positive');
    }
    if (k > arr.length) {
      throw new RangeError('k cannot exceed array length');
    }
    if (!rng || typeof rng.nextInt !== 'function') {
      throw new TypeError('rng must be an RNG instance');
    }
   const indices = new Set();
   const n = arr.length;
   
   while (indices.size < k) {
     indices.add(rng.nextInt(n));
   }
   
   return Array.from(indices).sort((a, b) => a - b).map(i => arr[i]);
 };

export const randomPermutation = (arr, rng) => {
   if (!Array.isArray(arr)) {
     throw new TypeError('arr must be array');
   }
   if (!rng || typeof rng.nextInt !== 'function') {
     throw new TypeError('rng must be an RNG instance');
   }
   const copy = [...arr];
   for (let i = copy.length - 1; i > 0; i--) {
     const j = rng.nextInt(i + 1);
     [copy[i], copy[j]] = [copy[j], copy[i]];
   }
   return copy;
 };
