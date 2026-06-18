import { CanvasWrapper } from "./CanvasWrapper";
import { ParticleField } from "./helpers/ParticleField";

interface ParticleSceneProps {
  className?: string;
  count?: number;
  colors?: string[];
}

function ParticleFallback({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(circle at 30% 50%, rgba(10,22,40,0.03) 0%, transparent 60%)",
      }}
    />
  );
}

export function ParticleScene({
  className = "absolute inset-0",
  count = 1500,
  colors,
}: ParticleSceneProps) {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0, 8], fov: 60 }}
      fallback={<ParticleFallback className={className} />}
    >
      <ParticleField count={count} colors={colors} />
    </CanvasWrapper>
  );
}
