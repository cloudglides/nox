export const rotateBits = (val, shift) => {
  const mask = BigInt(64);
  shift = BigInt(shift) % mask;
  return (val << shift) | (val >> (mask - shift));
};

export const extractBits = (val, start, length) => {
  const mask = (BigInt(1) << BigInt(length)) - BigInt(1);
  return (val >> BigInt(start)) & mask;
};

export const hammingWeight = (val) => {
  let count = 0;
  while (val > 0n) {
    count += val & 1n ? 1 : 0;
    val >>= 1n;
  }
  return count;
};

export const bitRange = (val, min, max) => {
  const shift = BigInt(min);
  const mask = (BigInt(1) << BigInt(max - min)) - BigInt(1);
  return (val >> shift) & mask;
};
