import { useState, useCallback, useMemo, useEffect } from 'react';
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

// ================= SCIENTIFICALLY ACCURATE LUNAR EVENTS =================
// The Moon has no atmosphere (vacuum/trace exosphere).
// Dust is surface regolith moved electrostatically across the terminator or kicked up by rovers.
const LUNAR_SOL_EVENTS: Record<number, SolDailyEvent> = {
  1: {
    title: 'Sol 1: Touchdown on Shackleton Crater Rim',
    description: 'Habitat airbridge pressurized in the lunar vacuum. Primary solar tracking arrays deployed on the crater rim with clean glass.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 0,
    tip: 'The Moon has no atmosphere. Keep Life Support O₂ and Thermal Regulation active to maintain a safe 21°C habitat.',
  },
  2: {
    title: 'Sol 2: Peak Solar Illumination at Polar Ridge',
    description: 'Sun tracking towers catch continuous low-angle solar rays along the elevated rim peaks.',
    solarModifier: 1.15,
    thermalModifierKw: 0,
    dustAccumulation: 2,
    tip: 'Store surplus solar electricity in central battery banks for periods when terrain creates localized shadow.',
  },
  3: {
    title: 'Sol 3: Electrostatic Regolith Levitation',
    description: 'Solar UV radiation electrostatically charges fine surface regolith across the terminator, depositing a light dust coating on solar cells.',
    solarModifier: 0.88,
    thermalModifierKw: 0,
    dustAccumulation: 8,
    tip: 'Click "Clean Solar Dust Wipers" to brush away electrostatically bound dust and restore 100% solar collection.',
  },
  4: {
    title: 'Sol 4: Polar Crater Shadow Pass',
    description: 'The habitat moved into an extended shadow cast by a towering crater massif. Exterior ambient temperature plummeted.',
    solarModifier: 0.9,
    thermalModifierKw: 10,
    dustAccumulation: 2,
    tip: 'Thermal heating demand increases in deep shadow. Ensure Thermal Regulation stays powered to prevent gradual cooling.',
  },
  5: {
    title: 'Sol 5: Lunar Rover EVA to Crater Interior',
    description: 'Crew drove the unpressurized rover into the permanent darkness of Shackleton Crater. Extra suit battery and oxygen consumed during airlock cycles.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 4,
    tip: 'Switch Oxygen Generation to "Boost Mode" if habitat reserves dipped during intensive airlock operations.',
  },
  8: {
    title: 'Sol 8: Subsurface Lunar Water-Ice Discovery',
    description: 'Neutron spectrometer readings confirmed crystalline water-ice mixed within deep regolith cold traps beneath the surface!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 2,
    tip: 'Toggle "Ice Smelter" ON in Water Systems to melt stored polar ice into drinkable water!',
  },
  12: {
    title: 'Sol 12: Terminator Crossing Dust Migration',
    description: 'Sharp thermal transition as the lunar day progresses causes localized electrostatic regolith migration near the landing pad.',
    solarModifier: 0.82,
    thermalModifierKw: 0,
    dustAccumulation: 10,
    tip: 'Clean solar dust wipers today to restore peak photovoltaic efficiency.',
  },
  15: {
    title: 'Sol 15: Halfway Mark! (15 Sols Completed)',
    description: 'Artemis Mission Control in Houston transmits congratulations to the junior lunar expedition crew!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 3,
    tip: 'You have survived half the lunar mission! Verify all environmental life-support reserves.',
  },
  20: {
    title: 'Sol 20: Solar Cosmic Ray Alert',
    description: 'Space radiation monitors detect energetic proton flux from a solar flare. Heavy regolith berm shielding protects the crew habitat.',
    solarModifier: 1.05,
    thermalModifierKw: 0,
    dustAccumulation: 2,
    tip: 'Keep communications powered to monitor radiation warning updates from the Deep Space Network.',
  },
  25: {
    title: 'Sol 25: Deep Core Sample Extraction',
    description: 'Automated core drill returned a 50kg cylinder of pristine water-ice and volatiles from a 2-billion-year-old cold trap.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 3,
    tip: 'Melt the ice core to guarantee full potable water tanks for the final push to Sol 30.',
  },
  30: {
    title: 'Sol 30: Final Sol & Lunar Mission Accomplished!',
    description: 'All 30 Sols of lunar South Pole habitat survival achieved! Artemis Senior Astronaut Wings unlocked!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 0,
    tip: 'Outstanding stewardship, Commander! Your lunar base camp is ready for permanent human settlement.',
  },
};

