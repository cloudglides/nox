export const seedFromTime = () => {
   const time = BigInt(Date.now());
   const rand = BigInt(Math.floor(Math.random() * 1000000));
   return (time << 20n) | rand;
 };

export const seedFromEntropy = (entropy) => {
  if (typeof entropy !== 'string') throw new TypeError('Entropy must be string');
  if (entropy.length === 0) throw new Error('Entropy cannot be empty');
  
  let hash = 5381n;
  for (let i = 0; i < entropy.length; i++) {
    hash = ((hash << 5n) + hash) ^ BigInt(entropy.charCodeAt(i));
  }
  return hash % (1n << 32n);
};
