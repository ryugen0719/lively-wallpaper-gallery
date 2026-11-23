export interface BeamsConfig {
  color: string;
  backgroundColor: string;
  beamWidth: number;
  rotation: number;
  speed: number;
  waveLength: number;
  depth: number;
  sharpness: number;
  twist: number;
  fillLight: number;
  glow: number;
  brightness: number;
  variation: number;
  grain: number;
  fade: number;
  mouseInteraction: boolean;
  mouseStrength: number;
  lightMode: boolean;
  paused: boolean;
}

export type ClockPosition =
  | 'off'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
export type ClockSize = 'sm' | 'md' | 'lg';
export type ClockStyle =
  | 'minimal'
  | 'editorial'
  | 'stacked'
  | 'flip'
  | 'mono'
  | 'outline'
  | 'analog'
  | 'ring';
export type OsPreviewFrame = 'none' | 'windows' | 'macos';
export type ExportFormat = 'png' | 'jpeg';

export interface ClockStyleMeta {
  id: ClockStyle;
  label: string;
  description: string;
}

export const CLOCK_STYLES: ClockStyleMeta[] = [
  { id: 'minimal', label: 'ミニマル', description: '軽やかな幾何学サンセリフ' },
  { id: 'editorial', label: 'セリフ', description: '繊細な高級時計風セリフ' },
  { id: 'stacked', label: '縦積み', description: '時と分を重ねたポスター風' },
  { id: 'flip', label: 'フリップ', description: 'パタパタ式スプリットパネル' },
  { id: 'mono', label: 'テック', description: '等幅デジタル＋秒バー' },
  { id: 'outline', label: '線画', description: '背景の光が透ける中抜き数字' },
  { id: 'analog', label: 'アナログ', description: 'スイスミニマル針時計' },
  { id: 'ring', label: 'リング', description: '秒と分が周回する軌道アーク' },
];

export function isValidClockStyle(value: unknown): value is ClockStyle {
  return typeof value === 'string' && CLOCK_STYLES.some((item) => item.id === value);
}

export interface ClockConfig {
  position: ClockPosition;
  size: ClockSize;
  style: ClockStyle;
  use24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  osFrame: OsPreviewFrame;
}

export interface WallpaperPreset {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  swatch: [string, string];
  config: BeamsConfig;
  isCustom?: boolean;
}

export interface ResolutionOption {
  id: string;
  label: string;
  aspect: string;
  width: number;
  height: number;
}

export const DEFAULT_BEAMS_CONFIG: BeamsConfig = {
  color: '#ffffff',
  backgroundColor: '#050507',
  beamWidth: 140,
  rotation: 30,
  speed: 1.0,
  waveLength: 233,
  depth: 1.05,
  sharpness: 0.62,
  twist: 0.15,
  fillLight: 0.32,
  glow: 0.65,
  brightness: 1.65,
  variation: 0,
  grain: 0.32,
  fade: 0.04,
  mouseInteraction: true,
  mouseStrength: 1.0,
  lightMode: false,
  paused: false,
};

