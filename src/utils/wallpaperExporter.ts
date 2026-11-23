import { renderBeamsSnapshot } from '../components/Beams';
import {
  type BeamsConfig,
  type ClockConfig,
  type ExportFormat,
  buildWallpaperFilename,
  formatJapaneseClock,
} from './wallpaperConfig';
import type { WallpaperDesignId } from './wallpaperDesigns';

export interface ExportWallpaperOptions {
  designId: WallpaperDesignId;
  beamsConfig: BeamsConfig;
  backgroundColor: string;
  lightMode: boolean;
  sourceCanvas: HTMLCanvasElement | null;
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

  const sizeMult = clock.size === 'sm' ? 0.72 : clock.size === 'lg' ? 1.28 : 1;
  const timeFontSize = Math.round(132 * scale * sizeMult);
  const dateFontSize = Math.round(24 * scale * (clock.size === 'sm' ? 0.85 : clock.size === 'lg' ? 1.15 : 1));
  const marginX = Math.round(96 * scale);
  const marginY = Math.round(96 * scale);

  let x = canvas.width / 2;
  let y = canvas.height / 2;
  let align: CanvasTextAlign = 'center';

  if (clock.position === 'top-left') {
    x = marginX;
    y = marginY + timeFontSize * 0.85;
    align = 'left';
  } else if (clock.position === 'top-right') {
    x = canvas.width - marginX;
    y = marginY + timeFontSize * 0.85;
    align = 'right';
  } else if (clock.position === 'bottom-left') {
    x = marginX;
    y = canvas.height - marginY - (clock.showDate ? dateFontSize * 2.2 : 0);
    align = 'left';
  } else if (clock.position === 'bottom-right') {
    x = canvas.width - marginX;
    y = canvas.height - marginY - (clock.showDate ? dateFontSize * 2.2 : 0);
    align = 'right';
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

function drawCoverCanvas(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  targetW: number,
  targetH: number
): void {
  const srcW = source.width || 1;
  const srcH = source.height || 1;
  const scale = Math.max(targetW / srcW, targetH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const offsetX = (targetW - drawW) * 0.5;
  const offsetY = (targetH - drawH) * 0.5;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, offsetX, offsetY, drawW, drawH);
}

export async function exportWallpaperFile(
  options: ExportWallpaperOptions
): Promise<ExportResult> {
  const {
    designId,
    beamsConfig,
    backgroundColor,
    lightMode,
    sourceCanvas,
    clock,
    bakeClock,
    clockTimeSeconds,
    width,
    height,
    format,
    presetSlug,
  } = options;

  let canvas: HTMLCanvasElement;

  if (designId === 'beams') {
    canvas = renderBeamsSnapshot({
      width,
      height,
      clock: clockTimeSeconds,
      color: beamsConfig.color,
      beamWidth: beamsConfig.beamWidth,
      rotation: beamsConfig.rotation,
      waveLength: beamsConfig.waveLength,
      depth: beamsConfig.depth,
      sharpness: beamsConfig.sharpness,
      twist: beamsConfig.twist,
      fillLight: beamsConfig.fillLight,
      glow: beamsConfig.glow,
      brightness: beamsConfig.brightness,
      variation: beamsConfig.variation,
      grain: beamsConfig.grain,
      fade: beamsConfig.fade,
      opacity: 1,
      lightMode: beamsConfig.lightMode,
      backgroundColor: beamsConfig.backgroundColor,
    });
  } else {
    if (!sourceCanvas) {
      throw new Error('描画中のキャンバスを取得できませんでした。');
    }
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('書き出し用キャンバスを作成できませんでした。');
    }
    ctx.fillStyle = backgroundColor || (lightMode ? '#F4F3EF' : '#050507');
    ctx.fillRect(0, 0, width, height);
    drawCoverCanvas(ctx, sourceCanvas, width, height);
  }

  if (bakeClock && clock.position !== 'off') {
    drawClockOntoCanvas(canvas, clock, lightMode);
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
