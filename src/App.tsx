import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Navbar } from './components/Navbar';
import { MissionStatusRibbon } from './components/MissionStatusRibbon';
import { NovaCompanion } from './components/NovaCompanion';
import { TestScene } from './components/TestScene';
import { WelcomeView } from './components/views/WelcomeView';
import { MissionSelectView } from './components/views/MissionSelectView';
import { JournalView } from './components/views/JournalView';
import { SettingsView } from './components/views/SettingsView';
import { NavTab, Destination, SettingsConfig } from './types';
import { INITIAL_TELEMETRY } from './data/missions';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [destination, setDestination] = useState<Destination>('moon');
  const [telemetry] = useState(INITIAL_TELEMETRY);
  const [settings, setSettings] = useState<SettingsConfig>({
    callSign: 'Cadet Commander',
    audioEnabled: true,
    novaVoiceEnabled: true,
    textSize: 'normal',
    lowPerformanceMode: false,
  });

  const handleUpdateSettings = (newSettings: Partial<SettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleAudio = () => {
    setSettings((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col ${
        settings.textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
      }`}
    >
      {/* 3D Celestial Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          dpr={settings.lowPerformanceMode ? 1 : [1, 2]}
        >
          <TestScene destination={destination} />
        </Canvas>
      </div>

      {/* NASA Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentSol={telemetry.currentSol}
        totalSols={telemetry.totalSols}
        audioEnabled={settings.audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Mission Telemetry Ribbon (Sol 1 of 30 + Life Support) */}
      <MissionStatusRibbon
        telemetry={telemetry}
        destination={destination}
      />

      {/* Main Content Area (Scrollable overlay above 3D Canvas) */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="max-w-6xl mx-auto">
          {currentTab === 'home' && (
            <WelcomeView
              onNavigate={setCurrentTab}
              destination={destination}
            />
          )}

          {currentTab === 'missions' && (
            <MissionSelectView
              selectedDestination={destination}
              onSelectDestination={(dest) => {
                setDestination(dest);
              }}
            />
          )}

          {currentTab === 'journal' && (
            <JournalView destination={destination} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </div>
      </div>

      {/* NOVA AI Mission Copilot Panel (Docked at bottom-right) */}
      <div className="fixed bottom-4 right-4 z-40 w-[92vw] sm:w-96 max-w-sm">
        <NovaCompanion destination={destination} />
      </div>

      {/* Background 3D Viewport Hint (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-20 hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-400 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D Celestial Viewport: Drag to inspect {destination === 'mars' ? 'Mars' : 'the Moon'}</span>
      </div>
    </div>
  );
}