export const DEFAULT_CLOCK_CONFIG: ClockConfig = {
  position: 'center',
  size: 'md',
  style: 'minimal',
  use24Hour: true,
  showSeconds: false,
  showDate: true,
  osFrame: 'none',
};

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'obsidian-white',
    slug: 'obsidian-white',
    name: '黒曜の白光',
    subtitle: '白黒 · 標準',
    swatch: ['#050507', '#F5F6FA'],
    config: { ...DEFAULT_BEAMS_CONFIG },
  },
  {
    id: 'amber-dawn',
    slug: 'amber-dawn',
    name: '暁の琥珀',
    subtitle: '暖色 · 彫刻的',
    swatch: ['#090604', '#F4A642'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#f4a642',
      backgroundColor: '#090604',
      beamWidth: 165,
      rotation: 24,
      speed: 0.8,
      waveLength: 270,
      depth: 1.25,
      sharpness: 0.56,
      twist: 0.28,
      fillLight: 0.38,
      glow: 0.78,
      brightness: 1.75,
      variation: 14,
      grain: 0.35,
      fade: 0.08,
    },
  },
  {
    id: 'abyssal-cobalt',
    slug: 'abyssal-cobalt',
    name: '深海の蒼',
    subtitle: '寒色 · 静穏',
    swatch: ['#04070E', '#589DF6'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#589df6',
      backgroundColor: '#04070e',
      beamWidth: 120,
      rotation: -28,
      speed: 0.75,
      waveLength: 210,
      depth: 1.15,
      sharpness: 0.7,
      twist: 0.35,
      fillLight: 0.35,
      glow: 0.72,
      brightness: 1.7,
      variation: 31,
      grain: 0.28,
      fade: 0.06,
    },
  },
  {
    id: 'jade-mist',
    slug: 'jade-mist',
    name: '翡翠の静寂',
    subtitle: '青緑 · 繊細',
    swatch: ['#040A08', '#4EC99E'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#4ec99e',
      backgroundColor: '#040a08',
      beamWidth: 96,
      rotation: 18,
      speed: 0.65,
      waveLength: 295,
      depth: 0.9,
      sharpness: 0.66,
      twist: 0.18,
      fillLight: 0.42,
      glow: 0.64,
      brightness: 1.55,
      variation: 48,
      grain: 0.3,
      fade: 0.1,
    },
  },
  {
    id: 'crimson-dusk',
    slug: 'crimson-dusk',
    name: '紅玉の残光',
    subtitle: '深紅 · 重厚',
    swatch: ['#0B0406', '#E85D70'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#e85d70',
      backgroundColor: '#0b0406',
      beamWidth: 185,
      rotation: -42,
      speed: 0.9,
      waveLength: 245,
      depth: 1.4,
      sharpness: 0.58,
      twist: 0.45,
      fillLight: 0.25,
      glow: 0.85,
      brightness: 1.85,
      variation: 62,
      grain: 0.38,
      fade: 0.08,
    },
  },
  {
    id: 'indigo-silk',
    slug: 'indigo-silk',
    name: '紫紺の絹波',
    subtitle: '群青 · 滑らか',
    swatch: ['#06050D', '#9384F7'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#9384f7',
      backgroundColor: '#06050d',
      beamWidth: 150,
      rotation: 45,
      speed: 1.15,
      waveLength: 190,
      depth: 1.1,
      sharpness: 0.74,
      twist: 0.55,
      fillLight: 0.34,
      glow: 0.74,
      brightness: 1.7,
      variation: 77,
      grain: 0.26,
      fade: 0.05,
    },
  },
  {
    id: 'washi-ink',
    slug: 'washi-ink',
    name: '和紙と墨',
    subtitle: 'ライト · 建築美',
    swatch: ['#F3F1EC', '#27292E'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#2c303a',
      backgroundColor: '#f3f1ec',
      beamWidth: 136,
      rotation: 28,
      speed: 0.7,
      waveLength: 235,
      depth: 1.15,
      sharpness: 0.54,
      twist: 0.24,
      fillLight: 0.55,
      glow: 0.58,
      brightness: 1.85,
      variation: 22,
      grain: 0.18,
      fade: 0,
      lightMode: true,
    },
  },
  {
    id: 'porcelain-azure',
    slug: 'porcelain-azure',
    name: '白磁と藍',
    subtitle: 'ライト · 清涼',
    swatch: ['#EFF3F8', '#224F8C'],
    config: {
      ...DEFAULT_BEAMS_CONFIG,
      color: '#224f8c',
      backgroundColor: '#eff3f8',
      beamWidth: 124,
      rotation: -22,
      speed: 0.8,
      waveLength: 230,
      depth: 1.15,
      sharpness: 0.58,
      twist: 0.32,
      fillLight: 0.55,
      glow: 0.62,
      brightness: 1.85,
      variation: 85,
      grain: 0.16,
      fade: 0,
      lightMode: true,
    },
  },
];

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: 'fhd', label: 'Full HD', aspect: '16:9', width: 1920, height: 1080 },
  { id: 'wqhd', label: 'WQHD', aspect: '16:9', width: 2560, height: 1440 },
  { id: '4k', label: '4K UHD', aspect: '16:9', width: 3840, height: 2160 },
  { id: 'uwqhd', label: 'Ultrawide', aspect: '21:9', width: 3440, height: 1440 },
  { id: 'macbook', label: 'MacBook 16:10', aspect: '16:10', width: 2880, height: 1800 },
  { id: '5k', label: '5K Studio', aspect: '16:9', width: 5120, height: 2880 },
];

