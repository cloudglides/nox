export function stratifiedSample(r, data, strata, n) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof strata !== 'function') {
    throw new TypeError('strata must be a function that returns stratum key');
  }
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const groups = new Map();
  
  for (let i = 0; i < data.length; i++) {
    const key = strata(data[i]);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(data[i]);
  }

  const result = [];
  const groupCount = groups.size;
  const samplesPerGroup = Math.floor(n / groupCount);
  let remaining = n - samplesPerGroup * groupCount;

  for (const [key, group] of groups) {
    const k = samplesPerGroup + (remaining > 0 ? 1 : 0);
    if (remaining > 0) remaining--;

    if (k >= group.length) {
      result.push(...group);
    } else {
      for (let i = 0; i < k; i++) {
        const idx = r.nextInt(group.length);
        result.push(group[idx]);
        group[idx] = group[group.length - 1];
        group.pop();
      }
    }
  }

  return result;
}

export function stratifiedSampleProportional(r, data, strata, n) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof strata !== 'function') {
    throw new TypeError('strata must be a function');
  }
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const groups = new Map();
  
  for (let i = 0; i < data.length; i++) {
    const key = strata(data[i]);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(data[i]);
  }

  const result = [];
  const total = data.length;

  for (const [key, group] of groups) {
    const k = Math.round(n * group.length / total);
    
    if (k >= group.length) {
      result.push(...group);
    } else if (k > 0) {
      const copy = [...group];
      for (let i = 0; i < k; i++) {
        const idx = r.nextInt(copy.length);
        result.push(copy[idx]);
        copy[idx] = copy[copy.length - 1];
        copy.pop();
      }
    }
  }

  return result;
}

export function stratify(data, strata) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof strata !== 'function') {
    throw new TypeError('strata must be a function');
  }

  const groups = new Map();
  
  for (let i = 0; i < data.length; i++) {
    const key = strata(data[i]);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(data[i]);
  }

  return Object.fromEntries(groups);
}
