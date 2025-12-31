export class LogisticRegression {
  constructor(X, y, learningRate = 0.01, iterations = 1000) {
    if (!Array.isArray(X) || !Array.isArray(y)) {
      throw new TypeError('X and y must be arrays');
    }
    if (X.length !== y.length || X.length < 2) {
      throw new RangeError('X and y must have same length >= 2');
    }
    if (!Array.isArray(X[0])) {
      throw new TypeError('X must be array of arrays (features)');
    }
    if (y.some(val => val !== 0 && val !== 1)) {
      throw new RangeError('y must contain only 0 and 1 (binary classification)');
    }

    const n = X.length;
    const p = X[0].length;

    this.coefficients = new Array(p + 1).fill(0);
    this.learningRate = learningRate;
    this.iterations = iterations;

    for (let iter = 0; iter < iterations; iter++) {
      const gradients = new Array(p + 1).fill(0);

      for (let i = 0; i < n; i++) {
        let z = this.coefficients[0];
        for (let j = 0; j < p; j++) {
          z += this.coefficients[j + 1] * X[i][j];
        }

        const sigmoid = 1 / (1 + Math.exp(-z));
        const error = sigmoid - y[i];

        gradients[0] += error;
        for (let j = 0; j < p; j++) {
          gradients[j + 1] += error * X[i][j];
        }
      }

      for (let j = 0; j < p + 1; j++) {
        this.coefficients[j] -= (learningRate / n) * gradients[j];
      }
    }

    this.intercept = this.coefficients[0];
  }

  predict(X) {
    if (typeof X[0] === 'number') {
      let z = this.intercept;
      for (let i = 0; i < X.length; i++) {
        z += this.coefficients[i + 1] * X[i];
      }
      return 1 / (1 + Math.exp(-z));
    }

    return X.map(row => {
      let z = this.intercept;
      for (let i = 0; i < row.length; i++) {
        z += this.coefficients[i + 1] * row[i];
      }
      return 1 / (1 + Math.exp(-z));
    });
  }

  predictClass(X, threshold = 0.5) {
    const probs = this.predict(X);
    if (Array.isArray(probs)) {
      return probs.map(p => p >= threshold ? 1 : 0);
    }
    return probs >= threshold ? 1 : 0;
  }

  evaluate(X, y) {
    if (X.length !== y.length) {
      throw new RangeError('X and y must have same length');
    }

    const predictions = this.predictClass(X);
    let correct = 0;

    for (let i = 0; i < y.length; i++) {
      if (predictions[i] === y[i]) {
        correct++;
      }
    }

    return correct / y.length;
  }
}
