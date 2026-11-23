import {
  type BeamsConfig,
  type ClockConfig,
  DEFAULT_BEAMS_CONFIG,
  DEFAULT_CLOCK_CONFIG,
  WALLPAPER_PRESETS,
  clampNumber,
  createRandomConfig as createRandomBeamsConfig,
  isValidHexColor,
  sanitizeBeamsConfig,
} from './wallpaperConfig';

export type WallpaperDesignId =
  | 'beams'
  | 'pixel-snow'
  | 'holo-mosaic'
  | 'aurora'
  | 'gradient-ascii'
  | 'letter-glitch'
  | 'grainient';

export interface PixelSnowConfig {
  color: string;
  backgroundColor: string;
  variant: 'square' | 'round' | 'snowflake';
  density: number;
  speed: number;
  wind: number;
  sway: number;
  flakeSize: number;
  pixelSize: number;
  depth: number;
  brightness: number;
  glow: number;
  twinkle: number;
  accumulate: boolean;
  mouseInteraction: boolean;
  lightMode: boolean;
  paused: boolean;
}

export interface HoloMosaicConfig {
  color: string;
  metalColor: string;
  spectrum: 'full' | 'warm' | 'cool' | 'pearl';
  tileSize: number;
  gap: number;
  roundness: number;
  bevel: number;
  rotation: number;
  swirl: number;
  ripple: number;
  intensity: number;
  saturation: number;
  glitter: number;
  sheen: number;
  grain: number;
  speed: number;
  filter: 'none' | 'dither' | 'ascii';
  mouseInteraction: boolean;
  flipOnClick: boolean;
  lightMode: boolean;
  paused: boolean;
}

export interface AuroraConfig {
  colorStops: [string, string, string];
  backgroundColor: string;
  amplitude: number;
  blend: number;
  speed: number;
  height: number;
  scale: number;
  glow: number;
  brightness: number;
  layers: number;
  direction: 'top' | 'bottom';
  mouseInteraction: boolean;
  lightMode: boolean;
  paused: boolean;
}

export interface GradientAsciiConfig {
  colors: [string, string, string, string];
  backgroundColor: string;
  shape: 'horizon' | 'pinch' | 'rise' | 'eclipse';
  cellSize: number;
  density: number;
  glyphOpacity: number;
  glow: number;
  flicker: number;
  softness: number;
  scale: number;
  flow: number;
  speed: number;
  gradientOpacity: number;
  grain: number;
  mouseInteraction: boolean;
  clickEffect: 'none' | 'wave' | 'burst';
  lightMode: boolean;
}

export interface LetterGlitchConfig {
  glitchColors: [string, string];
  baseColor: string;
  backgroundColor: string;
  fontSize: number;
  spacing: number;
  density: number;
  baseOpacity: number;
  glitchAmount: number;
  speed: number;
  smooth: boolean;
  interactive: boolean;
  cursorRadius: number;
  clickEffect: 'tear' | 'burst';
  flow: number;
  edgeFade: number;
  centerFade: number;
  lightMode: boolean;
}

export interface GrainientConfig {
  colors: [string, string, string, string, string];
  type: 'linear' | 'radial';
  angle: number;
  bands: number;
  speed: number;
  flow: number;
  scale: number;
  softness: number;
  silk: number;
  grainAmount: number;
  grainSize: number;
  grainAnimated: boolean;
  contrast: number;
  saturation: number;
  interactive: boolean;
  stir: number;
  clickSwirl: boolean;
  lightMode: boolean;
}

export interface AllDesignConfigs {
  beams: BeamsConfig;
  'pixel-snow': PixelSnowConfig;
  'holo-mosaic': HoloMosaicConfig;
  aurora: AuroraConfig;
  'gradient-ascii': GradientAsciiConfig;
  'letter-glitch': LetterGlitchConfig;
  grainient: GrainientConfig;
}

export interface DesignMeta {
  id: WallpaperDesignId;
  label: string;
  jaLabel: string;
  description: string;
  accentSwatch: [string, string];
}

