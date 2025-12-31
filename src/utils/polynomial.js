export class PolynomialRegression {
  constructor(x, y, degree = 2) {
    if (!Array.isArray(x) || !Array.isArray(y)) {
      throw new TypeError('x and y must be arrays');
    }
    if (x.length !== y.length || x.length < 2) {
      throw new RangeError('x and y must have same length >= 2');
    }
    if (typeof degree !== 'number' || degree < 1) {
      throw new RangeError('degree must be positive integer');
    }
    if (x.length <= degree) {
      throw new RangeError('need at least degree+1 data points');
    }

    const n = x.length;
    this.degree = degree;

    const X = x.map(xi => {
      const row = [1];
      for (let d = 1; d <= degree; d++) {
        row.push(Math.pow(xi, d));
      }
      return row;
    });

    const XtX = matmul(transpose(X), X);
    const Xty = matmul(transpose(X), y.map(yi => [yi]));

    this.coefficients = solve(XtX, Xty).flat();

    const yPred = x.map(xi => {
      let pred = this.coefficients[0];
      for (let d = 1; d <= degree; d++) {
        pred += this.coefficients[d] * Math.pow(xi, d);
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
    this.adjRSquared = 1 - (1 - this.rSquared) * (n - 1) / (n - degree - 1);
    this.rmse = Math.sqrt(ssRes / n);
    this.predictions = yPred;
    this.residuals = y.map((yi, i) => yi - yPred[i]);
  }

  predict(x) {
    if (typeof x === 'number') {
      let pred = this.coefficients[0];
      for (let d = 1; d <= this.degree; d++) {
        pred += this.coefficients[d] * Math.pow(x, d);
      }
      return pred;
    }

    if (Array.isArray(x)) {
      return x.map(xi => {
        let pred = this.coefficients[0];
        for (let d = 1; d <= this.degree; d++) {
          pred += this.coefficients[d] * Math.pow(xi, d);
        }
        return pred;
      });
    }

    throw new TypeError('x must be number or array');
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
