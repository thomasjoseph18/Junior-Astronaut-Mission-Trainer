import React from 'react';
import {
  Rocket,
  Compass,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { NavTab, Destination } from '../../types';

interface WelcomeViewProps {
  onNavigate: (tab: NavTab) => void;
  destination: Destination;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onNavigate,
  destination,
}) => {
  const isMars = destination === 'mars';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0A1E4A]/90 via-[#071333]/90 to-[#040A1D]/90 p-6 sm:p-10 shadow-2xl shadow-blue-950/80 backdrop-blur-xl overflow-hidden">
        
        {/* Subtle Decorative Star/Grid Graphic */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-5">
          {/* NASA Educational Header Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>NASA JUNIOR ASTRONAUT CADET ACADEMY</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              BUILDSCAPES: <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-300">
                Apollo to Artemis
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Step into the boots of a NASA flight commander! Experience humanity's greatest journey—from Apollo 11's first footsteps in 1969 to building self-sustaining bases on the Moon and launching crewed expeditions to Mars.
            </p>
          </div>

          {/* Key Mission Pillars (Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-cyan-400 mb-1">
                <Rocket className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">Apollo Heritage</span>
              </div>
              <p className="text-xs text-slate-300">
                Explore Saturn V rocket staging and the historical Eagle Lunar Module touchdown.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-sky-400 mb-1">
                <Globe2 className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">Artemis Base</span>
              </div>
              <p className="text-xs text-slate-300">
                Mine water ice and generate solar energy on the rim of Shackleton Crater.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center space-x-2 text-amber-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">30-Sol Survival</span>
              </div>
              <p className="text-xs text-slate-300">
                Manage Oxygen, Water, Power, and Temperature to survive 30 harsh space days.
              </p>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('missions')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/40 border border-blue-400/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5 text-cyan-200" />
              <span>Launch Mission Selector</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>View Sol 1 Journal</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mission Quick Status / Active Target Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#070F2B]/85 p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400 shadow-inner">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 font-bold">
              CURRENT CADET DESTINATION
            </div>
            <div className="text-lg font-bold text-white">
              {isMars ? 'Mars • Ares Jezero Outpost' : 'Moon • Artemis Shackleton Base Camp'}
            </div>
            <div className="text-xs text-slate-400">
              Interactive 3D view rendered in background. Click &amp; drag to explore!
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('missions')}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-cyan-300 hover:text-white transition-colors"
        >
          Change Destination &rarr;
        </button>
      </div>

    </div>
  );
};
