export const saveState = (rng) => {
  const gen = rng.gen || rng;
  if (gen.state === undefined) {
    throw new Error('Generator does not support state snapshots');
  }
  return { state: gen.state };
};

export const restoreState = (rng, snapshot) => {
  const gen = rng.gen || rng;
  if (gen.state === undefined) {
    throw new Error('Generator does not support state snapshots');
  }
  gen.state = snapshot.state;
};

export const cloneGenerator = (rng) => {
   const isRNGWrapper = rng.gen !== undefined;
   const gen = isRNGWrapper ? rng.gen : rng;
   const Constructor = gen.constructor;
   
   let clonedGen;
   
   if (Constructor.name === 'PCG64') {
     clonedGen = new Constructor(gen.state, gen.inc);
   } else if (Constructor.name === 'Logistic') {
     clonedGen = new Constructor(gen.x, gen.r);
   } else if (Constructor.name === 'Tent') {
     clonedGen = new Constructor(gen.x, gen.mu);
   } else if (Constructor.name === 'Mixer') {
     const gen1 = gen.rng1.gen !== undefined ? gen.rng1.gen : gen.rng1;
     const gen2 = gen.rng2.gen !== undefined ? gen.rng2.gen : gen.rng2;
     const Constructor1 = gen1.constructor;
     const Constructor2 = gen2.constructor;
     let cloned1, cloned2;
     
     if (Constructor1.name === 'PCG64') {
       cloned1 = new Constructor1(gen1.state, gen1.inc);
     } else if (Constructor1.name === 'Logistic') {
       cloned1 = new Constructor1(gen1.x, gen1.r);
     } else if (Constructor1.name === 'Tent') {
       cloned1 = new Constructor1(gen1.x, gen1.mu);
     } else {
       cloned1 = new Constructor1(gen1.state);
     }
     
     if (Constructor2.name === 'PCG64') {
       cloned2 = new Constructor2(gen2.state, gen2.inc);
     } else if (Constructor2.name === 'Logistic') {
       cloned2 = new Constructor2(gen2.x, gen2.r);
     } else if (Constructor2.name === 'Tent') {
       cloned2 = new Constructor2(gen2.x, gen2.mu);
     } else {
       cloned2 = new Constructor2(gen2.state);
     }
     
     clonedGen = new Constructor(cloned1, cloned2);
   } else {
     clonedGen = new Constructor(gen.state);
   }
   
   return isRNGWrapper ? new (rng.constructor)(Constructor, gen.state) : clonedGen;
 };
