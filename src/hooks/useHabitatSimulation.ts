import { useState, useCallback, useMemo } from 'react';
import {
  Destination,
  HabitatSimulationState,
  O2Mode,
  WaterRecyclerMode,
  WaterRation,
  PowerAllocation,
  SolDailyEvent,
  JournalEntry,
} from '../types';

const SOL_EVENTS: Record<number, SolDailyEvent> = {
  1: {
    title: 'Sol 1: Touchdown & Habitat Airbridge Seal',
    description: 'Perfect atmospheric conditions. Primary solar arrays deployed with zero dust coating.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'Keep Life Support O₂ and Thermal Regulation powered at all times to maintain a safe 21°C habitat.',
  },
  2: {
    title: 'Sol 2: Solar Peak Alignment',
    description: 'Sun tracking towers reached 100% illumination angle! High solar power collection.',
    solarModifier: 1.15,
    thermalModifierKw: 0,
    tip: 'Use excess solar power during peak daylight to charge habitat batteries to 100%!',
  },
  3: {
    title: 'Sol 3: Fine Dust Settling',
    description: 'Electrostatic dust particles have accumulated on the photovoltaic glass surface.',
    solarModifier: 0.85,
    thermalModifierKw: 0,
    tip: 'Click "Clean Dust Wipers" on the Solar Array to restore maximum power collection efficiency.',
  },
  4: {
    title: 'Sol 4: Polar Crater Thermal Shadow',
    description: 'The habitat rim moved into an extended shadow pass. Outside temperature plummeted.',
    solarModifier: 0.9,
    thermalModifierKw: 10,
    tip: 'Heating demand is higher today. Ensure Thermal Regulation remains powered.',
  },
  5: {
    title: 'Sol 5: First Science EVA Expedition',
    description: 'Crew ventured onto the regolith. Great discoveries made, but crew oxygen consumption was high.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'Switch Oxygen Generation to "Boost Mode" if reserve levels dip below 90%.',
  },
  8: {
    title: 'Sol 8: Subsurface Ice Pocket Discovered',
    description: 'Drill probes located rich frozen water ice crystals 1 meter under the surface!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'Toggle "Ice Smelter" ON in Water Systems to melt stored polar ice into drinkable water!',
  },
  12: {
    title: 'Sol 12: Atmospheric Dust Squall',
    description: 'Fine high-altitude dust particles are scattering incoming sunlight.',
    solarModifier: 0.7,
    thermalModifierKw: 5,
    tip: 'Consider setting Water Recycling to "Eco" mode today to reduce electrical demand.',
  },
  15: {
    title: 'Sol 15: Halfway Mark! (15 Sols Completed)',
    description: 'NASA Mission Control in Houston transmits congratulations to the junior flight crew!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'You have survived half the mission! Check all subsystem levels before advancing.',
  },
  20: {
    title: 'Sol 20: Cosmic Ray Shielding Test',
    description: 'Solar magnetic storm detected. Habitat electromagnetic deflector tested successfully.',
    solarModifier: 1.05,
    thermalModifierKw: 0,
    tip: 'Batteries handled the surge with flying colors. Keep communications active for DSN telemetry.',
  },
  25: {
    title: 'Sol 25: Deep Ice Core Harvesting',
    description: 'Automated rovers brought back a 50kg cylinder of ancient prehistoric ice.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'Melt the ice core to guarantee full water tanks for the final stretch to Sol 30.',
  },
  30: {
    title: 'Sol 30: Final Sol & Mission Accomplished!',
    description: 'All 30 Sols of planetary habitat survival achieved! Junior Astronaut Wings unlocked!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    tip: 'Outstanding work, Commander! Your life-support stewardship made this expedition a triumph.',
  },
};

const DEFAULT_EVENT: SolDailyEvent = {
  title: 'Nominal Planetary Operations',
  description: 'Stable solar insolation and clear celestial skies over the habitat site.',
  solarModifier: 1.0,
  thermalModifierKw: 0,
  tip: 'Monitor O₂, Water, and Battery storage balance to keep your crew healthy.',
};

