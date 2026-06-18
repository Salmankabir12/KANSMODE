import { useEffect, useRef, useCallback } from 'react';
import type { GeoPath, GeoProjection } from 'd3-geo';
import type { FeatureCollection } from 'geojson';
import styles from './GlobeViz.module.css';

const RADIUS = 78;
const PHI = -12;
const ROTATION_SPEED = 22;

export interface GlobePin {
  coords: [number, number]; // [longitude, latitude]
}

interface GlobeVizProps {
  pins?: GlobePin[];
  connections?: [number, number][];
  showScene?: boolean;
  /** Use the grand cosmic scene variant (dense starfield, nebula) */
  grandScene?: boolean;
  className?: string;
  /** Scroll progress 0–1, drives scroll-linked animations */
  scrollProgress?: number;
  /** When true, globe rotation follows scrollProgress instead of auto-rotating */
  enableScrollRotation?: boolean;
  /** When true, pins appear sequentially based on scrollProgress */
  enablePinCascade?: boolean;
  /** Color phase 0–1: cool (#1a1a2e) → hot (#e94560) */
  colorPhase?: number;
  /** Perspective tilt 0–1: flat (top-down) → 3D perspective */
  perspectiveTilt?: number;
}

/** Linearly interpolate between two values */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/** Interpolate hex colors */
function lerpColor(c1: string, c2: string, t: number): string {
  const p = (s: string, i: number) => parseInt(s.slice(i, i + 2), 16);
  const clamped = Math.max(0, Math.min(1, t));
  const r = Math.round(lerp(p(c1, 1), p(c2, 1), clamped));
  const g = Math.round(lerp(p(c1, 3), p(c2, 3), clamped));
  const b = Math.round(lerp(p(c1, 5), p(c2, 5), clamped));
  return `rgb(${r},${g},${b})`;
}

function buildSvgStyles(colorPhase: number): string {
  // Interpolate colors based on phase
  const gratStroke = `rgba(233,69,96,${lerp(0.22, 0.45, colorPhase).toFixed(2)})`;
  const landColor = lerpColor('#ffb45a', '#ff4444', colorPhase);
  const landColor2 = lerpColor('#fff5d8', '#ffaaaa', colorPhase);
  const pinFill = lerpColor('#ffd27a', '#ff6b6b', colorPhase);
  const pinStroke = lerpColor('#fff5d8', '#ffcccc', colorPhase);
  const connColor = lerpColor('#ffb45a', '#e94560', colorPhase);
  const connGlow = lerpColor('#ffd27a', '#ff6b8a', colorPhase);

  return `
    .gv-graticule { fill: none; stroke: ${gratStroke}; stroke-width: 0.3; }
    .gv-land      { fill: none; stroke: ${landColor}; stroke-width: 0.55; stroke-linejoin: round; stroke-linecap: round; filter: url(#gv-land-glow); }
    .gv-land2     { fill: none; stroke: ${landColor2}; stroke-width: 0.35; stroke-linejoin: round; stroke-linecap: round; opacity: 0.9; }
    .gv-pin-pulse {
      fill: none; stroke: ${connColor}; stroke-width: 1;
      transform-origin: center; transform-box: fill-box;
      animation: gvPinPulse 1.8s ease-out infinite;
    }
    .gv-pin-shape { fill: ${pinFill}; stroke: ${pinStroke}; stroke-width: 0.4; filter: url(#gv-pin-glow); }
    .gv-pin-core  { fill: #1a1a2e; }
    .gv-conn      { fill: none; stroke: ${connColor}; stroke-width: 1.4; stroke-linecap: round; filter: url(#gv-land-glow); opacity: 0.95; }
    .gv-conn-glow { fill: none; stroke: ${connGlow}; stroke-width: 2.4; stroke-linecap: round; opacity: 0.35; filter: url(#gv-land-glow); }
    .gv-conn-dash {
      fill: none; stroke: #ffffff; stroke-width: 1.1; stroke-linecap: round;
      stroke-dasharray: 5 55;
      animation: gvDashFlow 2.4s linear infinite;
    }
    .gv-pin-enter {
      animation: gvPinEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .gv-pin-shockwave {
      fill: none; stroke: ${connColor}; stroke-width: 1.5;
      animation: gvShockwave 1s ease-out forwards;
    }
    @keyframes gvPinPulse {
      0%   { r: 1.5px; opacity: 1; }
      100% { r: 10px;  opacity: 0; }
    }
    @keyframes gvDashFlow {
      to { stroke-dashoffset: -64; }
    }
    @keyframes gvPinEnter {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes gvShockwave {
      0%   { r: 2px; opacity: 1; stroke-width: 2; }
      100% { r: 18px; opacity: 0; stroke-width: 0.5; }
    }
    @media (prefers-reduced-motion: reduce) {
      .gv-pin-pulse, .gv-conn-dash, .gv-pin-enter, .gv-pin-shockwave { animation: none; }
    }
  `;
}

