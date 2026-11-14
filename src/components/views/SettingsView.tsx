import React from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Bot,
  Type,
  Gauge,
  User,
  ShieldCheck,
} from 'lucide-react';
import { SettingsConfig } from '../../types';

interface SettingsViewProps {
  settings: SettingsConfig;
  onUpdateSettings: (newSettings: Partial<SettingsConfig>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 rounded-3xl border border-blue-900/60 bg-[#070F2B]/90 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-cyan-400 shadow-md">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold block">
            FLIGHT DECK CONFIGURATION
          </span>
          <h2 className="text-2xl font-bold text-white">Trainer Settings</h2>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-[#070F2B]/85 backdrop-blur-md space-y-6 shadow-xl">
        
        {/* Astronaut Call-Sign */}
        <div className="space-y-2 pb-5 border-b border-slate-800">
          <label className="flex items-center space-x-2 text-xs font-mono font-semibold text-cyan-300">
            <User className="w-4 h-4 text-cyan-400" />
            <span>ASTRONAUT CALL-SIGN (NAME)</span>
          </label>
          <input
            type="text"
            value={settings.callSign}
            onChange={(e) => onUpdateSettings({ callSign: e.target.value })}
            className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-medium focus:outline-none focus:border-cyan-400"
            placeholder="e.g. Commander Armstrong"
          />
          <p className="text-[11px] text-slate-400">
            This call-sign will be stamped onto your official Sol 1 Mission Journal entries and certificates.
          </p>
        </div>

        {/* Audio Effects */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-200">
              {settings.audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>MISSION SOUND EFFECTS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Play authentic Apollo thruster acoustic effects and radio beeps.
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ audioEnabled: !settings.audioEnabled })}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
              settings.audioEnabled
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {settings.audioEnabled ? 'SOUND: ON' : 'SOUND: MUTED'}
          </button>
        </div>

        {/* NOVA Voice Companion */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-200">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>N.O.V.A. COPILOT SPEECH</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Allow NOVA to speak advice and read mission facts aloud.
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ novaVoiceEnabled: !settings.novaVoiceEnabled })}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
              settings.novaVoiceEnabled
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {settings.novaVoiceEnabled ? 'VOICE: ACTIVE' : 'VOICE: OFF'}
          </button>
        </div>

        {/* Text Size Accessibility */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-200">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>INTERFACE TEXT SIZE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Adjust typography scale for young readers and junior cadets.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateSettings({ textSize: 'normal' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                settings.textSize === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => onUpdateSettings({ textSize: 'large' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                settings.textSize === 'large'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Large Text (Ages 7-9)
            </button>
          </div>
        </div>

        {/* Graphics Performance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-200">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>3D GRAPHICS QUALITY</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Optimize rendering for classroom tablets, Chromebooks, or desktop gaming PCs.
            </p>
          </div>
          <button
            onClick={() => onUpdateSettings({ lowPerformanceMode: !settings.lowPerformanceMode })}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
              settings.lowPerformanceMode
                ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {settings.lowPerformanceMode ? 'BATTERY SAVER (30 FPS)' : 'MAX QUALITY (60 FPS)'}
          </button>
        </div>

      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex items-center space-x-3 text-xs text-slate-300 font-mono">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span>Child-Safe Environment: Compliant with NASA STEM Education Privacy Guidelines. No external personal data tracked.</span>
      </div>

    </div>
  );
};
