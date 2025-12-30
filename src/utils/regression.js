export class LinearRegression {
  constructor(x, y) {
    if (!Array.isArray(x) || !Array.isArray(y)) {
      throw new TypeError('x and y must be arrays');
    }
    if (x.length !== y.length || x.length < 2) {
      throw new RangeError('x and y must have same length >= 2');
    }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    this.slope = (sumXY - n * meanX * meanY) / (sumX2 - n * meanX * meanX);
    this.intercept = meanY - this.slope * meanX;

    const yPred = x.map(xi => this.slope * xi + this.intercept);
    
    let ssRes = 0, ssTot = 0;
    for (let i = 0; i < n; i++) {
      ssRes += (y[i] - yPred[i]) ** 2;
      ssTot += (y[i] - meanY) ** 2;
    }

    this.rSquared = 1 - ssRes / ssTot;
    this.rmse = Math.sqrt(ssRes / n);
    this.residuals = y.map((yi, i) => yi - yPred[i]);
    this.predictions = yPred;
  }

  predict(x) {
    if (typeof x === 'number') {
      return this.slope * x + this.intercept;
    }
    if (Array.isArray(x)) {
      return x.map(xi => this.slope * xi + this.intercept);
    }
    throw new TypeError('x must be number or array');
  }
}

export class MultipleRegression {
  constructor(X, y) {
    if (!Array.isArray(X) || !Array.isArray(y)) {
      throw new TypeError('X and y must be arrays');
    }
    if (X.length !== y.length || X.length < 2) {
      throw new RangeError('X and y must have same length >= 2');
    }
    if (!Array.isArray(X[0])) {
      throw new TypeError('X must be array of arrays (features)');
    }

    const n = X.length;
    const p = X[0].length;

    const matX = X.map(row => [1, ...row]);
    
    const XtX = matmul(transpose(matX), matX);
    const Xty = matmul(transpose(matX), y.map(yi => [yi]));

    this.coefficients = solve(XtX, Xty).flat();
    this.intercept = this.coefficients[0];

    const yPred = X.map((row, i) => {
      let pred = this.intercept;
      for (let j = 0; j < p; j++) {
        pred += this.coefficients[j + 1] * row[j];
      }
      return pred;
    });

    const meanY = y.reduce((a, b) => a + b, 0) / n;
    let ssRes = 0, ssTot = 0;

    for (let i = 0; i < n; i++) {
      ssRes += (y[i] - yPred[i]) ** 2;
      ssTot += (y[i] - meanY) ** 2;
    }

    this.rSquared = 1 - ssRes / ssTot;
    this.adjRSquared = 1 - (1 - this.rSquared) * (n - 1) / (n - p - 1);
    this.rmse = Math.sqrt(ssRes / n);
    this.predictions = yPred;
    this.residuals = y.map((yi, i) => yi - yPred[i]);
  }

  predict(X) {
    if (typeof X[0] === 'number') {
      let pred = this.intercept;
      for (let i = 0; i < X.length; i++) {
        pred += this.coefficients[i + 1] * X[i];
      }
      return pred;
    }

    return X.map(row => {
      let pred = this.intercept;
      for (let i = 0; i < row.length; i++) {
        pred += this.coefficients[i + 1] * row[i];
      }
      return pred;
    });
  }
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
