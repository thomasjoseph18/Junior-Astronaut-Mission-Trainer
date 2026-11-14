import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { NOVA_FACTS } from '../data/missions';
import { Destination } from '../types';

interface NovaCompanionProps {
  destination: Destination;
  currentSol?: number;
  lastDebriefMessage?: string;
  solTip?: string;
}

export const NovaCompanion: React.FC<NovaCompanionProps> = ({
  destination,
  currentSol = 1,
  lastDebriefMessage,
  solTip,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState<string>(
    "Greetings, Junior Commander! I'm N.O.V.A., your AI Mission Copilot! Welcome to Sol 1 of our 30-Sol expedition. I'm monitoring life support and ready to assist!"
  );
  const [speakingAnimation, setSpeakingAnimation] = useState(false);

  // Sync NOVA when Sol advances
  useEffect(() => {
    if (lastDebriefMessage) {
      setActiveSpeech(`Sol ${currentSol} Report: ${lastDebriefMessage}`);
      setSpeakingAnimation(true);
      const timer = setTimeout(() => setSpeakingAnimation(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentSol, lastDebriefMessage]);

  const handleNextFact = () => {
    const nextIdx = (factIndex + 1) % NOVA_FACTS.length;
    setFactIndex(nextIdx);
    setActiveSpeech(`Space Fact #${nextIdx + 1}: ${NOVA_FACTS[nextIdx]}`);
    triggerSpeechAnimation();
  };

  const handleSolAdvice = () => {
    if (solTip) {
      setActiveSpeech(`Sol ${currentSol} Tactical Tip: ${solTip}`);
    } else if (destination === 'moon') {
      setActiveSpeech(
        "Lunar Operations Tip: Shadows at the lunar South Pole are super long and dark because the sun is always hugging the horizon! Always keep your suit lights and rover battery charged!"
      );
    } else {
      setActiveSpeech(
        "Mars Operations Tip: Dust on Mars is very fine! Make sure the airlock electro-scrubber is running before stepping inside the pressurized habitat dome!"
      );
    }
    triggerSpeechAnimation();
  };

  const triggerSpeechAnimation = () => {
    setSpeakingAnimation(true);
    setTimeout(() => setSpeakingAnimation(false), 1200);
  };

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-[#09152e]/90 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl transition-all duration-300 overflow-hidden">
      
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-950 via-[#0B1E47] to-cyan-950/80 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Animated NOVA Robot Head */}
          <div className="relative w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/30">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black tracking-wider text-white">N.O.V.A.</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
                AI COPILOT
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-200/70 hidden sm:block">
              Navigational Operations &amp; Versatile Assistant
            </p>
          </div>
        </div>

        {/* Minimize / Expand Toggle */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1 rounded-md text-cyan-300 hover:text-white hover:bg-cyan-900/50 transition-colors cursor-pointer"
            title={minimized ? 'Expand NOVA' : 'Minimize NOVA'}
          >
            {minimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body Area */}
      {!minimized && (
        <div className="p-4 space-y-3">
          
          {/* Speech Bubble */}
          <div className="relative rounded-xl bg-slate-950/70 border border-cyan-500/30 p-3.5 text-xs text-slate-200 leading-relaxed shadow-inner">
            <div className="flex items-start space-x-2">
              <MessageSquare className={`w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 ${speakingAnimation ? 'animate-bounce' : ''}`} />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold block">
                  Transmission from NOVA:
                </span>
                <p className="text-xs sm:text-[13px] text-slate-100 font-medium">
                  {activeSpeech}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Interactive Actions for Children */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleNextFact}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Space Fact</span>
            </button>

            <button
              onClick={handleSolAdvice}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-200 text-xs font-semibold transition-transform active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sol {currentSol} Tips</span>
            </button>

            <button
              onClick={triggerSpeechAnimation}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              title="Voice Synthesizer Test"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono">Audio Check</span>
            </button>
          </div>

        </div>
      )}

      {/* Minimized Pill Preview */}
      {minimized && (
        <div
          onClick={() => setMinimized(false)}
          className="px-4 py-2 text-xs text-cyan-300 font-mono flex items-center justify-between cursor-pointer hover:bg-cyan-950/40"
        >
          <span className="truncate">N.O.V.A. (Sol {currentSol}) Standing by...</span>
          <span className="text-[10px] text-cyan-400 underline font-sans ml-2">Click to expand</span>
        </div>
      )}

    </div>
  );
};
