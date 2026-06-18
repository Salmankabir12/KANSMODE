import React, { useMemo } from 'react';
import { PRESETS, noiseDataUrl, type PresetKey } from './FloatingLogoCard.helpers';

interface FloatingLogoCardProps {
  src?: string;
  alt?: string;
  cardWidth?: number;
  cardHeight?: number;
  cornerRadius?: number;
  cardThickness?: number;
  preset?: PresetKey;
  noiseScale?: number;
  noiseOpacity?: number;
  estYear?: number;
  serialMark?: string;
  brandLabel?: string;
}

export const FloatingLogoCard: React.FC<FloatingLogoCardProps> = ({
  src = '/img/logo-transparent.png',
  alt = 'Mustang Group',
  cardWidth = 340,
  cardHeight = 440,
  cornerRadius = 18,
  cardThickness = 42,
  preset = 'silver',
  noiseScale = 1.4,
  noiseOpacity = 0.12,
  estYear = 1985,
  serialMark = 'SER · MG/01.85',
  brandLabel = 'Mustang Group',
}) => {
  const eff = PRESETS[preset];
  const sheenHue = preset === 'blackred' ? 355 : eff.sheenTone >= 0 ? 25 : 220;
  const noiseSvg = useMemo(() => noiseDataUrl(noiseScale, true), [noiseScale]);

  const faceLayers = (
    <>
      <div className="flc-edgewash" />
      <div className="flc-sheen" />
      <div className="flc-sheen2" />
      <div className="flc-specular" />
      <div className="flc-edgeshine" />
      <div className="flc-grain" style={{ backgroundImage: `url('${noiseSvg}')` }} />
      <div className="flc-vignette" />
      <div className="flc-band">
        <span>{brandLabel}</span>
        <span className="flc-band-est">EST · {estYear}</span>
      </div>
      <div className="flc-serial">{serialMark}</div>
      <div className="flc-corner-dot" />
    </>
  );

  const imgStyle: React.CSSProperties = {
    filter: 'grayscale(1) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.18)) contrast(1.05) brightness(1.0)',
    width: '92%',
    height: 'auto',
    objectFit: 'contain',
    transform: 'translateX(6.5%)',
  };

  return (
    <div
      className="flc-wrap"
      aria-label={`${brandLabel} card`}
      style={
        {
          '--flc-glow': eff.glow,
          '--flc-base': eff.base,
          '--flc-edge': eff.edge,
          '--flc-sheen-hue': sheenHue,
          '--flc-noise-opacity': noiseOpacity,
        } as React.CSSProperties
      }
    >
      <div
        className="flc-halo"
        style={{
          width: `calc(min(${cardWidth}px, 85vw) * 1.3)`,
          height: `calc(min(${cardHeight}px, 110vw) * 1.3)`,
        }}
      />

      <div
        className="flc-card"
        style={{
          maxWidth: '100%',
          width: `min(${cardWidth}px, 85vw)`,
          height: `min(${cardHeight}px, 110vw)`,
          borderRadius: `${cornerRadius}px`,
          '--flc-thickness': `${cardThickness}px`,
        } as React.CSSProperties}
      >
        <div className="flc-face flc-front">
          {faceLayers}
          <div className="flc-logo-layer">
            <img src={src} alt={alt} draggable="false" style={imgStyle} />
          </div>
        </div>

        <div className="flc-face flc-back">
          {faceLayers}
          <div className="flc-logo-layer flc-logo-layer--back">
            <img src={src} alt={alt} draggable="false" style={imgStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};
