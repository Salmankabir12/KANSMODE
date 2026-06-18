import React, { Suspense, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { GlobePin } from './GlobeViz';

const GlobeViz = React.lazy(() =>
  import('./GlobeViz').then((m) => ({ default: m.GlobeViz }))
);

interface LazyGlobeVizProps {
  pins?: GlobePin[];
  connections?: [number, number][];
  showScene?: boolean;
  grandScene?: boolean;
  className?: string;
  scrollProgress?: number;
  enableScrollRotation?: boolean;
  enablePinCascade?: boolean;
  colorPhase?: number;
  perspectiveTilt?: number;
}

export function LazyGlobeViz(props: LazyGlobeVizProps) {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '400px 0px' });

  useEffect(() => {
    import('./GlobeViz');
  }, []);

  return (
    <div
      ref={ref}
      className={`w-full h-full transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
    >
      {inView && (
        <Suspense fallback={null}>
          <GlobeViz {...props} />
        </Suspense>
      )}
    </div>
  );
}
