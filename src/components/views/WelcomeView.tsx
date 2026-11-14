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
} from 'lucide-react';
import { NavTab, Destination, HabitatSimulationState } from '../../types';

interface WelcomeViewProps {
  onNavigate: (tab: NavTab) => void;
  destination: Destination;
  simulationState: HabitatSimulationState;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onNavigate,
  destination,
  simulationState,
}) => {
  const isMars = destination === 'mars';
  const isCritical = simulationState.missionStatus === 'critical';
  const isVictory = simulationState.missionStatus === 'victory';

  const progressPercent = Math.round((simulationState.currentSol / simulationState.totalSols) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0A1E4A]/95 via-[#071333]/90 to-[#040A1D]/95 p-6 sm:p-10 shadow-2xl shadow-blue-950/80 backdrop-blur-xl overflow-hidden">
        
        {/* Decorative Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-5">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>NASA JUNIOR ASTRONAUT CADET ACADEMY</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 font-mono text-xs">
              INDEPENDENT EDUCATIONAL EXPERIENCE
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              BUILDSCAPES: <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-300">
                Apollo to Artemis
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Command your own research habitat on the Moon or Mars! Manage closed-loop life support, explore extraterrestrial landmarks, and survive a 30-Sol scientific mission.
            </p>
          </div>

          {/* Current Destination & Sol Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 font-bold">
                  ACTIVE OUTPOST: {isMars ? 'MARS • ARES JEZERO' : 'MOON • SHACKLETON CRATER'}
                </span>
              </div>
              <span className="text-cyan-300 font-bold">
                SOL {simulationState.currentSol} OF {simulationState.totalSols} ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical
                    ? 'bg-red-500'
                    : isVictory
                    ? 'bg-emerald-400'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('habitat')}
              className="flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/40 border border-blue-400/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-200" />
              <span>Enter Habitat Command Deck</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('exploration')}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all duration-200 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Explore Planetary Surface</span>
            </button>

            <button
              onClick={() => onNavigate('missions')}
              className="flex items-center space-x-2 px-4 py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Switch World</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Resource Overview Cards (4 Clean Highlights) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Habitat Resource Telemetry Overview</span>
          </h2>
          <button
            onClick={() => onNavigate('habitat')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Subsystems &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Oxygen Card */}
          <div
            onClick={() => onNavigate('habitat')}
            className="p-4 rounded-2xl bg-[#070F2B]/85 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-md cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <div className="flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>OXYGEN</span>
              </div>
              <span className={`font-bold ${simulationState.oxygenLevel < 30 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                {simulationState.oxygenLevel}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${simulationState.oxygenLevel < 30 ? 'bg-red-500' : 'bg-cyan-400'}`}
                style={{ width: `${simulationState.oxygenLevel}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              {isMars ? 'MOXIE CO₂-cracking unit online.' : 'Electrolysis loops generating O₂.'}
            </p>
          </div>

          {/* Water Card */}
          <div
            onClick={() => onNavigate('habitat')}
            className="p-4 rounded-2xl bg-[#070F2B]/85 border border-slate-800 hover:border-blue-500/50 backdrop-blur-md cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <div className="flex items-center space-x-1.5">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>WATER (H₂O)</span>
              </div>
              <span className={`font-bold ${simulationState.waterLevel < 30 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                {simulationState.waterLevel}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${simulationState.waterLevel < 30 ? 'bg-red-500' : 'bg-blue-400'}`}
                style={{ width: `${simulationState.waterLevel}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              ECLSS closed-loop graywater recovery active.
            </p>
          </div>

          {/* Power Card */}
          <div
            onClick={() => onNavigate('habitat')}
            className="p-4 rounded-2xl bg-[#070F2B]/85 border border-slate-800 hover:border-amber-500/50 backdrop-blur-md cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>POWER GRID</span>
              </div>
              <span className={`font-bold ${simulationState.batteryCharge < 25 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                {simulationState.batteryCharge}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${simulationState.batteryCharge < 25 ? 'bg-red-500' : 'bg-amber-400'}`}
                style={{ width: `${simulationState.batteryCharge}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Solar generation: {simulationState.totalPowerGeneratedKw} kW.
            </p>
          </div>

          {/* Temperature & Integrity Card */}
          <div
            onClick={() => onNavigate('habitat')}
            className="p-4 rounded-2xl bg-[#070F2B]/85 border border-slate-800 hover:border-emerald-500/50 backdrop-blur-md cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <div className="flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <span>HABITAT HULL</span>
              </div>
              <span className="font-bold text-emerald-300">
                {simulationState.habitatIntegrity}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${simulationState.habitatIntegrity}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Interior temperature: {simulationState.habitatTempC}°C (Nominal).
            </p>
          </div>

        </div>
      </div>

      {/* Active Sol Objective Banner */}
      <div className="p-5 rounded-2xl border border-blue-900/60 bg-[#070F2B]/90 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SOL {simulationState.currentSol} OBJECTIVE:</span>
            <span className="text-white font-sans text-sm">{simulationState.currentEvent.title}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {simulationState.currentEvent.description}
          </p>
        </div>

        <button
          onClick={() => onNavigate('habitat')}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors flex-shrink-0 cursor-pointer"
        >
          <span>Manage Sol {simulationState.currentSol}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Apollo to Artemis Educational Spotlight Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/70 to-slate-950/80 border border-blue-900/60 backdrop-blur-md space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-300">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>APOLLO (1969–1972)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Apollo proved that humans could reach the Moon, land safely, and return to Earth. Astronauts stayed on the lunar surface for hours to days using battery-powered life support.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-950/80 border border-indigo-900/60 backdrop-blur-md space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-300">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <span>ARTEMIS GENERATION (TODAY &amp; BEYOND)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Artemis establishes permanent bases at the Lunar South Pole, mining water ice for fuel and using the Moon as a stepping stone for humanity's crewed expedition to Mars!
          </p>
        </div>
      </div>

    </div>
  );
};
