import { Html } from "@react-three/drei";

export function SceneLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-brand-navy animate-spin" />
        <p className="text-xs text-text-muted font-medium">Loading 3D Scene</p>
      </div>
    </Html>
  );
}
