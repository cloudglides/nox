export const categorical = (rng, categories, probabilities) => {
  if (probabilities.length !== categories.length) {
    throw new Error('Probabilities and categories must have same length');
  }

  const total = probabilities.reduce((a, b) => a + b, 0);
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
  const rows = matrix.length;
  const cols = matrix[0].length;

  const total = matrix.flat().reduce((a, b) => a + b, 0);
  let rand = rng.nextFloat() * total;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rand -= matrix[i][j];
      if (rand <= 0) {
        return [i, j];
      }
    }
  }

  return [rows - 1, cols - 1];
};
