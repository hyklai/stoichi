// Percent-yield market pressure, on discrete intervals rather than
// continuous decay. Pure math only, no Firebase calls -- every function
// here is synchronous on purpose, because the Firebase transaction
// callbacks that use them (in student/teacher/display.html) MUST be
// synchronous themselves -- passing an async function to runTransaction
// silently treats its return value as a Promise object, which Firebase
// stores as null (deleting the path). Nothing in this file may become
// async, and nothing that calls into this file from inside a transaction
// callback should either.
//
// Model: each reaction has a published {pressure, extentThisInterval}
// that stays fixed for the whole interval. Runs during an interval just
// add their extent to extentThisInterval (a simple atomic increment,
// done outside any transaction) -- a big batch run adds more than a
// token-sized one. At the interval boundary, ALL reactions' pressure
// gets recomputed at once: decayed for the full interval duration, then
// bumped by extentThisInterval scaled by BOTH the tier-adjusted
// increment AND a sensitivity multiplier that depends on where pressure
// currently sits (see pressureSensitivity below) -- then
// extentThisInterval resets to 0. The result stays fixed as the
// "current" pressure until the NEXT boundary, which is what makes yield
// stable and IDENTICAL for every student across a whole interval, not
// just individually frozen per attempt.

export const BASE_YIELD = 90;
export const YIELD_FLOOR = 50;
export const DEFAULT_RUN_PRESSURE_INCREMENT = 8;
export const DEFAULT_PRESSURE_DECAY_PER_MINUTE = 2;
export const DEFAULT_INTERVAL_MINUTES = 2;

// Tier 1 is expected to run far more often than Tier 3 just from the
// shape of the reaction network, so it gets a damped multiplier and
// Tier 3 an amplified one -- aiming for all three tiers to land in a
// comparably "active" pressure range despite very different natural
// volume. Adjustable live from teacher.html; these are just the defaults.
export const DEFAULT_TIER_MULTIPLIERS = { 1: 0.7, 2: 1, 3: 1.5 };

// Pressure beyond these points already can't move yield any further (it's
// sitting at the floor or cap), so there's no reason to let it drift
// further out -- doing so would just mean an unreasonably long real-world
// wait before it decays back into a range that matters again.
export const PRESSURE_CEILING = BASE_YIELD - YIELD_FLOOR;
export const PRESSURE_FLOOR = BASE_YIELD - 100;

export function clampPressure(p) {
  return Math.max(PRESSURE_FLOOR, Math.min(PRESSURE_CEILING, p));
}

export function yieldFromPressure(pressure) {
  return Math.max(YIELD_FLOOR, Math.min(100, BASE_YIELD - pressure));
}

// Reaction names are "Reaction X.Y ..." -- X is the tier.
export function tierOf(reaction) {
  return Number(reaction.name.split(' ')[1].split('.')[0]);
}

// How strongly additional extent moves pressure, depending on where
// pressure CURRENTLY sits. Shaped like p*(1-p) from binomial variance:
// zero right at either edge (yield 100% or yield 50%, where the market
// is either untouched or already fully saturated and further activity
// barely changes the picture), peaking at the midpoint (yield 75%,
// where the market has the most "give" either direction). Returns a
// multiplier in [0, 1].
export function pressureSensitivity(pressure) {
  const x = Math.max(0, Math.min(1, (pressure - PRESSURE_FLOOR) / (PRESSURE_CEILING - PRESSURE_FLOOR)));
  return 4 * x * (1 - x);
}

// The boundary computation for one reaction: linear decay applied for
// the full interval duration, plus the extent-weighted, sensitivity-
// scaled effect of however much that reaction actually ran during that
// same interval.
export function nextPressure(oldPressure, extentThisInterval, effectiveIncrement, decayPerMinute, intervalMinutes) {
  const activityEffect = extentThisInterval * effectiveIncrement * pressureSensitivity(oldPressure);
  return clampPressure(oldPressure - decayPerMinute * intervalMinutes + activityEffect);
}

