export const categorical = (rng, categories, probabilities) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (!categories || !probabilities) throw new Error('Categories and probabilities required');
   if (categories.length === 0) throw new Error('Categories cannot be empty');
   if (probabilities.length !== categories.length) {
     throw new Error('Probabilities and categories must have same length');
   }

   const total = probabilities.reduce((a, b) => a + b, 0);
   if (total <= 0) throw new Error('Probabilities must sum to positive value');
  
  const normalized = probabilities.map(p => p / total);

  let cumsum = 0;
  const cumulative = normalized.map(p => (cumsum += p));

  const rand = rng.nextFloat();
  for (let i = 0; i < cumulative.length; i++) {
    if (rand <= cumulative[i]) {
      return categories[i];
    }
  }

  return categories[categories.length - 1];
};

export const multinomial = (rng, n, categories, probabilities) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (typeof n !== 'number' || !Number.isInteger(n) || n <= 0) {
     throw new Error('n must be positive integer');
   }
   const result = {};
   for (const cat of categories) {
     result[cat] = 0;
   }

   for (let i = 0; i < n; i++) {
     const pick = categorical(rng, categories, probabilities);
     result[pick]++;
   }

   return result;
 };

export const categorical2D = (rng, matrix) => {
   if (!rng || typeof rng.nextFloat !== 'function') {
     throw new TypeError('First argument must be RNG instance');
   }
   if (!Array.isArray(matrix) || matrix.length === 0) {
     throw new TypeError('matrix must be non-empty array');
   }
   const rows = matrix.length;
   const cols = matrix[0].length;

   const flat = matrix.flat();
   const total = flat.reduce((a, b) => a + b, 0);
   if (total <= 0) throw new Error('Matrix values must sum to positive');
   
   let cumsum = 0;
   const rand = rng.nextFloat() * total;

   for (let idx = 0; idx < flat.length; idx++) {
     cumsum += flat[idx];
     if (rand < cumsum) {
       return [Math.floor(idx / cols), idx % cols];
     }
   }

   return [rows - 1, cols - 1];
 };
