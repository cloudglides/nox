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
  const clone = new Constructor();
  if (rng.state !== undefined) {
    clone.state = rng.state;
  }
  if (rng.r !== undefined) {
    clone.r = rng.r;
  }
  if (rng.mu !== undefined) {
    clone.mu = rng.mu;
  }
  if (rng.x !== undefined) {
    clone.x = rng.x;
  }
  if (rng.inc !== undefined) {
    clone.inc = rng.inc;
  }
  return clone;
};
