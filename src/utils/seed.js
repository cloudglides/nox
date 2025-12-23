export const seedFromTime = () => {
  return BigInt(Date.now() + Math.random() * 1000000);
};

export const seedFromEntropy = (entropy) => {
  let hash = 5381n;
  for (let i = 0; i < entropy.length; i++) {
    hash = ((hash << 5n) + hash) ^ BigInt(entropy.charCodeAt(i));
  }
  return hash >>> 0n;
};
