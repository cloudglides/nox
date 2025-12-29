export function sum(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be array');
  }
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

export function mean(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new TypeError('arr must be non-empty array');
  }
  return sum(arr) / arr.length;
}

export function min(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new TypeError('arr must be non-empty array');
  }
  let minVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minVal) minVal = arr[i];
  }
  return minVal;
}

export function max(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new TypeError('arr must be non-empty array');
  }
  let maxVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) maxVal = arr[i];
  }
  return maxVal;
}

export function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be array');
  }
  const seen = new Set();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}

export function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be array');
  }
  if (typeof size !== 'number' || size < 1) {
    throw new RangeError('size must be positive integer');
  }

  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function flatten(arr, depth = Infinity) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be array');
  }
  if (typeof depth !== 'number' || depth < 0) {
    throw new RangeError('depth must be non-negative number');
  }

  if (depth === 0) return arr;

  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i]) && depth > 0) {
      result.push(...flatten(arr[i], depth - 1));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

export function zip(...arrays) {
  if (arrays.length === 0) {
    throw new TypeError('at least one array required');
  }

  for (let i = 0; i < arrays.length; i++) {
    if (!Array.isArray(arrays[i])) {
      throw new TypeError(`argument ${i} must be array`);
    }
  }

  const minLen = Math.min(...arrays.map(a => a.length));
  const result = new Array(minLen);

  for (let i = 0; i < minLen; i++) {
    result[i] = arrays.map(a => a[i]);
  }
  return result;
}

export function transpose(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new TypeError('matrix must be non-empty 2D array');
  }

  const cols = matrix[0].length;
  const result = new Array(cols);

  for (let j = 0; j < cols; j++) {
    result[j] = new Array(matrix.length);
    for (let i = 0; i < matrix.length; i++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

export function partition(arr, predicate) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr must be array');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be function');
  }

  const truthy = [];
  const falsy = [];

  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      truthy.push(arr[i]);
    } else {
      falsy.push(arr[i]);
    }
  }

  return [truthy, falsy];
}
