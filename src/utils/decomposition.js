export function svd(A, maxIter = 100) {
  if (!Array.isArray(A) || A.length === 0) {
    throw new TypeError('A must be non-empty matrix');
  }

  const m = A.length;
  const n = A[0].length;
  const k = Math.min(m, n);

  const U = A.map(row => [...row]);
  const VT = new Array(n);
  for (let i = 0; i < n; i++) {
    VT[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      VT[i][j] = i === j ? 1 : 0;
    }
  }

  const S = new Array(k);
  for (let i = 0; i < k; i++) {
    S[i] = 1;
  }

  for (let iter = 0; iter < maxIter; iter++) {
    for (let i = 0; i < Math.min(m, n); i++) {
      for (let j = i + 1; j < Math.min(m, n); j++) {
        const x = new Array(m);
        const y = new Array(m);

        for (let p = 0; p < m; p++) {
          x[p] = U[p][i];
          y[p] = U[p][j];
        }

        const xNorm = Math.sqrt(x.reduce((a, b) => a + b * b, 0));
        const yNorm = Math.sqrt(y.reduce((a, b) => a + b * b, 0));
        const xy = x.reduce((a, b, p) => a + b * y[p], 0);

        if (xNorm < 1e-10 || yNorm < 1e-10 || Math.abs(xy) < 1e-10) continue;

        const cos = xy / (xNorm * yNorm);
        const angle = Math.acos(Math.min(1, Math.max(-1, cos)));
        const sin = Math.sin(angle);
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        for (let p = 0; p < m; p++) {
          const up_i = U[p][i];
          const up_j = U[p][j];
          U[p][i] = cosTheta * up_i + sinTheta * up_j;
          U[p][j] = -sinTheta * up_i + cosTheta * up_j;
        }
      }
    }
  }

  for (let i = 0; i < k; i++) {
    let colNorm = 0;
    for (let j = 0; j < m; j++) {
      colNorm += U[j][i] * U[j][i];
    }
    S[i] = Math.sqrt(colNorm);
  }

  return { U, S, VT };
}

export function qr(A) {
  if (!Array.isArray(A) || A.length === 0) {
    throw new TypeError('A must be non-empty matrix');
  }

  const m = A.length;
  const n = A[0].length;

  const Q = A.map(row => [...row]);
  const R = new Array(n);
  for (let i = 0; i < n; i++) {
    R[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      R[i][j] = 0;
    }
  }

  for (let j = 0; j < n; j++) {
    let normCol = 0;
    for (let i = 0; i < m; i++) {
      normCol += Q[i][j] * Q[i][j];
    }
    R[j][j] = Math.sqrt(normCol);

    if (R[j][j] > 1e-10) {
      for (let i = 0; i < m; i++) {
        Q[i][j] /= R[j][j];
      }
    }

    for (let k = j + 1; k < n; k++) {
      R[j][k] = 0;
      for (let i = 0; i < m; i++) {
        R[j][k] += Q[i][j] * A[i][k];
      }

      for (let i = 0; i < m; i++) {
        Q[i][k] -= R[j][k] * Q[i][j];
      }
    }
  }

  return { Q, R };
}

export function cholesky(A) {
  if (!Array.isArray(A) || A.length !== A[0].length) {
    throw new TypeError('A must be square matrix');
  }

  const n = A.length;
  const L = new Array(n);
  for (let i = 0; i < n; i++) {
    L[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      L[i][j] = 0;
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) {
        sum += L[i][k] * L[j][k];
      }

      if (i === j) {
        const val = A[i][i] - sum;
        if (val <= 0) {
          throw new RangeError('matrix must be positive definite');
        }
        L[i][j] = Math.sqrt(val);
      } else {
        L[i][j] = (A[i][j] - sum) / L[j][j];
      }
    }
  }

  return L;
}

export function lu(A) {
  if (!Array.isArray(A) || A.length !== A[0].length) {
    throw new TypeError('A must be square matrix');
  }

  const n = A.length;
  const LU = A.map(row => [...row]);
  const P = new Array(n);
  for (let i = 0; i < n; i++) {
    P[i] = i;
  }

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(LU[k][i]) > Math.abs(LU[maxRow][i])) {
        maxRow = k;
      }
    }

    [LU[i], LU[maxRow]] = [LU[maxRow], LU[i]];
    [P[i], P[maxRow]] = [P[maxRow], P[i]];

    if (Math.abs(LU[i][i]) < 1e-10) {
      throw new RangeError('matrix is singular');
    }

    for (let k = i + 1; k < n; k++) {
      LU[k][i] /= LU[i][i];
      for (let j = i + 1; j < n; j++) {
        LU[k][j] -= LU[k][i] * LU[i][j];
      }
    }
  }

  const L = new Array(n);
  const U = new Array(n);
  for (let i = 0; i < n; i++) {
    L[i] = new Array(n);
    U[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      if (j < i) {
        L[i][j] = LU[i][j];
        U[i][j] = 0;
      } else if (j === i) {
        L[i][j] = 1;
        U[i][j] = LU[i][j];
      } else {
        L[i][j] = 0;
        U[i][j] = LU[i][j];
      }
    }
  }

  return { L, U, P };
}
