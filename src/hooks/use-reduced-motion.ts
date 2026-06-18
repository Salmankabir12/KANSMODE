import { useEffect } from "react";
import { useMediaQuery } from "./use-media-query";
import { useThreeStore } from "../components/react/stores/three-store";

export function useReducedMotion(): boolean {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const setReducedMotion = useThreeStore((s) => s.setReducedMotion);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion);
  }, [prefersReducedMotion, setReducedMotion]);

  return prefersReducedMotion;
}