// ================= SCIENTIFICALLY ACCURATE MARS EVENTS =================
// Mars has a thin 95% CO2 atmosphere with atmospheric dust storms, wind, and lower solar irradiance.
const MARS_SOL_EVENTS: Record<number, SolDailyEvent> = {
  1: {
    title: 'Sol 1: Touchdown on Jezero Crater Delta',
    description: 'Pressurized habitat dome sealed against the thin Martian CO₂ atmosphere. Photovoltaic glass is pristine and dust-free.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 0,
    tip: 'MOXIE unit is ready to convert Martian atmospheric CO₂ into breathable Oxygen. Keep Thermal Regulation powered.',
  },
  2: {
    title: 'Sol 2: Midday Solar Insolation',
    description: 'Thin carbon dioxide skies allow clear sunlight over the ancient delta lakebed deposits.',
    solarModifier: 1.10,
    thermalModifierKw: 0,
    dustAccumulation: 3,
    tip: 'Charge batteries while sunlight is strong before the cold Martian night.',
  },
  3: {
    title: 'Sol 3: Dust Devil Sighting',
    description: 'A localized spinning dust vortex crossed the western crater floor, depositing fine ferric oxide dust on solar panels.',
    solarModifier: 0.85,
    thermalModifierKw: 0,
    dustAccumulation: 10,
    tip: 'Use "Clean Solar Dust Wipers" to clear iron-oxide dust from solar cells.',
  },
  4: {
    title: 'Sol 4: Martian Nocturnal Freeze',
    description: 'Surface temperature dropped to -65°C under the thin atmosphere. Electric thermal heaters active throughout the night.',
    solarModifier: 1.0,
    thermalModifierKw: 8,
    dustAccumulation: 3,
    tip: 'Martian night chill demands steady thermal power. Keep heating powered to protect airlock seals.',
  },
  5: {
    title: 'Sol 5: First Geologic Delta EVA',
    description: 'Crew sampled ancient riverbed mudstones. Increased oxygen consumption during 4-hour traverse in pressurized suits.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 4,
    tip: 'Set Oxygen Mode to "Standard" or "Boost" to restore habitat atmospheric pressure.',
  },
  8: {
    title: 'Sol 8: Glacial Subsurface Ice Horizon',
    description: 'Ground-penetrating radar identified pure glacial water-ice deposits beneath 30cm of soil!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 3,
    tip: 'Activate the Ice Smelter to turn raw glacial ice into pure drinking water.',
  },
  12: {
    title: 'Sol 12: Regional Atmospheric Dust Storm',
    description: 'Atmospheric winds lofted fine dust into the upper Martian troposphere, filtering incoming sunlight.',
    solarModifier: 0.70,
    thermalModifierKw: 5,
    dustAccumulation: 14,
    tip: 'Solar generation is reduced by airborne dust. Switch Water Recycler to "Basic" to conserve battery power.',
  },
  15: {
    title: 'Sol 15: Halfway Mark! (15 Martian Sols Completed)',
    description: 'Telemetry transmitted across 140 million miles to Earth. Mission Control confirms nominal crew vitals.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 4,
    tip: '15 Sols completed! You have proven human habitability on Mars is possible.',
  },
  20: {
    title: 'Sol 20: Atmospheric Haze Clearing',
    description: 'High-altitude atmospheric dust settles out. Solar flux improves significantly over Jezero Crater.',
    solarModifier: 1.05,
    thermalModifierKw: 0,
    dustAccumulation: 3,
    tip: 'Take advantage of bright Martian skies to run full water recycling.',
  },
  25: {
    title: 'Sol 25: Permafrost Deep Core Sample',
    description: 'Scientific drilling rig returned massive ice core samples from ancient alluvial deposits. Water reserves expanded.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 4,
    tip: 'Melt ice samples to secure full water tanks for the final sols.',
  },
  30: {
    title: 'Sol 30: Final Sol & Mars Mission Accomplished!',
    description: 'All 30 Sols of Martian survival achieved! You have laid the foundation for humanity’s first city on Mars!',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 0,
    tip: 'Mission Victory, Commander! You have successfully survived 30 Sols on the Red Planet.',
  },
};

