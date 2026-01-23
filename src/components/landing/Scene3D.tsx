import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Single Bird Component
const Bird = ({ position, speed, amplitude }: { position: [number, number, number]; speed: number; amplitude: number }) => {
  const meshRef = useRef<THREE.Group>(null);
  const wingRef1 = useRef<THREE.Mesh>(null);
  const wingRef2 = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Circular flight path
    meshRef.current.position.x = initialPosition.x + Math.sin(time * speed + offset) * amplitude;
    meshRef.current.position.y = initialPosition.y + Math.sin(time * speed * 1.5 + offset) * (amplitude * 0.3);
    meshRef.current.position.z = initialPosition.z + Math.cos(time * speed + offset) * amplitude;
    
    // Rotate bird to face direction of movement
    const angle = Math.atan2(
      Math.cos(time * speed + offset) * speed * amplitude,
      -Math.sin(time * speed + offset) * speed * amplitude
    );
    meshRef.current.rotation.y = angle;
    
    // Wing flapping animation
    if (wingRef1.current && wingRef2.current) {
      const flapAngle = Math.sin(time * 15) * 0.6;
      wingRef1.current.rotation.z = flapAngle;
      wingRef2.current.rotation.z = -flapAngle;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Bird body */}
      <mesh>
        <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.02, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.015, 0.04, 4]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
      
      {/* Wings */}
      <mesh ref={wingRef1} position={[0.06, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#2d4a6f" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh ref={wingRef2} position={[-0.06, 0, 0]}>
        <boxGeometry args={[0.15, 0.01, 0.08]} />
        <meshStandardMaterial color="#2d4a6f" roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[0, 0, -0.12]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.06, 0.01, 0.08]} />
        <meshStandardMaterial color="#2d4a6f" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Flock of Birds
const BirdFlock = () => {
  const birds = useMemo(() => {
    const birdData: { position: [number, number, number]; speed: number; amplitude: number }[] = [];
    
    // Create multiple birds with varying positions and behaviors
    for (let i = 0; i < 12; i++) {
      birdData.push({
        position: [
          (Math.random() - 0.5) * 4,
          1.5 + Math.random() * 2,
          (Math.random() - 0.5) * 4
        ],
        speed: 0.3 + Math.random() * 0.4,
        amplitude: 1.5 + Math.random() * 1.5
      });
    }
    return birdData;
  }, []);

  return (
    <group>
      {birds.map((bird, i) => (
        <Bird key={i} position={bird.position} speed={bird.speed} amplitude={bird.amplitude} />
      ))}
    </group>
  );
};

// Modern Building Component
const ModernBuilding = () => {
  const buildingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={buildingRef} position={[0, -0.5, 0]}>
        {/* Main Tower */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1.2, 3, 1.2]} />
          <meshStandardMaterial 
            color="#1e3a5f" 
            roughness={0.1} 
            metalness={0.8}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Glass Panels on Main Tower */}
        {[...Array(6)].map((_, i) => (
          <group key={i}>
            <mesh position={[0.61, 0.5 + i * 0.45, 0]}>
              <boxGeometry args={[0.02, 0.35, 0.9]} />
              <meshStandardMaterial 
                color="#60a5fa" 
                roughness={0.1} 
                metalness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[-0.61, 0.5 + i * 0.45, 0]}>
              <boxGeometry args={[0.02, 0.35, 0.9]} />
              <meshStandardMaterial 
                color="#60a5fa" 
                roughness={0.1} 
                metalness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0, 0.5 + i * 0.45, 0.61]}>
              <boxGeometry args={[0.9, 0.35, 0.02]} />
              <meshStandardMaterial 
                color="#60a5fa" 
                roughness={0.1} 
                metalness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0, 0.5 + i * 0.45, -0.61]}>
              <boxGeometry args={[0.9, 0.35, 0.02]} />
              <meshStandardMaterial 
                color="#60a5fa" 
                roughness={0.1} 
                metalness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        ))}
        
        {/* Crown/Top Section */}
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[1.4, 0.3, 1.4]} />
          <meshStandardMaterial color="#0f1f33" roughness={0.2} metalness={0.9} />
        </mesh>
        
        {/* Antenna/Spire */}
        <mesh position={[0, 3.8, 0]}>
          <cylinderGeometry args={[0.03, 0.08, 1, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.95} />
        </mesh>
        
        {/* Secondary Tower */}
        <mesh position={[1, 0.75, 0]}>
          <boxGeometry args={[0.6, 1.5, 0.8]} />
          <meshStandardMaterial color="#2d4a6f" roughness={0.15} metalness={0.7} />
        </mesh>
        
        {/* Glass panels on secondary tower */}
        {[...Array(3)].map((_, i) => (
          <mesh key={`sec-${i}`} position={[1.31, 0.3 + i * 0.4, 0]}>
            <boxGeometry args={[0.02, 0.3, 0.6]} />
            <meshStandardMaterial 
              color="#60a5fa" 
              roughness={0.1} 
              metalness={0.9}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
        
        {/* Tertiary Structure */}
        <mesh position={[-0.8, 0.4, 0.3]}>
          <boxGeometry args={[0.4, 0.8, 0.5]} />
          <meshStandardMaterial color="#3d5a7f" roughness={0.2} metalness={0.6} />
        </mesh>
        
        {/* Base/Platform */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[2.5, 0.1, 2]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
        </mesh>
        
        {/* Decorative elements - LED strips */}
        <mesh position={[0, 3.1, 0.6]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 3.1, -0.6]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

// Ground Plane with subtle reflection
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#e2e8f0" 
        roughness={0.8} 
        metalness={0.1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

// Main Scene Component
const Scene3D = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas
        camera={{ position: [4, 3, 5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#60a5fa" />
        <pointLight position={[0, 4, 0]} intensity={0.5} color="#60a5fa" />
        
        <Environment preset="city" />
        
        <ModernBuilding />
        <BirdFlock />
        <Ground />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* Gradient overlay for blending */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white via-transparent to-transparent" />
    </div>
  );
};

export default Scene3D;
