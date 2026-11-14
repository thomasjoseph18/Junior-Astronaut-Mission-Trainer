import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type * as THREE from 'three';

function RotatingLunarBody() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        color="#94a3b8"
        roughness={0.85}
        metalness={0.15}
      />
    </mesh>
  );
}

export function TestScene() {
  return (
    <>
      <color attach="background" args={['#030712']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={2.0} color="#f8fafc" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#38bdf8" />
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      <RotatingLunarBody />
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
}
