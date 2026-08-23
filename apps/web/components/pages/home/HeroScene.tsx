'use client';

import { Suspense, useRef, useState } from 'react';
import { useGLTF, Environment, Center } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

function Model() {
  const { scene } = useGLTF('/models/Standing_Desk_With_Coffee.glb');
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const { pointer } = state;
    target.current.y = pointer.x * 0.6;
    target.current.x = pointer.y * 0.3;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        target.current.y,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        target.current.x,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.4} />
      </Center>
    </group>
  );
}

export default function HeroScene() {
  const [contextKey, setContextKey] = useState(0);

  return (
    <CanvasErrorBoundary>
      <Canvas
        key={contextKey}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        className="absolute inset-0 h-full w-full"
        onCreated={({ gl }) => {
          const canvas = gl.domElement;

          const handleContextLost = (e: Event) => {
            e.preventDefault();
            console.warn(
              '[HeroScene] WebGL context lost — remounting canvas with a fresh context'
            );
            // Don't try to restore GPU resources in place — force React to
            // tear down and rebuild the whole Canvas, which creates a brand
            // new context and re-uploads everything cleanly.
            setContextKey((k) => k + 1);
          };

          canvas.addEventListener('webglcontextlost', handleContextLost, {
            once: true
          });
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload('/models/Standing_Desk_With_Coffee.glb');
