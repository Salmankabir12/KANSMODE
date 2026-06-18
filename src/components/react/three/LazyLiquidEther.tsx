import React, { Suspense, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { LiquidEtherProps } from './LiquidEther';

const LiquidEther = React.lazy(() => import('./LiquidEther').then(module => ({ default: module.LiquidEther })));

export function LazyLiquidEther(props: LiquidEtherProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '800px 0px', // Trigger render much earlier
  });

  useEffect(() => {
    // Pre-warm the chunk cache as soon as the wrapper mounts
    // This starts the network download immediately without rendering yet
    import('./LiquidEther');
  }, []);

  return (
    <div ref={ref} className={`w-full h-full min-h-[400px] transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
      {inView && (
        <Suspense fallback={null}>
          <LiquidEther {...props} />
        </Suspense>
      )}
    </div>
  );
}
