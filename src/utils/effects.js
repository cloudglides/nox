export function cohensD(group1, group2) {
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

  const pooledStd = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));

  return (mean1 - mean2) / pooledStd;
}

export function hedgesG(group1, group2) {
  const d = cohensD(group1, group2);
  const n1 = group1.length;
  const n2 = group2.length;
  const n = n1 + n2;
  const correction = 1 - (3 / (4 * n - 9));

  return d * correction;
}

export function correlation(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y)) {
    throw new TypeError('x and y must be arrays');
  }
  if (x.length !== y.length || x.length === 0) {
    throw new RangeError('x and y must have same non-zero length');
  }

  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    sumXY += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }

  return sumXY / Math.sqrt(sumX2 * sumY2);
}

export function cramersV(contingencyTable) {
  if (!Array.isArray(contingencyTable) || contingencyTable.length === 0) {
    throw new TypeError('contingencyTable must be non-empty array');
  }

  const rows = contingencyTable.length;
  const cols = contingencyTable[0].length;

  let n = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (typeof contingencyTable[i][j] !== 'number') {
        throw new TypeError('all table entries must be numbers');
      }
      n += contingencyTable[i][j];
    }
  }

  let chi2 = 0;
  const rowTotals = new Array(rows);
  const colTotals = new Array(cols);

  for (let i = 0; i < rows; i++) {
    rowTotals[i] = 0;
    for (let j = 0; j < cols; j++) {
      rowTotals[i] += contingencyTable[i][j];
    }
  }

  for (let j = 0; j < cols; j++) {
    colTotals[j] = 0;
    for (let i = 0; i < rows; i++) {
      colTotals[j] += contingencyTable[i][j];
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const expected = (rowTotals[i] * colTotals[j]) / n;
      const diff = contingencyTable[i][j] - expected;
      chi2 += (diff * diff) / expected;
    }
  }

  const minDim = Math.min(rows, cols) - 1;
  return Math.sqrt(chi2 / (n * minDim));
}

export function etaSquared(groups) {
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new TypeError('groups must be non-empty array of arrays');
  }

  let totalN = 0;
  const groupMeans = new Array(groups.length);
  const groupSizes = new Array(groups.length);

  for (let i = 0; i < groups.length; i++) {
    if (!Array.isArray(groups[i])) {
      throw new TypeError('each group must be an array');
    }
    groupSizes[i] = groups[i].length;
    totalN += groupSizes[i];
    groupMeans[i] = groups[i].reduce((a, b) => a + b, 0) / groupSizes[i];
  }

  const grandMean = groups.flat().reduce((a, b) => a + b, 0) / totalN;

  let ssB = 0;
  for (let i = 0; i < groups.length; i++) {
    ssB += groupSizes[i] * (groupMeans[i] - grandMean) ** 2;
  }

  let ssT = 0;
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      ssT += (groups[i][j] - grandMean) ** 2;
    }
  }

  return ssB / ssT;
}

export function glasssDelta(control, treatment, pooledStd = null) {
  if (!Array.isArray(control) || control.length === 0) {
    throw new TypeError('control must be non-empty array');
  }
  if (!Array.isArray(treatment) || treatment.length === 0) {
    throw new TypeError('treatment must be non-empty array');
  }

  const meanControl = control.reduce((a, b) => a + b, 0) / control.length;
  const meanTreatment = treatment.reduce((a, b) => a + b, 0) / treatment.length;

  let std = pooledStd;

  if (std === null) {
    let varControl = 0;
    for (let i = 0; i < control.length; i++) {
      varControl += (control[i] - meanControl) ** 2;
    }
    varControl /= control.length - 1;
    std = Math.sqrt(varControl);
  }

  return (meanTreatment - meanControl) / std;
}