// Runs the boundary computation for every reaction at once. Pure/sync --
// safe to call directly inside a transaction callback.
export function advanceAllPressures(currentPressures, reactions, marketParams) {
  const result = {};
  reactions.forEach((reaction) => {
    const p = (currentPressures && currentPressures[reaction.id]) || { pressure: 0, extentThisInterval: 0 };
    const tierMult = (marketParams.tierMultipliers && marketParams.tierMultipliers[tierOf(reaction)]) || 1;
    const effectiveIncrement = marketParams.runPressureIncrement * tierMult;
    result[reaction.id] = {
      pressure: nextPressure(p.pressure, p.extentThisInterval || 0, effectiveIncrement, marketParams.decayPerMinute, marketParams.intervalMinutes),
      extentThisInterval: 0,
      previousPressure: p.pressure
    };
  });
  return result;
}

// Random market event: 1-3 reactions get an immediate +/-15 jolt on top
// of whatever advanceAllPressures already computed. Pure/sync.
export function applyRandomShock(pressures, reactions) {
  const shockCount = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...reactions].sort(() => Math.random() - 0.5).slice(0, shockCount);
  const result = { ...pressures };
  shuffled.forEach((reaction) => {
    const shockAmount = Math.random() * 30 - 15;
    const current = result[reaction.id] || { pressure: 0, extentThisInterval: 0 };
    result[reaction.id] = { ...current, pressure: clampPressure(current.pressure + shockAmount) };
  });
  return result;
}

// How many past intervals to keep in history -- generous for a single
// class period (a 50-minute session at 2-minute intervals is ~25
// entries) without growing unbounded across a very long-running page.
export const MAX_HISTORY_LENGTH = 60;

// Aggregates one boundary's outcome by tier: total extent that just
// happened (from the OUTGOING extentThisInterval, before it's reset) and
// the average yield going forward (from the NEW pressures). This is what
// the display's volume chart reads, one entry per interval, per tier.
export function computeTierSummary(oldPressures, newPressures, reactions) {
  const totals = { 1: { extent: 0, yieldSum: 0, count: 0 }, 2: { extent: 0, yieldSum: 0, count: 0 }, 3: { extent: 0, yieldSum: 0, count: 0 } };
  reactions.forEach((reaction) => {
    const tier = tierOf(reaction);
    const old = (oldPressures && oldPressures[reaction.id]) || { extentThisInterval: 0 };
    const updated = newPressures[reaction.id];
    totals[tier].extent += old.extentThisInterval || 0;
    totals[tier].yieldSum += yieldFromPressure(updated.pressure);
    totals[tier].count += 1;
  });
  const result = {};
  [1, 2, 3].forEach((t) => {
    result[t] = { extent: totals[t].extent, avgYield: totals[t].count ? totals[t].yieldSum / totals[t].count : BASE_YIELD };
  });
  return result;
}

// The complete boundary transition: new pressures, a fresh timer, and one
// new history entry appended (capped at MAX_HISTORY_LENGTH). This is the
// single source of truth for "an interval just ended" -- every file's
// transaction callback for the automatic advance-when-due case should
// just call this directly rather than reimplementing it.
export function computeBoundaryTransition(current, reactions, marketParams, now) {
  const oldPressures = (current && current.pressures) || {};
  const newPressures = advanceAllPressures(oldPressures, reactions, marketParams);
  const tierSummary = computeTierSummary(oldPressures, newPressures, reactions);
  const priorHistory = (current && current.history) || [];
  const newHistory = [...priorHistory, { timestamp: now, tiers: tierSummary }].slice(-MAX_HISTORY_LENGTH);
  return {
    pressures: newPressures,
    timer: { remainingSeconds: marketParams.intervalMinutes * 60, checkpointAt: now, running: true },
    history: newHistory
  };
}

// Live remaining seconds for display, given a {remainingSeconds,
// checkpointAt, running} timer. Frozen (not counting down further) while
// paused, since running will be false in that case.
export function liveRemainingSeconds(timer, now) {
  if (!timer) return 0;
  if (!timer.running) return Math.max(0, timer.remainingSeconds);
  return Math.max(0, timer.remainingSeconds - (now - timer.checkpointAt) / 1000);
}