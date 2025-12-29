export function tTest(group1, group2, paired = false) {
  if (!Array.isArray(group1) || group1.length === 0) {
    throw new TypeError('group1 must be non-empty array');
  }
  if (!Array.isArray(group2) || group2.length === 0) {
    throw new TypeError('group2 must be non-empty array');
  }

  if (paired) {
    if (group1.length !== group2.length) {
      throw new RangeError('paired samples must have equal length');
    }

    const diff = new Array(group1.length);
    for (let i = 0; i < group1.length; i++) {
      diff[i] = group1[i] - group2[i];
    }

    const n = diff.length;
    const mean = diff.reduce((a, b) => a + b, 0) / n;
    let ss = 0;

    for (let i = 0; i < n; i++) {
      ss += (diff[i] - mean) ** 2;
    }

    const se = Math.sqrt(ss / (n * (n - 1)));
    const t = mean / se;

    return { t, df: n - 1, paired: true };
  }

  const n1 = group1.length;
  const n2 = group2.length;

  const mean1 = group1.reduce((a, b) => a + b, 0) / n1;
  const mean2 = group2.reduce((a, b) => a + b, 0) / n2;

  let var1 = 0, var2 = 0;
  for (let i = 0; i < n1; i++) {
    var1 += (group1[i] - mean1) ** 2;
  }
  for (let i = 0; i < n2; i++) {
    var2 += (group2[i] - mean2) ** 2;
  }

  var1 /= n1 - 1;
  var2 /= n2 - 1;

  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
  const t = (mean1 - mean2) / se;

  return { t, df: n1 + n2 - 2, meandiff: mean1 - mean2 };
}

export function welchTTest(group1, group2) {
  if (!Array.isArray(group1) || group1.length === 0) {
    throw new TypeError('group1 must be non-empty array');
  }
  if (!Array.isArray(group2) || group2.length === 0) {
    throw new TypeError('group2 must be non-empty array');
  }

  const n1 = group1.length;
  const n2 = group2.length;

  const mean1 = group1.reduce((a, b) => a + b, 0) / n1;
  const mean2 = group2.reduce((a, b) => a + b, 0) / n2;

  let var1 = 0, var2 = 0;
  for (let i = 0; i < n1; i++) {
    var1 += (group1[i] - mean1) ** 2;
  }
  for (let i = 0; i < n2; i++) {
    var2 += (group2[i] - mean2) ** 2;
  }

  var1 /= n1 - 1;
  var2 /= n2 - 1;

  const se = Math.sqrt(var1 / n1 + var2 / n2);
  const t = (mean1 - mean2) / se;

  const df = (var1 / n1 + var2 / n2) ** 2 / (
    (var1 / n1) ** 2 / (n1 - 1) + (var2 / n2) ** 2 / (n2 - 1)
  );

  return { t, df, meandiff: mean1 - mean2 };
}

export function mannWhitneyU(group1, group2) {
  if (!Array.isArray(group1) || group1.length === 0) {
    throw new TypeError('group1 must be non-empty array');
  }
  if (!Array.isArray(group2) || group2.length === 0) {
    throw new TypeError('group2 must be non-empty array');
  }

  const combined = [...group1.map((x, i) => [x, 0, i]), ...group2.map((x, i) => [x, 1, i])];
  combined.sort((a, b) => a[0] - b[0]);

  const ranks1 = new Array(group1.length);
  const ranks2 = new Array(group2.length);

  for (let i = 0; i < combined.length; i++) {
    if (combined[i][1] === 0) {
      ranks1[combined[i][2]] = i + 1;
    } else {
      ranks2[combined[i][2]] = i + 1;
    }
  }

  const r1 = ranks1.reduce((a, b) => a + b, 0);
  const n1 = group1.length;
  const n2 = group2.length;

  const u1 = n1 * n2 + (n1 * (n1 + 1)) / 2 - r1;
  const u2 = n1 * n2 - u1;

  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (Math.min(u1, u2) - mu) / sigma;

  return { U: Math.min(u1, u2), z, n1, n2 };
}

export function oneWayAnova(groups) {
  if (!Array.isArray(groups) || groups.length < 2) {
    throw new TypeError('groups must be array of at least 2 arrays');
  }

  let N = 0;
  const means = new Array(groups.length);

  for (let i = 0; i < groups.length; i++) {
    if (!Array.isArray(groups[i]) || groups[i].length === 0) {
      throw new TypeError('each group must be non-empty array');
    }
    means[i] = groups[i].reduce((a, b) => a + b, 0) / groups[i].length;
    N += groups[i].length;
  }

  const grandMean = groups.flat().reduce((a, b) => a + b, 0) / N;

  let ssB = 0;
  for (let i = 0; i < groups.length; i++) {
    ssB += groups[i].length * (means[i] - grandMean) ** 2;
  }

  let ssW = 0;
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      ssW += (groups[i][j] - means[i]) ** 2;
    }
  }

  const k = groups.length;
  const dfB = k - 1;
  const dfW = N - k;

  const msB = ssB / dfB;
  const msW = ssW / dfW;
  const f = msB / msW;

  return { f, dfB, dfW, ssB, ssW, msB, msW };
}
