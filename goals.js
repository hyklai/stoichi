// Goal + reward definitions. Edit rewards or add goals/quests here --
// nothing else needs to change.
//
// Common goals: class-wide leaderboard, top 3 paid out at session end.
// Hidden quests: pick one at start; earns reward only if you're both the
// one who picked it AND the current class-record holder for it
// (recordKey points at the matching /classRecords entry).
// producedOf(letter): shortcut getValue for "most of this species made".

export function producedOf(letter) {
  return (s) => (s.totalProducedBySpecies && s.totalProducedBySpecies[letter]) || 0;
}

export const COMMON_GOAL_SPECIES = 'Y';

export const COMMON_GOALS = [
  { id: 'mostProduced', label: 'Most ' + COMMON_GOAL_SPECIES + ' produced', getValue: producedOf(COMMON_GOAL_SPECIES), rewards: { first: 500, second: 300, third: 100 } },
  { id: 'leastWaste', label: 'Least wasted', getValue: (s) => s.totalWasted || 0, rewards: { first: 500, second: 300, third: 100 } },
  { id: 'bigProducer', label: 'Biggest single-run yield (any species)', getValue: (s) => s.bestSingleRunYield || 0, rewards: { first: 500, second: 300, third: 100 } }
];

export const HIDDEN_GOALS = [
  { id: 'bonusMaster', label: 'Bonus questions answered correctly', getValue: (s) => s.bonusCorrectCount || 0, reward: 200, recordKey: 'bonusMaster' },
  { id: 'bigSeller', label: 'Heat earned from selling', getValue: (s) => s.totalSoldRevenue || 0, reward: 200, recordKey: 'bigSeller' },
  { id: 'produceM', label: 'Most M produced', getValue: producedOf('M'), reward: 200, recordKey: 'species_M' }
];