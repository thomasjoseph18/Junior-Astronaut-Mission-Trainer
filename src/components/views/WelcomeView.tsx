import React from 'react';
import {
  Rocket,
  Compass,
  Sparkles,
  ChevronRight,
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
  Radio,
  Scale,
  Clock,
  Eye,
} from 'lucide-react';
import { NavTab, Destination, HabitatSimulationState } from '../../types';
import { MISSIONS } from '../../data/missions';
import { CircularGauge } from '../common/CircularGauge';

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
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* 1. CINEMATIC AEROSPACE MISSION COCKPIT HERO */}
      <div className="relative rounded-3xl aerospace-hud p-6 sm:p-10 overflow-hidden">
        {/* Technical HUD Corner Reticles */}
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Two-Column Responsive Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Command Title & Mission Brief */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Top Military/Aerospace Identification Beacon */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-bold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NASA JUNIOR ASTRONAUT CADET CORPS</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 font-mono text-xs">
                OUTPOST: <strong className={isMars ? 'text-amber-400' : 'text-cyan-300'}>{isMars ? 'ARES JEZERO BIOSPHERE' : 'SHACKLETON BASE CAMP'}</strong>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                CLASS: FLIGHT DECK
              </span>
            </div>

            {/* Main Cinematic Title */}
            <div className="space-y-1">
              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(56,189,248,0.35)] leading-tight">
                BUILDSCAPES
              </h1>
              <div className="text-xl sm:text-3xl font-tech font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-300 uppercase">
                Apollo to Artemis Expedition
              </div>
            </div>

            {/* Mission Pitch Briefing */}
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-sans font-normal">
              Commander, take operational command of humanity's off-world research base. Balance closed-loop oxygen, water, and power systems across a demanding 30-Sol mission, survey alien geological landmarks, and advance from Apollo’s bootprints to the Artemis future!
            </p>

            {/* Segmented Sol Timeline */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300 font-semibold uppercase">Expedition Timeline:</span>
                  <span className="text-cyan-300 font-bold">
                    SOL {currentSol} OF {totalSols}
                  </span>
                </div>
                <span className="text-slate-400 font-mono">
                  {progressPercent}% Complete
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isCritical
                      ? 'bg-red-500 glow-red'
                      : isVictory
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 glow-amber'
                      : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 glow-cyan'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                <span>Sol 1: Touchdown</span>
                <span>Sol 15: Halfway Operations</span>
                <span>Sol 30: Mission Wings</span>
              </div>
            </div>

            {/* High-Impact Primary CTA Console */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('habitat')}
                className="flex items-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-display font-black text-sm sm:text-base shadow-xl shadow-cyan-900/50 border border-cyan-300/50 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer glow-cyan"
              >
                <Rocket className="w-5 h-5 text-white animate-pulse" />
                <span>{currentSol === 1 ? 'LAUNCH SOL 1 OPERATIONS' : `RESUME MISSION (SOL ${currentSol})`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('exploration')}
                className="flex items-center space-x-2 px-5 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-tech font-bold text-sm tracking-wider border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer shadow-lg"
              >
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>SURFACE EVA SURVEY</span>
              </button>

              <button
                onClick={() => onNavigate('journal')}
                className="flex items-center space-x-2 px-4 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>FLIGHT LOGS</span>
              </button>
            </div>

          </div>

          {/* Right Column: Real-Time Orbital Telemetry Aperture */}
          <div className="lg:col-span-5">
            <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all relative overflow-hidden backdrop-blur-xl ${
              isMars
                ? 'border-amber-500/40 bg-gradient-to-b from-[#251009]/90 to-[#100603]/95 shadow-xl shadow-amber-950/40'
                : 'border-cyan-500/40 bg-gradient-to-b from-[#061738]/90 to-[#030c20]/95 shadow-xl shadow-cyan-950/40'
            }`}>
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Radio className={`w-4 h-4 ${isMars ? 'text-amber-400' : 'text-cyan-400'} animate-pulse`} />
                  <span className="font-tech text-xs font-bold tracking-widest uppercase text-slate-200">
                    ORBITAL TELEMETRY FEED
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  isMars
                    ? 'bg-amber-950 border-amber-500/40 text-amber-300'
                    : 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                }`}>
                  {isMars ? 'MARS ORBIT' : 'LUNAR POLAR ORBIT'}
                </span>
              </div>

              {/* Planet Quick Switch Pill */}
              <div className="my-4 p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDestination && onSelectDestination('moon')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-tech font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    !isMars
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>MOON (ARTEMIS)</span>
                </button>

                <button
                  onClick={() => onSelectDestination && onSelectDestination('mars')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-tech font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isMars
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>MARS (JEZERO)</span>
                </button>
              </div>

              {/* Telemetry Matrix Grid */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Site:</span>
                  </div>
                  <strong className="text-white font-mono text-[11px]">
                    {isMars ? 'Jezero Delta (18.38°N, 77.58°E)' : 'Shackleton Rim (89.9°S, 0.0°E)'}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Surface Gravity:</span>
                  </div>
                  <strong className="text-slate-200">
                    {isMars ? '0.379 g (3.72 m/s²)' : '0.166 g (1.62 m/s²)'}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Solar Diurnal Cycle:</span>
                  </div>
                  <strong className="text-slate-200">
                    {isMars ? '24h 39m Solar Sol' : 'Peaks of Eternal Light'}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Radio className="w-3.5 h-3.5 text-blue-400" />
                    <span>DSN Signal Delay:</span>
                  </div>
                  <strong className="text-slate-200">
                    {isMars ? '14.2 min (Auto-Life Support)' : '1.3 sec (Direct Houston Link)'}
                  </strong>
                </div>
              </div>

              {/* Viewport Hint */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3D Viewport Active Behind HUD</span>
                </span>
                <span className="text-cyan-300 font-bold">DRAG TO ROTATE</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. FOUR HIGH-TECH CIRCULAR AEROSPACE RESOURCE GAUGES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Life-Support Subsystem Gauges (Sol {currentSol})
            </h2>
          </div>
          <button
            onClick={() => onNavigate('habitat')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>Open Engineering Deck</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gauge 1: Oxygen */}
          <CircularGauge
            value={simulationState.oxygenLevel}
            label="Oxygen Atmosphere"
            subLabel={`Mode: ${simulationState.o2Mode}`}
            color={simulationState.oxygenLevel > 50 ? 'cyan' : 'red'}
            icon={Wind}
            statusText={simulationState.oxygenLevel > 70 ? 'NOMINAL' : simulationState.oxygenLevel > 30 ? 'CAUTION' : 'CRITICAL'}
            deltaText={simulationState.netO2Delta >= 0 ? `+${simulationState.netO2Delta}%/Sol` : `${simulationState.netO2Delta}%/Sol`}
            onClick={() => onNavigate('habitat')}
          />

          {/* Gauge 2: Water */}
          <CircularGauge
            value={simulationState.waterLevel}
            label="Water Recycling"
            subLabel={`Loop: ${simulationState.waterRecyclerMode}`}
            color={simulationState.waterLevel > 50 ? 'blue' : 'red'}
            icon={Droplets}
            statusText={simulationState.waterLevel > 70 ? 'NOMINAL' : simulationState.waterLevel > 30 ? 'CAUTION' : 'CRITICAL'}
            deltaText={simulationState.netWaterDelta >= 0 ? `+${simulationState.netWaterDelta}%/Sol` : `${simulationState.netWaterDelta}%/Sol`}
            onClick={() => onNavigate('habitat')}
          />

          {/* Gauge 3: Electrical Power */}
          <CircularGauge
            value={simulationState.batteryCharge}
            label="Power Storage"
            subLabel={`${simulationState.batteryDeltaKw >= 0 ? `+${simulationState.batteryDeltaKw}` : simulationState.batteryDeltaKw} kW Net`}
            color={simulationState.batteryCharge > 30 ? 'amber' : 'red'}
            icon={Zap}
            statusText={simulationState.batteryCharge > 60 ? 'NOMINAL' : simulationState.batteryCharge > 25 ? 'WARNING' : 'LOW POWER'}
            deltaText={`${simulationState.batteryDeltaKw >= 0 ? `+${simulationState.batteryDeltaKw}` : simulationState.batteryDeltaKw} kW Flow`}
            onClick={() => onNavigate('habitat')}
          />

          {/* Gauge 4: Hull & Thermal */}
          <CircularGauge
            value={simulationState.habitatIntegrity}
            label="Structural Hull"
            subLabel={`Internal: ${simulationState.habitatTempC}°C`}
            color={simulationState.habitatIntegrity > 50 ? 'emerald' : 'red'}
            icon={Thermometer}
            statusText={simulationState.habitatIntegrity > 75 ? 'SEALED' : simulationState.habitatIntegrity > 40 ? 'STRESSED' : 'BREACH'}
            deltaText={`Temp: ${simulationState.habitatTempC}°C`}
            onClick={() => onNavigate('habitat')}
          />
        </div>
      </div>

      {/* 3. DISTINCTIVE MOON AND MARS DESTINATION COMMAND CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
              Planetary Outpost Destinations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('missions')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>Compare Planetary Physics</span>
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
            className={`p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group ${
              !isMars
                ? 'border-cyan-400/90 aerospace-hud shadow-2xl shadow-cyan-950/60 scale-[1.01]'
                : 'border-slate-800 bg-[#070f26]/80 hover:border-cyan-500/50 hover:bg-[#08183a]/80'
            }`}
          >
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-cyan-950/90 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-md group-hover:scale-105 transition-transform">
                    <Moon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                      DESTINATION ALPHA (1.3 LIGHT-SEC)
                    </span>
                    <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                      <span>The Moon (Luna)</span>
                      {!isMars && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold">
                          ACTIVE EXPEDITION
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-cyan-400/60 transition-colors">
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{moonMission.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-sans">
                  {moonMission.tagline}
                </p>
              </div>

              {/* Scientific Stats Pills */}
              <div className="grid grid-cols-3 gap-2.5 text-[11px] font-mono pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Gravity</div>
                  <div className="font-bold text-slate-100 mt-0.5">{moonMission.gravity}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Atmosphere</div>
                  <div className="font-bold text-cyan-300 mt-0.5">Vacuum Exosphere</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Primary Era</div>
                  <div className="font-bold text-cyan-300 mt-0.5">Artemis Base</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Objective:</span>
              <span className="text-cyan-300 font-semibold truncate max-w-[220px]">Map Cold Traps &amp; Ice Deposits</span>
            </div>
          </div>

          {/* ================= MARS DESTINATION CARD ================= */}
          <div
            onClick={() => {
              if (onSelectDestination) onSelectDestination('mars');
              onNavigate('habitat');
            }}
            className={`p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group ${
              isMars
                ? 'border-amber-400/90 aerospace-hud-mars shadow-2xl shadow-amber-950/60 scale-[1.01]'
                : 'border-slate-800 bg-[#160c0c]/80 hover:border-amber-500/50 hover:bg-[#22100d]/80'
            }`}
          >
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-amber-950/90 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                      DESTINATION BETA (4 TO 24 LIGHT-MIN)
                    </span>
                    <h3 className="text-xl font-display font-black text-white flex items-center gap-2">
                      <span>Mars (Red Planet)</span>
                      {isMars && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
                          ACTIVE EXPEDITION
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:border-amber-400/60 transition-colors">
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{marsMission.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed font-sans">
                  {marsMission.tagline}
                </p>
              </div>

              {/* Scientific Stats Pills */}
              <div className="grid grid-cols-3 gap-2.5 text-[11px] font-mono pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Gravity</div>
                  <div className="font-bold text-slate-100 mt-0.5">{marsMission.gravity}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Atmosphere</div>
                  <div className="font-bold text-amber-300 mt-0.5">95% Carbon Dioxide</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-[9px] uppercase text-slate-400">Primary Era</div>
                  <div className="font-bold text-amber-300 mt-0.5">MOXIE ISRU</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Objective:</span>
              <span className="text-amber-300 font-semibold truncate max-w-[220px]">Test MOXIE O₂ Extraction</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. APOLLO TO ARTEMIS HISTORICAL SPOTLIGHT */}
      <div className="rounded-3xl aerospace-hud p-6 sm:p-8 space-y-4">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex items-center space-x-3 text-cyan-400">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">
            Scientific Evolution: Apollo (1969) to Artemis (2026+)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-tech font-bold text-base text-cyan-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Apollo Era: Consumable Dependence</span>
            </div>
            <p className="font-sans text-slate-300">
              Apollo astronauts stayed on the lunar surface between 21 hours (Apollo 11) and 75 hours (Apollo 17). Every kilogram of water, oxygen, and battery power had to be carried from Earth inside the Lunar Module, limiting humanity to short reconnaissance footpaths.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="font-tech font-bold text-base text-amber-300 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Artemis &amp; Mars Era: Closed-Loop Independence</span>
            </div>
            <p className="font-sans text-slate-300">
              For a 30-Sol or multi-year outpost, carrying supplies is impossible. Junior Astronauts must operate bioregenerative life support (ECLSS): recovering 98% of water, harvesting polar ice, and using MOXIE solid oxide electrolysis to manufacture oxygen from planetary soil and atmosphere!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
