import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface LunarTerrainProps {
  lowPerformanceMode?: boolean;
}

export function LunarTerrain({ lowPerformanceMode = false }: LunarTerrainProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = lowPerformanceMode ? 64 : 128;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const count = pos.count;

    // Crater bowl definitions: [cx, cz, radius, depth]
    const craters: [number, number, number, number][] = [
      [40, 30, 14, 2.4],
      [-60, -20, 18, 3.0],
      [80, -50, 10, 1.8],
      [-30, 70, 12, 2.0],
      [100, 10, 8, 1.4],
      [-90, -60, 20, 3.5],
    ];

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Flat landing pad at origin (radius 14)
      const distFromOrigin = Math.sqrt(x * x + z * z);
      if (distFromOrigin < 14) {
        pos.setY(i, 0);
        continue;
      }

      // Rolling hills via layered sine waves
      let y =
        Math.sin(x * 0.045 + 0.3) * 1.6 +
        Math.sin(z * 0.038 - 0.7) * 1.4 +
        Math.sin(x * 0.09 + z * 0.07) * 0.7 +
        Math.cos(x * 0.025 - z * 0.03) * 2.0 +
        Math.sin((x + z) * 0.055) * 0.9;

      // Crater bowls
      for (const [cx, cz, radius, depth] of craters) {
        const dx = x - cx;
        const dz = z - cz;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < radius) {
          // Smooth bowl using cosine falloff
          const t = dist / radius;
          const bowl = Math.cos(t * Math.PI * 0.5);
          y -= bowl * depth;
          // Raised rim at edge
          if (t > 0.75) {
            const rimT = (t - 0.75) / 0.25;
            y += Math.sin(rimT * Math.PI) * depth * 0.35;
          }
        }
      }

      pos.setY(i, y);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }, [segments]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400, segments, segments]} />
      <meshStandardMaterial
        color="#787878"
        roughness={1.0}
        metalness={0.0}
      />
    </mesh>
  );
}
