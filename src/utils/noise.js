const permutation = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
  247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
  74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,206,39,223,202,148,35,158,236,156,67,126,65,
  189,238,72,108,248,191,227,21,205,45,94,2,32,230,239,210,246,24,97,78,101,40,71,224,255,200,167,21,213,2,223,166,
  205,57,130,180,51,108,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,
  143,146,157,41,244,8,51,153,78,130,83,142,46,168,134,55,63,160,166,56,172,85,24,254,192,221,100,73,32,163,244,236,
  37,46,28,141,149,34,69,193,70,199,154,159,147,12,130,199,10,154,27,112,44,135,58,137,73,109,35,199,17,92,107,203,
  190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,41,51,51,51,51
];

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t, a, b) => a + t * (b - a);
const grad = (hash, x, y) => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 8 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

export const perlin2D = (rng, x, y, octaves = 1) => {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new TypeError('x and y must be numbers');
    }
    if (typeof octaves !== 'number' || !Number.isInteger(octaves)) {
      throw new TypeError('octaves must be an integer');
    }
    if (octaves <= 0) {
      throw new RangeError('octaves must be positive');
    }
   let value = 0;
   let amplitude = 1;
   let frequency = 1;
   let maxValue = 0;

   for (let i = 0; i < octaves; i++) {
    const xi = Math.floor((x * frequency) % 256);
    const yi = Math.floor((y * frequency) % 256);

    const xf = (x * frequency) - Math.floor(x * frequency);
    const yf = (y * frequency) - Math.floor(y * frequency);

    const u = fade(xf);
    const v = fade(yf);

    const p0 = permutation[xi];
    const p1 = permutation[(xi + 1) & 255];

    const g00 = grad(permutation[(p0 + yi) & 255], xf, yf);
    const g10 = grad(permutation[(p1 + yi) & 255], xf - 1, yf);
    const g01 = grad(permutation[(p0 + yi + 1) & 255], xf, yf - 1);
    const g11 = grad(permutation[(p1 + yi + 1) & 255], xf - 1, yf - 1);

    const nx0 = lerp(u, g00, g10);
    const nx1 = lerp(u, g01, g11);
    const nxy = lerp(v, nx0, nx1);

    value += nxy * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
};

export const valueNoise = (rng, x, y, scale = 1) => {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new TypeError('x and y must be numbers');
    }
    if (typeof scale !== 'number') {
      throw new TypeError('scale must be a number');
    }
    if (scale <= 0) {
      throw new RangeError('scale must be positive');
    }
   const sx = Math.floor(x * scale);
   const sy = Math.floor(y * scale);

  const n00 = Math.sin(sx * 12.9898 + sy * 78.233) * 43758.5453;
  const n10 = Math.sin((sx + 1) * 12.9898 + sy * 78.233) * 43758.5453;
  const n01 = Math.sin(sx * 12.9898 + (sy + 1) * 78.233) * 43758.5453;
  const n11 = Math.sin((sx + 1) * 12.9898 + (sy + 1) * 78.233) * 43758.5453;

  const fx = x * scale - sx;
  const fy = y * scale - sy;

  const u = fade(fx);
  const v = fade(fy);

  const nx0 = lerp(u, n00 - Math.floor(n00), n10 - Math.floor(n10));
  const nx1 = lerp(u, n01 - Math.floor(n01), n11 - Math.floor(n11));

  return lerp(v, nx0, nx1);
};
