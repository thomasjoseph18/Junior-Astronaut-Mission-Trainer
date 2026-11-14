import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type * as THREE from 'three';
import { Destination } from '../types';

interface TestSceneProps {
  destination?: Destination;
}

function CelestialBody({ destination = 'moon' }: { destination: Destination }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.18;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  const isMars = destination === 'mars';

  return (
    <group>
      {/* Primary Planetary Sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshStandardMaterial
          color={isMars ? '#c1440e' : '#a8b2c1'}
          roughness={isMars ? 0.9 : 0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Glow Ring for Mars / Exosphere Rim for Moon */}
      <mesh scale={1.03}>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial
          color={isMars ? '#f97316' : '#7dd3fc'}
          transparent
          opacity={isMars ? 0.15 : 0.08}
          wireframe={false}
        />
      </mesh>
    </group>
  );
}

export function TestScene({ destination = 'moon' }: TestSceneProps) {
  const isMars = destination === 'mars';

  return (
    <>
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={0.35} />
      
      {/* Solar Key Light */}
      <directionalLight
        position={[6, 4, 5]}
        intensity={2.2}
        color={isMars ? '#fff7ed' : '#ffffff'}
      />
      
      {/* Planetary Fill Light */}
      <pointLight
        position={[-6, -3, -5]}
        intensity={0.6}
        color={isMars ? '#fb923c' : '#38bdf8'}
      />

      <Stars
        radius={120}
        depth={60}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.8}
      />

      <CelestialBody destination={destination} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3.2}
        maxDistance={8.5}
        autoRotate={false}
      />
    </>
  );
}
