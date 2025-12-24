export const combinations = (arr, k) => {
  if (k > arr.length) return [];
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
  if (k > arr.length) return [];
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
  const indices = [];
  const n = arr.length;
  
  while (indices.length < k) {
    const idx = rng.nextInt(n);
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }
  
  return indices.sort((a, b) => a - b).map(i => arr[i]);
};

export const randomPermutation = (arr, rng) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
