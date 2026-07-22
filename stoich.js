// Given a reaction and committed reactant amounts: returns the limiting
// reactant, extent (times the equation occurred), moles formed, and
// moles consumed. Left unrounded on purpose -- rounding here previously
// caused a float-precision bug. Display code formats with .toFixed(2);
// caller handles inventory/waste bookkeeping, this file is just the math.

export function solveReaction(reaction, committed) {
  let limitingLetter = null;
  let minRatio = Infinity;

  reaction.reactants.forEach((r) => {
    const amount = committed[r.letter] || 0;
    const ratio = amount / r.coeff;
    if (ratio < minRatio) {
      minRatio = ratio;
      limitingLetter = r.letter;
    }
  });

  const formed = {};
  reaction.products.forEach((p) => {
    formed[p.letter] = minRatio * p.coeff;
  });

  const consumed = {};
  reaction.reactants.forEach((r) => {
    consumed[r.letter] = minRatio * r.coeff;
  });

  return { limitingLetter, formed, consumed, extent: minRatio };
}