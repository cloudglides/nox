export function bootstrap(r, data, n, statistic) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }
  if (typeof statistic !== 'function') {
    throw new TypeError('statistic must be a function');
  }

  const samples = new Array(n);
  const size = data.length;

  for (let i = 0; i < n; i++) {
    const resample = new Array(size);
    for (let j = 0; j < size; j++) {
      resample[j] = data[r.nextInt(size)];
    }
    samples[i] = statistic(resample);
  }

  return samples;
}

export function jackknife(data, statistic) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof statistic !== 'function') {
    throw new TypeError('statistic must be a function');
  }

  const n = data.length;
  const samples = new Array(n);

  for (let i = 0; i < n; i++) {
    const subset = data.slice(0, i).concat(data.slice(i + 1));
    samples[i] = statistic(subset);
  }

  return samples;
}

export function crossValidation(r, data, k, trainFn, testFn) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError('data must be a non-empty array');
  }
  if (typeof k !== 'number' || k < 2 || k !== Math.floor(k)) {
    throw new RangeError('k must be an integer >= 2');
  }
  if (typeof trainFn !== 'function' || typeof testFn !== 'function') {
    throw new TypeError('trainFn and testFn must be functions');
  }

  const n = data.length;
  const foldSize = Math.floor(n / k);
  const shuffled = [...data];
  
  for (let i = n - 1; i > 0; i--) {
    const j = r.nextInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const scores = new Array(k);

  for (let fold = 0; fold < k; fold++) {
    const start = fold * foldSize;
    const end = fold === k - 1 ? n : (fold + 1) * foldSize;
    
    const testSet = shuffled.slice(start, end);
    const trainSet = shuffled.slice(0, start).concat(shuffled.slice(end));
    
    const model = trainFn(trainSet);
    scores[fold] = testFn(model, testSet);
  }

  return scores;
}

export function permutationTest(r, data1, data2, testStatistic, n) {
  if (!Array.isArray(data1) || !Array.isArray(data2)) {
    throw new TypeError('data1 and data2 must be arrays');
  }
  if (typeof testStatistic !== 'function') {
    throw new TypeError('testStatistic must be a function');
  }
  if (typeof n !== 'number' || n < 1) {
    throw new RangeError('n must be a positive integer');
  }

  const observed = testStatistic(data1, data2);
  const combined = [...data1, ...data2];
  const n1 = data1.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = combined.length - 1; j > 0; j--) {
      const k = r.nextInt(j + 1);
      [combined[j], combined[k]] = [combined[k], combined[j]];
    }

    const perm1 = combined.slice(0, n1);
    const perm2 = combined.slice(n1);
    
    if (Math.abs(testStatistic(perm1, perm2)) >= Math.abs(observed)) {
      count++;
    }
  }

  return count / n;
}
