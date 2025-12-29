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
   if (typeof start !== 'number' || !Number.isInteger(start)) {
     throw new TypeError('start must be an integer');
   }
   if (start < 0) {
     throw new RangeError('start must be non-negative');
   }
   if (typeof length !== 'number' || !Number.isInteger(length)) {
     throw new TypeError('length must be an integer');
   }
   if (length <= 0) {
     throw new RangeError('length must be positive');
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
   if (typeof min !== 'number' || !Number.isInteger(min)) {
     throw new TypeError('min must be an integer');
   }
   if (min < 0) {
     throw new RangeError('min must be non-negative');
   }
   if (typeof max !== 'number' || !Number.isInteger(max)) {
     throw new TypeError('max must be an integer');
   }
   if (max <= min) {
     throw new RangeError('max must be greater than min');
   }
   const shift = BigInt(min);
   const mask = (BigInt(1) << BigInt(max - min)) - BigInt(1);
   return (val >> shift) & mask;
 };

 export const popcountNum = (val) => {
 if (typeof val !== 'number' || !Number.isInteger(val) || val < 0) {
   throw new TypeError('val must be a non-negative integer');
 }
 let count = 0;
 let v = val >>> 0;
 while (v) {
   count += v & 1;
   v >>>= 1;
 }
 return count;
 };

 export const clz = (val) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (val === 0n) return 64;
 let count = 0;
 let mask = 1n << 63n;
 while ((val & mask) === 0n) {
   count++;
   mask >>= 1n;
 }
 return count;
 };

 export const ctz = (val) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (val === 0n) return 64;
 let count = 0;
 let mask = 1n;
 while ((val & mask) === 0n) {
   count++;
   mask <<= 1n;
 }
 return count;
 };

 export const reverseBits = (val, width = 64) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (typeof width !== 'number' || !Number.isInteger(width) || width <= 0) {
   throw new TypeError('width must be a positive integer');
 }
 let result = 0n;
 for (let i = 0; i < width; i++) {
   result = (result << 1n) | ((val >> BigInt(i)) & 1n);
 }
 return result;
 };

 export const setBit = (val, pos) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (typeof pos !== 'number' || !Number.isInteger(pos) || pos < 0) {
   throw new TypeError('pos must be a non-negative integer');
 }
 return val | (1n << BigInt(pos));
 };

 export const clearBit = (val, pos) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (typeof pos !== 'number' || !Number.isInteger(pos) || pos < 0) {
   throw new TypeError('pos must be a non-negative integer');
 }
 return val & ~(1n << BigInt(pos));
 };

 export const toggleBit = (val, pos) => {
 if (typeof val !== 'bigint') {
   throw new TypeError('val must be bigint');
 }
 if (typeof pos !== 'number' || !Number.isInteger(pos) || pos < 0) {
   throw new TypeError('pos must be a non-negative integer');
 }
 return val ^ (1n << BigInt(pos));
 };
