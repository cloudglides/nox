export function residualDiagnostics(model) {
  if (!model.residuals || !model.predictions) {
    throw new TypeError('model must have residuals and predictions');
  }

  const residuals = model.residuals;
  const predictions = model.predictions;
  const n = residuals.length;

  const mean = residuals.reduce((a, b) => a + b, 0) / n;
  let variance = 0;
  for (let i = 0; i < n; i++) {
    variance += (residuals[i] - mean) ** 2;
  }
  variance /= (n - 1);
  const stddev = Math.sqrt(variance);

  const standardized = residuals.map(r => r / stddev);

  const studentized = residuals.map((r, i) => {
    const leverage = 1 / n;
    const se = stddev * Math.sqrt(1 - leverage);
    return r / se;
  });

  const qqData = [...standardized].sort((a, b) => a - b);
  const qqTheoretical = new Array(n);
  for (let i = 0; i < n; i++) {
    const p = (i + 0.5) / n;
    qqTheoretical[i] = invNormal(p);
  }

  let correlation = 0;
  let sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    correlation += qqData[i] * qqTheoretical[i];
    sumX2 += qqData[i] * qqData[i];
    sumY2 += qqTheoretical[i] * qqTheoretical[i];
  }
  const qqCorr = correlation / Math.sqrt(sumX2 * sumY2);

  return {
    residuals,
    standardized,
    studentized,
    mean,
    variance,
    stddev,
    qqCorrelation: qqCorr,
    qqData,
    qqTheoretical
  };
}

export function leverageValues(X) {
  if (!Array.isArray(X) || X.length === 0) {
    throw new TypeError('X must be non-empty array');
  }

  const n = X.length;
  const p = Array.isArray(X[0]) ? X[0].length : 1;

  const Xmat = X.map(row => Array.isArray(row) ? [1, ...row] : [1, row]);
  const XtX = matmul(transpose(Xmat), Xmat);
  
  let invXtX;
  try {
    invXtX = matrixInverse(XtX);
  } catch {
    throw new RangeError('X matrix is singular');
  }

  const leverages = new Array(n);
  for (let i = 0; i < n; i++) {
    let leverage = 0;
    for (let j = 0; j <= p; j++) {
      for (let k = 0; k <= p; k++) {
        leverage += Xmat[i][j] * invXtX[j][k] * Xmat[i][k];
      }
    }
    leverages[i] = leverage;
  }

  return leverages;
}

export function cookDistance(residuals, predictions, leverage, n, p) {
  if (!Array.isArray(residuals) || !Array.isArray(predictions)) {
    throw new TypeError('residuals and predictions must be arrays');
  }

  const sigma2 = residuals.reduce((s, r) => s + r * r, 0) / (n - p - 1);
  const cooks = new Array(n);

  for (let i = 0; i < n; i++) {
    const lev = leverage[i];
    cooks[i] = (residuals[i] ** 2 / (sigma2 * (p + 1))) * (lev / (1 - lev));
  }

  return cooks;
}

export function durwinWatson(residuals) {
  if (!Array.isArray(residuals) || residuals.length < 2) {
    throw new TypeError('residuals must be array of length >= 2');
  }

  let numerator = 0;
  let denominator = 0;

  for (let i = 1; i < residuals.length; i++) {
    const diff = residuals[i] - residuals[i - 1];
    numerator += diff * diff;
  }

  for (let i = 0; i < residuals.length; i++) {
    denominator += residuals[i] * residuals[i];
  }

  return numerator / denominator;
}

export function vif(X) {
  if (!Array.isArray(X) || X.length === 0) {
    throw new TypeError('X must be non-empty array of features');
  }

  const n = X.length;
  const p = Array.isArray(X[0]) ? X[0].length : 1;
  const vifs = new Array(p);

  for (let j = 0; j < p; j++) {
    const y = X.map(row => Array.isArray(row) ? row[j] : row);
    const Xj = X.map((row, i) => {
      const features = Array.isArray(row) ? row : [row];
      return features.filter((_, k) => k !== j);
    });

    if (Xj[0].length === 0) {
      vifs[j] = 1;
      continue;
    }

    const r2 = computeR2(Xj, y);
    vifs[j] = 1 / (1 - r2);
  }

  return vifs;
}

function computeR2(X, y) {
  const n = X.length;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssTot += (y[i] - yMean) ** 2;
  }

  const Xmat = X.map(row => Array.isArray(row) ? [1, ...row] : [1, row]);
  const XtX = matmul(transpose(Xmat), Xmat);
  const Xty = matmul(transpose(Xmat), y.map(yi => [yi]));
  
  let beta;
  try {
    beta = solve(XtX, Xty).flat();
  } catch {
    return 0;
  }

  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    let pred = beta[0];
    for (let j = 1; j < beta.length; j++) {
      pred += beta[j] * (Array.isArray(X[i]) ? X[i][j - 1] : X[i]);
    }
    ssRes += (y[i] - pred) ** 2;
  }

  return 1 - (ssRes / ssTot);
}

function transpose(matrix) {
  const result = [];
  for (let j = 0; j < matrix[0].length; j++) {
    result[j] = [];
    for (let i = 0; i < matrix.length; i++) {
      result[j].push(matrix[i][j]);
    }
  }
  return result;
}

function matmul(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function solve(A, b) {
  const n = A.length;
  const aug = A.map((row, i) => [...row, b[i][0]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }

    [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

    if (Math.abs(aug[i][i]) < 1e-10) {
      throw new RangeError('matrix is singular');
    }

    for (let k = i + 1; k < n; k++) {
      const factor = aug[k][i] / aug[i][i];
      for (let j = i; j < n + 1; j++) {
        aug[k][j] -= factor * aug[i][j];
      }
    }
  }

  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j];
    }
    x[i] /= aug[i][i];
  }

  return x.map(xi => [xi]);
}

function matrixInverse(A) {
  const n = A.length;
  const aug = A.map((row, i) => {
    const augRow = [...row];
    for (let j = 0; j < n; j++) {
      augRow.push(i === j ? 1 : 0);
    }
    return augRow;
  });

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }

    [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

    const pivot = aug[i][i];
    for (let j = 0; j < 2 * n; j++) {
      aug[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = aug[i].slice(n);
  }
  return result;
}

function invNormal(p) {
  if (p <= 0.5) {
    const t = Math.sqrt(-2 * Math.log(p));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    return -(t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));
  } else {
    const t = Math.sqrt(-2 * Math.log(1 - p));
    const c0 = 2.515517;
    const c1 = 0.802853;
    const c2 = 0.010328;
    const d1 = 1.432788;
    const d2 = 0.189269;
    const d3 = 0.001308;
    return t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
  }
}
