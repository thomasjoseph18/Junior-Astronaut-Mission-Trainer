import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  Calendar,
  Send,
  Rocket,
  BatteryCharging,
  Info,
} from 'lucide-react';
import { JournalEntry, Destination } from '../../types';
import { INITIAL_JOURNAL } from '../../data/missions';

interface JournalViewProps {
  destination: Destination;
}

export const JournalView: React.FC<JournalViewProps> = ({ destination }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [customNote, setCustomNote] = useState('');
  const [authorName, setAuthorName] = useState('Cadet Commander');

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNote.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      sol: 1,
      title: 'Cadet Surface Observation Log',
      author: authorName,
      timestamp: 'Mission Day 01 - Field Note',
      body: customNote,
      badge: {
        name: 'Curious Explorer Pin',
        icon: 'Award',
        description: 'Recorded an official Sol 1 scientific observation in the flight journal.',
      },
      scienceTip: 'Astronauts write field logs every single Sol so scientists on Earth can analyze discoveries!',
    };

    setEntries([newEntry, ...entries]);
    setCustomNote('');
  };

  const getBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-cyan-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-blue-900/60 bg-[#070F2B]/90 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                FLIGHT DECK ARCHIVES
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                SOL 1 ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Mission Journal</h2>
          </div>
        </div>

        <div className="text-xs text-slate-300 font-mono bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl">
          EXPEDITION: <span className="text-cyan-300 font-bold uppercase">{destination} OUTPOST</span>
        </div>
      </div>

      {/* Interactive Junior Astronaut Field Note Form */}
      <div className="p-5 rounded-2xl border border-blue-800/60 bg-[#091533]/85 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-cyan-300 text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Record a Sol 1 Scientific Observation</span>
        </div>
        <p className="text-xs text-slate-300">
          What did you observe outside the habitat window? Type your discovery to earn your Explorer Badge!
        </p>

        <form onSubmit={handleAddObservation} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your Astronaut Call-Sign"
              className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Deployed the spectrometer and found ice crystals near the ridge!"
              className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Save Log to NASA Telemetry</span>
          </button>
        </form>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 rounded-2xl border border-slate-800 bg-[#070F2B]/80 backdrop-blur-md space-y-3 shadow-lg"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-700 text-cyan-300 font-mono text-[10px] font-bold">
                  SOL {entry.sol}
                </span>
                <h3 className="text-base font-bold text-white">{entry.title}</h3>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{entry.timestamp}</span>
              </div>
            </div>

            {/* Body */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {entry.body}
            </p>

            {/* Badge Earned Pill (if any) */}
            {entry.badge && (
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200">
                <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center flex-shrink-0">
                  {getBadgeIcon(entry.badge.icon)}
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Badge Earned:</span>
                    <span>{entry.badge.name}</span>
                  </div>
                  <div className="text-[11px] text-amber-200/80">{entry.badge.description}</div>
                </div>
              </div>
            )}

            {/* Science Tip */}
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/40 text-[11px] text-cyan-200 font-mono">
              <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>{entry.scienceTip}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
