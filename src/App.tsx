import { Canvas } from '@react-three/fiber';
import { Rocket, ShieldCheck, Activity, Globe2, Compass, AlertCircle } from 'lucide-react';
import { TestScene } from './components/TestScene';

export function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* 3D Simulation Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          dpr={[1, 2]}
        >
          <TestScene />
        </Canvas>
      </div>

      {/* Top Navigation HUD Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Phase 1: Online
              </span>
              <span className="text-xs font-mono text-slate-400">SYS_VER 0.1.0</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              BUILDSCAPES: Apollo to Artemis
            </h1>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs">TARGET: LUNAR SOUTH POLE</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs">PIPELINE: OPERATIONAL</span>
          </div>
        </div>
      </header>

      {/* Main Viewport Content Overlay */}
      <main className="relative z-10 flex-1 flex flex-col justify-between p-6 pointer-events-none">
        {/* Left Side: 30-Sol Habitat Readiness Architecture Placeholder */}
        <div className="max-w-md pointer-events-auto space-y-4">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-200">
                  Mission Readiness Subsystem
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
                NOMINAL
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Foundational graphics pipeline and 3D rendering infrastructure successfully initialized.
              Architected to support multi-era Apollo historical trajectories, Artemis lunar logistics, and the 30-Sol Moon &amp; Mars habitat survival training modules.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">3D Engine</div>
                <div className="text-cyan-300 font-semibold mt-0.5">Three.js + R3F</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Physics Engine</div>
                <div className="text-cyan-300 font-semibold mt-0.5">Rapier3D Ready</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Styling Engine</div>
                <div className="text-cyan-300 font-semibold mt-0.5">Tailwind v4</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Habitat Trainer</div>
                <div className="text-emerald-300 font-semibold mt-0.5">30-Sol Prepared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Interactive Instruction Bar */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-xs font-mono text-slate-400 shadow-xl">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Interactive Lunar Viewport: Click &amp; drag to orbit celestial body.</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Phase 1 Verification: Ready for Phase 2 State &amp; Mission Architecture</span>
          </div>
        </div>
      </main>
    </div>
  );
}
