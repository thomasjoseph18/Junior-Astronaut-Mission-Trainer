import { useState, useCallback, useMemo } from 'react';
import type {
  Destination,
  HabitatSimulationState,
  O2Mode,
  WaterRecyclerMode,
  WaterRation,
  PowerAllocation,
  JournalEntry,
} from '../types';
import {
  actions,
  advanceSolState,
  computeCalculations,
  getInitialSimulationState,
} from '../engine/simulation';
import type { GameEvent } from '../engine/achievements';

export type SimulationMap = Record<Destination, HabitatSimulationState>;

/**
 * React wrapper around the pure simulation engine (src/engine/simulation.ts).
 * Moon and Mars keep INDEPENDENT progress: switching destination never resets either.
 * Achievements are emitted only through real game events (see engine/achievements.ts).
 */
export function useHabitatSimulation(
  destination: Destination,
  options: {
    initialSimulations?: SimulationMap;
    onSimulationsChange?: (sims: SimulationMap) => void;
    onJournalAdd?: (entry: JournalEntry, destination: Destination) => void;
    onGameEvent?: (event: GameEvent) => void;
  } = {},
) {
  const { initialSimulations, onSimulationsChange, onJournalAdd, onGameEvent } = options;

  const [sims, setSims] = useState<SimulationMap>(
    () =>
      initialSimulations ?? {
        moon: getInitialSimulationState('moon'),
        mars: getInitialSimulationState('mars'),
      },
  );

  const state = sims[destination];

  const commit = useCallback(
    (next: HabitatSimulationState) => {
      const merged = { ...sims, [destination]: next };
      setSims(merged);
      onSimulationsChange?.(merged);
    },
    [sims, destination, onSimulationsChange],
  );

  const calculations = useMemo(() => computeCalculations(state, destination), [state, destination]);

  const setO2Mode = useCallback((mode: O2Mode) => commit({ ...state, o2Mode: mode }), [commit, state]);

  const setWaterRecyclerMode = useCallback(
    (mode: WaterRecyclerMode) => commit({ ...state, waterRecyclerMode: mode }),
    [commit, state],
  );

  const setWaterRation = useCallback(
    (ration: WaterRation) => commit({ ...state, waterRation: ration }),
    [commit, state],
  );

  const toggleIceSmelting = useCallback(() => {
    const next = actions.toggleIceSmelting(state);
    commit(next);
    if (next.iceSmeltingActive) onGameEvent?.({ type: 'ice_smelter_started' });
  }, [commit, state, onGameEvent]);

  const togglePowerAllocation = useCallback(
    (key: keyof PowerAllocation) => commit(actions.togglePowerAllocation(state, key)),
    [commit, state],
  );

  const cleanSolarPanels = useCallback(() => {
    onGameEvent?.({ type: 'solar_cleaned', dustBefore: state.solarDustAccumulation });
    commit(actions.cleanSolarPanels(state));
  }, [commit, state, onGameEvent]);

  const useEmergencyO2Canister = useCallback(
    () => commit(actions.useEmergencyO2Canister(state)),
    [commit, state],
  );

  const advanceSol = useCallback(() => {
    const result = advanceSolState(state, destination);
    if (!result) return;
    commit(result.state);
    onGameEvent?.({ type: 'sol_completed', facts: result.facts });
    onJournalAdd?.(result.journalEntry, destination);
  }, [state, destination, commit, onGameEvent, onJournalAdd]);

  /** Restarts ONLY the active destination. */
  const resetSimulation = useCallback(() => {
    commit(getInitialSimulationState(destination));
  }, [commit, destination]);

  return {
    state,
    simulations: sims,
    calculations,
    setO2Mode,
    setWaterRecyclerMode,
    setWaterRation,
    toggleIceSmelting,
    togglePowerAllocation,
    cleanSolarPanels,
    useEmergencyO2Canister,
    advanceSol,
    resetSimulation,
  };
}
