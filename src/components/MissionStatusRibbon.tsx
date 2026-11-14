import React from 'react';
import {
  Wind,
  Droplets,
  BatteryCharging,
  Thermometer,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react';
import { SolTelemetry, Destination } from '../types';

interface MissionStatusRibbonProps {
  telemetry: SolTelemetry;
  destination: Destination;
}

export const MissionStatusRibbon: React.FC<MissionStatusRibbonProps> = ({
  telemetry,
  destination,
}) => {
  const isMars = destination === 'mars';

  return (
    <div className="w-full bg-[#081225]/85 border-b border-blue-950/90 backdrop-blur-md px-4 py-2 text-xs font-mono text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        
        {/* Sol Counter & Main Objective */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-1.5 bg-blue-900/60 border border-blue-500/40 px-2.5 py-1 rounded text-cyan-200 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SOL {telemetry.currentSol} OF {telemetry.totalSols}</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-200 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded">
            <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs truncate max-w-xs sm:max-w-md">
              <span className="text-slate-400 font-normal">Active Objective: </span>
              {isMars
                ? 'Unpack Life-Support Module & Test MOXIE O2 Generation'
                : 'Deploy Solar Arrays & Map Shackleton Crater Water Ice'}
            </span>
          </div>
        </div>

        {/* Environmental Life Support Subsystem Readings */}
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto py-1 scrollbar-none">
          
          {/* Oxygen */}
          <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-400">O₂</span>
            <span className="font-bold text-white text-[11px]">{telemetry.oxygenLevel}%</span>
          </div>

          {/* Water */}
          <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-slate-400">H₂O</span>
            <span className="font-bold text-white text-[11px]">{telemetry.waterLevel}%</span>
          </div>

          {/* Power */}
          <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">PWR</span>
            <span className="font-bold text-emerald-300 text-[11px]">{telemetry.powerLevel}%</span>
          </div>

          {/* Habitat Temp */}
          <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-400">TEMP</span>
            <span className="font-bold text-white text-[11px]">{telemetry.habitatTempC}°C</span>
          </div>

          {/* Hull Integrity */}
          <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[10px] text-slate-400">HULL</span>
            <span className="font-bold text-cyan-300 text-[11px]">{telemetry.habitatIntegrity}%</span>
          </div>

        </div>

      </div>
    </div>
  );
};
