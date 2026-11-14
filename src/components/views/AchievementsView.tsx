import React, { useState } from 'react';
import {
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Droplets,
  Wind,
  Zap,
  Flame,
  Brush,
  Compass,
  Rocket,
  Globe2,
  Filter,
} from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsViewProps {
  achievements: Achievement[];
  currentSol?: number;
  onNavigateToHabitat?: () => void;
}

type CategoryFilter = 'all' | 'survival' | 'engineering' | 'milestone' | 'exploration';

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  currentSol = 1,
  onNavigateToHabitat,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = `w-7 h-7 ${unlocked ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-500'}`;

    switch (iconName) {
      case 'Rocket':
        return <Rocket className={iconClass} />;
      case 'Brush':
        return <Brush className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Droplets':
        return <Droplets className={iconClass} />;
      case 'Wind':
        return <Wind className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'Globe2':
        return <Globe2 className={iconClass} />;
      case 'Award':
      default:
        return <Award className={iconClass} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'survival':
        return 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40';
      case 'engineering':
        return 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40';
      case 'milestone':
        return 'text-amber-300 border-amber-500/40 bg-amber-950/40';
      case 'exploration':
        return 'text-purple-300 border-purple-500/40 bg-purple-950/40';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner with Progression Bar */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-amber-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Astronaut Badge &amp; Honor Room</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                  STEM MERIT
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Earn NASA mission badges by mastering life-support engineering, surviving critical solar events, and exploring planetary landmarks.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 self-start sm:self-center">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-right">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Merits Unlocked
              </div>
              <div className="text-base font-black text-amber-300 font-mono">
                {unlockedCount} / {totalCount} Badges
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mission Progress at Sol {currentSol}:</span>
          </div>

          <div className="flex items-center space-x-3 flex-1 sm:max-w-md">
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold min-w-[3rem]">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Badges:</span>
        </div>

        {[
          { key: 'all', label: 'All Badges' },
          { key: 'survival', label: 'Survival' },
          { key: 'engineering', label: 'Engineering' },
          { key: 'milestone', label: 'Milestones' },
          { key: 'exploration', label: 'Exploration' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as CategoryFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === tab.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((badge) => {
          const isUnlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'border-amber-400/50 bg-gradient-to-b from-slate-900/90 to-amber-950/20 shadow-xl shadow-amber-950/20'
                  : 'border-slate-800/80 bg-slate-900/40 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-transform hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-400/60 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    {renderBadgeIcon(badge.icon, isUnlocked)}
                  </div>
                  <div>
                    <h2 className={`text-base font-black ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {badge.name}
                    </h2>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold uppercase ${getCategoryColor(
                        badge.category
                      )}`}
                    >
                      {badge.category}
                    </span>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="flex items-center space-x-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{badge.unlockedAtSol ? `Sol ${badge.unlockedAtSol}` : 'UNLOCKED'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-[11px] font-mono text-slate-500 bg-slate-950 border border-slate-800 px-2 py-1 rounded-md">
                      <Lock className="w-3.5 h-3.5" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Badge Description */}
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                {badge.description}
              </p>

              {/* Criteria Card */}
              <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Unlock Criteria:
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {badge.criteria}
                </div>
              </div>

              {/* Educational Fact Card */}
              <div
                className={`p-3 rounded-xl border space-y-1 ${
                  isUnlocked
                    ? 'border-amber-500/30 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                    NASA Science Fact
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {badge.educationalFact}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom CTA to return or test skills */}
      {onNavigateToHabitat && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Ready to test your astronaut skills in the field?
            </h3>
            <p className="text-xs text-slate-400">
              Jump into the Habitat Control Deck to adjust life support, wipe solar panels, and guide your crew through 30 Sols!
            </p>
          </div>

          <button
            onClick={onNavigateToHabitat}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/50 transition-all cursor-pointer whitespace-nowrap"
          >
            Open Habitat Control Deck
          </button>
        </div>
      )}

    </div>
  );
};
