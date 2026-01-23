import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Trail, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Central luminous core (AI brain)
function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Inner core */}
        <Sphere ref={meshRef} args={[0.4, 32, 32]}>
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={2}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
        {/* Outer glow */}
        <Sphere ref={glowRef} args={[0.6, 32, 32]}>
          <meshStandardMaterial
            color="#0066ff"
            emissive="#0066ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.15}
          />
        </Sphere>
      </group>
    </Float>
  );
}

// Orbiting particle representing a module
function OrbitingParticle({ 
  radius, 
  speed, 
  offset, 
  color, 
  size = 0.08,
  tilt = 0 
}: { 
  radius: number; 
  speed: number; 
  offset: number; 
  color: string;
  size?: number;
  tilt?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <Trail
        width={0.8}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <group ref={ref}>
          <Sphere args={[size, 16, 16]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
        </group>
      </Trail>
    </group>
  );
}

// Orbital ring
function OrbitalRing({ 
  radius, 
  opacity = 0.3,
  rotationSpeed = 0.001,
  tilt = 0
}: { 
  radius: number; 
  opacity?: number;
  rotationSpeed?: number;
  tilt?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <Ring 
      ref={ref}
      args={[radius - 0.01, radius + 0.01, 64]} 
      rotation={[Math.PI / 2 + tilt, 0, 0]}
    >
      <meshBasicMaterial 
        color="#00d4ff" 
        transparent 
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </Ring>
  );
}

// Connection lines between nodes
function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: THREE.Vector3[][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const innerRadius = 0.5;
      const outerRadius = 1.8 + Math.random() * 0.5;
      pts.push([
        new THREE.Vector3(
          Math.cos(angle) * innerRadius,
          (Math.random() - 0.5) * 0.3,
          Math.sin(angle) * innerRadius
        ),
        new THREE.Vector3(
          Math.cos(angle) * outerRadius,
          (Math.random() - 0.5) * 0.5,
          Math.sin(angle) * outerRadius
        )
      ]);
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={linesRef}>
      {points.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                pts[0].x, pts[0].y, pts[0].z,
                pts[1].x, pts[1].y, pts[1].z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={0.2 + Math.sin(i) * 0.1} 
          />
        </line>
      ))}
    </group>
  );
}

// Floating data particles
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    const colors = new Float32Array(150 * 3);
    
    for (let i = 0; i < 150; i++) {
      const radius = 1.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Cyan to blue gradient
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={150}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={150}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Main scene
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0.1]}>
      {/* Central AI core */}
      <CentralCore />
      
      {/* Orbital rings */}
      <OrbitalRing radius={1.2} opacity={0.2} tilt={0.3} />
      <OrbitalRing radius={1.8} opacity={0.15} rotationSpeed={-0.0015} tilt={-0.2} />
      <OrbitalRing radius={2.4} opacity={0.1} rotationSpeed={0.0008} tilt={0.1} />
      
      {/* Orbiting modules - Leads, Imóveis, Jurídico, Dados */}
      <OrbitingParticle radius={1.2} speed={0.4} offset={0} color="#00d4ff" size={0.1} tilt={0.3} />
      <OrbitingParticle radius={1.2} speed={0.4} offset={Math.PI} color="#00ff88" size={0.08} tilt={0.3} />
      <OrbitingParticle radius={1.8} speed={0.25} offset={Math.PI / 2} color="#8844ff" size={0.09} tilt={-0.2} />
      <OrbitingParticle radius={1.8} speed={0.25} offset={Math.PI * 1.5} color="#00d4ff" size={0.07} tilt={-0.2} />
      <OrbitingParticle radius={2.4} speed={0.15} offset={0} color="#00ff88" size={0.06} tilt={0.1} />
      <OrbitingParticle radius={2.4} speed={0.15} offset={Math.PI * 0.7} color="#8844ff" size={0.08} tilt={0.1} />
      
      {/* Connection lines */}
      <ConnectionLines />
      
      {/* Ambient data particles */}
      <DataParticles />
    </group>
  );
}

export default function FlyCore3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8844ff" />
        <Scene />
      </Canvas>
      
      {/* Gradient overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
    </div>
  );
}
