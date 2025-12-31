export class KMeans {
  constructor(k, maxIter = 100, tol = 1e-6) {
    if (typeof k !== 'number' || k < 1) {
      throw new RangeError('k must be positive integer');
    }
    if (typeof maxIter !== 'number' || maxIter < 1) {
      throw new RangeError('maxIter must be positive integer');
    }

    this.k = k;
    this.maxIter = maxIter;
    this.tol = tol;
    this.centroids = null;
    this.labels = null;
    this.inertia = null;
  }

  fit(X) {
    if (!Array.isArray(X) || X.length === 0) {
      throw new TypeError('X must be non-empty array');
    }
    if (!Array.isArray(X[0]) || X[0].length === 0) {
      throw new TypeError('X must be array of numeric arrays');
    }

    const n = X.length;
    const d = X[0].length;

    if (this.k > n) {
      throw new RangeError('k cannot exceed number of samples');
    }

    this.centroids = this._initializeCentroids(X);
    let prevInertia = Infinity;

    for (let iter = 0; iter < this.maxIter; iter++) {
      this.labels = this._assignClusters(X);
      const newCentroids = this._updateCentroids(X);
      
      this.inertia = this._calculateInertia(X);

      if (Math.abs(prevInertia - this.inertia) < this.tol) {
        break;
      }

      prevInertia = this.inertia;
      this.centroids = newCentroids;
    }

    return this;
  }

  predict(X) {
    if (this.centroids === null) {
      throw new Error('Model not fitted. Call fit() first.');
    }
    if (!Array.isArray(X) || X.length === 0) {
      throw new TypeError('X must be non-empty array');
    }

    return this._assignClusters(X);
  }

  _initializeCentroids(X) {
    const indices = new Set();
    while (indices.size < this.k) {
      indices.add(Math.floor(Math.random() * X.length));
    }

    return Array.from(indices).map(i => [...X[i]]);
  }

  _assignClusters(X) {
    const labels = new Array(X.length);

    for (let i = 0; i < X.length; i++) {
      let minDist = Infinity;
      let bestCluster = 0;

      for (let j = 0; j < this.k; j++) {
        const dist = this._euclideanDistance(X[i], this.centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = j;
        }
      }

      labels[i] = bestCluster;
    }

    return labels;
  }

  _updateCentroids(X) {
    const newCentroids = [];
    const d = X[0].length;

    for (let j = 0; j < this.k; j++) {
      const clusterPoints = [];

      for (let i = 0; i < X.length; i++) {
        if (this.labels[i] === j) {
          clusterPoints.push(X[i]);
        }
      }

      if (clusterPoints.length === 0) {
        newCentroids.push([...this.centroids[j]]);
      } else {
        const centroid = new Array(d).fill(0);
        for (let dim = 0; dim < d; dim++) {
          let sum = 0;
          for (let point of clusterPoints) {
            sum += point[dim];
          }
          centroid[dim] = sum / clusterPoints.length;
        }
        newCentroids.push(centroid);
      }
    }

    return newCentroids;
  }

  _euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  }

  _calculateInertia(X) {
    let inertia = 0;

    for (let i = 0; i < X.length; i++) {
      const dist = this._euclideanDistance(X[i], this.centroids[this.labels[i]]);
      inertia += dist * dist;
    }

    return inertia;
  }
}
