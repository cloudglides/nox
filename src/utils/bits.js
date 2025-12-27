export const rotateBits = (val, shift) => {
   if (typeof val !== 'bigint') {
     throw new TypeError('val must be bigint');
   }
   if (typeof shift !== 'number' && typeof shift !== 'bigint') {
     throw new TypeError('shift must be number or bigint');
   }
   const mask = BigInt(64);
   shift = BigInt(shift) % mask;
   return (val << shift) | (val >> (mask - shift));
 };
 
 export const extractBits = (val, start, length) => {
   if (typeof val !== 'bigint') {
     throw new TypeError('val must be bigint');
   }
   if (typeof start !== 'number' || !Number.isInteger(start) || start < 0) {
     throw new Error('start must be non-negative integer');
   }
   if (typeof length !== 'number' || !Number.isInteger(length) || length <= 0) {
     throw new Error('length must be positive integer');
   }
   const mask = (BigInt(1) << BigInt(length)) - BigInt(1);
   return (val >> BigInt(start)) & mask;
 };
 
 export const hammingWeight = (val) => {
   if (typeof val !== 'bigint') {
     throw new TypeError('val must be bigint');
   }
   let count = 0;
   let v = val < 0n ? -val : val;
   while (v > 0n) {
     v = v & (v - 1n);
     count++;
   }
   return count;
 };
 
 export const bitRange = (val, min, max) => {
   if (typeof val !== 'bigint') {
     throw new TypeError('val must be bigint');
   }
   if (typeof min !== 'number' || !Number.isInteger(min) || min < 0) {
     throw new Error('min must be non-negative integer');
   }
   if (typeof max !== 'number' || !Number.isInteger(max) || max <= min) {
     throw new Error('max must be greater than min');
   }
   const shift = BigInt(min);
   const mask = (BigInt(1) << BigInt(max - min)) - BigInt(1);
   return (val >> shift) & mask;
 };
