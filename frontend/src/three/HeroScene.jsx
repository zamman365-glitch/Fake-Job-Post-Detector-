import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { StaticGraphicFallback } from '../components/StaticGraphicFallback';
import { useTheme } from '../hooks/useTheme';

function JobDocument({ theme }) {
  const docRef = useRef();

  useFrame((state) => {
    if (!docRef.current) return;
    const t = state.clock.getElapsedTime();
    docRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    docRef.current.rotation.y = Math.sin(t * 0.4) * 0.15 - 0.25;
    docRef.current.rotation.x = Math.cos(t * 0.5) * 0.08 + 0.1;
  });

  const isLight = theme === 'light';

  return (
    <group ref={docRef} position={[-0.8, 0.1, -0.6]}>
      {/* Document Sheet */}
      <mesh>
        <planeGeometry args={[2.2, 3.2, 8, 12]} />
        <meshBasicMaterial
          color={isLight ? '#8a9a8f' : '#252a27'}
          wireframe={true}
          transparent={true}
          opacity={isLight ? 0.65 : 0.45}
        />
      </mesh>

      {/* Simulated Document Text Lines */}
      {[-1.0, -0.7, -0.4, -0.1, 0.2, 0.5, 0.8, 1.1].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.02]}>
          <planeGeometry args={[idx % 2 === 0 ? 1.6 : 1.2, 0.05]} />
          <meshBasicMaterial
            color={isLight ? '#166940' : '#4fb07f'}
            transparent={true}
            opacity={isLight ? 0.5 : 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function DefenseShield({ theme }) {
  const shieldRef = useRef();

  useFrame((state) => {
    if (!shieldRef.current) return;
    const t = state.clock.getElapsedTime();
    shieldRef.current.rotation.y = t * 0.45;
    shieldRef.current.position.y = Math.cos(t * 0.9) * 0.12;
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.9, 1.2);
    shape.lineTo(0.9, 1.2);
    shape.lineTo(0.9, 0.2);
    shape.lineTo(0, -1.3);
    shape.lineTo(-0.9, 0.2);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const isLight = theme === 'light';

  return (
    <group ref={shieldRef} position={[0.7, 0, 0.3]}>
      {/* Outer Wireframe Shield */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={isLight ? '#166940' : '#4fb07f'}
          wireframe={true}
          transparent={true}
          opacity={isLight ? 0.9 : 0.75}
        />
      </mesh>

      {/* Inner Core Solid Tint */}
      <mesh geometry={geometry} scale={[0.92, 0.92, 0.92]}>
        <meshBasicMaterial
          color={isLight ? '#ffffff' : '#131614'}
          transparent={true}
          opacity={isLight ? 0.9 : 0.85}
        />
      </mesh>

      {/* Center Reticle Glyph */}
      <mesh position={[0, 0.1, 0.18]}>
        <ringGeometry args={[0.25, 0.28, 6]} />
        <meshBasicMaterial color={isLight ? '#166940' : '#1f7a4d'} wireframe={true} />
      </mesh>
    </group>
  );
}

function OrbitingShards({ theme }) {
  const groupRef = useRef();
  const isLight = theme === 'light';

  const shardData = useMemo(() => {
    return Array.from({ length: 18 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.5
      ],
      rotSpeed: (Math.random() - 0.5) * 1.5,
      orbitRadius: 1.8 + Math.random() * 1.6,
      orbitSpeed: 0.2 + Math.random() * 0.5,
      orbitAngle: Math.random() * Math.PI * 2,
      scale: 0.06 + Math.random() * 0.12
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const data = shardData[i];
      if (!data) return;
      const angle = data.orbitAngle + t * data.orbitSpeed;
      child.position.x = Math.cos(angle) * data.orbitRadius + 0.3;
      child.position.z = Math.sin(angle) * (data.orbitRadius * 0.7);
      child.rotation.x += data.rotSpeed * 0.02;
      child.rotation.y += data.rotSpeed * 0.02;
    });
  });

  return (
    <group ref={groupRef}>
      {shardData.map((data, idx) => (
        <mesh key={idx} position={data.pos} scale={data.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={
              idx % 3 === 0
                ? (isLight ? '#166940' : '#4fb07f')
                : (isLight ? '#8a9a8f' : '#252a27')
            }
            wireframe={true}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneController({ mousePos }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mousePos.x * 0.75, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mousePos.y * 0.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionHandler = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    window.addEventListener('resize', checkSize);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    return () => {
      window.removeEventListener('resize', checkSize);
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  if (!hasWebGL || reducedMotion || isMobile) {
    return <StaticGraphicFallback state="neutral" />;
  }

  const isLight = theme === 'light';

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        position: 'relative',
        cursor: 'grab'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isLight ? 0.75 : 0.4} />
        <pointLight position={[5, 5, 5]} intensity={isLight ? 1.0 : 0.8} />
        <SceneController mousePos={mousePos} />
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
          <JobDocument theme={theme} />
          <DefenseShield theme={theme} />
          <OrbitingShards theme={theme} />
        </Float>
      </Canvas>

      {/* Decorative corner reticle overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--subtle)',
          letterSpacing: '0.1em',
          pointerEvents: 'none'
        }}
      >
        SYS.3D // ZERO_G_ACTIVE
      </div>
    </div>
  );
}
