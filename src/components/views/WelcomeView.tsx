import React from 'react';
import {
  Rocket,
  Compass,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Wind,
  Droplets,
  Zap,
  Thermometer,
  Moon,
  Flame,
  CheckCircle2,
  BookOpen,
  Trophy,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import { NavTab, Destination, HabitatSimulationState } from '../../types';
import { MISSIONS } from '../../data/missions';

interface WelcomeViewProps {
  onNavigate: (tab: NavTab) => void;
  destination: Destination;
  simulationState: HabitatSimulationState;
  onSelectDestination?: (dest: Destination) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onNavigate,
  destination,
  simulationState,
  onSelectDestination,
}) => {
  const isMars = destination === 'mars';
  const isCritical = simulationState.missionStatus === 'critical';
  const isVictory = simulationState.missionStatus === 'victory';

  const currentSol = simulationState.currentSol;
  const totalSols = simulationState.totalSols;
  const progressPercent = Math.round((currentSol / totalSols) * 100);

  const moonMission = MISSIONS.moon;
  const marsMission = MISSIONS.mars;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* 1. CINEMATIC HERO MISSION BANNER */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#06122c]/95 via-[#08183a]/90 to-[#030917]/98 p-6 sm:p-10 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl overflow-hidden">
        
        {/* Aerospace Grid & Radar Background Accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e2a5e12_1px,transparent_1px),linear-gradient(to_bottom,#0e2a5e12_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-6">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>NASA JUNIOR ASTRONAUT ACADEMY</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 font-mono text-xs">
                MISSION DESIGNATION: <strong className="text-white">{isMars ? 'ARES-30 JEZERO' : 'ARTEMIS-30 BASE'}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-400 animate-ping' : isVictory ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span>STATUS: {simulationState.missionStatus.toUpperCase()}</span>
              </span>
            </div>
          </div>

          {/* Main Title & Mission Brief */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              BUILDSCAPES: <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200">
                Apollo to Artemis
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Step into the boots of a Junior Astronaut Commander! Operate a self-sustaining research habitat, manage closed-loop oxygen, water, and power systems, survive extraterrestrial hazards, and complete your 30-Sol scientific expedition.
            </p>
          </div>

          {/* Interactive Sol Progress Tracker */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 font-medium">Expedition Timeline:</span>
                <span className="text-cyan-300 font-bold">
                  SOL {currentSol} OF {totalSols}
                </span>
              </div>
              <span className="text-slate-400 font-mono">
                {progressPercent}% Completed
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCritical
                    ? 'bg-red-500'
                    : isVictory
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
              <span>Sol 1: Touchdown &amp; Seals</span>
              <span>Sol 15: Halfway Operations</span>
              <span>Sol 30: Mission Graduation</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('habitat')}
              className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm sm:text-base shadow-xl shadow-cyan-900/40 border border-cyan-400/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-white animate-pulse" />
              <span>{currentSol === 1 ? 'Start Sol 1 Mission' : `Continue Mission (Sol ${currentSol})`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('exploration')}
              className="flex items-center space-x-2.5 px-5 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer shadow-lg"
            >
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Planetary Surface EVA</span>
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className="flex items-center space-x-2 px-4 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Flight Logs</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. FOUR ESSENTIAL HABITAT STATUS INDICATORS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Life-Support Subsystem Status (Sol {currentSol})
            </h2>
          </div>
          <button
            onClick={() => onNavigate('habitat')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>Open Subsystem Deck</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Oxygen Atmosphere */}
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl shadow-lg hover:border-cyan-400/60 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Wind className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Atmosphere</div>
                  <div className="text-sm font-bold text-white">Oxygen (O₂)</div>
                </div>
              </div>
              <span className={`text-xl font-mono font-black ${simulationState.oxygenLevel > 50 ? 'text-cyan-300' : 'text-red-400'}`}>
                {simulationState.oxygenLevel}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Mode: <strong className="text-cyan-300 uppercase">{simulationState.o2Mode}</strong></span>
              <span>Canisters: <strong className="text-white">{simulationState.emergencyO2Canisters}</strong></span>
            </div>
          </div>

          {/* Card 2: Water Reserves */}
          <div className="p-4 rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl shadow-lg hover:border-blue-400/60 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Droplets className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Hydration</div>
                  <div className="text-sm font-bold text-white">Water (H₂O)</div>
                </div>
              </div>
              <span className={`text-xl font-mono font-black ${simulationState.waterLevel > 50 ? 'text-blue-300' : 'text-red-400'}`}>
                {simulationState.waterLevel}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Recycler: <strong className="text-blue-300 uppercase">{simulationState.waterRecyclerMode}</strong></span>
              <span>Ice: <strong className="text-white">{simulationState.iceReservesKg} kg</strong></span>
            </div>
          </div>

          {/* Card 3: Electrical Power */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-slate-900/80 backdrop-blur-xl shadow-lg hover:border-amber-400/60 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Power Grid</div>
                  <div className="text-sm font-bold text-white">Battery Bank</div>
                </div>
              </div>
              <span className={`text-xl font-mono font-black ${simulationState.batteryCharge > 30 ? 'text-amber-300' : 'text-red-400'}`}>
                {simulationState.batteryCharge}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Net: <strong className={simulationState.batteryDeltaKw >= 0 ? 'text-emerald-400' : 'text-red-400'}>{simulationState.batteryDeltaKw >= 0 ? `+${simulationState.batteryDeltaKw}` : simulationState.batteryDeltaKw} kW</strong></span>
              <span>Dust: <strong className="text-white">{simulationState.solarDustAccumulation}%</strong></span>
            </div>
          </div>

          {/* Card 4: Habitat Integrity & Thermal */}
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl shadow-lg hover:border-emerald-400/60 transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Thermometer className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Environment</div>
                  <div className="text-sm font-bold text-white">Hull &amp; Thermal</div>
                </div>
              </div>
              <span className="text-xl font-mono font-black text-emerald-300">
                {simulationState.habitatIntegrity}%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Temp: <strong className="text-white">{simulationState.habitatTempC}°C</strong></span>
              <span>Target: <strong className="text-emerald-400">21°C</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. ATTRACTIVE MOON AND MARS DESTINATION CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Planetary Outpost Destinations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('missions')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>Compare Worlds</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ================= MOON DESTINATION CARD ================= */}
          <div
            onClick={() => {
              if (onSelectDestination) onSelectDestination('moon');
              onNavigate('habitat');
            }}
            className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group ${
              !isMars
                ? 'border-cyan-400/90 bg-gradient-to-br from-[#082046]/95 to-[#040e24]/95 shadow-xl shadow-cyan-950/50'
                : 'border-slate-800 bg-[#070f26]/80 hover:border-cyan-500/50 hover:bg-[#08183a]/80'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md group-hover:scale-105 transition-transform">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                      DESTINATION ALPHA
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <span>The Moon (Luna)</span>
                      {!isMars && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-cyan-400/60 transition-colors">
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-cyan-300 font-semibold">{moonMission.location}</div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {moonMission.tagline}
                </p>
              </div>

              {/* Scientific Stats Pills */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Gravity</div>
                  <div className="font-bold text-slate-100">{moonMission.gravity}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Atmosphere</div>
                  <div className="font-bold text-slate-100">Vacuum</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Era</div>
                  <div className="font-bold text-cyan-300">Artemis Base</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Primary Objective:</span>
              <span className="text-cyan-300 font-semibold truncate max-w-[200px]">Map Cold Traps &amp; Ice</span>
            </div>
          </div>

          {/* ================= MARS DESTINATION CARD ================= */}
          <div
            onClick={() => {
              if (onSelectDestination) onSelectDestination('mars');
              onNavigate('habitat');
            }}
            className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group ${
              isMars
                ? 'border-amber-400/90 bg-gradient-to-br from-[#38160e]/95 to-[#1c0c07]/95 shadow-xl shadow-amber-950/50'
                : 'border-slate-800 bg-[#160c0c]/80 hover:border-amber-500/50 hover:bg-[#22100d]/80'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                      DESTINATION BETA
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <span>Mars (Ares)</span>
                      {isMars && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-amber-400/60 transition-colors">
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-amber-300 font-semibold">{marsMission.location}</div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {marsMission.tagline}
                </p>
              </div>

              {/* Scientific Stats Pills */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Gravity</div>
                  <div className="font-bold text-slate-100">{marsMission.gravity}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Atmosphere</div>
                  <div className="font-bold text-slate-100">95% CO₂</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Era</div>
                  <div className="font-bold text-amber-300">MOXIE ISRU</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Primary Objective:</span>
              <span className="text-amber-300 font-semibold truncate max-w-[200px]">Test MOXIE O₂ &amp; Sediments</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. APOLLO TO ARTEMIS HISTORICAL SPOTLIGHT */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex items-center space-x-3 text-cyan-400">
          <Layers className="w-6 h-6" />
          <h2 className="text-lg font-black text-white uppercase tracking-wider font-mono">
            The Scientific Evolution: Apollo (1969) to Artemis (2026+)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-bold text-cyan-300 font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Apollo Heritage (Short Stays):</span>
            </div>
            <p>
              Apollo astronauts stayed on the lunar surface between 21 hours (Apollo 11) and 75 hours (Apollo 17). All oxygen, water, and food had to be carried from Earth in fuel cells and tanks because there were no recycling systems on the Lunar Module.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-bold text-amber-300 font-mono flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Artemis &amp; Mars Future (Permanent Closed-Loop):</span>
            </div>
            <p>
              For a 30-Sol or multi-year mission, carrying all consumables is impossible. Astronauts must master closed-loop life support (ECLSS): recovering 98% of water, harvesting polar ice, and generating oxygen directly from extraterrestrial rock and atmosphere!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
