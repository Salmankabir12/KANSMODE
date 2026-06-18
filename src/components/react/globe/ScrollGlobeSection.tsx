import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { LazyGlobeViz } from './LazyGlobeViz';
import type { GlobePin } from './GlobeViz';

interface ScrollGlobeSectionProps {
  pins?: GlobePin[];
  connections?: [number, number][];
  children?: ReactNode;
  className?: string;
}

/**
 * ScrollGlobeSection — Sticky fullscreen globe backdrop with scroll-driven animations.
 *
 * Three stages driven by scroll progress (0–1):
 *   0–0.3  → Perspective warp (flat → 3D)
 *   0.3–0.6 → Color ignition (cool → fiery)
 *   0.6–1.0 → Pin cascade (pins slam in sequentially)
 */
export function ScrollGlobeSection({
  pins = [],
  connections = [],
  children,
  className = '',
}: ScrollGlobeSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!outerRef.current) return;
    const rect = outerRef.current.getBoundingClientRect();
    const sectionH = outerRef.current.scrollHeight;
    const viewH = window.innerHeight;

    // Progress: 0 when section top reaches viewport top, 1 when section bottom reaches viewport top
    const totalTravel = sectionH - viewH;
    const traveled = -rect.top;
    const p = Math.max(0, Math.min(1, totalTravel > 0 ? traveled / totalTravel : 0));
    setScrollProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Derive animation phases from scroll progress
  // Stage 1: Perspective warp (0–0.15) — starts nearly upright, quickly settles
  const perspectiveTilt = Math.min(1, scrollProgress / 0.15);
  // Stage 2: Color ignition (0.2–0.6) — cool to fiery
  const colorPhase = scrollProgress < 0.2 ? 0 : Math.min(1, (scrollProgress - 0.2) / 0.4);
  // Stage 3: Pin cascade (0.15–0.6) — handled inside GlobeViz

  return (
    <div
      ref={outerRef}
      className={`relative ${className}`}
      style={{ minHeight: '200vh' }}
    >
      {/* Sticky globe background */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh', zIndex: 0 }}
      >
        <LazyGlobeViz
          pins={pins}
          connections={connections}
          grandScene={true}
          showScene={true}
          className="w-full h-full"
          scrollProgress={scrollProgress}
          enableScrollRotation={true}
          enablePinCascade={true}
          colorPhase={colorPhase}
          perspectiveTilt={perspectiveTilt}
        />
        {/* Gradient overlay at bottom for readability transition */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '30%',
            background: 'linear-gradient(to bottom, transparent, rgba(13,17,23,0.6))',
          }}
        />
      </div>

      {/* Scrollable foreground content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
