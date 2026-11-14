import React, { useState } from 'react';
import {
  Wind,
  Droplets,
  Zap,
  Sparkles,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Brush,
  Flame,
  ShieldCheck,
  Radio,
  FlaskConical,
  Award,
  Thermometer,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import {
  Destination,
  HabitatSimulationState,
  O2Mode,
  WaterRecyclerMode,
  WaterRation,
  PowerAllocation,
} from '../../types';

interface HabitatControlDeckProps {
  state: HabitatSimulationState;
  calculations: {
    powerGenerated: number;
    totalDemand: number;
    netPowerKw: number;
    o2Delta: number;
    waterDelta: number;
  };
  destination: Destination;
  onSetO2Mode: (mode: O2Mode) => void;
  onSetWaterRecyclerMode: (mode: WaterRecyclerMode) => void;
  onSetWaterRation: (ration: WaterRation) => void;
  onToggleIceSmelting: () => void;
  onTogglePowerAllocation: (key: keyof PowerAllocation) => void;
  onCleanSolarPanels: () => void;
  onUseEmergencyO2: () => void;
  onAdvanceSol: () => void;
  onResetSimulation: () => void;
}

export const HabitatControlDeck: React.FC<HabitatControlDeckProps> = ({
  state,
  calculations,
  destination,
  onSetO2Mode,
  onSetWaterRecyclerMode,
  onSetWaterRation,
  onToggleIceSmelting,
  onTogglePowerAllocation,
  onCleanSolarPanels,
  onUseEmergencyO2,
  onAdvanceSol,
  onResetSimulation,
}) => {
  const [activeSubsystem, setActiveSubsystem] = useState<'o2' | 'water' | 'power' | null>('o2');
  const isMars = destination === 'mars';

  const isSol30 = state.currentSol >= state.totalSols;
  const isMissionCritical = state.missionStatus === 'critical';
  // Bug 2 Fix: Show victory ONLY when missionStatus === 'victory' and never when critical
  const isMissionVictory = state.missionStatus === 'victory' && !isMissionCritical;

  const toggleSubsystem = (subsystem: 'o2' | 'water' | 'power') => {
    setActiveSubsystem(activeSubsystem === subsystem ? null : subsystem);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Sol Mission Controller Banner */}
      <div className="p-6 rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-r from-[#071330]/95 via-[#0A1D47]/95 to-[#05112B]/95 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          {/* Sol Counter & Daily Planetary Brief */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>EXPEDITION SOL {state.currentSol} OF {state.totalSols}</span>
              </span>

              {isMissionVictory && (
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>30-SOL VICTORY ACHIEVED!</span>
                </span>
              )}

              {isMissionCritical && (
                <span className="px-3 py-1 rounded-full bg-red-950 border border-red-500 text-red-300 font-mono text-xs font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>CRITICAL ALERT: MISSION HALTED</span>
                </span>
              )}

              <span className="text-xs font-mono text-slate-400">
                OUTPOST: {isMars ? 'ARES JEZERO' : 'SHACKLETON BASE'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {state.currentEvent.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {state.currentEvent.description}
            </p>

            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-cyan-300/90 pt-1">
              <span className="font-bold uppercase tracking-wider text-cyan-400">NOVA Flight Tip:</span>
              <span>{state.currentEvent.tip}</span>
            </div>
          </div>

          {/* Sol Advancement & Mission-State Protection Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* 1. Critical Failure State */}
            {isMissionCritical && (
              <div className="px-5 py-3 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 font-bold text-xs sm:text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Mission Failed: Reset required to continue</span>
              </div>
            )}

            {/* 2. Victory State */}
            {isMissionVictory && (
              <div className="px-5 py-3 rounded-2xl bg-emerald-600/30 border border-emerald-400 text-emerald-200 font-bold text-xs sm:text-sm flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Mission Completed! 30 Sols Survived!</span>
              </div>
            )}

            {/* 3. Active Mission Advancement Button */}
            {!isMissionCritical && !isMissionVictory && !isSol30 && (
              <button
                onClick={onAdvanceSol}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base shadow-xl shadow-cyan-900/50 border border-cyan-300/40 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>Execute Sol {state.currentSol} Operations</span>
                <ChevronRight className="w-5 h-5 text-cyan-200" />
              </button>
            )}

            {/* Reset Button (Always available, highlighted if critical) */}
            <button
              onClick={onResetSimulation}
              title="Reset Habitat to Sol 1"
              className={`px-4 py-3 rounded-2xl text-xs font-mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                isMissionCritical
                  ? 'bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-900/50 border border-red-400 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isMissionCritical ? 'Reset Mission' : 'Reset'}</span>
            </button>
          </div>

        </div>

        {/* 30-Sol Visual Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Sol 1 (Touchdown)</span>
            <span className="text-cyan-300 font-bold">Progress: {Math.round((state.currentSol / state.totalSols) * 100)}%</span>
            <span>Sol 30 (Mission Wings)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMissionCritical
                  ? 'bg-red-500'
                  : isMissionVictory
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                  : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-sm shadow-cyan-400'
              }`}
              style={{ width: `${(state.currentSol / state.totalSols) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical Alert Warning Card (if mission failed) */}
      {isMissionCritical && (
        <div className="p-5 rounded-2xl border-2 border-red-500 bg-red-950/70 backdrop-blur-xl text-red-200 space-y-2 shadow-2xl animate-fadeIn">
          <div className="flex items-center space-x-2 text-sm font-bold text-red-300">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>MISSION FAILED: Life Support Exhaustion or Hull Failure</span>
          </div>
          <p className="text-xs text-red-200/90 leading-relaxed">
            One or more vital habitat parameters dropped below survivable safety thresholds (Oxygen &le; 5%, Water &le; 5%, or Structural Integrity &le; 10%). Sol advancement has been locked to protect crew safety telemetry. Click the pulsing <strong>Reset Mission</strong> button above to re-initialize your habitat systems.
          </p>
        </div>
      )}

      {/* ================= FOUR PRIMARY RESOURCE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Oxygen */}
        <div className="p-5 rounded-3xl bg-[#070F2B]/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Primary Gas</div>
                  <h4 className="text-sm font-bold text-white">Oxygen (O₂)</h4>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                state.oxygenLevel > 70
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : state.oxygenLevel > 30
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
              }`}>
                {state.oxygenLevel > 70 ? 'NOMINAL' : state.oxygenLevel > 30 ? 'CAUTION' : 'CRITICAL'}
              </span>
            </div>

            {/* Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Atmosphere Tank</span>
                <span className="text-cyan-300 font-bold">{state.oxygenLevel}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    state.oxygenLevel > 70 ? 'bg-cyan-400' : state.oxygenLevel > 30 ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${state.oxygenLevel}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-right">
                Net Delta: {calculations.o2Delta >= 0 ? `+${calculations.o2Delta}%/Sol` : `${calculations.o2Delta}%/Sol`}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isMars ? 'MOXIE cracks atmospheric CO₂.' : 'Electrolysis splits water into breathable air.'}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={onUseEmergencyO2}
              disabled={state.emergencyO2Canisters <= 0 || isMissionCritical}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                state.emergencyO2Canisters > 0 && !isMissionCritical
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Emergency O₂ (+25%) [{state.emergencyO2Canisters}]</span>
            </button>

            <button
              onClick={() => toggleSubsystem('o2')}
              className="w-full py-1.5 text-[11px] font-mono text-cyan-300 hover:text-white flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Subsystem Settings</span>
              {activeSubsystem === 'o2' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Card 2: Water */}
        <div className="p-5 rounded-3xl bg-[#070F2B]/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Potable Fluid</div>
                  <h4 className="text-sm font-bold text-white">Water (H₂O)</h4>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                state.waterLevel > 70
                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                  : state.waterLevel > 30
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
              }`}>
                {state.waterLevel > 70 ? 'NOMINAL' : state.waterLevel > 30 ? 'CAUTION' : 'CRITICAL'}
              </span>
            </div>

            {/* Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Purified Storage</span>
                <span className="text-blue-300 font-bold">{state.waterLevel}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    state.waterLevel > 70 ? 'bg-blue-400' : state.waterLevel > 30 ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${state.waterLevel}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-right">
                Net Delta: {calculations.waterDelta >= 0 ? `+${calculations.waterDelta}%/Sol` : `${calculations.waterDelta}%/Sol`}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ECLSS closed-loop recyclers recover 92% of graywater &amp; humidity.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={onToggleIceSmelting}
              disabled={isMissionCritical}
              className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                state.iceSmeltingActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Ice Smelter: {state.iceSmeltingActive ? 'ON (+7%)' : 'OFF'}</span>
            </button>

            <button
              onClick={() => toggleSubsystem('water')}
              className="w-full py-1.5 text-[11px] font-mono text-blue-300 hover:text-white flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Subsystem Settings</span>
              {activeSubsystem === 'water' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Card 3: Power */}
        <div className="p-5 rounded-3xl bg-[#070F2B]/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Energy Grid</div>
                  <h4 className="text-sm font-bold text-white">Power &amp; Battery</h4>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                state.batteryCharge > 60
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : state.batteryCharge > 25
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
              }`}>
                {calculations.netPowerKw >= 0 ? 'CHARGING' : 'DRAINING'}
              </span>
            </div>

            {/* Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Battery Bank</span>
                <span className="text-amber-300 font-bold">{state.batteryCharge}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    state.batteryCharge > 60 ? 'bg-amber-400' : state.batteryCharge > 25 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${state.batteryCharge}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-right">
                Net Flow: {calculations.netPowerKw >= 0 ? `+${calculations.netPowerKw} kW` : `${calculations.netPowerKw} kW`}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Solar Gen: {calculations.powerGenerated} kW • Demand: {calculations.totalDemand} kW.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={onCleanSolarPanels}
              disabled={isMissionCritical}
              className="w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
            >
              <Brush className="w-3.5 h-3.5" />
              <span>Clean Dust Wipers ({state.solarDustAccumulation}%)</span>
            </button>

            <button
              onClick={() => toggleSubsystem('power')}
              className="w-full py-1.5 text-[11px] font-mono text-amber-300 hover:text-white flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Subsystem Settings</span>
              {activeSubsystem === 'power' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Card 4: Temperature & Integrity */}
        <div className="p-5 rounded-3xl bg-[#070F2B]/90 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Environment</div>
                  <h4 className="text-sm font-bold text-white">Habitat &amp; Hull</h4>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {state.habitatTempC >= 18 ? 'NOMINAL' : 'COLD STRESS'}
              </span>
            </div>

            {/* Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Structural Integrity</span>
                <span className="text-emerald-300 font-bold">{state.habitatIntegrity}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${state.habitatIntegrity}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-right">
                Interior Temp: {state.habitatTempC}°C
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Thermal heating units regulate temperature against harsh space cold.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span>Heating Status:</span>
              <span className={`font-bold ${state.powerAllocation.thermalRegulation ? 'text-emerald-400' : 'text-red-400'}`}>
                {state.powerAllocation.thermalRegulation ? 'POWERED (21°C)' : 'UNPOWERED'}
              </span>
            </div>

            <button
              onClick={() => toggleSubsystem('power')}
              className="w-full py-1.5 text-[11px] font-mono text-emerald-300 hover:text-white flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Manage Thermal Grid</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= EXPANDABLE SUBSYSTEM PANELS ================= */}
      {activeSubsystem && (
        <div className="p-6 rounded-3xl border border-slate-800 bg-[#070F2B]/95 backdrop-blur-xl shadow-2xl space-y-5 animate-fadeIn">
          
          {/* Subsystem Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
                Advanced {activeSubsystem === 'o2' ? 'Oxygen Production' : activeSubsystem === 'water' ? 'ECLSS Water Recycling' : 'Electrical Grid Matrix'} Controls
              </h3>
            </div>
            <button
              onClick={() => setActiveSubsystem(null)}
              className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              Close Panel [X]
            </button>
          </div>

          {/* OXYGEN SUBSYSTEM */}
          {activeSubsystem === 'o2' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => !isMissionCritical && onSetO2Mode('eco')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.o2Mode === 'eco' ? 'border-cyan-400 bg-cyan-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Eco-Conservation</span>
                    {state.o2Mode === 'eco' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mb-1.5">Demand: 15 kW • Net: -2%/Sol</div>
                  <p className="text-[11px] text-slate-400">Saves power during dust storms. Crew breathes slightly conserved air.</p>
                </div>

                <div
                  onClick={() => !isMissionCritical && onSetO2Mode('standard')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.o2Mode === 'standard' ? 'border-cyan-400 bg-cyan-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Standard Mode</span>
                    {state.o2Mode === 'standard' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono mb-1.5">Demand: 25 kW • Net: +1%/Sol</div>
                  <p className="text-[11px] text-slate-400">Balanced closed-loop recycling. Replenishes oxygen at nominal metabolic pace.</p>
                </div>

                <div
                  onClick={() => !isMissionCritical && onSetO2Mode('boost')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.o2Mode === 'boost' ? 'border-cyan-400 bg-cyan-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Max Boost Mode</span>
                    {state.o2Mode === 'boost' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mb-1.5">Demand: 35 kW • Net: +5%/Sol</div>
                  <p className="text-[11px] text-slate-400">Runs compressors at peak capacity to rapidly refill reserve tanks.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>CO₂ Scrubbers (Lithium Hydroxide Canisters): {state.o2ScrubberEfficiency}% Efficient</span>
                </div>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
            </div>
          )}

          {/* WATER SUBSYSTEM */}
          {activeSubsystem === 'water' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => !isMissionCritical && onSetWaterRecyclerMode('basic')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.waterRecyclerMode === 'basic' ? 'border-blue-400 bg-blue-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Basic Recycler</span>
                    {state.waterRecyclerMode === 'basic' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mb-1.5">Demand: 10 kW • 75% Recovery</div>
                  <p className="text-[11px] text-slate-400">Uses low power. Recommended when solar collection is reduced by dust.</p>
                </div>

                <div
                  onClick={() => !isMissionCritical && onSetWaterRecyclerMode('advanced')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.waterRecyclerMode === 'advanced' ? 'border-blue-400 bg-blue-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Advanced Catalytic</span>
                    {state.waterRecyclerMode === 'advanced' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-mono mb-1.5">Demand: 20 kW • 92% Recovery</div>
                  <p className="text-[11px] text-slate-400">NASA standard closed loop. Multi-stage filtration guarantees ultra-clean water.</p>
                </div>

                <div
                  onClick={() => !isMissionCritical && onSetWaterRecyclerMode('hyper')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    state.waterRecyclerMode === 'hyper' ? 'border-blue-400 bg-blue-950/50 shadow-md' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                    <span>Hyper Vapor-Filter</span>
                    {state.waterRecyclerMode === 'hyper' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mb-1.5">Demand: 30 kW • 98% Recovery</div>
                  <p className="text-[11px] text-slate-400">Recovers virtually 100% of all moisture in the habitat.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs font-mono text-slate-400 self-center mr-2">Crew Rationing:</span>
                {(['strict', 'standard', 'generous'] as WaterRation[]).map((ration) => (
                  <button
                    key={ration}
                    onClick={() => !isMissionCritical && onSetWaterRation(ration)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-colors cursor-pointer ${
                      state.waterRation === ration
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ration} ({ration === 'strict' ? '-5%/Sol' : ration === 'standard' ? '-8%/Sol' : '-12%/Sol'})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* POWER SUBSYSTEM */}
          {activeSubsystem === 'power' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div
                  onClick={() => !isMissionCritical && onTogglePowerAllocation('lifeSupportO2')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    state.powerAllocation.lifeSupportO2 ? 'bg-blue-950/60 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span>Life Support O₂ (25 kW)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${state.powerAllocation.lifeSupportO2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {state.powerAllocation.lifeSupportO2 ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div
                  onClick={() => !isMissionCritical && onTogglePowerAllocation('waterRecycling')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    state.powerAllocation.waterRecycling ? 'bg-blue-950/60 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span>Water Recycler (20 kW)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${state.powerAllocation.waterRecycling ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {state.powerAllocation.waterRecycling ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div
                  onClick={() => !isMissionCritical && onTogglePowerAllocation('thermalRegulation')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    state.powerAllocation.thermalRegulation ? 'bg-blue-950/60 border-amber-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span>Thermal Heating (20 kW)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${state.powerAllocation.thermalRegulation ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {state.powerAllocation.thermalRegulation ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div
                  onClick={() => !isMissionCritical && onTogglePowerAllocation('scienceLab')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    state.powerAllocation.scienceLab ? 'bg-blue-950/60 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="w-4 h-4 text-purple-400" />
                    <span>Science Lab (15 kW)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${state.powerAllocation.scienceLab ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {state.powerAllocation.scienceLab ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div
                  onClick={() => !isMissionCritical && onTogglePowerAllocation('communications')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    state.powerAllocation.communications ? 'bg-blue-950/60 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>DSN Comms (10 kW)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${state.powerAllocation.communications ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {state.powerAllocation.communications ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Sol Debrief Message Banner */}
      <div className="p-4 rounded-2xl bg-[#091533]/80 border border-blue-900/60 flex items-start space-x-3 text-xs text-slate-200 shadow-md">
        <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-bold block mb-0.5">
            Mission Debrief Telemetry:
          </span>
          <p className="leading-relaxed">{state.lastDebriefMessage}</p>
        </div>
      </div>

    </div>
  );
};
