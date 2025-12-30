export function eulerMethod(dydt, y0, t0, tf, h) {
  if (typeof dydt !== 'function') {
    throw new TypeError('dydt must be function');
  }
  if (typeof y0 !== 'number' || typeof t0 !== 'number' || typeof tf !== 'number') {
    throw new TypeError('y0, t0, tf must be numbers');
  }
  if (typeof h !== 'number' || h <= 0) {
    throw new RangeError('step size h must be positive');
  }

  const t = [];
  const y = [];
  let tCurrent = t0;
  let yCurrent = y0;

  while (tCurrent <= tf) {
    t.push(tCurrent);
    y.push(yCurrent);
    yCurrent += h * dydt(tCurrent, yCurrent);
    tCurrent += h;
  }

  return { t, y };
}

export function rk4(dydt, y0, t0, tf, h) {
  if (typeof dydt !== 'function') {
    throw new TypeError('dydt must be function');
  }
  if (typeof y0 !== 'number' || typeof t0 !== 'number' || typeof tf !== 'number') {
    throw new TypeError('y0, t0, tf must be numbers');
  }
  if (typeof h !== 'number' || h <= 0) {
    throw new RangeError('step size h must be positive');
  }

  const t = [];
  const y = [];
  let tCurrent = t0;
  let yCurrent = y0;

  while (tCurrent <= tf) {
    t.push(tCurrent);
    y.push(yCurrent);

    const k1 = dydt(tCurrent, yCurrent);
    const k2 = dydt(tCurrent + h / 2, yCurrent + (h / 2) * k1);
    const k3 = dydt(tCurrent + h / 2, yCurrent + (h / 2) * k2);
    const k4 = dydt(tCurrent + h, yCurrent + h * k3);

    yCurrent += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    tCurrent += h;
  }

  return { t, y };
}

export function systemEuler(dydt, y0, t0, tf, h) {
  if (typeof dydt !== 'function') {
    throw new TypeError('dydt must be function');
  }
  if (!Array.isArray(y0)) {
    throw new TypeError('y0 must be array');
  }
  if (typeof t0 !== 'number' || typeof tf !== 'number') {
    throw new TypeError('t0, tf must be numbers');
  }
  if (typeof h !== 'number' || h <= 0) {
    throw new RangeError('step size h must be positive');
  }

  const t = [];
  const y = [];
  let tCurrent = t0;
  let yCurrent = [...y0];

  while (tCurrent <= tf) {
    t.push(tCurrent);
    y.push([...yCurrent]);

    const dydt_val = dydt(tCurrent, yCurrent);
    for (let i = 0; i < yCurrent.length; i++) {
      yCurrent[i] += h * dydt_val[i];
    }
    tCurrent += h;
  }

  return { t, y };
}

export function systemRK4(dydt, y0, t0, tf, h) {
  if (typeof dydt !== 'function') {
    throw new TypeError('dydt must be function');
  }
  if (!Array.isArray(y0)) {
    throw new TypeError('y0 must be array');
  }
  if (typeof t0 !== 'number' || typeof tf !== 'number') {
    throw new TypeError('t0, tf must be numbers');
  }
  if (typeof h !== 'number' || h <= 0) {
    throw new RangeError('step size h must be positive');
  }

  const t = [];
  const y = [];
  let tCurrent = t0;
  let yCurrent = [...y0];

  while (tCurrent <= tf) {
    t.push(tCurrent);
    y.push([...yCurrent]);

    const k1 = dydt(tCurrent, yCurrent);
    const y_k2 = yCurrent.map((yi, i) => yi + (h / 2) * k1[i]);
    const k2 = dydt(tCurrent + h / 2, y_k2);
    const y_k3 = yCurrent.map((yi, i) => yi + (h / 2) * k2[i]);
    const k3 = dydt(tCurrent + h / 2, y_k3);
    const y_k4 = yCurrent.map((yi, i) => yi + h * k3[i]);
    const k4 = dydt(tCurrent + h, y_k4);

    for (let i = 0; i < yCurrent.length; i++) {
      yCurrent[i] += (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
    tCurrent += h;
  }

  return { t, y };
}

export function rk45Adaptive(dydt, y0, t0, tf, tol = 1e-6, hmax = (tf - t0) / 10, hmin = 1e-8) {
  if (typeof dydt !== 'function') {
    throw new TypeError('dydt must be function');
  }
  if (typeof y0 !== 'number') {
    throw new TypeError('y0 must be number');
  }

  const t = [t0];
  const y = [y0];
  let tCurrent = t0;
  let yCurrent = y0;
  let h = hmax;

  while (tCurrent < tf) {
    if (tCurrent + h > tf) {
      h = tf - tCurrent;
    }

    const k1 = dydt(tCurrent, yCurrent);
    const k2 = dydt(tCurrent + h / 4, yCurrent + (h / 4) * k1);
    const k3 = dydt(tCurrent + 3 * h / 8, yCurrent + (3 * h / 32) * k1 + (9 * h / 32) * k2);
    const k4 = dydt(tCurrent + 12 * h / 13, yCurrent + (1932 * h / 2197) * k1 - (7200 * h / 2197) * k2 + (7296 * h / 2197) * k3);
    const k5 = dydt(tCurrent + h, yCurrent + (439 * h / 216) * k1 - 8 * h * k2 + (3680 * h / 513) * k3 - (845 * h / 4104) * k4);
    const k6 = dydt(tCurrent + h / 2, yCurrent - (8 * h / 27) * k1 + 2 * h * k2 - (3544 * h / 2565) * k3 + (1859 * h / 4104) * k4 - (11 * h / 40) * k5);

    const y4 = yCurrent + (25 * h / 216) * k1 + (1408 * h / 2565) * k3 + (2197 * h / 4104) * k4 - (h / 5) * k5;
    const y5 = yCurrent + (16 * h / 135) * k1 + (6656 * h / 12825) * k3 + (28561 * h / 56430) * k4 - (9 * h / 50) * k5 + (2 * h / 55) * k6;

    const error = Math.abs(y5 - y4);
    const hNew = h * Math.pow(tol / error, 0.2);

    if (error <= tol) {
      tCurrent += h;
      yCurrent = y5;
      t.push(tCurrent);
      y.push(yCurrent);
      h = Math.min(Math.max(hNew, hmin), hmax);
    } else {
      h = Math.max(hNew, hmin);
    }
  }

  return { t, y };
}
