// Goal + reward definitions. Edit reward proportions or add goals/quests
// here -- nothing else needs to change.
//
// Common goals: class-wide leaderboard, top 3 paid out at session end.
// Hidden quests: pick one at start; earns reward only if you're both the
// one who picked it AND the current class-record holder for it
// (recordKey points at the matching /classRecords entry).
// producedOf(letter): shortcut getValue for "most of this species made".
//
// Rewards are stored as PROPORTIONS of starting heat, not flat numbers --
// since starting heat is teacher-configurable (a class running Mass Mode
// might reasonably set it much higher, given per-unit prices are smaller
// by the gram than by the mole), a flat reward would feel disproportionate
// depending on that setting. computeReward(proportion, startingHeat) is
// what turns a proportion into an actual number; every consumer (teacher
// End Session payout, teacher Records tab, student Goals tab, the shared
// display) calls this at the point of use rather than reading a fixed
// number, so the whole reward structure scales automatically with
// whatever starting heat is currently configured.

export function computeReward(proportion, startingHeat) {
  return Math.round(proportion * startingHeat);
}

export function producedOf(letter) {
  return (s) => (s.totalProducedBySpecies && s.totalProducedBySpecies[letter]) || 0;
}

// The species tracked by the "most produced" common goal below.
export const COMMON_GOAL_SPECIES = 'Y';

// Common goals: the same 3 for every student, ranked at the end of the
// session. rewardProportions are fractions of starting heat.
// Reward proportions here were chosen by simulating a realistic 19-student
// classroom (a spread of struggling/average/skilled players, PLUS an
// explicit "does nothing at all" student) across many trials, not
// guessed. Two things came out of that:
//   1. Skilled players sweep mostProduced entirely in every trial (0%
//      placement rate for average students) -- so its size mainly
//      rewards genuine top-end skill, which is the intent.
//   2. bigProducer is the only common goal an average student has any
//      real shot at (~4% placement rate vs 0% for mostProduced), so it's
//      weighted above where a strict difficulty-only ranking would put it.
//   3. leastWaste is trivially won by doing nothing (zero waste is
//      unbeatable except by ties with equally inactive students), so its
//      reward is pushed as low as this system reasonably allows.
// Even at these numbers, a genuinely zero-effort student still lands
// slightly ahead of a realistically-competent "doing fine, not perfect"
// student in simulation (~2010 vs ~1890 starting from 2000) -- doing
// nothing has zero variance, while real participation always carries
// some risk even played reasonably well. Reward scaling alone can
// compress that gap a lot (it went from ~600 to ~120 in testing) but
// can't fully erase it without changing what leastWaste measures, which
// was intentionally kept as a simple total.
export const COMMON_GOALS = [
  {
    id: 'mostProduced',
    label: 'Most ' + COMMON_GOAL_SPECIES + ' produced',
    getValue: producedOf(COMMON_GOAL_SPECIES),
    rewardProportions: { first: 0.60, second: 0.40, third: 0.20 }
  },
  {
    id: 'leastWaste',
    label: 'Least wasted',
    getValue: (s) => s.totalWasted || 0,
    rewardProportions: { first: 0.02, second: 0.01, third: 0.005 }
  },
  {
    id: 'bigProducer',
    label: 'Biggest single-run yield (any species)',
    getValue: (s) => s.bestSingleRunYield || 0,
    rewardProportions: { first: 0.35, second: 0.21, third: 0.10 }
  }
];

