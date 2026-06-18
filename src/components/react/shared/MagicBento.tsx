'use client';

import React, { useRef, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useIsMobile, useIsTablet } from '@/hooks/use-media-query';


interface BentoItem {
  icon: string;
  title: string;
  description: string;
  status?: string;
  location?: string;
  startDate?: string;
}

// Grid layout: [colSpan, rowSpan] in grid units (for a 4-col grid)
const LAYOUTS: [number, number][] = [
  [2, 2], // 0 – hero tile
  [1, 1], // 1
  [1, 1], // 2
  [2, 1], // 3 – wide
  [1, 2], // 4 – tall
  [1, 1], // 5
  [2, 1], // 6 – wide
  [1, 1], // 7
];

// Accent styles cycling through brand
const ACCENTS = [
  { border: 'rgba(233,69,96,0.35)', iconBg: 'rgba(233,69,96,0.15)', iconColor: '#e94560', topBar: '#e94560' },
  { border: 'rgba(255,255,255,0.09)', iconBg: 'rgba(255,255,255,0.08)', iconColor: 'rgba(255,255,255,0.7)', topBar: 'rgba(255,255,255,0.3)' },
  { border: 'rgba(255,255,255,0.09)', iconBg: 'rgba(255,255,255,0.08)', iconColor: 'rgba(255,255,255,0.7)', topBar: 'rgba(255,255,255,0.3)' },
  { border: 'rgba(233,69,96,0.25)', iconBg: 'rgba(233,69,96,0.12)', iconColor: '#e94560', topBar: '#e94560' },
  { border: 'rgba(255,255,255,0.09)', iconBg: 'rgba(255,255,255,0.08)', iconColor: 'rgba(255,255,255,0.7)', topBar: 'rgba(255,255,255,0.3)' },
  { border: 'rgba(233,69,96,0.2)', iconBg: 'rgba(233,69,96,0.1)', iconColor: '#e94560', topBar: '#e94560' },
  { border: 'rgba(255,255,255,0.09)', iconBg: 'rgba(255,255,255,0.08)', iconColor: 'rgba(255,255,255,0.7)', topBar: 'rgba(255,255,255,0.3)' },
  { border: 'rgba(233,69,96,0.18)', iconBg: 'rgba(233,69,96,0.09)', iconColor: '#e94560', topBar: '#e94560' },
];

// Inline SVG icons
const ICONS: Record<string, React.ReactNode> = {
  zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  'hard-hat': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a8 8 0 0 1 16 0v3"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ship: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/></svg>,
  globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><circle cx={12} cy={12} r={10}/><line x1={2} y1={12} x2={22} y2={12}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><circle cx={12} cy={12} r={5}/><line x1={12} y1={1} x2={12} y2={3}/><line x1={12} y1={21} x2={12} y2={23}/><line x1={4.22} y1={4.22} x2={5.64} y2={5.64}/><line x1={18.36} y1={18.36} x2={19.78} y2={19.78}/><line x1={1} y1={12} x2={3} y2={12}/><line x1={21} y1={12} x2={23} y2={12}/><line x1={4.22} y1={19.78} x2={5.64} y2={18.36}/><line x1={18.36} y1={5.64} x2={19.78} y2={4.22}/></svg>,
  'building-2': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  leaf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
};

function getIcon(name: string) {
  return ICONS[name] ?? ICONS['globe'];
}

type Particle = { id: number; x: number; y: number; vx: number; vy: number; size: number };

interface BentoCardProps {
  item: BentoItem;
  index: number;
  colSpan: number;
  rowSpan: number;
  isMobile: boolean;
  isTablet: boolean;
  brandColor?: string;
}

