import React from 'react';
import {
  Moon,
  Flame,
  CheckCircle2,
  Scale,
  Clock,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Destination } from '../../types';
import { MISSIONS } from '../../data/missions';

interface MissionSelectViewProps {
  selectedDestination: Destination;
  onSelectDestination: (dest: Destination) => void;
}

export const MissionSelectView: React.FC<MissionSelectViewProps> = ({
  selectedDestination,
  onSelectDestination,
}) => {
  const moonMission = MISSIONS.moon;
  const marsMission = MISSIONS.mars;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-600/50 text-cyan-300 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>EXPEDITION BRIEFING ROOM</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Choose Your Planetary Mission
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Select an outpost destination to train as a Junior Astronaut. Each world features unique gravity, atmospheric physics, and survival challenges for our 30-Sol habitat program.
        </p>
      </div>

      {/* Grid of Moon and Mars Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ================= MOON CARD ================= */}
        <div
          onClick={() => onSelectDestination('moon')}
          className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl ${
            selectedDestination === 'moon'
              ? 'border-cyan-400 bg-gradient-to-b from-[#09224A]/90 to-[#051128]/95 shadow-2xl shadow-cyan-950/70 scale-[1.01]'
              : 'border-slate-800 bg-[#070F2B]/75 hover:border-slate-700 hover:bg-[#09153a]/80'
          }`}
        >
          <div className="space-y-4">
            
            {/* Top Badge & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-md">
                  <Moon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                    DESTINATION ALPHA
                  </span>
                  <h3 className="text-xl font-bold text-white">The Moon (Luna)</h3>
                </div>
              </div>

              {selectedDestination === 'moon' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>ACTIVE</span>
                </div>
              )}
            </div>

            {/* Outpost & Tagline */}
            <div>
              <div className="text-sm font-semibold text-cyan-300">{moonMission.name}</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {moonMission.tagline}
              </p>
            </div>

            {/* Scientific Telemetry Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Surface Gravity</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{moonMission.gravity}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lunar Day</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{moonMission.dayLength}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Temperature</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{moonMission.tempRange}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atmosphere</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{moonMission.atmosphere}</div>
              </div>
            </div>

            {/* Sol 1 Primary Mission Objective */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-200">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-bold mb-1">
                Sol 1 Primary Objective:
              </div>
              <p className="leading-relaxed">{moonMission.primaryObjective}</p>
            </div>

            {/* Historical Heritage Note */}
            <p className="text-[11px] text-slate-400 italic">
              <strong>Heritage:</strong> {moonMission.historyNote}
            </p>

          </div>

          {/* Action Button */}
          <div className="pt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectDestination('moon');
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                selectedDestination === 'moon'
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>{selectedDestination === 'moon' ? 'Stationed at Moon Base' : 'Select Moon Expedition'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= MARS CARD ================= */}
        <div
          onClick={() => onSelectDestination('mars')}
          className={`cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl ${
            selectedDestination === 'mars'
              ? 'border-amber-400 bg-gradient-to-b from-[#3a1a0c]/90 to-[#1e0d06]/95 shadow-2xl shadow-amber-950/70 scale-[1.01]'
              : 'border-slate-800 bg-[#070F2B]/75 hover:border-slate-700 hover:bg-[#09153a]/80'
          }`}
        >
          <div className="space-y-4">
            
            {/* Top Badge & Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/90 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    DESTINATION BETA
                  </span>
                  <h3 className="text-xl font-bold text-white">Mars (Red Planet)</h3>
                </div>
              </div>

              {selectedDestination === 'mars' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>ACTIVE</span>
                </div>
              )}
            </div>

            {/* Outpost & Tagline */}
            <div>
              <div className="text-sm font-semibold text-amber-300">{marsMission.name}</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {marsMission.tagline}
              </p>
            </div>

            {/* Scientific Telemetry Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Surface Gravity</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{marsMission.gravity}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Martian Sol</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{marsMission.dayLength}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Temperature</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{marsMission.tempRange}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atmosphere</span>
                </div>
                <div className="text-slate-100 font-bold mt-0.5">{marsMission.atmosphere}</div>
              </div>
            </div>

            {/* Sol 1 Primary Mission Objective */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-slate-200">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-bold mb-1">
                Sol 1 Primary Objective:
              </div>
              <p className="leading-relaxed">{marsMission.primaryObjective}</p>
            </div>

            {/* Historical Heritage Note */}
            <p className="text-[11px] text-slate-400 italic">
              <strong>Heritage:</strong> {marsMission.historyNote}
            </p>

          </div>

          {/* Action Button */}
          <div className="pt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectDestination('mars');
              }}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                selectedDestination === 'mars'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>{selectedDestination === 'mars' ? 'Stationed at Mars Base' : 'Select Mars Expedition'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
