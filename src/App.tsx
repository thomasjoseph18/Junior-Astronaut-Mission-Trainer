import { useState, useCallback, useEffect, useMemo, useReducer } from 'react';
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
import { LunarPOVScene } from './components/lunar-pov/LunarPOVScene';
import { MarsSurfaceScene } from './components/mars-pov/MarsSurfaceScene';
import { POVHud } from './components/lunar-pov/POVHud';
import { MissionDebriefScreen } from './components/MissionDebriefScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameShell } from './components/GameShell';
import { StaticBackdrop, WebGLFallback } from './components/WebGLFallback';
import { NavTab, Destination, SettingsConfig, JournalEntry, SolTelemetry, Achievement, ExplorationPoint } from './types';
import { getInitialJournal } from './data/missions';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { useHabitatSimulation } from './hooks/useHabitatSimulation';
import type { SimulationMap } from './hooks/useHabitatSimulation';
import type { GameEvent } from './engine/achievements';
import { loadSave, resolveStorage, writeSave } from './engine/save';
import type { SaveGame } from './engine/save';
import { applyGameEvent, markSiteViewed } from './engine/progress';
import { gameReducer, initialGameState } from './engine/gameState';
import { detectWebGL } from './engine/webgl';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [destination, setDestination] = useState<Destination>('moon');
  // Versioned save: both destinations' simulations, journals, achievements.
  const [{ storage, persistent }] = useState(() => resolveStorage(() => window.localStorage));
  const [saveOk, setSaveOk] = useState(true);
  const [save, setSave] = useState<SaveGame>(() => {
    const prefersReduced =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loaded = loadSave(storage, prefersReduced);
    for (const d of ['moon', 'mars'] as Destination[]) {
      if (loaded.journals[d].length === 0) loaded.journals[d] = getInitialJournal(d);
    }
    return loaded;
  });

  useEffect(() => {
    setSaveOk(writeSave(storage, save));
  }, [save, storage]);

  const saveWarning = !persistent || !saveOk;

  // Phase 3 — Lunar POV state
  const [povPointerLocked, setPovPointerLocked] = useState(false);
  const [povSelectedPoint, setPovSelectedPoint] = useState<ExplorationPoint | null>(null);

  // Settings live inside the versioned save, so they persist across reloads.
  const settings = save.settings;
  const handleUpdateSettings = useCallback((patch: Partial<SettingsConfig>) => {
    setSave((prev) => {
      const merged = { ...prev.settings, ...patch };
      if (typeof patch.masterVolume === 'number') merged.masterVolume = Math.min(1, Math.max(0, patch.masterVolume));
      if (typeof patch.callSign === 'string') merged.callSign = patch.callSign.slice(0, 24);
      return { ...prev, settings: merged };
    });
  }, []);

  // Achievements are derived from the save and only change through real game events.
  const achievements: Achievement[] = useMemo(
    () =>
      INITIAL_ACHIEVEMENTS.map((init) => {
        const got = save.achievements[init.id];
        return got ? { ...init, unlocked: true, unlockedAtSol: got.unlockedAtSol ?? init.unlockedAtSol } : { ...init, unlocked: false };
      }),
    [save.achievements],
  );

  const handleGameEvent = useCallback((event: GameEvent) => {
    setSave((prev) => applyGameEvent(prev, event));
  }, []);

  const handleSiteViewed = useCallback((siteId: string) => {
    setSave((prev) => markSiteViewed(prev, siteId));
  }, []);

  const handleDailyJournalEntry = useCallback((entry: JournalEntry, dest: Destination) => {
    setSave((prev) => {
      const list = prev.journals[dest];
      if (list.some((e) => e.id === entry.id || (e.sol === entry.sol && e.title === entry.title))) return prev;
      return { ...prev, journals: { ...prev.journals, [dest]: [entry, ...list] } };
    });
  }, []);

  const handleSimulationsChange = useCallback((sims: SimulationMap) => {
    setSave((prev) => ({ ...prev, simulations: sims }));
  }, []);

  const [initialSims] = useState<SimulationMap>(() => save.simulations);
  const simulation = useHabitatSimulation(destination, {
    initialSimulations: initialSims,
    onSimulationsChange: handleSimulationsChange,
    onJournalAdd: handleDailyJournalEntry,
    onGameEvent: handleGameEvent,
  });

  const journalEntries = save.journals[destination];

  // Starting a destination for the first time is a real event (first_touchdown).
  useEffect(() => {
    handleGameEvent({ type: 'mission_started', destination });
  }, [destination, handleGameEvent]);

  const handleToggleAudio = () => handleUpdateSettings({ audioEnabled: !settings.audioEnabled });

  const handleAddCustomJournalEntry = (newEntry: JournalEntry) => {
    setSave((prev) => ({
      ...prev,
      journals: { ...prev.journals, [destination]: [newEntry, ...prev.journals[destination]] },
    }));
  };

  // Switching destination keeps BOTH simulations and journals intact.
  const handleSelectDestination = useCallback((newDest: Destination) => {
    if (newDest !== destination) setDestination(newDest);
  }, [destination]);

  // Restart only the active destination (its simulation and its auto-logged journal).
  const handleResetSimulation = useCallback(() => {
    simulation.resetSimulation();
    setSave((prev) => ({ ...prev, journals: { ...prev.journals, [destination]: getInitialJournal(destination) } }));
  }, [simulation, destination]);

  // ---- Game state machine (first-person shell) ----
  const [game, dispatchGame] = useReducer(gameReducer, undefined, initialGameState);

  useEffect(() => {
    dispatchGame({ type: 'BOOT_DONE', introSeen: save.progress.introSeen, uiMode: save.settings.uiMode });
    // boot runs once, from the loaded save
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The Experience Mode setting drives the classic <-> game switch after boot.
  useEffect(() => {
    if (game.screen === 'boot') return;
    if (settings.uiMode === 'classic' && game.screen !== 'classic') dispatchGame({ type: 'ENTER_CLASSIC' });
    if (settings.uiMode === 'game' && game.screen === 'classic') dispatchGame({ type: 'EXIT_CLASSIC' });
  }, [settings.uiMode, game.screen]);

  // ---- WebGL capability ----
  const [webgl] = useState(() => detectWebGL(() => document.createElement('canvas')));
  const [forceWebGL, setForceWebGL] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const canRender3D = (webgl.supported || forceWebGL) && !contextLost;

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

  if (game.screen === 'boot') {
    return <div role="status" className="min-h-screen bg-[#020617] text-slate-300 flex items-center justify-center text-sm font-mono">Loading mission data…</div>;
  }

  if (game.screen !== 'classic') {
    return (
      <GameShell
        saveWarning={saveWarning}
        state={game}
        dispatch={dispatchGame}
        unlocks={save.progress}
        reducedMotion={settings.reducedMotion}
        onUseClassic={() => handleUpdateSettings({ uiMode: 'classic' })}
      />
    );
  }

  const inPov = currentTab === 'lunar-pov' || currentTab === 'mars-pov';

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-[#020617] font-sans text-slate-100 flex flex-col scanlines ${
        settings.textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
      } ${settings.reducedMotion ? 'reduce-motion' : ''}`}
    >
      {saveWarning && (
        <div role="status" className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-900/90 border border-amber-500/60 text-amber-100 text-xs font-mono">
          Progress can’t be saved on this device right now. You can keep playing, but it will be lost when you close the page.
        </div>
      )}
      {/* 3D Background Canvas — switches between orbital, Lunar POV, and Mars POV */}
      <div className="absolute inset-0 z-0">
        {canRender3D ? (
          <ErrorBoundary resetKey={`${currentTab}:${destination}`} fallback={() => <StaticBackdrop />}>
            <Canvas
              camera={{ position: [0, 0, 5.8], fov: 45 }}
              dpr={settings.lowPerformanceMode ? 1 : [1, 2]}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  setContextLost(true);
                });
              }}
            >
              {currentTab === 'lunar-pov' ? (
                <LunarPOVScene
                  lowPerformanceMode={settings.lowPerformanceMode}
                  onPointSelected={setPovSelectedPoint}
                  onPointerLockChange={setPovPointerLocked}
                />
              ) : currentTab === 'mars-pov' ? (
                <MarsSurfaceScene
                  lowPerformanceMode={settings.lowPerformanceMode}
                  onPointSelected={setPovSelectedPoint}
                  onPointerLockChange={setPovPointerLocked}
                />
              ) : (
                <TestScene destination={destination} />
              )}
            </Canvas>
          </ErrorBoundary>
        ) : (
          <StaticBackdrop />
        )}
      </div>

      {/* No usable 3D: explain instead of showing a dead screen. */}
      {inPov && !canRender3D && (
        <WebGLFallback
          support={webgl}
          contextLost={contextLost}
          onTryAnyway={webgl.reason === 'major_performance_caveat' ? () => setForceWebGL(true) : undefined}
          onExit={() => {
            setPovPointerLocked(false);
            setPovSelectedPoint(null);
            setCurrentTab('exploration');
          }}
        />
      )}

      {/* POV HUD — full-screen overlay, shown in both lunar-pov and mars-pov modes */}
      {inPov && canRender3D && (
        <POVHud
          destination={currentTab === 'mars-pov' ? 'mars' : 'moon'}
          onExit={() => {
            setPovPointerLocked(false);
            setPovSelectedPoint(null);
            setCurrentTab('exploration');
          }}
          currentSol={simulation.state.currentSol}
          oxygenLevel={simulation.state.oxygenLevel}
          waterLevel={simulation.state.waterLevel}
          batteryCharge={simulation.state.batteryCharge}
          selectedPoint={povSelectedPoint}
          onDismissPoint={() => setPovSelectedPoint(null)}
          isPointerLocked={povPointerLocked}
          onRequestPointerLock={() => {
            const canvas = document.querySelector('canvas');
            if (canvas) canvas.click();
          }}
        />
      )}

      {/* NASA Top Navigation Bar — hidden in POV modes */}
      {currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          currentSol={simulation.state.currentSol}
          totalSols={simulation.state.totalSols}
          audioEnabled={settings.audioEnabled}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Mission Telemetry Ribbon — hidden in POV modes */}
      {currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
        <MissionStatusRibbon
          telemetry={currentTelemetry}
          destination={destination}
        />
      )}

      {/* Main Content Area — hidden in POV modes */}
      {currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto">
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
                exploredIds={save.viewedSites}
                onSiteViewed={handleSiteViewed}
                onNavigateToHabitat={() => setCurrentTab('habitat')}
                onNavigateToPOV={() => setCurrentTab(destination === 'mars' ? 'mars-pov' : 'lunar-pov')}
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
      )}

      {/* NOVA AI Mission Copilot — hidden in POV modes */}
      {currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
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
      )}

      {/* Background 3D Viewport Hint — hidden in POV modes */}
      {currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
        <div className="fixed bottom-4 left-4 z-20 hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-400 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D Celestial Viewport: Drag to inspect {destination === 'mars' ? 'Mars' : 'the Moon'}</span>
        </div>
      )}
      {/* Mission Debrief Screen — full-screen overlay on victory or critical */}
      {(simulation.state.missionStatus === 'victory' || simulation.state.missionStatus === 'critical') &&
        currentTab !== 'lunar-pov' && currentTab !== 'mars-pov' && (
          <MissionDebriefScreen
            status={simulation.state.missionStatus}
            destination={destination}
            simulationState={simulation.state}
            onReset={handleResetSimulation}
            onNavigate={setCurrentTab}
          />
        )
      }
    </div>
  );
}
