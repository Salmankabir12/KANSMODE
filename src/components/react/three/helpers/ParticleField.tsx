import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThreeStore } from "../../stores/three-store";

interface ParticleFieldProps {
  count?: number;
  size?: number;
  spread?: number;
  colors?: string[];
  speed?: number;
}

export function ParticleField({
  count: baseCount = 2000,
  size = 0.015,
  spread = 10,
  colors = ["#0a1628", "#dc2626", "#7C3AED", "#0EA5E9"],
  speed = 0.3,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const quality = useThreeStore((s) => s.quality);

  const count =
    quality === "low"
      ? Math.floor(baseCount * 0.25)
      : quality === "medium"
      ? Math.floor(baseCount * 0.5)
      : quality === "high"
      ? Math.floor(baseCount * 0.75)
      : baseCount;

  const { positions, particleColors, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * spread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;

      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002;

      const color = new THREE.Color(
        colors[Math.floor(Math.random() * colors.length)]
      );
      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
    }

    return { positions: pos, particleColors: cols, velocities: vel };
  }, [count, spread, colors]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = clock.elapsedTime * speed;
    const halfSpread = spread / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply noise-like motion
      posArray[i3] += velocities[i3] + Math.sin(time + i * 0.01) * 0.0005;
      posArray[i3 + 1] +=
        velocities[i3 + 1] + Math.cos(time + i * 0.01) * 0.0005;
      posArray[i3 + 2] += velocities[i3 + 2];

      // Wrap around boundaries
      for (let j = 0; j < 3; j++) {
        if (posArray[i3 + j] > halfSpread) posArray[i3 + j] = -halfSpread;
        if (posArray[i3 + j] < -halfSpread) posArray[i3 + j] = halfSpread;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
