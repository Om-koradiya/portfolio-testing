import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Text3D, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { LayerMaterial, Depth, Fresnel } from 'lamina';

function WaterParticles({ count = 1000 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.random() * 20 - 10 + 15; // Start from right side
      pos[i * 3 + 1] = Math.random() * 20 - 10;
      pos[i * 3 + 2] = Math.random() * 20 - 10;
    }
    return pos;
  }, [count]);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] -= 0.1; // Move particles left
        if (positions[i] < -20) positions[i] = 20; // Reset position when too far left
        
        // Add wave motion
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.01;
        positions[i + 2] += Math.cos(state.clock.elapsedTime + positions[i]) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00a6ff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WaterEffect() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(viewport.width * 2, viewport.height * 2, 128, 128);
    const pos = geo.attributes.position;
    const pa = pos.array as Float32Array;
    for (let i = 0; i < pa.length; i += 3) {
      pa[i + 2] = Math.sin(pa[i] / 2) * 0.2;
    }
    pos.needsUpdate = true;
    return geo;
  }, [viewport]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.1;
      meshRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 2 + 10;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[15, 0, -5]} rotation={[-Math.PI / 4, 0, 0]}>
      <LayerMaterial side={THREE.DoubleSide} transparent opacity={0.7}>
        <Depth
          colorA="#00ffff"
          colorB="#00a6ff"
          alpha={1}
          mode="normal"
          near={0}
          far={2}
          origin={[1, 1, 1]}
        />
        <Fresnel
          mode="add"
          color="#ffffff"
          intensity={0.3}
          power={2}
          bias={0.1}
        />
      </LayerMaterial>
    </mesh>
  );
}

function TextMesh() {
  const textRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={textRef}>
      <mesh position={[-8, 2, 0]}>
        <textGeometry
          args={[
            'dm',
            {
              size: 3,
              height: 0.2,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.02,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5
            }
          ]}
        />
        <meshStandardMaterial
          color="white"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-12, -2, 0]}>
        <textGeometry
          args={[
            'Hangover',
            {
              size: 3,
              height: 0.2,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.02,
              bevelSize: 0.02,
              bevelOffset: 0,
              bevelSegments: 5
            }
          ]}
        />
        <meshStandardMaterial
          color="white"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <WaterEffect />
      <WaterParticles />
      <TextMesh />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

extend({ TextGeometry: THREE.TextGeometry });

export default function HeroSection() {
  return (
    <section className="h-screen relative bg-black">
      <Canvas className="h-full">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </section>
  );
}