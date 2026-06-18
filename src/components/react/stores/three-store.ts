import { create } from "zustand";

type QualityTier = "low" | "medium" | "high" | "ultra";

interface ThreeState {
  quality: QualityTier;
  isLoading: boolean;
  gpuTier: number;
  reducedMotion: boolean;
  setQuality: (quality: QualityTier) => void;
  setIsLoading: (loading: boolean) => void;
  setGpuTier: (tier: number) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useThreeStore = create<ThreeState>((set) => ({
  quality: "medium",
  isLoading: true,
  gpuTier: 2,
  reducedMotion: false,
  setQuality: (quality) => set({ quality }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setGpuTier: (gpuTier) => {
    let quality: QualityTier = "medium";
    if (gpuTier === 0) quality = "low";
    else if (gpuTier === 1) quality = "low";
    else if (gpuTier === 2) quality = "medium";
    else quality = "high";
    set({ gpuTier, quality });
  },
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