export function useHabitatSimulation(
  destination: Destination,
  onJournalAdd?: (entry: JournalEntry) => void
) {
  const initialPowerAllocation: PowerAllocation = {
    lifeSupportO2: true,
    waterRecycling: true,
    thermalRegulation: true,
    scienceLab: true,
    communications: true,
    iceSmelting: false,
  };

  const [state, setState] = useState<HabitatSimulationState>({
    currentSol: 1,
    totalSols: 30,
    missionStatus: 'active',
    oxygenLevel: 98,
    o2Mode: 'standard',
    o2ScrubberEfficiency: 96,
    emergencyO2Canisters: 2,
    netO2Delta: 1,
    waterLevel: 96,
    waterRecyclerMode: 'advanced',
    waterRation: 'standard',
    iceSmeltingActive: false,
    iceReservesKg: 300,
    netWaterDelta: 0,
    batteryCharge: 100,
    solarDustAccumulation: 0,
    powerAllocation: initialPowerAllocation,
    totalPowerGeneratedKw: 105,
    totalPowerDemandKw: 90,
    batteryDeltaKw: 15,
    habitatTempC: 21,
    habitatIntegrity: 100,
    currentEvent: SOL_EVENTS[1],
    lastDebriefMessage:
      'Sol 1 initialized. Environmental loops connected. All life support systems nominal.',
  });

  // Calculate live power demand and generation
  const calculations = useMemo(() => {
    const isMars = destination === 'mars';
    const baseSolar = isMars ? 95 : 110;
    const dustPenalty = (100 - state.solarDustAccumulation * 0.4) / 100;
    const eventMod = state.currentEvent.solarModifier;
    const powerGenerated = Math.max(0, Math.round(baseSolar * dustPenalty * eventMod));

    // Power demands
    let o2Demand = state.powerAllocation.lifeSupportO2 ? 25 : 0;
    if (state.o2Mode === 'boost') o2Demand += 10;
    if (state.o2Mode === 'eco') o2Demand = Math.max(10, o2Demand - 10);

    let waterDemand = 0;
    if (state.powerAllocation.waterRecycling) {
      if (state.waterRecyclerMode === 'basic') waterDemand = 10;
      else if (state.waterRecyclerMode === 'advanced') waterDemand = 20;
      else if (state.waterRecyclerMode === 'hyper') waterDemand = 30;
    }

    const thermalDemand = state.powerAllocation.thermalRegulation
      ? 20 + state.currentEvent.thermalModifierKw
      : 0;

    const scienceDemand = state.powerAllocation.scienceLab ? 15 : 0;
    const commsDemand = state.powerAllocation.communications ? 10 : 0;
    const iceDemand = state.powerAllocation.iceSmelting && state.iceSmeltingActive ? 15 : 0;

    const totalDemand = o2Demand + waterDemand + thermalDemand + scienceDemand + commsDemand + iceDemand;
    const netPowerKw = powerGenerated - totalDemand;

    // Oxygen delta estimation
    let o2Delta = -8; // baseline human consumption
    if (state.powerAllocation.lifeSupportO2 && (state.batteryCharge > 0 || netPowerKw >= 0)) {
      if (state.o2Mode === 'eco') o2Delta += 6; // net -2%
      else if (state.o2Mode === 'standard') o2Delta += 9; // net +1%
      else if (state.o2Mode === 'boost') o2Delta += 13; // net +5%
    }

    // Water delta estimation
    let waterConsumed = -8;
    if (state.waterRation === 'strict') waterConsumed = -5;
    if (state.waterRation === 'generous') waterConsumed = -12;

    let waterRecovered = 0;
    if (state.powerAllocation.waterRecycling && (state.batteryCharge > 0 || netPowerKw >= 0)) {
      if (state.waterRecyclerMode === 'basic') waterRecovered = Math.abs(waterConsumed) * 0.75;
      else if (state.waterRecyclerMode === 'advanced') waterRecovered = Math.abs(waterConsumed) * 0.92;
      else if (state.waterRecyclerMode === 'hyper') waterRecovered = Math.abs(waterConsumed) * 0.98;
    }

    let iceWaterGained = 0;
    if (state.iceSmeltingActive && state.powerAllocation.iceSmelting && state.iceReservesKg > 0) {
      iceWaterGained = 7;
    }

    const waterDelta = Math.round(waterConsumed + waterRecovered + iceWaterGained);

    return {
      powerGenerated,
      totalDemand,
      netPowerKw,
      o2Delta,
      waterDelta,
    };
  }, [state, destination]);

  // Actions
  const setO2Mode = useCallback((mode: O2Mode) => {
    setState((prev) => ({ ...prev, o2Mode: mode }));
  }, []);

  const setWaterRecyclerMode = useCallback((mode: WaterRecyclerMode) => {
    setState((prev) => ({ ...prev, waterRecyclerMode: mode }));
  }, []);

  const setWaterRation = useCallback((ration: WaterRation) => {
    setState((prev) => ({ ...prev, waterRation: ration }));
  }, []);

  const toggleIceSmelting = useCallback(() => {
    setState((prev) => {
      const next = !prev.iceSmeltingActive;
      return {
        ...prev,
        iceSmeltingActive: next,
        powerAllocation: {
          ...prev.powerAllocation,
          iceSmelting: next,
        },
      };
    });
  }, []);

  const togglePowerAllocation = useCallback((key: keyof PowerAllocation) => {
    setState((prev) => ({
      ...prev,
      powerAllocation: {
        ...prev.powerAllocation,
        [key]: !prev.powerAllocation[key],
      },
    }));
  }, []);

  const cleanSolarPanels = useCallback(() => {
    setState((prev) => ({
      ...prev,
      solarDustAccumulation: 0,
      lastDebriefMessage: 'Solar array wipers activated! Dust cleared—solar efficiency restored to 100%.',
    }));
  }, []);

  const useEmergencyO2Canister = useCallback(() => {
    setState((prev) => {
      if (prev.emergencyO2Canisters <= 0) return prev;
      const newO2 = Math.min(100, prev.oxygenLevel + 25);
      return {
        ...prev,
        oxygenLevel: newO2,
        emergencyO2Canisters: prev.emergencyO2Canisters - 1,
        lastDebriefMessage: 'Emergency O₂ Canister released! +25% pressurized Oxygen added to habitat atmosphere.',
      };
    });
  }, []);

  const advanceSol = useCallback(() => {
    setState((prev) => {
      if (prev.currentSol >= prev.totalSols) {
        return prev;
      }

      const nextSol = prev.currentSol + 1;
      const event = SOL_EVENTS[nextSol] || DEFAULT_EVENT;

      // Battery update
      let newBattery = prev.batteryCharge;
      if (calculations.netPowerKw >= 0) {
        newBattery = Math.min(100, Math.round(prev.batteryCharge + calculations.netPowerKw * 0.35));
      } else {
        newBattery = Math.max(0, Math.round(prev.batteryCharge + calculations.netPowerKw * 0.6));
      }

      // Oxygen update
      let newO2 = Math.min(100, Math.max(0, prev.oxygenLevel + calculations.o2Delta));
      let emergencyTriggered = false;
      let remainingCanisters = prev.emergencyO2Canisters;

      // Auto emergency canister if dangerously low (< 15%)
      if (newO2 < 15 && remainingCanisters > 0) {
        newO2 = Math.min(100, newO2 + 25);
        remainingCanisters -= 1;
        emergencyTriggered = true;
      }

      // Water update
      const newWater = Math.min(100, Math.max(0, prev.waterLevel + calculations.waterDelta));

      // Ice reduction
      let newIce = prev.iceReservesKg;
      if (prev.iceSmeltingActive && prev.powerAllocation.iceSmelting && newIce >= 50) {
        newIce -= 50;
      }

      // Dust accumulation (adds 3-8% dust each Sol)
      const addedDust = Math.floor(Math.random() * 6) + 3;
      const newDust = Math.min(80, prev.solarDustAccumulation + addedDust);

      // Temperature update
      let newTemp = 21;
      let integrityDelta = 0;
      if (!prev.powerAllocation.thermalRegulation || newBattery <= 0) {
        newTemp = destination === 'mars' ? -42 : -75;
        integrityDelta = -6; // cold damages exterior seals
      }

      const newIntegrity = Math.max(0, prev.habitatIntegrity + integrityDelta);

      // Check Mission Status
      let newStatus: 'active' | 'victory' | 'critical' = 'active';
      if (nextSol === 30 && newO2 > 20 && newWater > 15 && newIntegrity > 30) {
        newStatus = 'victory';
      } else if (newO2 <= 5 || newWater <= 5 || newIntegrity <= 10) {
        newStatus = 'critical';
      }

      // Debrief message
      let debrief = `Sol ${nextSol} Operations Complete. `;
      if (emergencyTriggered) {
        debrief += `⚠️ Emergency O₂ auto-injected! `;
      }
      if (calculations.netPowerKw < 0) {
        debrief += `Batteries drained by ${Math.abs(calculations.netPowerKw)} kW. `;
      } else {
        debrief += `Solar power surplus: +${calculations.netPowerKw} kW. `;
      }
      debrief += `O₂ is at ${newO2}%, Water is at ${newWater}%, Batteries at ${newBattery}%.`;

      // Trigger Journal Entry callback
      if (onJournalAdd) {
        const journalTitle = nextSol === 30
          ? 'Sol 30 Milestone: Mission Accomplished!'
          : `Sol ${nextSol} Field Operations & Resource Log`;

        const newJournalEntry: JournalEntry = {
          id: `sol-${nextSol}-${Date.now()}`,
          sol: nextSol,
          title: journalTitle,
          author: 'Junior Commander (Flight Ops)',
          timestamp: `Sol ${nextSol} / 30 - Planetary Time`,
          body: `Day summary: ${event.title}. ${debrief} Habitat environmental systems maintained at ${newTemp}°C.`,
          scienceTip: event.tip,
          badge: nextSol === 30 ? {
            name: 'Senior Astronaut 30-Sol Wings',
            icon: 'Award',
            description: 'Mastered all 30 Sols of habitat survival on a foreign planetary world!',
          } : (nextSol === 15 ? {
            name: 'Halfway Pioneer Pin',
            icon: 'Rocket',
            description: 'Successfully reached Sol 15 with nominal life-support reserves.',
          } : undefined),
        };
        onJournalAdd(newJournalEntry);
      }

      return {
        ...prev,
        currentSol: nextSol,
        missionStatus: newStatus,
        oxygenLevel: newO2,
        emergencyO2Canisters: remainingCanisters,
        netO2Delta: calculations.o2Delta,
        waterLevel: newWater,
        iceReservesKg: newIce,
        netWaterDelta: calculations.waterDelta,
        batteryCharge: newBattery,
        solarDustAccumulation: newDust,
        totalPowerGeneratedKw: calculations.powerGenerated,
        totalPowerDemandKw: calculations.totalDemand,
        batteryDeltaKw: calculations.netPowerKw,
        habitatTempC: newTemp,
        habitatIntegrity: newIntegrity,
        currentEvent: event,
        lastDebriefMessage: debrief,
      };
    });
  }, [calculations, destination, onJournalAdd]);

  const resetSimulation = useCallback(() => {
    setState({
      currentSol: 1,
      totalSols: 30,
      missionStatus: 'active',
      oxygenLevel: 98,
      o2Mode: 'standard',
      o2ScrubberEfficiency: 96,
      emergencyO2Canisters: 2,
      netO2Delta: 1,
      waterLevel: 96,
      waterRecyclerMode: 'advanced',
      waterRation: 'standard',
      iceSmeltingActive: false,
      iceReservesKg: 300,
      netWaterDelta: 0,
      batteryCharge: 100,
      solarDustAccumulation: 0,
      powerAllocation: initialPowerAllocation,
      totalPowerGeneratedKw: 105,
      totalPowerDemandKw: 90,
      batteryDeltaKw: 15,
      habitatTempC: 21,
      habitatIntegrity: 100,
      currentEvent: SOL_EVENTS[1],
      lastDebriefMessage: 'Simulation reset to Sol 1. All environmental parameters restored to baseline.',
    });
  }, []);

  return {
    state,
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
