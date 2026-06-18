import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import type { FloatingLinesProps } from './FloatingLines';

const FloatingLines = React.lazy(() => import('./FloatingLines').then(m => ({ default: m.FloatingLines })));

export function LazyFloatingLines(props: FloatingLinesProps) {
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: '400px 0px' });

  return (
    <div ref={ref} className="w-full h-full">
      {inView && (
        <Suspense fallback={null}>
          <FloatingLines {...props} />
        </Suspense>
      )}
    </div>
  );
}
