export function matrixAdd(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new TypeError('A and B must be matrices');
  }
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new RangeError('matrices must have same dimensions');
  }

  const result = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    result[i] = new Array(A[0].length);
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  return result;
}

export function matrixSub(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new TypeError('A and B must be matrices');
  }
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new RangeError('matrices must have same dimensions');
  }

  const result = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    result[i] = new Array(A[0].length);
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] - B[i][j];
    }
  }
  return result;
}

export function matrixMul(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new TypeError('A and B must be matrices');
  }
  if (A[0].length !== B.length) {
    throw new RangeError('incompatible dimensions for multiplication');
  }

  const result = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    result[i] = new Array(B[0].length);
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < B.length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function elementwiseMul(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    throw new TypeError('A and B must be matrices');
  }
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new RangeError('matrices must have same dimensions');
  }

  const result = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    result[i] = new Array(A[0].length);
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] * B[i][j];
    }
  }
  return result;
}

export function scalarMul(scalar, A) {
  if (typeof scalar !== 'number') {
    throw new TypeError('scalar must be number');
  }
  if (!Array.isArray(A)) {
    throw new TypeError('A must be matrix');
  }

  const result = new Array(A.length);
  for (let i = 0; i < A.length; i++) {
    result[i] = new Array(A[0].length);
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = scalar * A[i][j];
    }
  }
  return result;
}

export function transpose(A) {
  if (!Array.isArray(A) || A.length === 0) {
    throw new TypeError('A must be non-empty matrix');
  }

  const result = new Array(A[0].length);
  for (let j = 0; j < A[0].length; j++) {
    result[j] = new Array(A.length);
    for (let i = 0; i < A.length; i++) {
      result[j][i] = A[i][j];
    }
  }
  return result;
}

export function determinant(A) {
  if (!Array.isArray(A) || A.length !== A[0].length) {
    throw new TypeError('A must be square matrix');
  }

  const n = A.length;
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];

  const M = A.map(row => [...row]);
  let det = 1;

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(M[maxRow][i]) < 1e-10) {
      return 0;
    }

    if (maxRow !== i) {
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      det *= -1;
    }

    det *= M[i][i];

    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j < n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  return det;
}

export function trace(A) {
  if (!Array.isArray(A) || A.length !== A[0].length) {
    throw new TypeError('A must be square matrix');
  }

  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    sum += A[i][i];
  }
  return sum;
}

export function norm(A, type = 'frobenius') {
  if (!Array.isArray(A)) {
    throw new TypeError('A must be matrix');
  }

  if (type === 'frobenius') {
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[0].length; j++) {
        sum += A[i][j] * A[i][j];
      }
    }
    return Math.sqrt(sum);
  }

  if (type === 'spectral') {
    let maxNorm = 0;
    for (let j = 0; j < A[0].length; j++) {
      let colSum = 0;
      for (let i = 0; i < A.length; i++) {
        colSum += Math.abs(A[i][j]);
      }
      maxNorm = Math.max(maxNorm, colSum);
    }
    return maxNorm;
  }

  throw new RangeError('unknown norm type');
}

export function inverse(A) {
  if (!Array.isArray(A) || A.length !== A[0].length) {
    throw new TypeError('A must be square matrix');
  }

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

    if (Math.abs(aug[maxRow][i]) < 1e-10) {
      throw new RangeError('matrix is singular');
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
