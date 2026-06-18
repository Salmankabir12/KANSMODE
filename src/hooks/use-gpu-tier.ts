import { useEffect } from "react";
import { getGPUTier } from "detect-gpu";
import { useThreeStore } from "../components/react/stores/three-store";

export function useGpuTier() {
  const { gpuTier, quality, setGpuTier } = useThreeStore();

  useEffect(() => {
    getGPUTier().then((result) => {
      setGpuTier(result.tier);
    });
  }, [setGpuTier]);

  return { gpuTier, quality };
}