export interface DesignPresetItem {
  id: string;
  designId: WallpaperDesignId;
  slug: string;
  name: string;
  subtitle: string;
  swatch: [string, string];
  lightMode: boolean;
  config: AllDesignConfigs[WallpaperDesignId];
  isCustom?: boolean;
}

export const DESIGN_LIST: DesignMeta[] = [
  {
    id: 'beams',
    label: 'Beams',
    jaLabel: '光線',
    description: '立体的な光の帯が滑らかに揺らぐシェーダー',
    accentSwatch: ['#050507', '#F2F4F8'],
  },
  {
    id: 'pixel-snow',
    label: 'PixelSnow',
    jaLabel: 'ピクセル雪',
    description: 'ドット絵の雪結晶が奥行きを持って舞う背景',
    accentSwatch: ['#070B14', '#CBE8FF'],
  },
  {
    id: 'holo-mosaic',
    label: 'HoloMosaic',
    jaLabel: 'ホロモザイク',
    description: '金属タイルが虹色に反射するホログラフィック面',
    accentSwatch: ['#120F17', '#D8B4FE'],
  },
  {
    id: 'aurora',
    label: 'Aurora',
    jaLabel: 'オーロラ',
    description: '極光のカーテンが多層にたなびく幻想的な背景',
    accentSwatch: ['#040710', '#4FFFB0'],
  },
  {
    id: 'gradient-ascii',
    label: 'GradientASCII',
    jaLabel: 'グラデASCII',
    description: '滑らかなグラデーションをASCII文字で描く表現',
    accentSwatch: ['#0A1024', '#38BDF8'],
  },
  {
    id: 'letter-glitch',
    label: 'LetterGlitch',
    jaLabel: '文字グリッチ',
    description: 'グリッド状の文字列が電子的に瞬くマトリクス表現',
    accentSwatch: ['#050807', '#61DCA3'],
  },
  {
    id: 'grainient',
    label: 'Grainient',
    jaLabel: 'グレイニエント',
    description: '粒子感と絹のようなうねりを持つグラデーション',
    accentSwatch: ['#120F17', '#F97316'],
  },
];