export const clampNumber = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

export const isValidHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim());

export function sanitizeBeamsConfig(partial: Partial<BeamsConfig> = {}): BeamsConfig {
  const base = DEFAULT_BEAMS_CONFIG;
  return {
    color: isValidHexColor(partial.color) ? partial.color.trim().toLowerCase() : base.color,
    backgroundColor: isValidHexColor(partial.backgroundColor)
      ? partial.backgroundColor.trim().toLowerCase()
      : base.backgroundColor,
    beamWidth: Math.round(clampNumber(partial.beamWidth ?? base.beamWidth, 30, 320)),
    rotation: Math.round(clampNumber(partial.rotation ?? base.rotation, -180, 180)),
    speed: Number(clampNumber(partial.speed ?? base.speed, 0, 3).toFixed(2)),
    waveLength: Math.round(clampNumber(partial.waveLength ?? base.waveLength, 60, 500)),
    depth: Number(clampNumber(partial.depth ?? base.depth, 0, 2.5).toFixed(2)),
    sharpness: Number(clampNumber(partial.sharpness ?? base.sharpness, 0, 1).toFixed(2)),
    twist: Number(clampNumber(partial.twist ?? base.twist, 0, 2).toFixed(2)),
    fillLight: Number(clampNumber(partial.fillLight ?? base.fillLight, 0, 1.5).toFixed(2)),
    glow: Number(clampNumber(partial.glow ?? base.glow, 0, 1.8).toFixed(2)),
    brightness: Number(clampNumber(partial.brightness ?? base.brightness, 0.4, 3).toFixed(2)),
    variation: Math.round(clampNumber(partial.variation ?? base.variation, 0, 100)),
    grain: Number(clampNumber(partial.grain ?? base.grain, 0, 1).toFixed(2)),
    fade: Number(clampNumber(partial.fade ?? base.fade, 0, 0.6).toFixed(2)),
    mouseInteraction:
      typeof partial.mouseInteraction === 'boolean' ? partial.mouseInteraction : base.mouseInteraction,
    mouseStrength: Number(clampNumber(partial.mouseStrength ?? base.mouseStrength, 0, 2).toFixed(2)),
    lightMode: typeof partial.lightMode === 'boolean' ? partial.lightMode : base.lightMode,
    paused: typeof partial.paused === 'boolean' ? partial.paused : base.paused,
  };
}

