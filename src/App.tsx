import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Navbar } from './components/Navbar';
import { MissionStatusRibbon } from './components/MissionStatusRibbon';
import { NovaCompanion } from './components/NovaCompanion';
import { TestScene } from './components/TestScene';
import { WelcomeView } from './components/views/WelcomeView';
import { MissionSelectView } from './components/views/MissionSelectView';
import { HabitatControlDeck } from './components/simulation/HabitatControlDeck';
import { ExplorationView } from './components/views/ExplorationView';
import { JournalView } from './components/views/JournalView';
import { AchievementsView } from './components/views/AchievementsView';
import { SettingsView } from './components/views/SettingsView';
import { NavTab, Destination, SettingsConfig, JournalEntry, SolTelemetry, Achievement } from './types';
import { getInitialJournal } from './data/missions';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { useHabitatSimulation } from './hooks/useHabitatSimulation';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [destination, setDestination] = useState<Destination>('moon');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => getInitialJournal('moon'));

  const [settings, setSettings] = useState<SettingsConfig>({
    callSign: 'Cadet Commander',
    audioEnabled: true,
    novaVoiceEnabled: true,
    textSize: 'normal',
    lowPerformanceMode: false,
  });

  // Track player merits & badges
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('buildscapes_achievements');
      if (saved) {
        const parsed: Achievement[] = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map((init) => {
          const match = parsed.find((p) => p.id === init.id);
          return match
            ? { ...init, unlocked: match.unlocked, unlockedAtSol: match.unlockedAtSol }
            : init;
        });
      }
    } catch {
      // ignore
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Callback to unlock an achievement with persistence and deduplication
  const handleUnlockAchievement = useCallback((id: string, atSol?: number) => {
    setAchievements((prev) => {
      const match = prev.find((a) => a.id === id);
      if (match && match.unlocked) return prev;
      const next = prev.map((a) =>
        a.id === id
          ? { ...a, unlocked: true, unlockedAtSol: atSol || a.unlockedAtSol || 1 }
          : a
      );
      try {
        localStorage.setItem('buildscapes_achievements', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Callback when simulation triggers a daily journal entry (guarantees zero duplicate entries)
  const handleDailyJournalEntry = useCallback((entry: JournalEntry) => {
    setJournalEntries((prev) => {
      if (prev.some((e) => e.id === entry.id || (e.sol === entry.sol && e.title === entry.title))) {
        return prev;
      }
      return [entry, ...prev];
    });
  }, []);

  // Initialize Habitat 30-Sol Resource Simulation Engine
  const simulation = useHabitatSimulation(destination, handleDailyJournalEntry, handleUnlockAchievement);

  const handleUpdateSettings = (newSettings: Partial<SettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleAudio = () => {
    setSettings((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }));
  };

  const handleAddCustomJournalEntry = (newEntry: JournalEntry) => {
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  // Bug 1 Fix: Fresh simulation and destination-specific journal when destination switches
  const handleSelectDestination = useCallback((newDest: Destination) => {
    if (newDest !== destination) {
      setDestination(newDest);
      setJournalEntries(getInitialJournal(newDest));
    }
  }, [destination]);

  const handleResetSimulation = useCallback(() => {
    simulation.resetSimulation();
    setJournalEntries(getInitialJournal(destination));
  }, [simulation, destination]);

  // Live Telemetry mapping for top status ribbon
  const currentTelemetry: SolTelemetry = {
    currentSol: simulation.state.currentSol,
    totalSols: simulation.state.totalSols,
    oxygenLevel: simulation.state.oxygenLevel,
    waterLevel: simulation.state.waterLevel,
    powerLevel: simulation.state.batteryCharge,
    habitatTempC: simulation.state.habitatTempC,
    habitatIntegrity: simulation.state.habitatIntegrity,
    statusMessage: simulation.state.lastDebriefMessage,
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

      {/* NASA Top Navigation Bar (7 Tabs: Home, Missions, Habitat, Exploration, Journal, Achievements, Settings) */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentSol={simulation.state.currentSol}
        totalSols={simulation.state.totalSols}
        audioEnabled={settings.audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Mission Telemetry Ribbon (Live Sol 1-30 + Life Support) */}
      <MissionStatusRibbon
        telemetry={currentTelemetry}
        destination={destination}
      />

      {/* Main Content Area (Scrollable overlay above 3D Canvas) */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="max-w-6xl mx-auto">
          {currentTab === 'home' && (
            <WelcomeView
              onNavigate={setCurrentTab}
              destination={destination}
              simulationState={simulation.state}
              onSelectDestination={handleSelectDestination}
            />
          )}

          {currentTab === 'missions' && (
            <MissionSelectView
              selectedDestination={destination}
              onSelectDestination={handleSelectDestination}
              onNavigateToHabitat={() => setCurrentTab('habitat')}
            />
          )}

          {currentTab === 'habitat' && (
            <HabitatControlDeck
              state={simulation.state}
              calculations={simulation.calculations}
              destination={destination}
              onSetO2Mode={simulation.setO2Mode}
              onSetWaterRecyclerMode={simulation.setWaterRecyclerMode}
              onSetWaterRation={simulation.setWaterRation}
              onToggleIceSmelting={simulation.toggleIceSmelting}
              onTogglePowerAllocation={simulation.togglePowerAllocation}
              onCleanSolarPanels={simulation.cleanSolarPanels}
              onUseEmergencyO2={simulation.useEmergencyO2Canister}
              onAdvanceSol={simulation.advanceSol}
              onResetSimulation={handleResetSimulation}
            />
          )}

          {currentTab === 'exploration' && (
            <ExplorationView
              destination={destination}
              onSelectDestination={handleSelectDestination}
              onUnlockAchievement={handleUnlockAchievement}
              onNavigateToHabitat={() => setCurrentTab('habitat')}
            />
          )}

          {currentTab === 'journal' && (
            <JournalView
              destination={destination}
              currentSol={simulation.state.currentSol}
              entries={journalEntries}
              onAddEntry={handleAddCustomJournalEntry}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              currentSol={simulation.state.currentSol}
              onNavigateToHabitat={() => setCurrentTab('habitat')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </div>
      </div>

      {/* NOVA AI Mission Copilot Panel (Docked at bottom-right, collapsible) */}
      <div className="fixed bottom-4 right-4 z-40 w-[92vw] sm:w-96 max-w-sm">
        <NovaCompanion
          destination={destination}
          currentSol={simulation.state.currentSol}
          lastDebriefMessage={simulation.state.lastDebriefMessage}
          solTip={simulation.state.currentEvent.tip}
          activeTab={currentTab}
          missionStatus={simulation.state.missionStatus}
        />
      </div>

      {/* Background 3D Viewport Hint (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-20 hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-400 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>3D Celestial Viewport: Drag to inspect {destination === 'mars' ? 'Mars' : 'the Moon'}</span>
      </div>
    </div>
  );
}