function getDailyEvent(destination: Destination, sol: number): SolDailyEvent {
  const table = destination === 'mars' ? MARS_SOL_EVENTS : LUNAR_SOL_EVENTS;
  if (table[sol]) {
    return table[sol];
  }

  // Scientifically grounded default events for intermediate days
  if (destination === 'mars') {
    return {
      title: `Sol ${sol}: Nominal Martian Surface Operations`,
      description: 'Clear carbon dioxide sky over Jezero Crater. Steady solar collection on solar arrays.',
      solarModifier: 1.0,
      thermalModifierKw: 0,
      dustAccumulation: 3, // deterministic 3% dust per sol
      tip: 'Monitor O₂, Water, and Battery storage balance to keep your crew healthy.',
    };
  }

  return {
    title: `Sol ${sol}: Nominal Lunar Surface Operations`,
    description: 'Direct vacuum solar insolation over Shackleton Crater rim. Thermal and electrical systems stable.',
    solarModifier: 1.0,
    thermalModifierKw: 0,
    dustAccumulation: 2, // deterministic 2% dust per sol
    tip: 'Monitor O₂, Water, and Battery storage balance to keep your crew healthy.',
  };
}

const INITIAL_POWER_ALLOCATION: PowerAllocation = {
  lifeSupportO2: true,      // 25 kW
  waterRecycling: true,     // 20 kW (advanced)
  thermalRegulation: true,  // 20 kW
  scienceLab: true,         // 15 kW
  communications: true,     // 10 kW
  iceSmelting: false,       // 0 kW
};

function getInitialSimulationState(destination: Destination): HabitatSimulationState {
  const isMars = destination === 'mars';
  const baseSolar = isMars ? 95 : 110;
  const initialDemand = 90; // 25 + 20 + 20 + 15 + 10
  const initialNet = baseSolar - initialDemand;

  return {
    currentSol: 1,
    totalSols: 30,
    missionStatus: 'active',
    oxygenLevel: 98,
    o2Mode: 'standard',
    o2ScrubberEfficiency: 96,
    emergencyO2Canisters: 2,
    netO2Delta: 1, // Standard mode (+9%) - human metabolism (-8%) = +1%
    waterLevel: 96,
    waterRecyclerMode: 'advanced',
    waterRation: 'standard',
    iceSmeltingActive: false,
    iceReservesKg: 300,
    netWaterDelta: -1, // Standard ration (-8%) + advanced 92% recovery (+7.36%) = -1%
    batteryCharge: 100,
    solarDustAccumulation: 0,
    powerAllocation: { ...INITIAL_POWER_ALLOCATION },
    totalPowerGeneratedKw: baseSolar,
    totalPowerDemandKw: initialDemand,
    batteryDeltaKw: initialNet,
    habitatTempC: 21,
    habitatIntegrity: 100,
    currentEvent: getDailyEvent(destination, 1),
    lastDebriefMessage: isMars
      ? 'Sol 1 initialized. Ares Jezero Biosphere environmental loops connected. All life support systems nominal.'
      : 'Sol 1 initialized. Shackleton Base Camp environmental loops connected. All life support systems nominal.',
  };
}