export const DEFAULT_DESIGN_CONFIGS: AllDesignConfigs = {
  beams: { ...DEFAULT_BEAMS_CONFIG },
  'pixel-snow': {
    color: '#e8f4ff',
    backgroundColor: '#070b14',
    variant: 'snowflake',
    density: 0.55,
    speed: 0.9,
    wind: 0.25,
    sway: 0.5,
    flakeSize: 1.05,
    pixelSize: 3,
    depth: 0.65,
    brightness: 1.05,
    glow: 0.85,
    twinkle: 0.4,
    accumulate: true,
    mouseInteraction: true,
    lightMode: false,
    paused: false,
  },
  'holo-mosaic': {
    color: '#100e16',
    metalColor: '#e8ebf2',
    spectrum: 'full',
    tileSize: 1.0,
    gap: 0.08,
    roundness: 0.16,
    bevel: 0.35,
    rotation: 0,
    swirl: 1.0,
    ripple: 0.6,
    intensity: 1.25,
    saturation: 0.14,
    glitter: 0.85,
    sheen: 0.8,
    grain: 0.08,
    speed: 0.5,
    filter: 'none',
    mouseInteraction: true,
    flipOnClick: true,
    lightMode: false,
    paused: false,
  },
  aurora: {
    colorStops: ['#4f46e5', '#34d399', '#38bdf8'],
    backgroundColor: '#04060d',
    amplitude: 1.0,
    blend: 0.52,
    speed: 0.85,
    height: 0.5,
    scale: 1.0,
    glow: 0.68,
    brightness: 1.08,
    layers: 2,
    direction: 'top',
    mouseInteraction: true,
    lightMode: false,
    paused: false,
  },
  'gradient-ascii': {
    colors: ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'],
    backgroundColor: '#070c1a',
    shape: 'horizon',
    cellSize: 18,
    density: 0.82,
    glyphOpacity: 0.86,
    glow: 0.25,
    flicker: 0.2,
    softness: 0.52,
    scale: 1.0,
    flow: 0.55,
    speed: 0.9,
    gradientOpacity: 0.92,
    grain: 0.08,
    mouseInteraction: true,
    clickEffect: 'wave',
    lightMode: false,
  },
  'letter-glitch': {
    glitchColors: ['#ffffff', '#61dca3'],
    baseColor: '#7a8a84',
    backgroundColor: '#050807',
    fontSize: 14,
    spacing: 0.6,
    density: 0.9,
    baseOpacity: 0.18,
    glitchAmount: 0.52,
    speed: 0.95,
    smooth: true,
    interactive: true,
    cursorRadius: 150,
    clickEffect: 'tear',
    flow: 0.5,
    edgeFade: 0.08,
    centerFade: 0,
    lightMode: false,
  },
  grainient: {
    colors: ['#120f17', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa'],
    type: 'linear',
    angle: 55,
    bands: 1.0,
    speed: 0.85,
    flow: 0.8,
    scale: 1.0,
    softness: 1.0,
    silk: 0.35,
    grainAmount: 0.08,
    grainSize: 1.2,
    grainAnimated: true,
    contrast: 1.0,
    saturation: 1.0,
    interactive: true,
    stir: 1.0,
    clickSwirl: true,
    lightMode: false,
  },
};

export const DESIGN_PRESETS: Record<WallpaperDesignId, DesignPresetItem[]> = {
  beams: WALLPAPER_PRESETS.map((p) => ({
    id: p.id,
    designId: 'beams',
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    swatch: p.swatch,
    lightMode: p.config.lightMode,
    config: p.config,
  })),
  'pixel-snow': [
    {
      id: 'snow-midnight',
      designId: 'pixel-snow',
      slug: 'snow-midnight',
      name: '深夜の粉雪',
      subtitle: '結晶 · 静寂',
      swatch: ['#070B14', '#E8F4FF'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['pixel-snow'] },
    },
    {
      id: 'snow-gold-dust',
      designId: 'pixel-snow',
      slug: 'snow-gold-dust',
      name: '金砂の星屑',
      subtitle: 'ドット · 暖色',
      swatch: ['#0B0805', '#F6C77A'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['pixel-snow'],
        color: '#f6c77a',
        backgroundColor: '#0b0805',
        variant: 'square',
        density: 0.48,
        speed: 0.65,
        wind: -0.35,
        pixelSize: 4,
        twinkle: 0.65,
        accumulate: false,
      },
    },
    {
      id: 'snow-sakura',
      designId: 'pixel-snow',
      slug: 'snow-sakura',
      name: '薄桜の吹雪',
      subtitle: '丸粒 · 淡紅',
      swatch: ['#120911', '#F9C6D9'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['pixel-snow'],
        color: '#f9c6d9',
        backgroundColor: '#120911',
        variant: 'round',
        density: 0.62,
        speed: 1.05,
        wind: 0.75,
        sway: 0.9,
        pixelSize: 3,
        accumulate: false,
      },
    },
    {
      id: 'snow-frost-paper',
      designId: 'pixel-snow',
      slug: 'snow-frost-paper',
      name: '白銀の和紙',
      subtitle: 'ライト · 結晶',
      swatch: ['#EEF2F7', '#4B6B94'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['pixel-snow'],
        color: '#4b6b94',
        backgroundColor: '#eef2f7',
        variant: 'snowflake',
        density: 0.5,
        speed: 0.8,
        glow: 0.45,
        lightMode: true,
      },
    },
  ],
  'holo-mosaic': [
    {
      id: 'holo-obsidian',
      designId: 'holo-mosaic',
      slug: 'holo-obsidian',
      name: '黒曜ホログラム',
      subtitle: 'フル · 光沢',
      swatch: ['#100E16', '#D8B4FE'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'] },
    },
    {
      id: 'holo-amber-alloy',
      designId: 'holo-mosaic',
      slug: 'holo-amber-alloy',
      name: '琥珀メタル',
      subtitle: '暖色 · 重厚',
      swatch: ['#140D08', '#F59E0B'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'],
        color: '#140d08',
        metalColor: '#f6d8b5',
        spectrum: 'warm',
        tileSize: 1.2,
        rotation: 24,
        saturation: 0.24,
        sheen: 0.95,
      },
    },
    {
      id: 'holo-arctic-grid',
      designId: 'holo-mosaic',
      slug: 'holo-arctic-grid',
      name: '氷晶モザイク',
      subtitle: '寒色 · 精密',
      swatch: ['#070F1A', '#67E8F9'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'],
        color: '#070f1a',
        metalColor: '#d6f2ff',
        spectrum: 'cool',
        tileSize: 0.78,
        gap: 0.05,
        roundness: 0.08,
        saturation: 0.22,
        glitter: 0.95,
      },
    },
    {
      id: 'holo-pearl-shell',
      designId: 'holo-mosaic',
      slug: 'holo-pearl-shell',
      name: '真珠貝シェル',
      subtitle: 'ライト · パール',
      swatch: ['#F2F0EC', '#A8B8D8'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'],
        color: '#f2f0ec',
        metalColor: '#ffffff',
        spectrum: 'pearl',
        tileSize: 1.1,
        roundness: 0.22,
        saturation: 0.16,
        lightMode: true,
      },
    },
  ],
  aurora: [
    {
      id: 'aurora-nordic',
      designId: 'aurora',
      slug: 'aurora-nordic',
      name: '北欧の極光',
      subtitle: '青緑 · 2層',
      swatch: ['#04060D', '#34D399'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS.aurora },
    },
    {
      id: 'aurora-violet-night',
      designId: 'aurora',
      slug: 'aurora-violet-night',
      name: '紫苑の夜空',
      subtitle: '紫藍 · 3層',
      swatch: ['#070412', '#A78BFA'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.aurora,
        colorStops: ['#5227ff', '#c084fc', '#38bdf8'],
        backgroundColor: '#070412',
        layers: 3,
        amplitude: 1.15,
        height: 0.56,
        glow: 0.78,
      },
    },
    {
      id: 'aurora-solar-horizon',
      designId: 'aurora',
      slug: 'aurora-solar-horizon',
      name: '黎明の残光',
      subtitle: '下部 · 暖色',
      swatch: ['#0D0608', '#FB7185'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.aurora,
        colorStops: ['#f97316', '#fb7185', '#facc15'],
        backgroundColor: '#0d0608',
        direction: 'bottom',
        layers: 2,
        height: 0.48,
        speed: 0.7,
      },
    },
    {
      id: 'aurora-morning-veil',
      designId: 'aurora',
      slug: 'aurora-morning-veil',
      name: '朝靄のヴェール',
      subtitle: 'ライト · 清澄',
      swatch: ['#F2F5FA', '#3B82F6'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.aurora,
        colorStops: ['#2563eb', '#14b8a6', '#6366f1'],
        backgroundColor: '#f2f5fa',
        layers: 2,
        brightness: 0.95,
        glow: 0.5,
        lightMode: true,
      },
    },
  ],
  'gradient-ascii': [
    {
      id: 'ascii-horizon',
      designId: 'gradient-ascii',
      slug: 'ascii-horizon',
      name: '蒼穹ホライズン',
      subtitle: '水平線 · 青藍',
      swatch: ['#070C1A', '#38BDF8'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'] },
    },
    {
      id: 'ascii-eclipse',
      designId: 'gradient-ascii',
      slug: 'ascii-eclipse',
      name: '日蝕エクリプス',
      subtitle: '環状 · 琥珀',
      swatch: ['#0C0705', '#FB923C'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'],
        colors: ['#9a3412', '#fb923c', '#fde68a', '#f43f5e'],
        backgroundColor: '#0c0705',
        shape: 'eclipse',
        cellSize: 16,
        density: 0.86,
        glow: 0.32,
      },
    },
    {
      id: 'ascii-emerald-rise',
      designId: 'gradient-ascii',
      slug: 'ascii-emerald-rise',
      name: '翡翠の胎動',
      subtitle: '上昇 · 緑青',
      swatch: ['#040C09', '#34D399'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'],
        colors: ['#065f46', '#34d399', '#a7f3d0', '#0ea5e9'],
        backgroundColor: '#040c09',
        shape: 'rise',
        cellSize: 20,
        flow: 0.72,
      },
    },
    {
      id: 'ascii-editorial-paper',
      designId: 'gradient-ascii',
      slug: 'ascii-editorial-paper',
      name: '活版プリント',
      subtitle: 'ライト · 印字',
      swatch: ['#F4F2ED', '#2563EB'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'],
        colors: ['#1e3a8a', '#3b82f6', '#93c5fd', '#0f172a'],
        backgroundColor: '#f4f2ed',
        shape: 'pinch',
        cellSize: 18,
        lightMode: true,
      },
    },
  ],
  'letter-glitch': [
    {
      id: 'glitch-terminal',
      designId: 'letter-glitch',
      slug: 'glitch-terminal',
      name: '翠緑マトリクス',
      subtitle: '標準 · 翠緑',
      swatch: ['#050807', '#61DCA3'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['letter-glitch'] },
    },
    {
      id: 'glitch-amber-crt',
      designId: 'letter-glitch',
      slug: 'glitch-amber-crt',
      name: '琥珀ターミナル',
      subtitle: '暖色 · 精密',
      swatch: ['#0A0704', '#F59E0B'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['letter-glitch'],
        glitchColors: ['#fef3c7', '#f59e0b'],
        baseColor: '#8c6b3f',
        backgroundColor: '#0a0704',
        fontSize: 15,
        glitchAmount: 0.56,
        clickEffect: 'burst',
      },
    },
    {
      id: 'glitch-ice-code',
      designId: 'letter-glitch',
      slug: 'glitch-ice-code',
      name: '氷青シグナル',
      subtitle: '寒色 · 繊細',
      swatch: ['#040812', '#60A5FA'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['letter-glitch'],
        glitchColors: ['#e0f2fe', '#38bdf8'],
        baseColor: '#5b7aa6',
        backgroundColor: '#040812',
        fontSize: 13,
        density: 0.92,
        edgeFade: 0.14,
      },
    },
    {
      id: 'glitch-ink-sheet',
      designId: 'letter-glitch',
      slug: 'glitch-ink-sheet',
      name: '墨字タイポ',
      subtitle: 'ライト · 墨色',
      swatch: ['#F3F2EE', '#0F9F6E'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['letter-glitch'],
        glitchColors: ['#18181b', '#0f9f6e'],
        baseColor: '#71717a',
        backgroundColor: '#f3f2ee',
        baseOpacity: 0.2,
        lightMode: true,
      },
    },
  ],
  grainient: [
    {
      id: 'grainient-ember',
      designId: 'grainient',
      slug: 'grainient-ember',
      name: '熾火シルク',
      subtitle: 'リニア · 暖色',
      swatch: ['#120F17', '#F97316'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS.grainient },
    },
    {
      id: 'grainient-midnight-ocean',
      designId: 'grainient',
      slug: 'grainient-midnight-ocean',
      name: '深海ベルベット',
      subtitle: 'ラジアル · 藍青',
      swatch: ['#040712', '#38BDF8'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.grainient,
        colors: ['#040712', '#0b1e3d', '#1d4ed8', '#38bdf8', '#bae6fd'],
        type: 'radial',
        angle: 35,
        silk: 0.45,
        grainAmount: 0.07,
      },
    },
    {
      id: 'grainient-moss-stone',
      designId: 'grainient',
      slug: 'grainient-moss-stone',
      name: '苔石の陰影',
      subtitle: 'リニア · 深緑',
      swatch: ['#060B08', '#34D399'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.grainient,
        colors: ['#060b08', '#0d261c', '#0f766e', '#34d399', '#d1fae5'],
        type: 'linear',
        angle: 120,
        bands: 1.35,
        silk: 0.42,
      },
    },
    {
      id: 'grainient-silk-dawn',
      designId: 'grainient',
      slug: 'grainient-silk-dawn',
      name: '薄絹の朝光',
      subtitle: 'ライト · 淡彩',
      swatch: ['#F6F3EE', '#E0A899'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.grainient,
        colors: ['#f6f3ee', '#e7dfd5', '#d9c5b2', '#c5a38d', '#9c7a69'],
        type: 'linear',
        angle: 42,
        grainAmount: 0.06,
        contrast: 0.95,
        lightMode: true,
      },
    },
  ],
};

export function isValidDesignId(value: unknown): value is WallpaperDesignId {
  return typeof value === 'string' && DESIGN_LIST.some((d) => d.id === value);
}

export function getBackgroundColorForDesign(
  designId: WallpaperDesignId,
  configs: AllDesignConfigs
): string {
  switch (designId) {
    case 'beams':
      return configs.beams.backgroundColor;
    case 'pixel-snow':
      return configs['pixel-snow'].backgroundColor;
    case 'holo-mosaic':
      return configs['holo-mosaic'].color;
    case 'aurora':
      return configs.aurora.backgroundColor;
    case 'gradient-ascii':
      return configs['gradient-ascii'].backgroundColor;
    case 'letter-glitch':
      return configs['letter-glitch'].backgroundColor;
    case 'grainient':
      return configs.grainient.colors[0];
  }
}

export function isLightModeForDesign(
  designId: WallpaperDesignId,
  configs: AllDesignConfigs
): boolean {
  return configs[designId].lightMode;
}

export function isPausedForDesign(
  designId: WallpaperDesignId,
  configs: AllDesignConfigs
): boolean {
  if (designId === 'beams') return configs.beams.paused;
  if (designId === 'pixel-snow') return configs['pixel-snow'].paused;
  if (designId === 'holo-mosaic') return configs['holo-mosaic'].paused;
  if (designId === 'aurora') return configs.aurora.paused;
  return configs[designId].speed === 0;
}

export function createRandomDesignConfig<K extends WallpaperDesignId>(
  designId: K,
  rng: () => number = Math.random
): AllDesignConfigs[K] {
  if (designId === 'beams') {
    return createRandomBeamsConfig(rng) as AllDesignConfigs[K];
  }
  const presets = DESIGN_PRESETS[designId];
  const base = presets[Math.floor(rng() * presets.length)].config;

  switch (designId) {
    case 'pixel-snow': {
      const c = base as PixelSnowConfig;
      const variants: PixelSnowConfig['variant'][] = ['snowflake', 'round', 'square'];
      return {
        ...c,
        variant: variants[Math.floor(rng() * variants.length)],
        density: Number(clampNumber(0.35 + rng() * 0.5, 0.1, 1).toFixed(2)),
        speed: Number(clampNumber(0.5 + rng() * 1.1, 0.1, 2.5).toFixed(2)),
        wind: Number(clampNumber((rng() - 0.5) * 1.6, -2, 2).toFixed(2)),
        pixelSize: Math.round(clampNumber(2 + rng() * 4, 1, 8)),
      } as AllDesignConfigs[K];
    }
    case 'holo-mosaic': {
      const c = base as HoloMosaicConfig;
      const spectrums: HoloMosaicConfig['spectrum'][] = ['full', 'warm', 'cool', 'pearl'];
      return {
        ...c,
        spectrum: spectrums[Math.floor(rng() * spectrums.length)],
        tileSize: Number(clampNumber(0.65 + rng() * 0.9, 0.4, 2.2).toFixed(2)),
        rotation: Math.round((rng() - 0.5) * 90),
        swirl: Number(clampNumber(0.4 + rng() * 1.2, 0, 2).toFixed(2)),
        saturation: Number(clampNumber(0.08 + rng() * 0.3, 0, 1).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'aurora': {
      const c = base as AuroraConfig;
      return {
        ...c,
        amplitude: Number(clampNumber(0.6 + rng() * 1.1, 0.2, 2).toFixed(2)),
        blend: Number(clampNumber(0.35 + rng() * 0.45, 0.1, 1).toFixed(2)),
        speed: Number(clampNumber(0.45 + rng() * 1.0, 0.1, 2.5).toFixed(2)),
        layers: Math.floor(rng() * 3) + 1,
        direction: rng() > 0.35 ? 'top' : 'bottom',
      } as AllDesignConfigs[K];
    }
    case 'gradient-ascii': {
      const c = base as GradientAsciiConfig;
      const shapes: GradientAsciiConfig['shape'][] = ['horizon', 'pinch', 'rise', 'eclipse'];
      return {
        ...c,
        shape: shapes[Math.floor(rng() * shapes.length)],
        cellSize: Math.round(clampNumber(12 + rng() * 16, 8, 36)),
        density: Number(clampNumber(0.55 + rng() * 0.4, 0.2, 1).toFixed(2)),
        flow: Number(clampNumber(0.3 + rng() * 0.7, 0, 1.5).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'letter-glitch': {
      const c = base as LetterGlitchConfig;
      return {
        ...c,
        fontSize: Math.round(clampNumber(11 + rng() * 10, 10, 26)),
        glitchAmount: Number(clampNumber(0.25 + rng() * 0.55, 0.1, 1).toFixed(2)),
        speed: Number(clampNumber(0.5 + rng() * 1.1, 0.1, 2.5).toFixed(2)),
        clickEffect: rng() > 0.5 ? 'tear' : 'burst',
      } as AllDesignConfigs[K];
    }
    case 'grainient':
    default: {
      const c = base as GrainientConfig;
      return {
        ...c,
        type: rng() > 0.4 ? 'linear' : 'radial',
        angle: Math.round(rng() * 360),
        bands: Number(clampNumber(0.7 + rng() * 1.1, 0.4, 2.5).toFixed(2)),
        silk: Number(clampNumber(0.2 + rng() * 0.55, 0, 1).toFixed(2)),
        grainAmount: Number(clampNumber(0.04 + rng() * 0.12, 0, 0.3).toFixed(2)),
      } as AllDesignConfigs[K];
    }
  }
}

export interface StudioSharePayload {
  designId: WallpaperDesignId;
  presetId: string;
  config: AllDesignConfigs[WallpaperDesignId];
  clock: ClockConfig;
  lively: boolean;
  autoHideSeconds: number;
}

function encodeBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(encoded: string): string | null {
  try {
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const binary = atob(padded + '='.repeat(padLen));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function serializeStudioUrlQuery(payload: StudioSharePayload): string {
  const params = new URLSearchParams();
  params.set('design', payload.designId);
  if (payload.presetId && payload.presetId !== 'custom') {
    params.set('preset', payload.presetId);
  }
  params.set('cfg', encodeBase64Url(JSON.stringify(payload.config)));
  if (payload.clock.position !== 'off') {
    params.set('clk', payload.clock.position);
    params.set('h24', payload.clock.use24Hour ? '1' : '0');
    params.set('sec', payload.clock.showSeconds ? '1' : '0');
    params.set('dt', payload.clock.showDate ? '1' : '0');
  }
  if (payload.autoHideSeconds > 0) {
    params.set('hide', String(payload.autoHideSeconds));
  }
  if (payload.lively) {
    params.set('lively', '1');
  }
  return `?${params.toString()}`;
}

export interface ParsedStudioQuery {
  hasParams: boolean;
  designId: WallpaperDesignId;
  presetId: string;
  configs: AllDesignConfigs;
  clock: ClockConfig;
  uiHidden: boolean;
  autoHideSeconds: number;
}

export function parseStudioUrlQuery(search: string): ParsedStudioQuery {
  const params = new URLSearchParams(search);
  const configs: AllDesignConfigs = {
    beams: { ...DEFAULT_DESIGN_CONFIGS.beams },
    'pixel-snow': { ...DEFAULT_DESIGN_CONFIGS['pixel-snow'] },
    'holo-mosaic': { ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'] },
    aurora: { ...DEFAULT_DESIGN_CONFIGS.aurora },
    'gradient-ascii': { ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'] },
    'letter-glitch': { ...DEFAULT_DESIGN_CONFIGS['letter-glitch'] },
    grainient: { ...DEFAULT_DESIGN_CONFIGS.grainient },
  };

  const designParam = params.get('design');
  const designId: WallpaperDesignId = isValidDesignId(designParam) ? designParam : 'beams';

  const presetParam = params.get('preset');
  const matchingPreset = presetParam
    ? DESIGN_PRESETS[designId].find((p) => p.id === presetParam)
    : undefined;

  let presetId = matchingPreset ? matchingPreset.id : DESIGN_PRESETS[designId][0].id;
  if (matchingPreset) {
    (configs as Record<WallpaperDesignId, unknown>)[designId] = { ...matchingPreset.config };
  }

  const cfgParam = params.get('cfg');
  if (cfgParam) {
    const decoded = decodeBase64Url(cfgParam);
    if (decoded) {
      try {
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed === 'object') {
          if (designId === 'beams') {
            configs.beams = sanitizeBeamsConfig(parsed);
          } else {
            (configs as Record<WallpaperDesignId, unknown>)[designId] = {
              ...DEFAULT_DESIGN_CONFIGS[designId],
              ...parsed,
            };
          }
          if (!matchingPreset) presetId = 'custom';
        }
      } catch {
        // Ignore malformed cfg
      }
    }
  } else if (designId === 'beams' && (params.has('c') || params.has('bg') || params.has('bw'))) {
    // Backward compatibility with legacy Beams query params
    const hex = (k: string) => {
      const r = params.get(k);
      if (!r) return undefined;
      const n = r.startsWith('#') ? r : `#${r}`;
      return isValidHexColor(n) ? n : undefined;
    };
    const num = (k: string) => {
      const r = params.get(k);
      if (!r) return undefined;
      const n = Number(r);
      return Number.isFinite(n) ? n : undefined;
    };
    configs.beams = sanitizeBeamsConfig({
      color: hex('c'),
      backgroundColor: hex('bg'),
      beamWidth: num('bw'),
      rotation: num('rot'),
      lightMode: params.has('lm') ? params.get('lm') === '1' : undefined,
    });
    presetId = 'custom';
  }

  const clkParam = params.get('clk');
  const validPositions: ClockConfig['position'][] = ['off', 'center', 'top-left', 'bottom-left'];
  const clock: ClockConfig = {
    position: validPositions.includes(clkParam as ClockConfig['position'])
      ? (clkParam as ClockConfig['position'])
      : DEFAULT_CLOCK_CONFIG.position,
    use24Hour: params.has('h24') ? params.get('h24') !== '0' : DEFAULT_CLOCK_CONFIG.use24Hour,
    showSeconds: params.has('sec') ? params.get('sec') === '1' : DEFAULT_CLOCK_CONFIG.showSeconds,
    showDate: params.has('dt') ? params.get('dt') !== '0' : DEFAULT_CLOCK_CONFIG.showDate,
    osFrame: 'none',
  };

  const uiHidden =
    params.get('lively') === '1' || params.get('zen') === '1' || params.get('clean') === '1';

  const hideRaw = Number(params.get('hide') || '0');
  const autoHideSeconds = [0, 3, 5, 10].includes(hideRaw) ? hideRaw : 0;

  const hasParams =
    params.has('design') ||
    params.has('cfg') ||
    params.has('preset') ||
    params.has('lively') ||
    params.has('zen') ||
    params.has('clean') ||
    params.has('c');

  return {
    hasParams,
    designId,
    presetId,
    configs,
    clock,
    uiHidden,
    autoHideSeconds,
  };
}
