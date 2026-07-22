// Reactions use plain letters instead of real chemical formulas, so the
// game stays focused on stoichiometry math rather than recognizing real
// compounds.
//
// "products" is always a list (1 or 2 entries) so the same shape covers
// all three reaction types:
//   synthesis:     2 reactants -> 1 product   (Reaction 1)
//   decomposition: 1 reactant  -> 2 products   (Reaction 2)
//   replacement:   2 reactants -> 2 products   (Reaction 3)
//
// PRICES is one flat table, used for BOTH buying and selling any letter.
// Each reaction is calibrated per "extent" (one full run of the equation
// as written) so that selling all the product recovers 80% of what the
// reactants cost, running pays 10% as heat immediately, and the optional
// bonus question pays the last 10%.

export const PRICES = {
  K: 47, P:45, U: 46, V:43,
  C: 60, D: 50, G: 110, I: 65, L: 85, N:68, Q: 64, S: 130,
  A: 200, B: 200, H: 165, M: 150, R: 136, W: 214, X: 145, Y: 160,
  E: 480, F: 420, J: 372, O: 310, T: 410
};

export const REACTIONS = [
  {
    id: 'r1',
    name: 'Reaction 1.1',
    type: 'decomposition',
    reactants: [
      { letter: 'A', coeff: 1 }
    ],
    products: [
      { letter: 'C', coeff: 1 },
      { letter: 'D', coeff: 2 }
    ],
    heatPerExtent: PRICES.A * 0.9 - (PRICES.C + (PRICES.D * 2)),
    bonusPerExtent: PRICES.A * 0.1
  },
  {
    id: 'r2',
    name: 'Reaction 1.2',
    type: 'synthesis',
    reactants: [
      { letter: 'A', coeff: 2 },
      { letter: 'B', coeff: 1 }
    ],
    products: [
      { letter: 'E', coeff: 1 }
    ],
    heatPerExtent: (PRICES.A * 2 + PRICES.B) * 0.9 - PRICES.E,
    bonusPerExtent: (PRICES.A * 2 + PRICES.B) * 0.1
  },
  {
    id: 'r3',
    name: 'Reaction 1.3',
    type: 'replacement',
    reactants: [
      { letter: 'A', coeff: 1 },
      { letter: 'B', coeff: 3 }
    ],
    products: [
      { letter: 'F', coeff: 1 },
      { letter: 'G', coeff: 2 }
    ],
    heatPerExtent: (PRICES.A + (PRICES.B * 3)) * 0.9 - (PRICES.F + (PRICES.G * 2)),
    bonusPerExtent: (PRICES.A + (PRICES.B * 3)) * 0.1
  },
  {
    id: 'r4',
    name: 'Reaction 1.4',
    type: 'replacement',
    reactants: [
      { letter: 'A', coeff: 1 },
      { letter: 'B', coeff: 2 }
    ],
    products: [
      { letter: 'H', coeff: 2 },
      { letter: 'M', coeff: 1 }
    ],
    heatPerExtent: (PRICES.A + (PRICES.B * 2)) * 0.9 - ((PRICES.H * 2) + PRICES.M),
    bonusPerExtent: (PRICES.A + (PRICES.B * 2)) * 0.1
  },
  {
    id: 'r5',
    name: 'Reaction 1.5',
    type: 'decomposition',
    reactants: [
      { letter: 'B', coeff: 2 }
    ],
    products: [
      { letter: 'I', coeff: 1 },
      { letter: 'L', coeff: 3 }
    ],
    heatPerExtent: (PRICES.B * 2) * 0.9 - (PRICES.I + (PRICES.L * 3)),
    bonusPerExtent: (PRICES.B * 2) * 0.1
  },
  {
    id: 'r6',
    name: 'Reaction 2.1',
    type: 'synthesis',
    reactants: [
      { letter: 'C', coeff: 2 },
      { letter: 'D', coeff: 1 }
    ],
    products: [
      { letter: 'R', coeff: 1 }
    ],
    heatPerExtent: (PRICES.C * 2 + PRICES.D) * 0.9 - PRICES.R,
    bonusPerExtent: (PRICES.C * 2 + PRICES.D) * 0.1
  },
  {
    id: 'r7',
    name: 'Reaction 2.2',
    type: 'replacement',
    reactants: [
      { letter: 'G', coeff: 1 },
      { letter: 'I', coeff: 2 }
    ],
    products: [
      { letter: 'X', coeff: 1 },
      { letter: 'K', coeff: 1 }
    ],
    heatPerExtent: (PRICES.G + (PRICES.I * 2)) * 0.9 - (PRICES.X + PRICES.K),
    bonusPerExtent: (PRICES.G + (PRICES.I * 2)) * 0.1
  },
  {
    id: 'r8',
    name: 'Reaction 2.3',
    type: 'decomposition',
    reactants: [
      { letter: 'L', coeff: 2 }
    ],
    products: [
      { letter: 'P', coeff: 2 },
      { letter: 'U', coeff: 1 }
    ],
    heatPerExtent: (PRICES.L * 2) * 0.9 - (PRICES.P * 2 + PRICES.U),
    bonusPerExtent: (PRICES.L * 2) * 0.1
  },
  {
    id: 'r9',
    name: 'Reaction 2.4',
    type: 'replacement',
    reactants: [
      { letter: 'E', coeff: 1 },
      { letter: 'D', coeff: 3 }
    ],
    products: [
      { letter: 'W', coeff: 1 },
      { letter: 'X', coeff: 2 }
    ],
    heatPerExtent: (PRICES.E + (PRICES.D * 3)) * 0.9 - (PRICES.W + (PRICES.X * 2)),
    bonusPerExtent: (PRICES.E + (PRICES.D * 3)) * 0.1
  },
  {
    id: 'r10',
    name: 'Reaction 2.5',
    type: 'synthesis',
    reactants: [
      { letter: 'H', coeff: 1 },
      { letter: 'M', coeff: 2 }
    ],
    products: [
      { letter: 'J', coeff: 1 }
    ],
    heatPerExtent: (PRICES.H + (PRICES.M * 2)) * 0.9 - PRICES.J,
    bonusPerExtent: (PRICES.H + (PRICES.M * 2)) * 0.1
  },
  {
    id: 'r11',
    name: 'Reaction 2.6',
    type: 'replacement',
    reactants: [
      { letter: 'F', coeff: 1 },
      { letter: 'E', coeff: 1 }
    ],
    products: [
      { letter: 'O', coeff: 1 },
      { letter: 'T', coeff: 1 }
    ],
    heatPerExtent: (PRICES.F + PRICES.E) * 0.9 - (PRICES.O + PRICES.T),
    bonusPerExtent: (PRICES.F + PRICES.E) * 0.1
  },
  {
    id: 'r12',
    name: 'Reaction 2.7',
    type: 'decomposition',
    reactants: [
      { letter: 'H', coeff: 1 }
    ],
    products: [
      { letter: 'N', coeff: 1 },
      { letter: 'Q', coeff: 1 }
    ],
    heatPerExtent: PRICES.H * 0.9 - (PRICES.N + PRICES.Q),
    bonusPerExtent: PRICES.H * 0.1
  },
  {
    id: 'r13',
    name: 'Reaction 2.8',
    type: 'replacement',
    reactants: [
      { letter: 'M', coeff: 1 },
      { letter: 'A', coeff: 2 }
    ],
    products: [
      { letter: 'O', coeff: 1 },
      { letter: 'S', coeff: 1 }
    ],
    heatPerExtent: (PRICES.M + (PRICES.A * 2)) * 0.9 - (PRICES.O + PRICES.S),
    bonusPerExtent: (PRICES.M + (PRICES.A * 2)) * 0.1
  },
  {
    id: 'r14',
    name: 'Reaction 2.9',
    type: 'decomposition',
    reactants: [
      { letter: 'G', coeff: 1 }
    ],
    products: [
      { letter: 'V', coeff: 1 },
      { letter: 'P', coeff: 1 }
    ],
    heatPerExtent: (PRICES.G) * 0.9 - (PRICES.V + PRICES.P),
    bonusPerExtent: (PRICES.G) * 0.1
  },
  {
    id: 'r15',
    name: 'Reaction 3.1',
    type: 'synthesis',
    reactants: [
      { letter: 'N', coeff: 2 },
      { letter: 'Q', coeff: 1 }
    ],
    products: [
      { letter: 'Y', coeff: 1 }
    ],
    heatPerExtent: (PRICES.N * 2 + PRICES.Q) * 0.9 - PRICES.Y,
    bonusPerExtent: (PRICES.N * 2 + PRICES.Q) * 0.1
  },
  {
    id: 'r16',
    name: 'Reaction 3.2',
    type: 'decomposition',
    reactants: [
      { letter: 'J', coeff: 1 }
    ],
    products: [
      { letter: 'Y', coeff: 1 },
      { letter: 'R', coeff: 1 }
    ],
    heatPerExtent: (PRICES.J) * 0.9 - (PRICES.Y + PRICES.R),
    bonusPerExtent: (PRICES.J) * 0.1
  },
  {
    id: 'r17',
    name: 'Reaction 3.3',
    type: 'replacement',
    reactants: [
      { letter: 'O', coeff: 1 },
      { letter: 'N', coeff: 3 }
    ],
    products: [
      { letter: 'Y', coeff: 1 },
      { letter: 'W', coeff: 1 }
    ],
    heatPerExtent: (PRICES.O + (PRICES.N * 3)) * 0.9 - (PRICES.Y + PRICES.W),
    bonusPerExtent: (PRICES.O + (PRICES.N * 3)) * 0.1
  },
  {
    id: 'r18',
    name: 'Reaction 3.4',
    type: 'replacement',
    reactants: [
      { letter: 'X', coeff: 2 },
      { letter: 'W', coeff: 1 }
    ],
    products: [
      { letter: 'Y', coeff: 1 },
      { letter: 'H', coeff: 1 }
    ],
    heatPerExtent: (PRICES.X * 2 + PRICES.W) * 0.9 - (PRICES.Y + PRICES.H),
    bonusPerExtent: (PRICES.X * 2 + PRICES.W) * 0.1
  },
  {
    id: 'r19',
    name: 'Reaction 3.5',
    type: 'decomposition',
    reactants: [
      { letter: 'T', coeff: 1 }
    ],
    products: [
      { letter: 'Y', coeff: 1 },
      { letter: 'M', coeff: 1 }
    ],
    heatPerExtent: (PRICES.T) * 0.9 - (PRICES.Y + PRICES.M),
    bonusPerExtent: (PRICES.T) * 0.1
  }
];

export function equationString(reaction) {
  const reactantsStr = reaction.reactants
    .map((r) => (r.coeff === 1 ? '' : r.coeff) + r.letter)
    .join(' + ');
  const productsStr = reaction.products
    .map((p) => (p.coeff === 1 ? '' : p.coeff) + p.letter)
    .join(' + ');
  return reactantsStr + ' → ' + productsStr;
}
 
export function findReactionById(id) {
  return REACTIONS.find((r) => r.id === id) || null;
}