import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { LunarTerrain } from './LunarTerrain';
import { LunarSky } from './LunarSky';
import { HabitatMesh } from './HabitatMesh';
import { ExplorationMarkers } from './ExplorationMarkers';
import { ExplorationPoint } from '../../types';

const KEYBOARD_MAP = [
  { name: 'forward',  keys: ['ArrowUp',    'KeyW'] },
  { name: 'backward', keys: ['ArrowDown',  'KeyS'] },
  { name: 'left',     keys: ['ArrowLeft',  'KeyA'] },
  { name: 'right',    keys: ['ArrowRight', 'KeyD'] },
  { name: 'sprint',   keys: ['ShiftLeft',  'ShiftRight'] },
];

const WALK_SPEED   = 8;
const SPRINT_SPEED = 20;
const EYE_HEIGHT   = 1.7;

const _forward  = new THREE.Vector3();
const _right    = new THREE.Vector3();
const _velocity = new THREE.Vector3();

function CameraController() {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls<string>();
  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current) {
      camera.position.set(0, EYE_HEIGHT, 10);
      initialised.current = true;
    }
  }, [camera]);

  useFrame((_, delta) => {
    const { forward, backward, left, right, sprint } = getKeys() as {
      forward: boolean; backward: boolean; left: boolean; right: boolean; sprint: boolean;
    };

    const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const dt = Math.min(delta, 0.05); // cap at 50 ms to prevent huge jumps

    // Build movement vector in camera-local space (XZ plane only)
    _velocity.set(0, 0, 0);

    if (forward || backward || left || right) {
      // Camera's forward direction projected onto XZ plane
      camera.getWorldDirection(_forward);
      _forward.y = 0;
      _forward.normalize();

      // Camera's right direction
      _right.crossVectors(_forward, camera.up).normalize();

      if (forward)  _velocity.addScaledVector(_forward, speed * dt);
      if (backward) _velocity.addScaledVector(_forward, -speed * dt);
      if (right)    _velocity.addScaledVector(_right,   speed * dt);
      if (left)     _velocity.addScaledVector(_right,  -speed * dt);
    }

    // Boundary clamp — keep inside terrain bounds
    const nextX = camera.position.x + _velocity.x;
    const nextZ = camera.position.z + _velocity.z;
    camera.position.x = Math.max(-185, Math.min(185, nextX));
    camera.position.z = Math.max(-185, Math.min(185, nextZ));

    // Lock eye height above terrain (simplified: constant EYE_HEIGHT above y=0 base)
    camera.position.y = EYE_HEIGHT;
  });

  return null;
}

interface LunarPOVSceneProps {
  lowPerformanceMode: boolean;
  onUnlockAchievement?: (id: string, atSol?: number) => void;
  onPointSelected: (point: ExplorationPoint | null) => void;
  onPointerLockChange?: (locked: boolean) => void;
}

export function LunarPOVScene({
  lowPerformanceMode,
  onUnlockAchievement,
  onPointSelected,
  onPointerLockChange,
}: LunarPOVSceneProps) {
  const [selectedPoint, setSelectedPoint] = useState<ExplorationPoint | null>(null);
  const controlsRef = useRef<{ lock: () => void; unlock: () => void } | null>(null);

  const handleSelectPoint = useCallback((pt: ExplorationPoint) => {
    setSelectedPoint(pt);
    onPointSelected(pt);
  }, [onPointSelected]);

  const handlePointerLock = useCallback(() => {
    if (onPointerLockChange) onPointerLockChange(true);
  }, [onPointerLockChange]);

  const handlePointerUnlock = useCallback(() => {
    if (onPointerLockChange) onPointerLockChange(false);
  }, [onPointerLockChange]);

  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      {/* Void sky background */}
      <color attach="background" args={['#000005']} />

      <LunarSky />
      <LunarTerrain lowPerformanceMode={lowPerformanceMode} />
      <HabitatMesh />
      <ExplorationMarkers
        onSelectPoint={handleSelectPoint}
        selectedPointId={selectedPoint?.id ?? null}
        onUnlockAchievement={onUnlockAchievement}
      />

      <CameraController />

      <PointerLockControls
        // @ts-expect-error – ref type from drei is compatible at runtime
        ref={controlsRef}
        makeDefault
        onLock={handlePointerLock}
        onUnlock={handlePointerUnlock}
      />
    </KeyboardControls>
  );
}
