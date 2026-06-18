import { Suspense, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { useGpuTier } from "../../../hooks/use-gpu-tier";
import { useReducedMotion } from "../../../hooks/use-reduced-motion";
import { useThreeStore } from "../stores/three-store";
import { SceneLoader } from "./helpers/SceneLoader";

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  fallback?: ReactNode;
  enableOrbitControls?: boolean;
}

export function CanvasWrapper({
  children,
  className = "",
  camera = { position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 },
  fallback,
}: CanvasWrapperProps) {
  const { quality } = useGpuTier();
  const reducedMotion = useReducedMotion();
  const setIsLoading = useThreeStore((s) => s.setIsLoading);

  useEffect(() => {
    setIsLoading(false);
    return () => setIsLoading(true);
  }, [setIsLoading]);

  // For very low-end devices or when reduced motion is requested, skip the 3D scene entirely
  // and just render the fallback to save battery and layout thrashing
  if ((reducedMotion || quality === "low") && fallback) {
    return <div className={`relative ${className} flex items-center justify-center`}>{fallback}</div>;
  }

  const dpr: [number, number] =
    quality === "ultra"
      ? [1, 2]
      : quality === "high"
      ? [1, 1.5]
      : quality === "medium"
      ? [0.75, 1]
      : [0.5, 0.75];

  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={dpr}
        camera={camera}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: quality === "low" ? "low-power" : "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={<SceneLoader />}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
