// Given a reaction and committed reactant amounts: returns the limiting
// reactant, extent (times the equation actually occurred), moles formed,
// and moles consumed. Left unrounded on purpose -- rounding here
// previously caused a float-precision bug. Display code formats with
// .toFixed(2); caller handles inventory/waste bookkeeping.
//
// percentYield (default 100) scales the ACTUAL extent below the
// theoretical maximum (still identified by the same limiting-reactant
// ratio). Below 100, every reactant -- including the limiting one --
// ends up with some committed-but-unconsumed amount, which is exactly
// what "waste" should mean when a reaction doesn't go to completion.

export function solveReaction(reaction, committed, percentYield = 100) {
  let limitingLetter = null;
  let theoreticalExtent = Infinity;

  reaction.reactants.forEach((r) => {
    const amount = committed[r.letter] || 0;
    const ratio = amount / r.coeff;
    if (ratio < theoreticalExtent) {
      theoreticalExtent = ratio;
      limitingLetter = r.letter;
    }
  });

  const extent = theoreticalExtent * (percentYield / 100);

  const formed = {};
  reaction.products.forEach((p) => {
    formed[p.letter] = extent * p.coeff;
  });

  const consumed = {};
  reaction.reactants.forEach((r) => {
    consumed[r.letter] = extent * r.coeff;
  });

  return { limitingLetter, formed, consumed, extent };
}