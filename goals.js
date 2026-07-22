// All goal definitions live here -- the 3 common goals every student
// competes on, and the pool of hidden quests they pick from at the
// start. This is the one place to edit what the goals are and what they
// pay; student.html just displays whatever's here.
//
// getValue(stats) returns a student's current progress number, shown
// plainly -- no progress bar, just the number as it stands.
//
// Every species a student has ever produced is tracked in one map:
// stats.totalProducedBySpecies['X'] is the running total for species X.
// producedOf(letter) hands back a ready-to-use getValue function for any
// letter, returning 0 for a species nobody's made yet rather than
// erroring -- e.g. getValue: producedOf('M').
//
// COMMON GOALS are a class-wide leaderboard: whoever's ranked 1st/2nd/3rd
// across the WHOLE CLASS at the end gets that placement's reward.
//
// HIDDEN QUESTS have no fixed target. A student picks one at the start,
// and earns `reward` only if BOTH are true at the end: (a) they picked
// THIS quest, and (b) they are currently the class record holder for it
// (i.e. the best in the whole class at that metric, ties included). A
// student who's objectively best at something but picked a different
// quest gets nothing for it; a student who picked this quest but isn't
// the class's best at it also gets nothing. This is what recordKey is
// for -- it points at the /classRecords entry that decides who's
// currently "best in class" for that quest.
//
// Add, remove, or edit quests here; nothing else in the game needs to
// change when you do.

export function producedOf(letter) {
  return (s) => (s.totalProducedBySpecies && s.totalProducedBySpecies[letter]) || 0;
}

// The species tracked by the "most produced" common goal below.
export const COMMON_GOAL_SPECIES = 'Y';

// Common goals: the same 3 for every student, ranked at the end of the
// session. Edit reward amounts (or add more goals) freely -- each needs
// a rewards.first/second/third in heat.
export const COMMON_GOALS = [
  {
    id: 'mostProduced',
    label: 'Most ' + COMMON_GOAL_SPECIES + ' produced',
    getValue: producedOf(COMMON_GOAL_SPECIES),
    rewards: { first: 500, second: 300, third: 100 }
  },
  {
    id: 'leastWaste',
    label: 'Least wasted',
    getValue: (s) => s.totalWasted || 0,
    rewards: { first: 500, second: 300, third: 100 }
  },
  {
    id: 'bigProducer',
    label: 'Biggest single-run yield (any species)',
    getValue: (s) => s.bestSingleRunYield || 0,
    rewards: { first: 500, second: 300, third: 100 }
  }
];

// Hidden quests: each student is offered 2 random options at the start
// and picks one. It stays visible to them (not a surprise reveal) but is
// never shown to other students or the class display. Repeats between
// different students are fine -- if two students both pick the same
// quest, only whichever of them is actually the class's best at it (per
// recordKey) is eligible to earn the reward.
export const HIDDEN_GOALS = [
  { id: 'bonusMaster', label: 'Bonus questions answered correctly', getValue: (s) => s.bonusCorrectCount || 0, reward: 200, recordKey: 'bonusMaster' },
  { id: 'bigSeller', label: 'Heat earned from selling', getValue: (s) => s.totalSoldRevenue || 0, reward: 200, recordKey: 'bigSeller' },
  { id: 'produceM', label: 'Most M produced', getValue: producedOf('M'), reward: 200, recordKey: 'species_M' }
];