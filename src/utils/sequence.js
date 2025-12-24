export const shuffle = (arr, rng) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const pick = (arr, rng) => {
  return arr[rng.nextInt(arr.length)];
};

export const sample = (arr, count, rng) => {
  const copy = shuffle(arr, rng);
  return copy.slice(0, count);
};
