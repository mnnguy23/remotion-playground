import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import * as THREE from "three";

// Floating cube with glow effect
const AnimatedCube: React.FC<{
  position: [number, number, number];
  color: string;
  delay: number;
}> = ({ position, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Continuous rotation
  const rotationY = (frame - delay) * 0.03;
  const rotationX = (frame - delay) * 0.02;

  // Floating motion
  const floatY = Math.sin((frame - delay) * 0.05) * 0.2;

  return (
    <mesh
      position={[position[0], position[1] + floatY, position[2]]}
      rotation={[rotationX, rotationY, 0]}
      scale={Math.max(0, scale)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Orbiting ring of spheres
const OrbitingSpheres: React.FC<{ radius: number; count: number }> = ({
  radius,
  count,
}) => {
  const frame = useCurrentFrame();

  const spheres = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return { angle, index: i };
    });
  }, [count]);

  return (
    <group>
      {spheres.map(({ angle, index }) => {
        const orbitSpeed = 0.02;
        const currentAngle = angle + frame * orbitSpeed;
        const x = Math.cos(currentAngle) * radius;
        const z = Math.sin(currentAngle) * radius;
        const y = Math.sin(frame * 0.03 + index) * 0.3;

        const hue = (index / count + frame * 0.002) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

        return (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Central glowing sphere
const CentralSphere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const pulse = 1 + Math.sin(frame * 0.1) * 0.1;

  return (
    <mesh scale={scale * pulse}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

// Ground plane with grid
const Ground: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial
        color="#1a1a2e"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

// Main 3D scene composition
export type ThreeSceneProps = {
  title?: string;
};

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  title = "Three.js + Remotion",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Camera orbit
  const cameraX = Math.sin(frame * 0.01) * 5;
  const cameraZ = Math.cos(frame * 0.01) * 5;

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)",
        position: "relative",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [cameraX, 3, cameraZ], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <directionalLight position={[0, 5, 5]} intensity={0.5} />

        {/* Scene content */}
        <CentralSphere />
        <OrbitingSpheres radius={3} count={12} />
        
        {/* Floating cubes */}
        <AnimatedCube position={[-2.5, 0.5, -1]} color="#3b82f6" delay={10} />
        <AnimatedCube position={[2.5, 0.5, -1]} color="#22c55e" delay={20} />
        <AnimatedCube position={[0, 0.5, 2.5]} color="#f59e0b" delay={30} />

        <Ground />
      </ThreeCanvas>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            textShadow: "0 0 20px rgba(168, 85, 247, 0.8)",
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};
