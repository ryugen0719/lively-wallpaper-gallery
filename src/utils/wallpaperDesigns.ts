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
  | 'grainient'
  | 'crystalized-ball'
  | 'scanner'
  | 'topography'
  | 'cursor-grid'
  | 'side-rays'
  | 'soft-aurora';

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

export interface CrystalizedBallConfig {
  preset: 'plasma' | 'aurora' | 'nebula' | 'ember' | 'frost' | 'solar' | 'eclipse' | 'abyss';
  color: string;
  backgroundColor: string;
  size: number;
  speed: number;
  glow: number;
  crackle: number;
  flares: number;
  interactive: boolean;
  lightMode: boolean;
  paused: boolean;
}

export interface ScannerConfig {
  color1: string;
  color2: string;
  color3: string;
  backgroundColor: string;
  scanDirection: 'vertical' | 'horizontal' | 'diagonal';
  speed: number;
  sweepSpeed: number;
  sweepWidth: number;
  trail: number;
  scale: number;
  bandDensity: number;
  glow: number;
  brightness: number;
  scanline: boolean;
  mouseInteraction: boolean;
  lightMode: boolean;
}

export interface TopographyConfig {
  color: string;
  backgroundColor: string;
  lineCount: number;
  lineWidth: number;
  elevation: number;
  scale: number;
  tilt: number;
  speed: number;
  direction: 'forward' | 'backward' | 'left' | 'right';
  morph: number;
  glow: number;
  fog: number;
  hoverEffect: 'lift' | 'trace' | 'light';
  markers: 'none' | 'plus' | 'dots';
  mouseInteraction: boolean;
  lightMode: boolean;
}

export interface CursorGridConfig {
  color: string;
  gridColor: string;
  backgroundColor: string;
  cellSize: number;
  radius: number;
  gridStyle: 'lines' | 'dashed' | 'dots' | 'crosses';
  highlight: 'area' | 'cell';
  ambient: number;
  spotlight: number;
  gridOpacity: number;
  fillOpacity: number;
  clickPulse: boolean;
  lightMode: boolean;
}

export interface SideRaysConfig {
  rayColor1: string;
  rayColor2: string;
  backgroundColor: string;
  origin: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left';
  blend: number;
  speed: number;
  intensity: number;
  spread: number;
  density: number;
  sharpness: number;
  glow: number;
  dust: number;
  followMouse: boolean;
  lightMode: boolean;
}