function BentoCard({ item, index, colSpan, rowSpan, isMobile, isTablet, brandColor }: BentoCardProps) {

  const [scope, animate] = useAnimate();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const accent = React.useMemo(() => {
    if (!brandColor) return ACCENTS[index % ACCENTS.length];
    const isAlt = index % 2 !== 0;
    return {
      border: `${brandColor}${isAlt ? '40' : '59'}`,
      iconBg: `${brandColor}${isAlt ? '1A' : '26'}`,
      iconColor: brandColor,
      topBar: brandColor
    };
  }, [brandColor, index]);

  const isHero = colSpan > 1 || rowSpan > 1;

  const spawnParticles = useCallback(() => {
    setHovered(true);
    const card = scope.current as HTMLDivElement | null;
    if (!card) return;
    const rect = card.getBoundingClientRect();

    for (let i = 0; i < 25; i++) {
      const t = setTimeout(() => {
        if (!scope.current) return;
        const id = Date.now() + i;
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        // Floatier, more varied drift
        const vx = (Math.random() - 0.5) * 60;
        const vy = (Math.random() - 0.8) * 70; 
        const size = 2.0 + Math.random() * 4.0;
        setParticles(prev => [...prev, { id, x, y, vx, vy, size }]);
      }, i * 35);
      timeoutsRef.current.push(t);
    }
  }, [scope]);

  const leaveCleanup = useCallback(() => {
    setHovered(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setParticles([]);
    animate(
      scope.current,
      { rotateX: 0, rotateY: 0, x: 0, y: 0 },
      { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
    );
  }, [scope, animate]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = scope.current as HTMLDivElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x: x + 'px', y: y + 'px' });
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      animate(
        card,
        {
          rotateX: ((y - cy) / cy) * -5,
          rotateY: ((x - cx) / cx) * 5,
          x: (x - cx) * 0.025,
          y: (y - cy) * 0.025,
        },
        { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
      );
    },
    [scope, animate]
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = scope.current as HTMLDivElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const r = document.createElement('div');
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      Object.assign(r.style, {
        position: 'absolute',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent.iconColor}40 0%, transparent 70%)`,
        pointerEvents: 'none',
        left: lx + 'px',
        top: ly + 'px',
        width: '8px',
        height: '8px',
        transform: 'translate(-50%,-50%)',
        zIndex: '30',
      });
      card.appendChild(r);
      animate(r, { scale: 60, opacity: 0 }, {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        onComplete: () => r.remove(),
      });
    },
    [scope, animate, accent.iconColor]
  );

  const cardStyle: CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'linear-gradient(145deg, #13131f 0%, #0c0c18 100%)',
    border: `1px solid ${accent.border}`,
    borderRadius: '2px',
    padding: isHero ? (isMobile ? '24px 20px' : '30px 28px') : (isMobile ? '18px 16px' : '22px 20px'),
    minHeight: isMobile ? '160px' : '180px',
    transformStyle: 'preserve-3d',
  };


  return (
    <motion.div
      ref={scope}
      style={{ ...cardStyle, transformPerspective: 1000 }}
      onMouseEnter={spawnParticles}
      onMouseMove={onMouseMove}
      onMouseLeave={leaveCleanup}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hover spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          background: `radial-gradient(300px circle at ${mousePos.x} ${mousePos.y}, ${accent.iconColor}22 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${accent.topBar}, transparent)`,
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      {/* Status Badge */}
      {item.status && (
        <div style={{
          position: 'absolute',
          top: isMobile ? '16px' : '20px',
          right: isMobile ? '16px' : '20px',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '9.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          background: item.status.toLowerCase() === 'completed' ? '#10b98120' : 
                      item.status.toLowerCase() === 'in progress' ? '#3b82f620' : 
                      item.status.toLowerCase() === 'planned' ? '#f59e0b20' : `${accent.iconColor}20`,
          color: item.status.toLowerCase() === 'completed' ? '#34d399' : 
                 item.status.toLowerCase() === 'in progress' ? '#60a5fa' : 
                 item.status.toLowerCase() === 'planned' ? '#fbbf24' : accent.iconColor,
          border: `1px solid ${
                 item.status.toLowerCase() === 'completed' ? '#10b98140' : 
                 item.status.toLowerCase() === 'in progress' ? '#3b82f640' : 
                 item.status.toLowerCase() === 'planned' ? '#f59e0b40' : `${accent.iconColor}40`
          }`,
          zIndex: 10
        }}>
          {item.status}
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: '2px',
          background: accent.iconBg,
          color: accent.iconColor,
          border: `1px solid ${accent.border}`,
          marginBottom: 'auto',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
          transition: 'transform 0.3s, box-shadow 0.3s',
          ...(hovered
            ? { transform: 'scale(1.06)', boxShadow: `0 0 14px ${accent.iconColor}40` }
            : {}),
        }}
      >
        {getIcon(item.icon)}
      </div>

      {/* Text content */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '14px' }}>
        <div
          style={{
            fontSize: '8.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.32em',
            color: accent.iconColor,
            opacity: 0.65,
            marginBottom: '5px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
          }}
        >
          Mustang Group
        </div>
        <h3
          style={{
            fontSize: isHero ? (isMobile ? '19px' : '21px') : (isMobile ? '15px' : '16px'),
            lineHeight: 1.25,
            color: '#f2efe9',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: '-0.015em',
            marginBottom: '7px',
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontSize: '12px',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          {item.description}
        </p>

        {(item.location || item.startDate) && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px',
            fontSize: '10.5px',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {item.location && <span>{item.location}</span>}
            {item.location && item.startDate && <span>•</span>}
            {item.startDate && <span>{item.startDate}</span>}
          </div>
        )}
      </div>

      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: Math.random() > 0.7 ? '#fff' : accent.iconColor,
            boxShadow: `0 0 ${p.size * 2.5}px ${accent.iconColor}`,
            filter: 'blur(0.3px)',
            pointerEvents: 'none',
            zIndex: 15,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.4, 0.7, 1.2, 0.8, 1],
            opacity: [0, 1, 0.3, 0.9, 0.4, 0.7, 0],
            x: [0, p.vx],
            y: [0, p.vy],
          }}
          transition={{ duration: 3.5 + Math.random() * 1.5, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
}

interface MagicBentoProps {
  items: BentoItem[];
  brandColor?: string;
}

export default function MagicBento({ items, brandColor }: MagicBentoProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getGridCols = () => {
    if (isMobile) return 'repeat(1, 1fr)';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <div
      style={{
        background: '#080810',
        borderRadius: '3px',
        padding: isMobile ? '8px' : '10px',
        display: 'grid',
        gridTemplateColumns: getGridCols(),
        gridAutoRows: isMobile ? 'auto' : '260px',
        gap: isMobile ? '8px' : '12px',
      }}
    >
      {items.map((item, i) => {
        let [colSpan, rowSpan] = LAYOUTS[i % LAYOUTS.length];

        if (isMobile) {
          colSpan = 1;
          rowSpan = 1;
          // Exception for the first hero tile on mobile - make it slightly taller
          if (i === 0) rowSpan = 1; // Keeping it 1 for now to avoid awkward gaps in 1-col
        } else if (isTablet) {
          // Cap colSpan at 2 for tablet (which is 2 cols wide)
          colSpan = Math.min(colSpan, 2);
          // If we are in 2-col mode, some spans might need adjustment to look good
        }

        return (
          <BentoCard
            key={i}
            item={item}
            index={i}
            colSpan={colSpan}
            rowSpan={rowSpan}
            isMobile={isMobile}
            isTablet={isTablet}
            brandColor={brandColor}
          />
        );
      })}
    </div>
  );
}