export function serializeConfigToQuery(
  config: BeamsConfig,
  clock: ClockConfig,
  zen: boolean
): string {
  const params = new URLSearchParams();
  params.set('c', config.color.replace('#', ''));
  params.set('bg', config.backgroundColor.replace('#', ''));
  params.set('bw', String(config.beamWidth));
  params.set('rot', String(config.rotation));
  params.set('spd', String(config.speed));
  params.set('wl', String(config.waveLength));
  params.set('dep', String(config.depth));
  params.set('shp', String(config.sharpness));
  params.set('tw', String(config.twist));
  params.set('fl', String(config.fillLight));
  params.set('gl', String(config.glow));
  params.set('br', String(config.brightness));
  params.set('var', String(config.variation));
  params.set('gr', String(config.grain));
  params.set('fd', String(config.fade));
  params.set('mi', config.mouseInteraction ? '1' : '0');
  params.set('ms', String(config.mouseStrength));
  params.set('lm', config.lightMode ? '1' : '0');
  params.set('clk', clock.position);
  if (clock.position !== 'off') {
    params.set('csz', clock.size);
    params.set('cst', clock.style);
    params.set('h24', clock.use24Hour ? '1' : '0');
    params.set('sec', clock.showSeconds ? '1' : '0');
    params.set('dt', clock.showDate ? '1' : '0');
  }
  if (zen) {
    params.set('zen', '1');
  }
  return `?${params.toString()}`;
}

export interface ParsedQueryState {
  config: BeamsConfig;
  clock: ClockConfig;
  zen: boolean;
  hasCustomParams: boolean;
}

