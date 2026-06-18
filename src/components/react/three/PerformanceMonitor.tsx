import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThreeStore } from "../stores/three-store";

export function PerformanceMonitor() {
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lowFrameCountRef = useRef(0);
  const setQuality = useThreeStore((s) => s.setQuality);
  const quality = useThreeStore((s) => s.quality);

  useFrame(() => {
    framesRef.current++;
    const now = performance.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 2000) {
      const fps = (framesRef.current / delta) * 1000;
      framesRef.current = 0;
      lastTimeRef.current = now;

      if (fps < 20) {
        lowFrameCountRef.current++;
        if (lowFrameCountRef.current >= 3) {
          if (quality === "ultra") setQuality("high");
          else if (quality === "high") setQuality("medium");
          else if (quality === "medium") setQuality("low");
          lowFrameCountRef.current = 0;
        }
      } else {
        lowFrameCountRef.current = Math.max(0, lowFrameCountRef.current - 1);
      }
    }
  });

  useEffect(() => {
    return () => {
      framesRef.current = 0;
      lastTimeRef.current = performance.now();
      lowFrameCountRef.current = 0;
    };
  }, []);

  return null;
}
