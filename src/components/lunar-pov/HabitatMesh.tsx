export function HabitatMesh() {
  return (
    <group position={[-30, 0, -55]}>
      {/* Internal habitat light */}
      <pointLight
        position={[0, 2.5, 0]}
        color="#8899ff"
        intensity={0.7}
        distance={12}
      />

      {/* Main cylindrical habitat module */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 3, 6]} />
        <meshStandardMaterial
          color="#b8c4cc"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Upper habitat dome (hemisphere) */}
      <mesh position={[0, 3, 0]} castShadow>
        <sphereGeometry args={[3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#ccd4dc"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Left solar panel wing */}
      <mesh position={[-9, 2.6, 0]} rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[10, 0.08, 2.5]} />
        <meshStandardMaterial
          color="#1a2a4a"
          metalness={0.85}
          roughness={0.15}
          emissive="#0a1424"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right solar panel wing */}
      <mesh position={[9, 2.6, 0]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[10, 0.08, 2.5]} />
        <meshStandardMaterial
          color="#1a2a4a"
          metalness={0.85}
          roughness={0.15}
          emissive="#0a1424"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Left panel support strut */}
      <mesh position={[-4.5, 2.3, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#8090a0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Right panel support strut */}
      <mesh position={[4.5, 2.3, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#8090a0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Airlock cylinder (front-facing) */}
      <mesh position={[0, 0.8, 3.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
        <meshStandardMaterial
          color="#7a8a9a"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {/* Airlock hatch ring */}
      <mesh position={[0, 0.8, 4.78]}>
        <torusGeometry args={[0.82, 0.08, 12, 32]} />
        <meshStandardMaterial color="#aabbcc" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front windows — glowing */}
      <mesh position={[-1.8, 2.0, 3.01]}>
        <boxGeometry args={[1.2, 0.9, 0.05]} />
        <meshStandardMaterial
          color="#aaccff"
          emissive="#6699ff"
          emissiveIntensity={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[1.8, 2.0, 3.01]}>
        <boxGeometry args={[1.2, 0.9, 0.05]} />
        <meshStandardMaterial
          color="#aaccff"
          emissive="#6699ff"
          emissiveIntensity={1.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Antenna mast */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.8, 8]} />
        <meshStandardMaterial color="#c0c8d0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Antenna dish */}
      <mesh position={[0, 7.0, 0]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#d0d8e0"
          metalness={0.8}
          roughness={0.2}
          side={2}
        />
      </mesh>
    </group>
  );
}
