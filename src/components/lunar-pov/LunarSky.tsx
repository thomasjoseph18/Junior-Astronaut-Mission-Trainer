import { Stars } from '@react-three/drei';

export function LunarSky() {
  return (
    <>
      {/* Sun — primary directional key light from solar direction */}
      <directionalLight
        position={[200, 120, -300]}
        intensity={3.2}
        color="#fffff5"
        castShadow={false}
      />

      {/* Ambient fill — very dim blue-black (space environment) */}
      <ambientLight intensity={0.15} color="#1a2040" />

      {/* Backfill from Earth-shine direction */}
      <pointLight
        position={[-100, 50, 100]}
        intensity={0.4}
        color="#2244aa"
        distance={800}
      />

      {/* Earth sphere */}
      <group position={[-80, 160, -500]}>
        {/* Core Earth */}
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshStandardMaterial
            color="#1a3a6e"
            emissive="#2244aa"
            emissiveIntensity={0.6}
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>

        {/* Thin atmosphere halo */}
        <mesh scale={1.045}>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial
            color="#3a6ea8"
            transparent
            opacity={0.28}
            side={2} /* THREE.DoubleSide */
          />
        </mesh>

        {/* Cloud layer suggestion */}
        <mesh scale={1.02}>
          <sphereGeometry args={[14, 24, 24]} />
          <meshBasicMaterial
            color="#8ab4d8"
            transparent
            opacity={0.12}
            side={2}
          />
        </mesh>
      </group>

      {/* Deep space starfield */}
      <Stars
        radius={300}
        depth={60}
        count={2000}
        factor={6}
        saturation={0}
        fade
        speed={0.3}
      />
    </>
  );
}