export function parseConfigFromQuery(search: string): ParsedQueryState {
  const params = new URLSearchParams(search);
  const num = (key: string): number | undefined => {
    const raw = params.get(key);
    if (raw === null || raw === '') return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const hex = (key: string): string | undefined => {
    const raw = params.get(key);
    if (!raw) return undefined;
    const normalized = raw.startsWith('#') ? raw : `#${raw}`;
    return isValidHexColor(normalized) ? normalized : undefined;
  };

  const hasCustomParams =
    params.has('c') || params.has('bg') || params.has('bw') || params.has('rot') || params.has('lm');

  const config = sanitizeBeamsConfig({
    color: hex('c'),
    backgroundColor: hex('bg'),
    beamWidth: num('bw'),
    rotation: num('rot'),
    speed: num('spd'),
    waveLength: num('wl'),
    depth: num('dep'),
    sharpness: num('shp'),
    twist: num('tw'),
    fillLight: num('fl'),
    glow: num('gl'),
    brightness: num('br'),
    variation: num('var'),
    grain: num('gr'),
    fade: num('fd'),
    mouseInteraction: params.has('mi') ? params.get('mi') !== '0' : undefined,
    mouseStrength: num('ms'),
    lightMode: params.has('lm') ? params.get('lm') === '1' : undefined,
  });

  const clkParam = params.get('clk');
  const validPositions: ClockPosition[] = [
    'off',
    'center',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ];
  const position: ClockPosition = validPositions.includes(clkParam as ClockPosition)
    ? (clkParam as ClockPosition)
    : DEFAULT_CLOCK_CONFIG.position;

  const sizeParam = params.get('csz');
  const validSizes: ClockSize[] = ['sm', 'md', 'lg'];
  const size: ClockSize = validSizes.includes(sizeParam as ClockSize)
    ? (sizeParam as ClockSize)
    : DEFAULT_CLOCK_CONFIG.size;

  const styleParam = params.get('cst');
  const style: ClockStyle = isValidClockStyle(styleParam)
    ? styleParam
    : DEFAULT_CLOCK_CONFIG.style;

  const clock: ClockConfig = {
    position,
    size,
    style,
    use24Hour: params.has('h24') ? params.get('h24') !== '0' : DEFAULT_CLOCK_CONFIG.use24Hour,
    showSeconds: params.has('sec') ? params.get('sec') === '1' : DEFAULT_CLOCK_CONFIG.showSeconds,
    showDate: params.has('dt') ? params.get('dt') !== '0' : DEFAULT_CLOCK_CONFIG.showDate,
    osFrame: 'none',
  };

  const zen = params.get('zen') === '1';

  return { config, clock, zen, hasCustomParams };
}

const CURATED_RANDOM_PALETTES: Array<{ color: string; bg: string; lightMode: boolean }> = [
  { color: '#e2e8f0', bg: '#050608', lightMode: false },
  { color: '#f5b971', bg: '#0a0704', lightMode: false },
  { color: '#6ba8ff', bg: '#040812', lightMode: false },
  { color: '#5bd3b4', bg: '#040b09', lightMode: false },
  { color: '#f07285', bg: '#0b0407', lightMode: false },
  { color: '#b49bff', bg: '#070510', lightMode: false },
  { color: '#e6c28b', bg: '#090806', lightMode: false },
  { color: '#7cc6d4', bg: '#05090c', lightMode: false },
  { color: '#2b3240', bg: '#f2f1ec', lightMode: true },
  { color: '#264d7a', bg: '#eef2f7', lightMode: true },
];

export function createRandomConfig(rng: () => number = Math.random): BeamsConfig {
  const palette = CURATED_RANDOM_PALETTES[Math.floor(rng() * CURATED_RANDOM_PALETTES.length)];
  const angleChoices = [-60, -45, -30, -18, 0, 18, 30, 45, 60];
  const baseAngle = angleChoices[Math.floor(rng() * angleChoices.length)];
  const jitter = Math.round((rng() - 0.5) * 14);

  return sanitizeBeamsConfig({
    color: palette.color,
    backgroundColor: palette.bg,
    lightMode: palette.lightMode,
    beamWidth: Math.round(80 + rng() * 140),
    rotation: baseAngle + jitter,
    speed: Number((0.55 + rng() * 0.95).toFixed(2)),
    waveLength: Math.round(160 + rng() * 190),
    depth: Number((0.75 + rng() * 0.95).toFixed(2)),
    sharpness: Number((0.45 + rng() * 0.4).toFixed(2)),
    twist: Number((rng() * 0.85).toFixed(2)),
    fillLight: Number((0.2 + rng() * 0.35).toFixed(2)),
    glow: Number((palette.lightMode ? 0.35 + rng() * 0.3 : 0.5 + rng() * 0.55).toFixed(2)),
    brightness: Number((palette.lightMode ? 1.35 + rng() * 0.35 : 1.45 + rng() * 0.55).toFixed(2)),
    variation: Math.floor(rng() * 100),
    grain: Number((0.18 + rng() * 0.24).toFixed(2)),
    fade: Number((rng() * 0.14).toFixed(2)),
    mouseInteraction: true,
    mouseStrength: 1,
    paused: false,
  });
}

export function buildWallpaperFilename(
  slug: string,
  width: number,
  height: number,
  format: ExportFormat
): string {
  const safeSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'custom';
  const ext = format === 'jpeg' ? 'jpg' : 'png';
  return `kosen-${safeSlug}-${width}x${height}.${ext}`;
}

const WEEKDAYS_JA = ['日', '月', '火', '水', '木', '金', '土'] as const;
const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export interface FormattedClockParts {
  hours: string;
  minutes: string;
  seconds: string;
  timeText: string;
  periodText: string;
  dateText: string;
  isoDateText: string;
}

export function formatJapaneseClock(
  date: Date,
  use24Hour: boolean,
  showSeconds: boolean
): FormattedClockParts {
  const rawHours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let hoursDisplay: string;
  let periodText = '';

  if (use24Hour) {
    hoursDisplay = String(rawHours).padStart(2, '0');
  } else {
    periodText = rawHours >= 12 ? 'PM' : 'AM';
    const h12 = rawHours % 12 || 12;
    hoursDisplay = String(h12).padStart(2, '0');
  }

  const timeText = showSeconds
    ? `${hoursDisplay}:${minutes}:${seconds}`
    : `${hoursDisplay}:${minutes}`;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdayIdx = date.getDay();
  const weekday = WEEKDAYS_JA[weekdayIdx];
  const weekdayEn = WEEKDAYS_EN[weekdayIdx];
  const dateText = `${year}年${month}月${day}日 (${weekday})`;
  const isoDateText = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${weekdayEn}`;

  return {
    hours: hoursDisplay,
    minutes,
    seconds,
    timeText,
    periodText,
    dateText,
    isoDateText,
  };
}
