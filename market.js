// Percent-yield market pressure. Pure math, no Firebase calls -- callers
// read/write the stored {pressure, lastUpdate} shape themselves.
//
// Each reaction tracks its own pressure, starting at 0. Running it adds
// pressure (lowers yield); time without a run decays pressure, even
// below 0 (raises yield, capped at 100). Yield is computed once when a
// student opens the confirm screen and held fixed for that attempt --
// it must not change while they're mid-calculation, or the bonus
// question would be checking against a moving target.

export const BASE_YIELD = 90;
export const YIELD_FLOOR = 50;
export const RUN_PRESSURE_INCREMENT = 8;
export const PRESSURE_DECAY_PER_MINUTE = 2;

// Applies decay for elapsed time to a stored {pressure, lastUpdate}.
// Pass the result of this straight into yieldFromPressure().
export function decayedPressure(stored, now) {
  const s = stored || { pressure: 0, lastUpdate: now };
  const minutesElapsed = Math.max(0, (now - s.lastUpdate) / 60000);
  return s.pressure - PRESSURE_DECAY_PER_MINUTE * minutesElapsed;
}

export function yieldFromPressure(pressure) {
  return Math.max(YIELD_FLOOR, Math.min(100, BASE_YIELD - pressure));
}