export interface SoftAuroraConfig {
  color1: string;
  color2: string;
  backgroundColor: string;
  speed: number;
  scale: number;
  brightness: number;
  noiseFrequency: number;
  noiseAmplitude: number;
  bandHeight: number;
  bandSpread: number;
  spectrum: number;
  tilt: number;
  enableMouseInteraction: boolean;
  clickPulse: boolean;
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
  'crystalized-ball': CrystalizedBallConfig;
  scanner: ScannerConfig;
  topography: TopographyConfig;
  'cursor-grid': CursorGridConfig;
  'side-rays': SideRaysConfig;
  'soft-aurora': SoftAuroraConfig;
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
  {
    id: 'crystalized-ball',
    label: 'CrystalizedBall',
    jaLabel: 'クリスタル球',
    description: 'プラズマと粒子が結晶球の中で煌めく表現',
    accentSwatch: ['#090612', '#F25BD0'],
  },
  {
    id: 'scanner',
    label: 'Scanner',
    jaLabel: 'スキャナー',
    description: '光の走査線が波形を描きながら横切る背景',
    accentSwatch: ['#080614', '#A78BFA'],
  },
  {
    id: 'topography',
    label: 'Topography',
    jaLabel: '等高線',
    description: '立体的な等高線地形が滑らかに流れる背景',
    accentSwatch: ['#050814', '#4F7CFF'],
  },
  {
    id: 'cursor-grid',
    label: 'CursorGrid',
    jaLabel: 'グリッド光',
    description: 'カーソルと環境光に反応する幾何学グリッド',
    accentSwatch: ['#06080D', '#38BDF8'],
  },
  {
    id: 'side-rays',
    label: 'SideRays',
    jaLabel: 'サイド光線',
    description: '画面端から柔らかな光束が差し込む演出',
    accentSwatch: ['#090807', '#FFC46B'],
  },
  {
    id: 'soft-aurora',
    label: 'SoftAurora',
    jaLabel: 'ソフト極光',
    description: '淡いオーロラ帯が滑らかに揺らぐ表現',
    accentSwatch: ['#0A0614', '#E100FF'],
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
  'crystalized-ball': {
    preset: 'plasma',
    color: '#f25bd0',
    backgroundColor: '#07050f',
    size: 0.72,
    speed: 1.0,
    glow: 0.9,
    crackle: 0.85,
    flares: 0.65,
    interactive: true,
    lightMode: false,
    paused: false,
  },
  scanner: {
    color1: '#5227ff',
    color2: '#ff9ffc',
    color3: '#ffffff',
    backgroundColor: '#060510',
    scanDirection: 'vertical',
    speed: 0.55,
    sweepSpeed: 0.28,
    sweepWidth: 1.6,
    trail: 0.52,
    scale: 1.5,
    bandDensity: 11,
    glow: 0.65,
    brightness: 1.05,
    scanline: true,
    mouseInteraction: true,
    lightMode: false,
  },
  topography: {
    color: '#4f7cff',
    backgroundColor: '#050814',
    lineCount: 22,
    lineWidth: 1.2,
    elevation: 1.05,
    scale: 1.0,
    tilt: 32,
    speed: 0.25,
    direction: 'forward',
    morph: 0.22,
    glow: 0.6,
    fog: 0.35,
    hoverEffect: 'lift',
    markers: 'none',
    mouseInteraction: true,
    lightMode: false,
  },
  'cursor-grid': {
    color: '#38bdf8',
    gridColor: '#94a3b8',
    backgroundColor: '#05080f',
    cellSize: 56,
    radius: 170,
    gridStyle: 'lines',
    highlight: 'area',
    ambient: 0.55,
    spotlight: 0.65,
    gridOpacity: 0.14,
    fillOpacity: 0.09,
    clickPulse: true,
    lightMode: false,
  },
  'side-rays': {
    rayColor1: '#ffc46b',
    rayColor2: '#96c8ff',
    backgroundColor: '#08080c',
    origin: 'top-right',
    blend: 0.6,
    speed: 2.2,
    intensity: 1.9,
    spread: 2.0,
    density: 5,
    sharpness: 0.5,
    glow: 1.0,
    dust: 0.45,
    followMouse: true,
    lightMode: false,
  },
  'soft-aurora': {
    color1: '#f7f7f7',
    color2: '#e100ff',
    backgroundColor: '#080510',
    speed: 0.6,
    scale: 1.5,
    brightness: 1.0,
    noiseFrequency: 2.5,
    noiseAmplitude: 1.0,
    bandHeight: 0.52,
    bandSpread: 1.0,
    spectrum: 1.0,
    tilt: 0,
    enableMouseInteraction: true,
    clickPulse: true,
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
  'crystalized-ball': [
    {
      id: 'ball-plasma',
      designId: 'crystalized-ball',
      slug: 'ball-plasma',
      name: 'プラズマ結晶',
      subtitle: '紫紅 · 発光',
      swatch: ['#07050F', '#F25BD0'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'] },
    },
    {
      id: 'ball-aurora',
      designId: 'crystalized-ball',
      slug: 'ball-aurora',
      name: '翠玉オーブ',
      subtitle: '青緑 · 静謐',
      swatch: ['#040C0B', '#5CFFC8'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'],
        preset: 'aurora',
        color: '#5cffc8',
        backgroundColor: '#040c0b',
        size: 0.74,
        speed: 0.85,
      },
    },
    {
      id: 'ball-solar',
      designId: 'crystalized-ball',
      slug: 'ball-solar',
      name: '太陽フレア球',
      subtitle: '黄金 · 躍動',
      swatch: ['#0D0704', '#FFB347'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'],
        preset: 'solar',
        color: '#ffb347',
        backgroundColor: '#0d0704',
        size: 0.76,
        flares: 0.85,
        speed: 1.15,
      },
    },
    {
      id: 'ball-frost-light',
      designId: 'crystalized-ball',
      slug: 'ball-frost-light',
      name: '氷晶プリズム',
      subtitle: 'ライト · 透明感',
      swatch: ['#F3F5FA', '#3B82F6'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'],
        preset: 'frost',
        color: '#3b82f6',
        backgroundColor: '#f3f5fa',
        size: 0.7,
        glow: 0.7,
        lightMode: true,
      },
    },
  ],
  scanner: [
    {
      id: 'scanner-violet',
      designId: 'scanner',
      slug: 'scanner-violet',
      name: '紫電スキャン',
      subtitle: '垂直 · 紫白',
      swatch: ['#060510', '#A78BFA'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS.scanner },
    },
    {
      id: 'scanner-cyber-cyan',
      designId: 'scanner',
      slug: 'scanner-cyber-cyan',
      name: '蒼穹パルス',
      subtitle: '水平 · 青緑',
      swatch: ['#040A12', '#38BDF8'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.scanner,
        color1: '#0284c7',
        color2: '#34d399',
        color3: '#e0f2fe',
        backgroundColor: '#040a12',
        scanDirection: 'horizontal',
        bandDensity: 14,
        speed: 0.65,
      },
    },
    {
      id: 'scanner-crimson-diag',
      designId: 'scanner',
      slug: 'scanner-crimson-diag',
      name: '紅蓮レーザー',
      subtitle: '斜走 · 深紅',
      swatch: ['#0D0407', '#FB7185'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.scanner,
        color1: '#be123c',
        color2: '#fb923c',
        color3: '#fff1f2',
        backgroundColor: '#0d0407',
        scanDirection: 'diagonal',
        sweepWidth: 1.9,
        glow: 0.78,
      },
    },
    {
      id: 'scanner-paper-light',
      designId: 'scanner',
      slug: 'scanner-paper-light',
      name: '白紙オシロ',
      subtitle: 'ライト · 青線',
      swatch: ['#F4F5F8', '#4F46E5'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.scanner,
        color1: '#4f46e5',
        color2: '#0ea5e9',
        color3: '#1e293b',
        backgroundColor: '#f4f5f8',
        scanline: false,
        brightness: 0.95,
        lightMode: true,
      },
    },
  ],
  topography: [
    {
      id: 'topo-cobalt',
      designId: 'topography',
      slug: 'topo-cobalt',
      name: '群青の山脈',
      subtitle: '前進 · 青藍',
      swatch: ['#050814', '#4F7CFF'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS.topography },
    },
    {
      id: 'topo-emerald-ridge',
      designId: 'topography',
      slug: 'topo-emerald-ridge',
      name: '翠嶺マップ',
      subtitle: 'マーカー · 翡翠',
      swatch: ['#040B09', '#34D399'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.topography,
        color: '#34d399',
        backgroundColor: '#040b09',
        lineCount: 28,
        elevation: 1.25,
        markers: 'plus',
        tilt: 38,
      },
    },
    {
      id: 'topo-amber-dune',
      designId: 'topography',
      slug: 'topo-amber-dune',
      name: '砂丘の等高線',
      subtitle: '横流 · 琥珀',
      swatch: ['#0C0805', '#F59E0B'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.topography,
        color: '#f59e0b',
        backgroundColor: '#0c0805',
        direction: 'right',
        lineCount: 20,
        elevation: 0.95,
        tilt: 26,
      },
    },
    {
      id: 'topo-cartography-light',
      designId: 'topography',
      slug: 'topo-cartography-light',
      name: '白地図アート',
      subtitle: 'ライト · 墨藍',
      swatch: ['#F4F2EC', '#2563EB'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS.topography,
        color: '#2563eb',
        backgroundColor: '#f4f2ec',
        lineCount: 24,
        glow: 0.35,
        fog: 0.25,
        lightMode: true,
      },
    },
  ],
  'cursor-grid': [
    {
      id: 'grid-cyber-blue',
      designId: 'cursor-grid',
      slug: 'grid-cyber-blue',
      name: '蒼光グリッド',
      subtitle: '実線 · 環境光',
      swatch: ['#05080F', '#38BDF8'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['cursor-grid'] },
    },
    {
      id: 'grid-emerald-dots',
      designId: 'cursor-grid',
      slug: 'grid-emerald-dots',
      name: '翡翠ドット網',
      subtitle: 'ドット · セル強調',
      swatch: ['#040B08', '#34D399'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['cursor-grid'],
        color: '#34d399',
        gridColor: '#6ee7b7',
        backgroundColor: '#040b08',
        gridStyle: 'dots',
        highlight: 'cell',
        cellSize: 48,
        ambient: 0.65,
      },
    },
    {
      id: 'grid-amber-cross',
      designId: 'cursor-grid',
      slug: 'grid-amber-cross',
      name: '琥珀クロス網',
      subtitle: 'クロス · 暖色',
      swatch: ['#0B0805', '#F59E0B'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['cursor-grid'],
        color: '#f59e0b',
        gridColor: '#d97706',
        backgroundColor: '#0b0805',
        gridStyle: 'crosses',
        cellSize: 64,
        ambient: 0.55,
      },
    },
    {
      id: 'grid-drafting-light',
      designId: 'cursor-grid',
      slug: 'grid-drafting-light',
      name: '製図方眼紙',
      subtitle: 'ライト · 破線',
      swatch: ['#F5F4F0', '#2563EB'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['cursor-grid'],
        color: '#2563eb',
        gridColor: '#64748b',
        backgroundColor: '#f5f4f0',
        gridStyle: 'dashed',
        gridOpacity: 0.16,
        ambient: 0.5,
        lightMode: true,
      },
    },
  ],
  'side-rays': [
    {
      id: 'rays-amber-sky',
      designId: 'side-rays',
      slug: 'rays-amber-sky',
      name: '黄昏の斜光',
      subtitle: '右上 · 金蒼',
      swatch: ['#08080C', '#FFC46B'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['side-rays'] },
    },
    {
      id: 'rays-arctic-left',
      designId: 'side-rays',
      slug: 'rays-arctic-left',
      name: '極夜の光芒',
      subtitle: '左上 · 氷青',
      swatch: ['#040812', '#60A5FA'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['side-rays'],
        rayColor1: '#38bdf8',
        rayColor2: '#a78bfa',
        backgroundColor: '#040812',
        origin: 'top-left',
        density: 6,
        dust: 0.6,
      },
    },
    {
      id: 'rays-emerald-side',
      designId: 'side-rays',
      slug: 'rays-emerald-side',
      name: '木漏れ日の緑光',
      subtitle: '右側 · 翠金',
      swatch: ['#050B09', '#34D399'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['side-rays'],
        rayColor1: '#34d399',
        rayColor2: '#fde68a',
        backgroundColor: '#050b09',
        origin: 'right',
        spread: 2.3,
        dust: 0.7,
      },
    },
    {
      id: 'rays-morning-light',
      designId: 'side-rays',
      slug: 'rays-morning-light',
      name: '朝窓の陽射し',
      subtitle: 'ライト · 柔光',
      swatch: ['#F6F4EE', '#D97706'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['side-rays'],
        rayColor1: '#f59e0b',
        rayColor2: '#38bdf8',
        backgroundColor: '#f6f4ee',
        origin: 'top-right',
        intensity: 1.5,
        lightMode: true,
      },
    },
  ],
  'soft-aurora': [
    {
      id: 'soft-aurora-magenta',
      designId: 'soft-aurora',
      slug: 'soft-aurora-magenta',
      name: '紅紫のソフト極光',
      subtitle: '標準 · 紅紫',
      swatch: ['#080510', '#E100FF'],
      lightMode: false,
      config: { ...DEFAULT_DESIGN_CONFIGS['soft-aurora'] },
    },
    {
      id: 'soft-aurora-lagoon',
      designId: 'soft-aurora',
      slug: 'soft-aurora-lagoon',
      name: '礁湖のゆらぎ',
      subtitle: '青緑 · 穏やか',
      swatch: ['#040A10', '#2DD4BF'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['soft-aurora'],
        color1: '#e0f2fe',
        color2: '#14b8a6',
        backgroundColor: '#040a10',
        speed: 0.45,
        scale: 1.35,
        bandHeight: 0.6,
        tilt: 12,
      },
    },
    {
      id: 'soft-aurora-amber',
      designId: 'soft-aurora',
      slug: 'soft-aurora-amber',
      name: '茜雲のヴェール',
      subtitle: '暖色 · 傾斜',
      swatch: ['#0D0605', '#FB923C'],
      lightMode: false,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['soft-aurora'],
        color1: '#fef3c7',
        color2: '#f97316',
        backgroundColor: '#0d0605',
        speed: 0.55,
        tilt: -14,
        bandSpread: 1.25,
      },
    },
    {
      id: 'soft-aurora-pastel-light',
      designId: 'soft-aurora',
      slug: 'soft-aurora-pastel-light',
      name: '薄雲パステル',
      subtitle: 'ライト · 透明',
      swatch: ['#F5F4FA', '#8B5CF6'],
      lightMode: true,
      config: {
        ...DEFAULT_DESIGN_CONFIGS['soft-aurora'],
        color1: '#38bdf8',
        color2: '#8b5cf6',
        backgroundColor: '#f5f4fa',
        brightness: 0.95,
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
    case 'crystalized-ball':
      return configs['crystalized-ball'].backgroundColor;
    case 'scanner':
      return configs.scanner.backgroundColor;
    case 'topography':
      return configs.topography.backgroundColor;
    case 'cursor-grid':
      return configs['cursor-grid'].backgroundColor;
    case 'side-rays':
      return configs['side-rays'].backgroundColor;
    case 'soft-aurora':
      return configs['soft-aurora'].backgroundColor;
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
  if (designId === 'crystalized-ball') return configs['crystalized-ball'].paused;
  if (designId === 'cursor-grid') return configs['cursor-grid'].ambient === 0;
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
    case 'crystalized-ball': {
      const c = base as CrystalizedBallConfig;
      const presetList: CrystalizedBallConfig['preset'][] = [
        'plasma',
        'aurora',
        'nebula',
        'ember',
        'frost',
        'solar',
        'eclipse',
        'abyss',
      ];
      return {
        ...c,
        preset: presetList[Math.floor(rng() * presetList.length)],
        size: Number(clampNumber(0.55 + rng() * 0.3, 0.35, 0.95).toFixed(2)),
        speed: Number(clampNumber(0.6 + rng() * 0.9, 0.1, 2.5).toFixed(2)),
        crackle: Number(clampNumber(0.35 + rng() * 0.65, 0, 1.5).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'scanner': {
      const c = base as ScannerConfig;
      const dirs: ScannerConfig['scanDirection'][] = ['vertical', 'horizontal', 'diagonal'];
      return {
        ...c,
        scanDirection: dirs[Math.floor(rng() * dirs.length)],
        bandDensity: Math.round(clampNumber(6 + rng() * 14, 4, 24)),
        speed: Number(clampNumber(0.3 + rng() * 0.8, 0.1, 2).toFixed(2)),
        glow: Number(clampNumber(0.35 + rng() * 0.55, 0, 1.5).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'topography': {
      const c = base as TopographyConfig;
      const dirs: TopographyConfig['direction'][] = ['forward', 'backward', 'left', 'right'];
      const markers: TopographyConfig['markers'][] = ['none', 'plus', 'dots'];
      return {
        ...c,
        direction: dirs[Math.floor(rng() * dirs.length)],
        markers: markers[Math.floor(rng() * markers.length)],
        lineCount: Math.round(clampNumber(14 + rng() * 20, 8, 40)),
        elevation: Number(clampNumber(0.65 + rng() * 0.85, 0.3, 2).toFixed(2)),
        tilt: Math.round(clampNumber(18 + rng() * 28, 10, 55)),
      } as AllDesignConfigs[K];
    }
    case 'cursor-grid': {
      const c = base as CursorGridConfig;
      const styles: CursorGridConfig['gridStyle'][] = ['lines', 'dashed', 'dots', 'crosses'];
      return {
        ...c,
        gridStyle: styles[Math.floor(rng() * styles.length)],
        highlight: rng() > 0.5 ? 'area' : 'cell',
        cellSize: Math.round(clampNumber(36 + rng() * 44, 24, 96)),
        ambient: Number(clampNumber(0.35 + rng() * 0.5, 0.1, 1).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'side-rays': {
      const c = base as SideRaysConfig;
      const origins: SideRaysConfig['origin'][] = [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
        'right',
        'left',
      ];
      return {
        ...c,
        origin: origins[Math.floor(rng() * origins.length)],
        density: Number(clampNumber(3 + rng() * 5, 2, 10).toFixed(1)),
        spread: Number(clampNumber(1.4 + rng() * 1.4, 0.8, 3.5).toFixed(2)),
        dust: Number(clampNumber(0.2 + rng() * 0.65, 0, 1).toFixed(2)),
      } as AllDesignConfigs[K];
    }
    case 'soft-aurora': {
      const c = base as SoftAuroraConfig;
      return {
        ...c,
        scale: Number(clampNumber(1.0 + rng() * 1.2, 0.6, 3).toFixed(2)),
        bandHeight: Number(clampNumber(0.35 + rng() * 0.4, 0.2, 1).toFixed(2)),
        tilt: Math.round((rng() - 0.5) * 36),
        speed: Number(clampNumber(0.35 + rng() * 0.75, 0.1, 2).toFixed(2)),
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

export type UiUnlockMode = 'triple-tap' | 'long-press' | 'corner-double' | 'locked';

export const DEFAULT_UI_UNLOCK_MODE: UiUnlockMode = 'triple-tap';

export interface UiUnlockModeMeta {
  id: UiUnlockMode;
  shortLabel: string;
  queryValue: string;
  hintText: string;
  description: string;
}

export const UI_UNLOCK_MODES: UiUnlockModeMeta[] = [
  {
    id: 'triple-tap',
    shortLabel: '3回タップ',
    queryValue: 'triple',
    hintText: '3回連続タップ または Ctrl+Shift+U',
    description:
      '同じ場所を素早く3回タップ/クリックしたときだけUIが開きます。通常のクリックやダブルクリックでは反応しません。',
  },
  {
    id: 'long-press',
    shortLabel: '長押し 1.2秒',
    queryValue: 'hold',
    hintText: '1.2秒長押し または Ctrl+Shift+U',
    description:
      'ポインタを動かさずに1.2秒間押し続けたときだけUIが開きます。クリックやドラッグ選択では反応しません。',
  },
  {
    id: 'corner-double',
    shortLabel: '右上隅2回',
    queryValue: 'corner',
    hintText: '右上隅をダブルタップ または Ctrl+Shift+U',
    description:
      '画面の右上隅（96px四方）をダブルタップしたときだけUIが開きます。中央やアイコン付近の操作では開きません。',
  },
  {
    id: 'locked',
    shortLabel: '完全ロック',
    queryValue: 'locked',
    hintText: 'Ctrl+Shift+U（または ?ui=1）',
    description:
      'クリック・タップ操作では一切UIを開きません。キーボードの Ctrl+Shift+U（Macは Cmd+Shift+U）のみで再表示できます。',
  },
];

export function isValidUiUnlockMode(value: unknown): value is UiUnlockMode {
  return (
    value === 'triple-tap' ||
    value === 'long-press' ||
    value === 'corner-double' ||
    value === 'locked'
  );
}

export function getUiUnlockModeMeta(mode: UiUnlockMode): UiUnlockModeMeta {
  return UI_UNLOCK_MODES.find((item) => item.id === mode) ?? UI_UNLOCK_MODES[0];
}

function parseUiUnlockParam(raw: string | null): UiUnlockMode {
  if (!raw) return DEFAULT_UI_UNLOCK_MODE;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'triple' || normalized === 'triple-tap') return 'triple-tap';
  if (normalized === 'hold' || normalized === 'long-press') return 'long-press';
  if (normalized === 'corner' || normalized === 'corner-double') return 'corner-double';
  if (normalized === 'locked' || normalized === 'lock' || normalized === 'key') return 'locked';
  return DEFAULT_UI_UNLOCK_MODE;
}

export interface StudioSharePayload {
  designId: WallpaperDesignId;
  presetId: string;
  config: AllDesignConfigs[WallpaperDesignId];
  clock: ClockConfig;
  lively: boolean;
  autoHideSeconds: number;
  uiUnlockMode?: UiUnlockMode;
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
  params.set('clk', payload.clock.position);
  if (payload.clock.position !== 'off') {
    params.set('csz', payload.clock.size);
    params.set('h24', payload.clock.use24Hour ? '1' : '0');
    params.set('sec', payload.clock.showSeconds ? '1' : '0');
    params.set('dt', payload.clock.showDate ? '1' : '0');
  }
  if (payload.autoHideSeconds > 0) {
    params.set('hide', String(payload.autoHideSeconds));
  }
  const unlockMeta = getUiUnlockModeMeta(payload.uiUnlockMode ?? DEFAULT_UI_UNLOCK_MODE);
  params.set('unlock', unlockMeta.queryValue);
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
  uiUnlockMode: UiUnlockMode;
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
    'crystalized-ball': { ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'] },
    scanner: { ...DEFAULT_DESIGN_CONFIGS.scanner },
    topography: { ...DEFAULT_DESIGN_CONFIGS.topography },
    'cursor-grid': { ...DEFAULT_DESIGN_CONFIGS['cursor-grid'] },
    'side-rays': { ...DEFAULT_DESIGN_CONFIGS['side-rays'] },
    'soft-aurora': { ...DEFAULT_DESIGN_CONFIGS['soft-aurora'] },
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
  const validPositions: ClockConfig['position'][] = [
    'off',
    'center',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];
  const sizeParam = params.get('csz');
  const validSizes: ClockConfig['size'][] = ['sm', 'md', 'lg'];
  const clock: ClockConfig = {
    position: validPositions.includes(clkParam as ClockConfig['position'])
      ? (clkParam as ClockConfig['position'])
      : DEFAULT_CLOCK_CONFIG.position,
    size: validSizes.includes(sizeParam as ClockConfig['size'])
      ? (sizeParam as ClockConfig['size'])
      : DEFAULT_CLOCK_CONFIG.size,
    use24Hour: params.has('h24') ? params.get('h24') !== '0' : DEFAULT_CLOCK_CONFIG.use24Hour,
    showSeconds: params.has('sec') ? params.get('sec') === '1' : DEFAULT_CLOCK_CONFIG.showSeconds,
    showDate: params.has('dt') ? params.get('dt') !== '0' : DEFAULT_CLOCK_CONFIG.showDate,
    osFrame: 'none',
  };

  // UI is hidden by default for Lively Wallpaper; only show on load if ?ui=1, ?edit=1, or ?lively=0
  const explicitShowUi =
    params.get('ui') === '1' || params.get('edit') === '1' || params.get('lively') === '0';
  const uiHidden = !explicitShowUi;

  const hideRaw = Number(params.get('hide') || '0');
  const autoHideSeconds = [0, 3, 5, 10].includes(hideRaw) ? hideRaw : 0;

  const uiUnlockMode = parseUiUnlockParam(params.get('unlock'));

  const hasParams =
    params.has('design') ||
    params.has('cfg') ||
    params.has('preset') ||
    params.has('lively') ||
    params.has('zen') ||
    params.has('clean') ||
    params.has('ui') ||
    params.has('edit') ||
    params.has('unlock') ||
    params.has('clk') ||
    params.has('c');

  return {
    hasParams,
    designId,
    presetId,
    configs,
    clock,
    uiHidden,
    autoHideSeconds,
    uiUnlockMode,
  };
}
