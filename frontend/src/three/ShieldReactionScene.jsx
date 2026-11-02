import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StaticGraphicFallback } from '../components/StaticGraphicFallback';
import { useTheme } from '../hooks/useTheme';

function ReactiveShieldMesh({ isFraud, isGenuine, isScanning, theme }) {
  const meshRef = useRef();
  const innerRef = useRef();
  const glitchRef = useRef();
  const isLight = theme === 'light';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      if (isScanning) {
        meshRef.current.rotation.y = t * 3.5;
        meshRef.current.rotation.x = Math.sin(t * 4) * 0.2;
      } else if (isFraud) {
        // Erratic rotation & jitter
        meshRef.current.rotation.y = t * 0.8 + Math.sin(t * 12) * 0.05;
        meshRef.current.position.x = (Math.random() - 0.5) * 0.04;
        meshRef.current.position.y = (Math.random() - 0.5) * 0.04;
      } else {
        // Smooth, harmonic genuine rotation
        meshRef.current.rotation.y = t * 0.4;
        meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
        meshRef.current.position.set(0, Math.sin(t * 1.2) * 0.08, 0);
      }
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
    }
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 1.4);
    shape.lineTo(1, 1.4);
    shape.lineTo(1, 0.2);
    shape.lineTo(0, -1.5);
    shape.lineTo(-1, 0.2);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 1
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const color = isFraud
    ? '#e5484d'
    : isGenuine
    ? (isLight ? '#166940' : '#4fb07f')
    : isScanning
    ? (isLight ? '#166940' : '#4fb07f')
    : (isLight ? '#728277' : '#8a968f');

  return (
    <group ref={meshRef}>
      {/* Outer Sharp Wireframe Shield */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          wireframe={true}
          transparent={true}
          opacity={isFraud ? 0.95 : 0.85}
        />
      </mesh>

      {/* Inner Core */}
      <mesh ref={innerRef} geometry={geometry} scale={[0.88, 0.88, 0.88]}>
        <meshBasicMaterial
          color={isLight ? '#ffffff' : '#131614'}
          transparent={true}
          opacity={isLight ? 0.95 : 0.88}
        />
      </mesh>

      {/* Decorative center element */}
      {isGenuine && (
        <mesh position={[0, 0, 0.22]}>
          <ringGeometry args={[0.3, 0.35, 8]} />
          <meshBasicMaterial color={isLight ? '#166940' : '#4fb07f'} wireframe={true} />
        </mesh>
      )}

      {/* Glitch / Crack lines if fraud */}
      {isFraud && (
        <group ref={glitchRef} position={[0, 0, 0.25]}>
          <mesh position={[-0.1, 0.1, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.06, 1.2, 0.04]} />
            <meshBasicMaterial color="#e5484d" />
          </mesh>
          <mesh position={[0.2, -0.3, 0]} rotation={[0, 0, -0.7]}>
            <boxGeometry args={[0.06, 0.9, 0.04]} />
            <meshBasicMaterial color="#e5484d" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function FloatingParticles({ isFraud, isGenuine, theme }) {
  const pointsRef = useRef();
  const isLight = theme === 'light';

  const [positions, color] = useMemo(() => {
    const count = 30;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const c = isFraud
      ? '#c1121f'
      : isGenuine
      ? (isLight ? '#166940' : '#1f7a4d')
      : (isLight ? '#8a9a8f' : '#252a27');
    return [pos, c];
  }, [isFraud, isGenuine, isLight]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.1;
    if (isFraud) {
      pointsRef.current.rotation.x = Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent={true}
        opacity={0.7}
      />
    </points>
  );
}

export default function ShieldReactionScene({
  result,
  isScanning = false
}) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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

  const stateKey = result ? (result.isFraud ? 'fraud' : 'genuine') : isScanning ? 'neutral' : 'neutral';

  if (!hasWebGL || reducedMotion || isMobile) {
    return <StaticGraphicFallback state={stateKey} />;
  }

  const isFraud = result?.isFraud || false;
  const isGenuine = result ? !result.isFraud : false;
  const isLight = theme === 'light';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '280px',
        position: 'relative'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isLight ? 0.75 : 0.5} />
        <pointLight position={[3, 3, 3]} intensity={isLight ? 1.1 : 0.9} />
        <ReactiveShieldMesh
          isFraud={isFraud}
          isGenuine={isGenuine}
          isScanning={isScanning}
          theme={theme}
        />
        <FloatingParticles isFraud={isFraud} isGenuine={isGenuine} theme={theme} />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: isFraud ? 'var(--crimson-300)' : isGenuine ? 'var(--forest-300)' : 'var(--muted)',
          letterSpacing: '0.08em'
        }}
      >
        {isScanning
          ? 'SCANNING // REALTIME_EXTRACT'
          : isFraud
          ? 'ANOMALY DETECTED // GLITCH_LOCK'
          : isGenuine
          ? 'INTEGRITY VERIFIED // SHIELD_SECURE'
          : 'CHAMBER IDLE // AWAITING_INPUT'}
      </div>
    </div>
  );
}
