import { renderBeamsSnapshot } from '../components/Beams';
import {
  type BeamsConfig,
  type ClockConfig,
  type ExportFormat,
  buildWallpaperFilename,
  formatJapaneseClock,
} from './wallpaperConfig';

export interface ExportWallpaperOptions {
  config: BeamsConfig;
  clock: ClockConfig;
  bakeClock: boolean;
  clockTimeSeconds: number;
  width: number;
  height: number;
  format: ExportFormat;
  presetSlug: string;
}

export interface ExportResult {
  filename: string;
  width: number;
  height: number;
  sizeBytes: number;
}

function drawClockOntoCanvas(
  canvas: HTMLCanvasElement,
  clock: ClockConfig,
  lightMode: boolean
): void {
  if (clock.position === 'off') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { timeText, periodText, dateText } = formatJapaneseClock(
    new Date(),
    clock.use24Hour,
    clock.showSeconds
  );

  const scale = canvas.height / 1080;
  const textColor = lightMode ? 'rgba(17, 19, 24, 0.90)' : 'rgba(255, 255, 255, 0.94)';
  const subColor = lightMode ? 'rgba(17, 19, 24, 0.62)' : 'rgba(255, 255, 255, 0.68)';

  ctx.save();
  ctx.fillStyle = textColor;
  ctx.shadowColor = lightMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 24 * scale;

  const timeFontSize = Math.round(132 * scale);
  const dateFontSize = Math.round(24 * scale);
  const marginX = Math.round(96 * scale);
  const marginY = Math.round(96 * scale);

  let x = canvas.width / 2;
  let y = canvas.height / 2;
  let align: CanvasTextAlign = 'center';

  if (clock.position === 'top-left') {
    x = marginX;
    y = marginY + timeFontSize * 0.85;
    align = 'left';
  } else if (clock.position === 'bottom-left') {
    x = marginX;
    y = canvas.height - marginY - (clock.showDate ? dateFontSize * 2.2 : 0);
    align = 'left';
  }

  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `300 ${timeFontSize}px "Outfit", "Noto Sans JP", sans-serif`;
  const displayTime = periodText ? `${timeText} ${periodText}` : timeText;
  ctx.fillText(displayTime, x, y);

  if (clock.showDate) {
    ctx.fillStyle = subColor;
    ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
    ctx.fillText(dateText, x, y + Math.round(44 * scale));
  }

  ctx.restore();
}

export async function exportWallpaperFile(
  options: ExportWallpaperOptions
): Promise<ExportResult> {
  const { config, clock, bakeClock, clockTimeSeconds, width, height, format, presetSlug } =
    options;

  const canvas = renderBeamsSnapshot({
    width,
    height,
    clock: clockTimeSeconds,
    color: config.color,
    beamWidth: config.beamWidth,
    rotation: config.rotation,
    waveLength: config.waveLength,
    depth: config.depth,
    sharpness: config.sharpness,
    twist: config.twist,
    fillLight: config.fillLight,
    glow: config.glow,
    brightness: config.brightness,
    variation: config.variation,
    grain: config.grain,
    fade: config.fade,
    opacity: 1,
    lightMode: config.lightMode,
    backgroundColor: config.backgroundColor,
  });

  if (bakeClock && clock.position !== 'off') {
    drawClockOntoCanvas(canvas, clock, config.lightMode);
  }

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? 0.94 : undefined;
  const filename = buildWallpaperFilename(presetSlug, width, height, format);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('画像データの生成に失敗しました。'));
      },
      mimeType,
      quality
    );
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return {
    filename,
    width,
    height,
    sizeBytes: blob.size,
  };
}