export function useHabitatSimulation(
  destination: Destination,
  onJournalAdd?: (entry: JournalEntry) => void
) {
  const [state, setState] = useState<HabitatSimulationState>(() =>
    getInitialSimulationState(destination)
  );

  // Bug 1 Fix: Reset simulation to Sol 1 with destination-specific initial telemetry whenever destination changes
  useEffect(() => {
    setState(getInitialSimulationState(destination));
  }, [destination]);

  // Calculate live power demand and generation deterministically
  const calculations = useMemo(() => {
    const isMars = destination === 'mars';
    const baseSolar = isMars ? 95 : 110;
    const dustPenalty = Math.max(0.2, (100 - state.solarDustAccumulation * 0.45) / 100);
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
      lastDebriefMessage: 'Solar array wipers activated! Dust cleared—solar collection efficiency restored to 100%.',
    }));
  }, []);

  const useEmergencyO2Canister = useCallback(() => {
    setState((prev) => {
      if (prev.emergencyO2Canisters <= 0 || prev.missionStatus !== 'active') return prev;
      const newO2 = Math.min(100, prev.oxygenLevel + 25);
      return {
        ...prev,
        oxygenLevel: newO2,
        emergencyO2Canisters: prev.emergencyO2Canisters - 1,
        lastDebriefMessage: 'Emergency O₂ Canister released! +25% pressurized Oxygen added to habitat atmosphere.',
      };
    });
  }, []);

  // Advance Sol with strict Mission-State Protection, Deterministic Dust, Gradual Temperature, and Reliable Journaling
  const advanceSol = useCallback(() => {
    // 1. Mission-state protection: Cannot advance if already failed or completed
    if (state.missionStatus === 'critical' || state.missionStatus === 'victory') {
      return;
    }
    if (state.currentSol >= state.totalSols) {
      return;
    }

    const nextSol = state.currentSol + 1;
    const event = getDailyEvent(destination, nextSol);

    // 2. Battery calculations
    let newBattery = state.batteryCharge;
    if (calculations.netPowerKw >= 0) {
      newBattery = Math.min(100, Math.round(state.batteryCharge + calculations.netPowerKw * 0.35));
    } else {
      newBattery = Math.max(0, Math.round(state.batteryCharge + calculations.netPowerKw * 0.6));
    }

    // 3. Oxygen calculations
    let newO2 = Math.min(100, Math.max(0, state.oxygenLevel + calculations.o2Delta));
    let emergencyTriggered = false;
    let remainingCanisters = state.emergencyO2Canisters;

    // Automatic emergency canister safeguard if critically low (< 15%)
    if (newO2 < 15 && remainingCanisters > 0) {
      newO2 = Math.min(100, newO2 + 25);
      remainingCanisters -= 1;
      emergencyTriggered = true;
    }

    // 4. Water calculations
    const newWater = Math.min(100, Math.max(0, state.waterLevel + calculations.waterDelta));

    // Ice reserve usage
    let newIce = state.iceReservesKg;
    if (state.iceSmeltingActive && state.powerAllocation.iceSmelting && newIce >= 50) {
      newIce -= 50;
    }

    // 5. Deterministic dust accumulation (based on event and destination)
    const addedDust = event.dustAccumulation;
    const newDust = Math.min(85, state.solarDustAccumulation + addedDust);

    // 6. Gradual, bounded Temperature Simulation
    // When powered, heaters gently warm toward +21°C (+8°C per Sol).
    // When unpowered, habitat loses heat gradually (-8°C to -12°C per Sol) bounded by surface limits.
    const isHeated = state.powerAllocation.thermalRegulation && (newBattery > 0 || calculations.netPowerKw >= 0);
    const minAmbientTemp = destination === 'mars' ? -40 : -65;
    let newTemp = state.habitatTempC;

    if (isHeated) {
      if (newTemp < 21) {
        newTemp = Math.min(21, newTemp + 8);
      } else {
        newTemp = 21;
      }
    } else {
      // Cooling drop based on unheated exposure and shadow modifier
      const coolingDrop = 8 + Math.round(event.thermalModifierKw / 2);
      newTemp = Math.max(minAmbientTemp, newTemp - coolingDrop);
    }

    // 7. Habitat Integrity based on thermal stress and pressure
    let integrityDelta = 0;
    if (newTemp >= 18 && newO2 >= 40) {
      // Nominal habitat conditions: automated seal maintenance can slowly recover up to 100%
      if (state.habitatIntegrity < 100) {
        integrityDelta = +1;
      }
    } else if (newTemp < 0 && newTemp >= -15) {
      integrityDelta = -3; // Freezing causes contraction stress on seals
    } else if (newTemp < -15) {
      integrityDelta = -6; // Deep freeze causes severe seal brittleness
    } else if (newTemp < 10) {
      integrityDelta = -1; // Mild condensation on electronics
    }

    // Additional asphyxiation pressure loss penalty if O2 collapsed
    if (newO2 < 20) {
      integrityDelta -= 2;
    }

    const newIntegrity = Math.min(100, Math.max(0, state.habitatIntegrity + integrityDelta));

    // 8. Mission Status Check (Bug 2 Fix: mutually exclusive critical vs victory)
    let newStatus: 'active' | 'victory' | 'critical' = 'active';
    if (newO2 <= 5 || newWater <= 5 || newIntegrity <= 10) {
      newStatus = 'critical';
    } else if (nextSol >= 30) {
      if (newO2 > 15 && newWater > 15 && newIntegrity > 25) {
        newStatus = 'victory';
      } else {
        newStatus = 'critical';
      }
    }

    // 9. Build Debrief Message
    let debrief = `Sol ${nextSol} Operations Complete. `;
    if (newStatus === 'critical') {
      debrief += `⚠️ MISSION FAILED: Life-support reserves or habitat hull integrity reached critical limits. Reset required.`;
    } else if (newStatus === 'victory') {
      debrief += `🏆 30-SOL MISSION ACCOMPLISHED! Outstanding leadership, Junior Commander! You have successfully mastered 30 Sols on ${destination === 'mars' ? 'Mars' : 'the Moon'}.`;
    } else {
      if (emergencyTriggered) {
        debrief += `⚠️ Emergency O₂ auto-injected! `;
      }
      if (calculations.netPowerKw < 0) {
        debrief += `Batteries supplied ${Math.abs(calculations.netPowerKw)} kW of power. `;
      } else {
        debrief += `Solar surplus: +${calculations.netPowerKw} kW. `;
      }
      debrief += `O₂ is at ${newO2}%, Water is at ${newWater}%, Batteries at ${newBattery}%, Temp at ${newTemp}°C.`;
    }

    // 10. Update simulation state
    setState({
      currentSol: nextSol,
      totalSols: state.totalSols,
      missionStatus: newStatus,
      oxygenLevel: newO2,
      o2Mode: state.o2Mode,
      o2ScrubberEfficiency: state.o2ScrubberEfficiency,
      emergencyO2Canisters: remainingCanisters,
      netO2Delta: calculations.o2Delta,
      waterLevel: newWater,
      waterRecyclerMode: state.waterRecyclerMode,
      waterRation: state.waterRation,
      iceSmeltingActive: state.iceSmeltingActive,
      iceReservesKg: newIce,
      netWaterDelta: calculations.waterDelta,
      batteryCharge: newBattery,
      solarDustAccumulation: newDust,
      powerAllocation: state.powerAllocation,
      totalPowerGeneratedKw: calculations.powerGenerated,
      totalPowerDemandKw: calculations.totalDemand,
      batteryDeltaKw: calculations.netPowerKw,
      habitatTempC: newTemp,
      habitatIntegrity: newIntegrity,
      currentEvent: event,
      lastDebriefMessage: debrief,
    });

    // 11. Reliable Journaling: Emit journal entry OUTSIDE of setState!
    if (onJournalAdd) {
      const journalTitle = nextSol === 30
        ? 'Sol 30 Milestone: Mission Accomplished!'
        : `Sol ${nextSol} Field Operations & Resource Log`;

      const newJournalEntry: JournalEntry = {
        id: `sol-${nextSol}-${destination}`,
        sol: nextSol,
        title: journalTitle,
        author: 'Junior Commander (Flight Ops)',
        timestamp: `Sol ${nextSol} / 30 - ${destination === 'mars' ? 'Martian Solar Time' : 'Lunar Mission Time'}`,
        body: `Day summary: ${event.title}. ${debrief} Habitat environmental systems operating at ${newTemp}°C with ${newIntegrity}% structural integrity.`,
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
  }, [state, calculations, destination, onJournalAdd]);

  // Reset restores every initial value correctly according to the active destination
  const resetSimulation = useCallback(() => {
    setState(getInitialSimulationState(destination));
  }, [destination]);

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
