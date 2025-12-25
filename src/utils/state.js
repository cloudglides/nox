export const saveState = (rng) => {
  if (rng.state === undefined) {
    throw new Error('Generator does not support state snapshots');
  }
  return { state: rng.state };
};

export const restoreState = (rng, snapshot) => {
  if (rng.state === undefined) {
    throw new Error('Generator does not support state snapshots');
  }
  rng.state = snapshot.state;
};

export const cloneGenerator = (rng) => {
  const Constructor = rng.constructor;
  
  if (rng.constructor.name === 'PCG64') {
    const clone = new Constructor(rng.state, rng.inc);
    return clone;
  }
  
  if (rng.constructor.name === 'Logistic') {
    const clone = new Constructor(rng.x, rng.r);
    return clone;
  }
  
  if (rng.constructor.name === 'Tent') {
    const clone = new Constructor(rng.x, rng.mu);
    return clone;
  }
  
  if (rng.constructor.name === 'Mixer') {
    const rng1Clone = cloneGenerator(rng.rng1);
    const rng2Clone = cloneGenerator(rng.rng2);
    return new Constructor(rng1Clone, rng2Clone);
  }
  
  const clone = new Constructor(rng.state);
  return clone;
};