export function GlobeViz({
  pins = [],
  connections = [],
  showScene = true,
  grandScene = false,
  className = '',
  scrollProgress,
  enableScrollRotation = false,
  enablePinCascade = false,
  colorPhase = 0,
  perspectiveTilt = 1,
}: GlobeVizProps) {
  const gratRef  = useRef<SVGPathElement>(null);
  const landRef  = useRef<SVGPathElement>(null);
  const land2Ref = useRef<SVGPathElement>(null);
  const pinsEl   = useRef<SVGGElement>(null);
  const connEl   = useRef<SVGGElement>(null);
  const styleRef = useRef<HTMLStyleElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  // Track which pins have been revealed (for cascade entrance animation)
  const revealedPins = useRef<Set<number>>(new Set());

  // Keep latest props without restarting the animation loop
  const dataRef = useRef({
    pins, connections, scrollProgress, enableScrollRotation,
    enablePinCascade, colorPhase, perspectiveTilt,
  });
  dataRef.current = {
    pins, connections, scrollProgress, enableScrollRotation,
    enablePinCascade, colorPhase, perspectiveTilt,
  };

  // Self-contained scroll tracking for standalone scroll rotation
  // (when enableScrollRotation is true but no external scrollProgress is provided)
  const selfScrollRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enableScrollRotation || scrollProgress !== undefined) return;

    function onScroll() {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when element enters viewport, 1 when it leaves
      const totalTravel = vh + rect.height;
      const traveled = vh - rect.top;
      selfScrollRef.current = Math.max(0, Math.min(1, traveled / totalTravel));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [enableScrollRotation, scrollProgress]);

  useEffect(() => {
    let active = true;
    let proj: GeoProjection | null = null;
    let pathFn: GeoPath | null = null;
    let landData: FeatureCollection | null = null;
    let gratData: GeoJSON.GeoJsonObject | null = null;
    let lambda = 0;
    let last = 0;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = mq.matches;
    const onMQ = (e: MediaQueryListEvent) => { reduced = e.matches; };
    mq.addEventListener('change', onMQ);

    function isVisible([lon, lat]: [number, number]): boolean {
      if (!proj) return false;
      const r = proj.rotate()!;
      const lm = -r[0] * Math.PI / 180;
      const ph = -r[1] * Math.PI / 180;
      const lo = lon * Math.PI / 180;
      const la = lat * Math.PI / 180;
      return (
        Math.cos(la) * Math.cos(lo) * Math.cos(ph) * Math.cos(lm) +
        Math.cos(la) * Math.sin(lo) * Math.cos(ph) * Math.sin(lm) +
        Math.sin(la) * Math.sin(ph)
      ) > 0.05;
    }

    function renderFrame() {
      if (!proj || !pathFn || !gratData) return;
      const {
        pins: p, connections: c,
        enablePinCascade: cascade,
        scrollProgress: sp,
        colorPhase: cp,
      } = dataRef.current;

      // Update dynamic SVG styles based on color phase
      if (styleRef.current) {
        styleRef.current.textContent = buildSvgStyles(cp);
      }

      gratRef.current?.setAttribute('d', pathFn(gratData as any) ?? '');

      if (landData) {
        const ld = pathFn(landData) ?? '';
        landRef.current?.setAttribute('d', ld);
        land2Ref.current?.setAttribute('d', ld);
      }

      // Determine visible pins based on cascade mode
      // Cascade from 15% to 60% scroll progress
      const visibleCount = cascade && sp !== undefined
        ? Math.floor(lerp(0, p.length, Math.max(0, Math.min(1, (sp - 0.15) / 0.45))))
        : p.length;

      if (pinsEl.current) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const frag = document.createDocumentFragment();
        p.forEach(({ coords }, i) => {
          if (i >= visibleCount) return;
          if (!isVisible(coords)) return;
          const pt = proj!(coords as any);
          if (!pt) return;
          const [x, y] = pt;
          const isNew = !revealedPins.current.has(i);
          if (isNew) revealedPins.current.add(i);

          const g = document.createElementNS(SVG_NS, 'g');
          g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
          if (isNew && cascade) g.setAttribute('class', 'gv-pin-enter');

          const pulse = document.createElementNS(SVG_NS, 'circle');
          pulse.setAttribute('class', 'gv-pin-pulse');
          pulse.setAttribute('r', '1.5');
          g.appendChild(pulse);

          if (isNew && cascade) {
            const shockwave = document.createElementNS(SVG_NS, 'circle');
            shockwave.setAttribute('class', 'gv-pin-shockwave');
            shockwave.setAttribute('cx', '0');
            shockwave.setAttribute('cy', '0');
            shockwave.setAttribute('r', '2');
            g.appendChild(shockwave);
          }

          const shape = document.createElementNS(SVG_NS, 'path');
          shape.setAttribute('class', 'gv-pin-shape');
          shape.setAttribute('d', 'M 0 0 C -3.6 -3.6 -3.6 -7.6 0 -10 C 3.6 -7.6 3.6 -3.6 0 0 Z');
          g.appendChild(shape);

          const core = document.createElementNS(SVG_NS, 'circle');
          core.setAttribute('class', 'gv-pin-core');
          core.setAttribute('cx', '0');
          core.setAttribute('cy', '-6.4');
          core.setAttribute('r', '1.5');
          g.appendChild(core);

          frag.appendChild(g);
        });
        pinsEl.current.replaceChildren(frag);
      }

      if (connEl.current) {
        const SVG_NS = 'http://www.w3.org/2000/svg';
        const frag = document.createDocumentFragment();
        c.forEach(([a, b]) => {
          // Only show connection if both endpoint pins are visible
          if (a >= visibleCount || b >= visibleCount) return;
          const ca = p[a]?.coords;
          const cb = p[b]?.coords;
          if (!ca || !cb || !isVisible(ca) || !isVisible(cb)) return;
          const line = { type: 'LineString' as const, coordinates: [ca, cb] };
          const d = pathFn!(line as any);
          if (!d) return;

          for (const cls of ['gv-conn-glow', 'gv-conn', 'gv-conn-dash']) {
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('class', cls);
            path.setAttribute('d', d);
            frag.appendChild(path);
          }
        });
        connEl.current.replaceChildren(frag);
      }
    }

    function loop(now: number) {
      if (!active) return;
      const dt = (now - last) / 1000;
      last = now;

      if (proj) {
        const {
          enableScrollRotation: scrollRot,
          scrollProgress: sp,
          perspectiveTilt: tilt,
        } = dataRef.current;

        if (scrollRot && sp !== undefined) {
          // Scroll-driven rotation: 2 full rotations over the scroll distance
          lambda = sp * 720;
        } else if (scrollRot && selfScrollRef.current !== undefined) {
          // Self-tracked scroll rotation (standalone globe)
          lambda = selfScrollRef.current * 720;
        } else if (!reduced) {
          lambda = (lambda + ROTATION_SPEED * dt) % 360;
        }

        // Perspective tilt: interpolate phi from -25 (tilted) to -12 (standard 3D)
        const currentPhi = lerp(-25, PHI, tilt);
        proj.rotate([lambda, currentPhi, 0]);
      }

      renderFrame();
      rafRef.current = requestAnimationFrame(loop);
    }

    async function init() {
      const [{ geoOrthographic, geoPath, geoGraticule10 }, topoClient] = await Promise.all([
        import('d3-geo'),
        import('topojson-client'),
      ]);
      if (!active) return;

      proj = geoOrthographic().scale(RADIUS).translate([0, 0]).clipAngle(90).rotate([0, PHI, 0]);
      pathFn = geoPath(proj);
      gratData = geoGraticule10() as any;

      try {
        const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json');
        if (!active) return;
        const topo = await res.json();
        landData = topoClient.feature(topo, topo.objects.countries) as unknown as FeatureCollection;
      } catch { /* no-op — globe still renders with graticule + pins */ }

      if (!active) return;
      last = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }

    init();

    return () => {
      active = false;
      mq.removeEventListener('change', onMQ);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute dynamic perspective based on tilt prop
  const sceneTiltStyle = perspectiveTilt !== undefined
    ? { perspectiveOrigin: `50% ${lerp(60, 42, perspectiveTilt)}%` } as React.CSSProperties
    : undefined;

  const useGrand = grandScene;
  const sceneClass = useGrand ? styles.sceneGrand : styles.scene;

  return (
    <div ref={wrapRef} className={`${styles.wrapper} ${className}`}>
      {(showScene || useGrand) && (
        <div className={sceneClass} style={sceneTiltStyle} aria-hidden="true">
          {useGrand ? (
            <>
              <div className={styles.starsGrand} />
              <div className={styles.nebula} />
            </>
          ) : (
            <div className={styles.stars} />
          )}
          <div className={styles.ceiling} />
          <div className={styles.floor} />
        </div>
      )}

      <div className={styles.stage}>
        <div className={styles.stageInner}>
          {/* Globe SVG */}
          <svg viewBox="-100 -100 200 200" width="200" height="200" style={{ overflow: 'visible' }}>
            <style ref={styleRef}>{buildSvgStyles(colorPhase)}</style>
            <defs>
              <radialGradient id="gv-sphere-grad" cx="42%" cy="38%" r="65%">
                <stop offset="0%"   stopColor="#1e2a45" />
                <stop offset="55%"  stopColor="#1a1a2e" />
                <stop offset="100%" stopColor="#0d1117" />
              </radialGradient>

              <filter id="gv-land-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="gv-edge-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="gv-pin-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="gv-sphere-clip">
                <circle cx="0" cy="0" r="78" />
              </clipPath>

              <radialGradient id="gv-terminator" cx="35%" cy="40%" r="75%">
                <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
                <stop offset="55%"  stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
              </radialGradient>
              <radialGradient id="gv-specular" cx="35%" cy="30%" r="40%">
                <stop offset="0%"  stopColor="rgba(255,220,170,0.22)" />
                <stop offset="60%" stopColor="rgba(255,220,170,0)" />
              </radialGradient>
            </defs>

            {/* Sphere body */}
            <circle cx="0" cy="0" r="78" fill="url(#gv-sphere-grad)" />

            <g clipPath="url(#gv-sphere-clip)">
              <path ref={gratRef} className="gv-graticule" />
              <path ref={landRef} className="gv-land" />
              <path ref={land2Ref} className="gv-land2" />
              <circle cx="0" cy="0" r="78" fill="url(#gv-specular)" />
              <circle cx="0" cy="0" r="78" fill="url(#gv-terminator)" />
              {/* Connections */}
              <g ref={connEl} />
              {/* Pins */}
              <g ref={pinsEl} />
            </g>

            {/* Rim — color shifts with phase */}
            <circle
              cx="0" cy="0" r="78"
              fill="none"
              stroke={lerpColor('#ffb45a', '#e94560', colorPhase)}
              strokeWidth="1"
              opacity={lerp(0.85, 1, colorPhase)}
              filter="url(#gv-edge-glow)"
            />
          </svg>

          {/* Orbital rings */}
          <div className={styles.orbits}>
            <svg viewBox="-122 -122 244 244" width="100%" height="100%">
              <defs>
                <filter id="gv-whirl-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#gv-whirl-glow)">
                {/* Ring 1 — amber arcs */}
                <g className={styles.ringA}>
                  <path d="M -100 -8 A 100 100 0 0 1 -52 -85"
                    fill="none" stroke={lerpColor('#ffb45a', '#e94560', colorPhase)} strokeWidth="1.2" opacity="0.9" strokeLinecap="round" />
                  <path d="M 100 8 A 100 100 0 0 1 52 85"
                    fill="none" stroke={lerpColor('#ffb45a', '#e94560', colorPhase)} strokeWidth="1.2" opacity="0.9" strokeLinecap="round" />
                </g>
                {/* Ring 2 — red counter-rotating */}
                <g className={styles.ringB}>
                  <path d="M -100 36 A 108 108 0 0 1 -78 -75"
                    fill="none" stroke="#E94560" strokeWidth="0.9" opacity={lerp(0.75, 1, colorPhase)} strokeLinecap="round" />
                  <path d="M 100 -36 A 108 108 0 0 1 78 75"
                    fill="none" stroke="#E94560" strokeWidth="0.9" opacity={lerp(0.75, 1, colorPhase)} strokeLinecap="round" />
                </g>
                {/* Ring 3 — dashed gold sweep */}
                <g className={styles.ringC}>
                  <path d="M -113 -25 A 116 116 0 1 1 25 113"
                    fill="none" stroke={lerpColor('#ffd27a', '#ff6b8a', colorPhase)} strokeWidth="0.6" opacity={lerp(0.4, 0.7, colorPhase)}
                    strokeDasharray="1 5" strokeLinecap="round" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
