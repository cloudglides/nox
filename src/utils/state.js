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
    const rng1Clone = cloneGenerator(gen.rng1);
    const rng2Clone = cloneGenerator(gen.rng2);
    clonedGen = new Constructor(rng1Clone, rng2Clone);
  } else {
    clonedGen = new Constructor(gen.state);
  }
  
  return isRNGWrapper ? new (rng.constructor)(Constructor, gen.state) : clonedGen;
};