// Hidden quests: each student is offered 2 random options at the start
// and picks one. Earns rewardProportion x startingHeat only if BOTH true
// at session end: they picked THIS quest, and they're the current class
// record holder for it (recordKey), per the model worked out earlier.
//
// The produce-X quests below were chosen by actually analyzing the
// reaction network (tier each letter is produced in, and how many total
// reactions it appears in), not picked arbitrarily -- see the reasoning
// next to each. Reward proportions scale with that same difficulty
// (doubled from the original pass so hidden quests stay meaningful next
// to the larger common-goal rewards -- see note above HOLD_TRACKED_LETTERS):
//   produceF (easiest: pure Tier 1, only 2 total reactions touch it --
//     the simplest possible production chain, from Reaction 1.3) -> 0.10
//   produceP (medium: Tier 2, produced by 2 different reactions) -> 0.16
//   produceO (medium-hard: Tier 2, but appears in 4 reactions total --
//     genuine cross-tier demand competing for it) -> 0.20
//   produceW (harder: spans Tier 2 AND Tier 3, one step deeper into the
//     network than produceO despite similar appearance count) -> 0.22
//   produceX (harder still: also Tier 2 & 3, but appears in 4 reactions
//     total like produceO, so more competing demand on top of the same
//     tier depth as W) -> 0.24
//   produceR (hardest: also spans Tier 2 AND Tier 3, and uniquely has
//     ZERO reactant appearances -- nothing ever consumes it, so any R a
//     student holds only exists because they deliberately chased this
//     quest, not as a side effect of other production) -> 0.26
// produceM (existing) sits at Tier 1 & 3 both, comparable difficulty to
// produceO, so it keeps the same 0.20 the difficulty tier implies.
export const HIDDEN_GOALS = [
  { id: 'bonusMaster', label: 'Bonus questions answered correctly', getValue: (s) => s.bonusCorrectCount || 0, rewardProportion: 0.2, recordKey: 'bonusMaster' },
  { id: 'bigSeller', label: 'Heat earned from selling', getValue: (s) => s.totalSoldRevenue || 0, rewardProportion: 0.2, recordKey: 'bigSeller' },
  { id: 'produceM', label: 'Most M produced', getValue: producedOf('M'), rewardProportion: 0.2, recordKey: 'species_M' },
  { id: 'produceF', label: 'Most F produced', getValue: producedOf('F'), rewardProportion: 0.1, recordKey: 'species_F' },
  { id: 'produceP', label: 'Most P produced', getValue: producedOf('P'), rewardProportion: 0.16, recordKey: 'species_P' },
  { id: 'produceO', label: 'Most O produced', getValue: producedOf('O'), rewardProportion: 0.2, recordKey: 'species_O' },
  { id: 'produceW', label: 'Most W produced', getValue: producedOf('W'), rewardProportion: 0.22, recordKey: 'species_W' },
  { id: 'produceX', label: 'Most X produced', getValue: producedOf('X'), rewardProportion: 0.24, recordKey: 'species_X' },
  { id: 'produceR', label: 'Most R produced', getValue: producedOf('R'), rewardProportion: 0.26, recordKey: 'species_R' },
  // 7 more produce-X quests, same tier-then-frequency methodology (also doubled):
  //   produceH (Tier 1 & 3, appears in 4 -- same profile as produceM) -> 0.20
  //   produceN, produceS (Tier 2, appear in 3) -> 0.16
  //   produceT, produceJ (Tier 2, appear in 2, higher-value species) -> 0.14
  //   produceK, produceQ (Tier 2, appear in 2) -> 0.14
  { id: 'produceH', label: 'Most H produced', getValue: producedOf('H'), rewardProportion: 0.2, recordKey: 'species_H' },
  { id: 'produceN', label: 'Most N produced', getValue: producedOf('N'), rewardProportion: 0.16, recordKey: 'species_N' },
  { id: 'produceS', label: 'Most S produced', getValue: producedOf('S'), rewardProportion: 0.16, recordKey: 'species_S' },
  { id: 'produceT', label: 'Most T produced', getValue: producedOf('T'), rewardProportion: 0.14, recordKey: 'species_T' },
  { id: 'produceJ', label: 'Most J produced', getValue: producedOf('J'), rewardProportion: 0.14, recordKey: 'species_J' },
  { id: 'produceK', label: 'Most K produced', getValue: producedOf('K'), rewardProportion: 0.14, recordKey: 'species_K' },
  { id: 'produceQ', label: 'Most Q produced', getValue: producedOf('Q'), rewardProportion: 0.14, recordKey: 'species_Q' },
  // Rewards breadth (running many DIFFERENT reactions) rather than depth
  // (grinding one reaction repeatedly), which none of the produce-X
  // quests above test for. Uses data already tracked -- no new stat
  // needed, just counts how many keys in totalProducedBySpecies are
  // actually positive.
  { id: 'diverseProducer', label: 'Most different species produced', getValue: (s) => Object.keys(s.totalProducedBySpecies || {}).filter((l) => (s.totalProducedBySpecies[l] || 0) > 0).length, rewardProportion: 0.2, recordKey: 'diverseProducer' },
  // "Most X CURRENTLY HELD" -- a genuinely different tension from every
  // produce-X quest above. Those track a cumulative, never-decreasing
  // total; this tracks live inventory, which falls the moment you sell
  // or spend it. Winning means choosing to hoard instead of converting
  // toward Y -- a real hidden cost, not just a hidden target.
  //
  // Candidates are restricted to the 13 letters that are DIRECT
  // reactants in some Tier-3 (Y-producing) reaction, since only those
  // have a concrete, one-step "hold vs. contribute to Y" tradeoff.
  // Ranked by the same production-difficulty method as the produce-X
  // quests (tier depth, then total reaction appearances), with hidden
  // cost (heat foregone per mole if held instead of run) as a tie-break
  // among an otherwise-equal group. All values doubled, along with every
  // other hidden quest, so they stay meaningful next to the larger
  // common-goal rewards (mostProduced/bigProducer) -- leastWaste is the
  // one deliberate exception, kept small on purpose as the anti-exploit
  // measure worked out earlier:
  //   holdX (hardest: Tier 2 & 3, appears in 4 reactions) -> 0.26
  //   holdW (also Tier 2 & 3, appears in 3 reactions) -> 0.24
  //   holdO (Tier 2 only, but appears in 4 -- real competing demand) -> 0.20
  //   holdS (Tier 2, appears in 3; tie-broken above holdN/holdP by
  //     hidden cost -- ~164 heat foregone per mole vs ~78/~72) -> 0.18
  //   holdN (Tier 2, appears in 3) -> 0.16
  { id: 'holdX', label: 'Most X currently held', getValue: (s) => (s.inventory && s.inventory.X) || 0, rewardProportion: 0.26, recordKey: 'holding_X' },
  { id: 'holdW', label: 'Most W currently held', getValue: (s) => (s.inventory && s.inventory.W) || 0, rewardProportion: 0.24, recordKey: 'holding_W' },
  { id: 'holdO', label: 'Most O currently held', getValue: (s) => (s.inventory && s.inventory.O) || 0, rewardProportion: 0.2, recordKey: 'holding_O' },
  { id: 'holdS', label: 'Most S currently held', getValue: (s) => (s.inventory && s.inventory.S) || 0, rewardProportion: 0.18, recordKey: 'holding_S' },
  { id: 'holdN', label: 'Most N currently held', getValue: (s) => (s.inventory && s.inventory.N) || 0, rewardProportion: 0.16, recordKey: 'holding_N' },
  // The remaining 8 Tier-3-reactant letters, completing the full set of
  // 13 -- same tier-then-frequency-then-hidden-cost methodology (doubled):
  //   holdP (Tier 2, appears in 3 -- highest of this remaining group) -> 0.18
  //   holdT, holdJ (Tier 2, appear in 2, but high hidden cost per mole
  //     -- 469 and 411 heat foregone respectively) -> 0.16
  //   holdQ, holdK (Tier 2, appear in 2, moderate hidden cost) -> 0.14
  //   holdU, holdV (Tier 2, appear in 2, lowest hidden cost of the group) -> 0.12
  { id: 'holdP', label: 'Most P currently held', getValue: (s) => (s.inventory && s.inventory.P) || 0, rewardProportion: 0.18, recordKey: 'holding_P' },
  { id: 'holdT', label: 'Most T currently held', getValue: (s) => (s.inventory && s.inventory.T) || 0, rewardProportion: 0.16, recordKey: 'holding_T' },
  { id: 'holdJ', label: 'Most J currently held', getValue: (s) => (s.inventory && s.inventory.J) || 0, rewardProportion: 0.16, recordKey: 'holding_J' },
  { id: 'holdQ', label: 'Most Q currently held', getValue: (s) => (s.inventory && s.inventory.Q) || 0, rewardProportion: 0.14, recordKey: 'holding_Q' },
  { id: 'holdK', label: 'Most K currently held', getValue: (s) => (s.inventory && s.inventory.K) || 0, rewardProportion: 0.14, recordKey: 'holding_K' },
  { id: 'holdU', label: 'Most U currently held', getValue: (s) => (s.inventory && s.inventory.U) || 0, rewardProportion: 0.12, recordKey: 'holding_U' },
  { id: 'holdV', label: 'Most V currently held', getValue: (s) => (s.inventory && s.inventory.V) || 0, rewardProportion: 0.12, recordKey: 'holding_V' },
  // holdG replaces the original holdL -- L was an output of Reaction 1.5,
  // one of the two reactions specifically scoped by the anti-spam
  // mechanism, so a hidden quest tied to it was still quietly
  // incentivizing repeated 1.5 runs even after that fix. G comes from
  // Reaction 1.3 (multi-reactant, nowhere near the scoped reactions) and
  // matches L's original Tier-1, moderate-frequency profile, so it keeps
  // the same 0.10 reward (now doubled along with everything else). It's no longer a Tier-3 reactant, so this one
  // doesn't carry the direct "hold vs. contribute to Y" framing the
  // other 12 do -- it's just the lowest-difficulty hold quest now.
  { id: 'holdG', label: 'Most G currently held', getValue: (s) => (s.inventory && s.inventory.G) || 0, rewardProportion: 0.1, recordKey: 'holding_G' }
];

// Letters tracked by the "currently held" quests above -- exported so
// student.html knows which inventory changes are worth recording a
// class record for, without hardcoding the list a second time. Now the
// complete set of 13 Tier-3-reactant letters.
export const HOLD_TRACKED_LETTERS = ['X', 'W', 'O', 'S', 'N', 'P', 'T', 'J', 'Q', 'K', 'U', 'V', 'G'];