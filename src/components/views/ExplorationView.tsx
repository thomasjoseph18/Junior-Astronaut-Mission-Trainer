import React, { useState } from 'react';
import {
  Compass,
  Globe2,
  Sun,
  Droplets,
  Rocket,
  Wind,
  Zap,
  Flame,
  MapPin,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Destination, ExplorationPoint } from '../../types';
import { EXPLORATION_POINTS } from '../../data/exploration';

interface ExplorationViewProps {
  destination: Destination;
  onSelectDestination?: (dest: Destination) => void;
  onUnlockAchievement?: (id: string) => void;
  onNavigateToHabitat?: () => void;
}

export const ExplorationView: React.FC<ExplorationViewProps> = ({
  destination,
  onSelectDestination,
  onUnlockAchievement,
  onNavigateToHabitat,
}) => {
  const [activeDest, setActiveDest] = useState<Destination>(destination);
  const [exploredIds, setExploredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('buildscapes_explored_sites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const sites = EXPLORATION_POINTS.filter((p) => p.destination === activeDest);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');

  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  const handleInspectSite = (site: ExplorationPoint) => {
    setSelectedSiteId(site.id);
    if (!exploredIds.includes(site.id)) {
      const nextExplored = [...exploredIds, site.id];
      setExploredIds(nextExplored);
      try {
        localStorage.setItem('buildscapes_explored_sites', JSON.stringify(nextExplored));
      } catch {
        // ignore
      }

      // If all sites for this destination are explored, unlock planetary geologist badge!
      const currentDestSites = EXPLORATION_POINTS.filter((p) => p.destination === activeDest);
      const allExplored = currentDestSites.every((s) => nextExplored.includes(s.id));
      if (allExplored && onUnlockAchievement) {
        onUnlockAchievement('planetary_geologist');
      }
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-blue-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-sky-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Compass className="w-5 h-5 text-indigo-400" />;
    }
  };

  const isMars = activeDest === 'mars';
  const totalExploredInDest = sites.filter((s) => exploredIds.includes(s.id)).length;
  const progressPercent = Math.round((totalExploredInDest / sites.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Compass className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white flex items-center gap-2">
                  <span>Planetary Surface Exploration Deck</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                    EVA SURVEY
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Explore scientific landmarks, historical landing sites, and resource deposits mapped by NASA orbiters and rovers.
                </p>
              </div>
            </div>
          </div>

          {/* Destination Selector Pill */}
          <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveDest('moon');
                const moonFirst = EXPLORATION_POINTS.find((p) => p.destination === 'moon');
                if (moonFirst) setSelectedSiteId(moonFirst.id);
                if (onSelectDestination) onSelectDestination('moon');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isMars
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌕 Moon (Artemis Base)</span>
            </button>

            <button
              onClick={() => {
                setActiveDest('mars');
                const marsFirst = EXPLORATION_POINTS.find((p) => p.destination === 'mars');
                if (marsFirst) setSelectedSiteId(marsFirst.id);
                if (onSelectDestination) onSelectDestination('mars');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isMars
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔴 Mars (Jezero Crater)</span>
            </button>
          </div>
        </div>

        {/* Survey Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300">
              Sector Survey Progress:{' '}
              <strong className="text-cyan-300 font-bold">{totalExploredInDest} of {sites.length} Sites Analyzed</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3 flex-1 sm:max-w-xs">
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  isMars ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold min-w-[3rem]">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Exploration Grid: Site Selector & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of Sites */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              {isMars ? 'Martian Geologic Coordinates' : 'Lunar Surface Coordinates'}
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              {sites.length} Active Targets
            </span>
          </div>

          <div className="space-y-2.5">
            {sites.map((site) => {
              const isExplored = exploredIds.includes(site.id);
              const isSelected = activeSite?.id === site.id;

              return (
                <button
                  key={site.id}
                  onClick={() => handleInspectSite(site)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between group ${
                    isSelected
                      ? isMars
                        ? 'border-amber-400/80 bg-amber-950/30 shadow-lg shadow-amber-950/30'
                        : 'border-cyan-400/80 bg-cyan-950/30 shadow-lg shadow-cyan-950/30'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2.5 rounded-lg border flex-shrink-0 ${
                        isSelected
                          ? isMars
                            ? 'bg-amber-500/20 border-amber-400/50'
                            : 'bg-cyan-500/20 border-cyan-400/50'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {renderIcon(site.icon)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <h2 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {site.title}
                        </h2>
                        {isExplored && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate max-w-[210px] sm:max-w-xs">
                        {site.coordinates}
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-1">
                        {site.subtitle}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 mt-2 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Scientific Dossier */}
        <div className="lg:col-span-7">
          {activeSite ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
              
              {/* Site Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30">
                      {renderIcon(activeSite.icon)}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        {activeSite.title}
                      </h2>
                      <p className="text-xs font-mono text-cyan-300">
                        {activeSite.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{activeSite.coordinates}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {activeSite.description}
              </div>

              {/* Scientific Significance Card */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    Scientific Significance &amp; Research Value
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeSite.scientificSignificance}
                </p>
              </div>

              {/* NASA & Artemis Connection Card */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Rocket className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    NASA Mission &amp; Flight Connection
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeSite.nasaConnection}
                </p>
              </div>

              {/* Junior Astronaut STEM Discovery Fact */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">
                    Cadet Field Discovery Fact
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                  {activeSite.interactiveFact}
                </p>
              </div>

              {/* Action Button: Log Survey */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>
                    Badge Link: <strong className="text-cyan-300 font-mono">{activeSite.badgeName}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleInspectSite(activeSite)}
                    className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
                      exploredIds.includes(activeSite.id)
                        ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
                        : isMars
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {exploredIds.includes(activeSite.id)
                        ? 'Geological Survey Logged ✓'
                        : 'Log Geological Survey'}
                    </span>
                  </button>

                  {onNavigateToHabitat && (
                    <button
                      onClick={onNavigateToHabitat}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Return to Deck
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
              Select an exploration landmark from the left column to begin surface survey.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
