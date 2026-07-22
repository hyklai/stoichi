// Given a reaction and the amounts of each reactant a student has chosen
// to COMMIT to this run, work out:
//  - which reactant is limiting (undefined/meaningless for a 1-reactant
//    decomposition -- callers should treat it as trivial in that case)
//  - extent: how many times the equation as written actually occurred
//  - formed: moles of EACH product formed (a map, since a reaction can
//    have 1 or 2 products now)
//  - consumed: moles of EACH reactant actually consumed (a map)
//
// Left at full precision on purpose -- no rounding. Display code handles
// formatting to 2 decimals with .toFixed(2).
//
// Whatever was committed but not consumed is waste -- the caller is
// responsible for subtracting the full committed amount from inventory
// and tracking committed-minus-consumed as wasted.

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