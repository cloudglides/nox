export const saveState = (rng) => {
   const gen = rng.gen || rng;
   if (gen.state === undefined) {
     throw new Error('Generator does not support state snapshots');
   }
   const state = gen.state;
   return {
     state: typeof state === 'bigint' ? state.toString() : state,
     isBigInt: typeof state === 'bigint'
   };
 };
 
 export const restoreState = (rng, snapshot) => {
   const gen = rng.gen || rng;
   if (gen.state === undefined) {
     throw new Error('Generator does not support state snapshots');
   }
   gen.state = snapshot.isBigInt ? BigInt(snapshot.state) : snapshot.state;
 };

export const cloneGenerator = (rng) => {
    const isRNGWrapper = rng.gen !== undefined;
    const gen = isRNGWrapper ? rng.gen : rng;
    const Constructor = gen.constructor;
    
    let clonedGen = Object.create(Constructor.prototype);
    
    if (Constructor.name === 'PCG64') {
      clonedGen.state = gen.state;
      clonedGen.inc = gen.inc;
    } else if (Constructor.name === 'Logistic') {
      clonedGen.x = gen.x;
      clonedGen.r = gen.r;
    } else if (Constructor.name === 'Tent') {
      clonedGen.x = gen.x;
      clonedGen.mu = gen.mu;
    } else if (Constructor.name === 'Xorshift64' || Constructor.name === 'Splitmix64' || Constructor.name === 'MT19937') {
      clonedGen.state = gen.state;
      if (Constructor.name === 'MT19937') {
        clonedGen.mt = [...gen.mt];
        clonedGen.mti = gen.mti;
      }
    } else if (Constructor.name === 'Mixer') {
      clonedGen.rng1 = cloneGenerator(gen.rng1);
      clonedGen.rng2 = cloneGenerator(gen.rng2);
    } else {
      clonedGen.state = gen.state;
    }
    
    return isRNGWrapper ? new (rng.constructor)(clonedGen) : clonedGen;
  };
