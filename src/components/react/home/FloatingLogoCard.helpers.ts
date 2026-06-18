export type PresetKey = 'goldblack' | 'blackgold' | 'rosegold' | 'darkgold' | 'blackred' | 'silver';

export type Preset = {
  glow: string;
  base: string;
  edge: string;
  sheenTone: number;
};

export const PRESETS: Record<PresetKey, Preset> = {
  goldblack: { glow: '#FFD700', base: '#EBEBEB', edge: '#D0D5DD', sheenTone:  5 },
  blackgold: { glow: '#D4AF37', base: '#EBEBEB', edge: '#D0D5DD', sheenTone:  0 },
  rosegold:  { glow: '#B76E79', base: '#EBEBEB', edge: '#D0D5DD', sheenTone:  5 },
  darkgold:  { glow: '#8B6914', base: '#EDE8DF', edge: '#D0CBBC', sheenTone: -5 },
  blackred:  { glow: '#FF0033', base: '#EBEBEB', edge: '#D0D5DD', sheenTone:  0 },
  silver:    { glow: '#C4CBD6', base: '#DEE2EC', edge: '#B8BECC', sheenTone: -12 },
};

export function noiseDataUrl(scale: number = 1.4, isLightMode: boolean = false): string {
  const baseF = (0.9 / scale).toFixed(3);
  const colorValues = isLightMode 
    ? '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
    : '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>` +
    `<filter id='n'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${baseF}' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix values='${colorValues}'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#n)' opacity='0.85'/>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
