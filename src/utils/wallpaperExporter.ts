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

  const now = new Date();
  const { hours, minutes, seconds, timeText, periodText, dateText, isoDateText } =
    formatJapaneseClock(now, clock.use24Hour, clock.showSeconds);

  const scale = canvas.height / 1080;
  const textColor = lightMode ? 'rgba(17, 19, 24, 0.92)' : 'rgba(255, 255, 255, 0.95)';
  const subColor = lightMode ? 'rgba(17, 19, 24, 0.66)' : 'rgba(255, 255, 255, 0.72)';
  const sizeMult = clock.size === 'sm' ? 0.74 : clock.size === 'lg' ? 1.26 : 1;
  const dateFontSize = Math.round(
    24 * scale * (clock.size === 'sm' ? 0.85 : clock.size === 'lg' ? 1.15 : 1)
  );
  const marginX = Math.round(96 * scale);
  const marginY = Math.round(96 * scale);
  const displayTime = periodText ? `${timeText} ${periodText}` : timeText;

  ctx.save();
  ctx.shadowColor = lightMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.42)';
  ctx.shadowBlur = 24 * scale;

  // Circular clock styles (analog & ring)
  if (clock.style === 'analog' || clock.style === 'ring') {
    const r = Math.round((clock.position === 'center' ? 132 : 98) * scale * sizeMult);
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    if (clock.position === 'top-left') {
      cx = marginX + r;
      cy = marginY + r;
    } else if (clock.position === 'top-right') {
      cx = canvas.width - marginX - r;
      cy = marginY + r;
    } else if (clock.position === 'bottom-left') {
      cx = marginX + r;
      cy = canvas.height - marginY - r - (clock.showDate ? dateFontSize * 2 : 0);
    } else if (clock.position === 'bottom-right') {
      cx = canvas.width - marginX - r;
      cy = canvas.height - marginY - r - (clock.showDate ? dateFontSize * 2 : 0);
    }

    const rawH = now.getHours() % 12;
    const rawM = now.getMinutes();
    const rawS = now.getSeconds();

    if (clock.style === 'analog') {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = lightMode ? 'rgba(248, 247, 243, 0.42)' : 'rgba(10, 12, 16, 0.36)';
      ctx.fill();
      ctx.lineWidth = Math.max(1.5, 2 * scale);
      ctx.strokeStyle = lightMode ? 'rgba(15, 17, 21, 0.24)' : 'rgba(255, 255, 255, 0.28)';
      ctx.stroke();

      for (let i = 0; i < 60; i++) {
        const isHour = i % 5 === 0;
        const rad = (i * 6 - 90) * (Math.PI / 180);
        const rOuter = r * 0.88;
        const rInner = r * (isHour ? 0.76 : 0.82);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * rInner, cy + Math.sin(rad) * rInner);
        ctx.lineTo(cx + Math.cos(rad) * rOuter, cy + Math.sin(rad) * rOuter);
        ctx.strokeStyle = isHour ? textColor : subColor;
        ctx.lineWidth = (isHour ? (i % 15 === 0 ? 3.2 : 2.1) : 1.1) * scale;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      const drawHand = (deg: number, lenRatio: number, tailRatio: number, width: number, color: string) => {
        const rad = (deg - 90) * (Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(rad) * r * tailRatio, cy - Math.sin(rad) * r * tailRatio);
        ctx.lineTo(cx + Math.cos(rad) * r * lenRatio, cy + Math.sin(rad) * r * lenRatio);
        ctx.strokeStyle = color;
        ctx.lineWidth = width * scale;
        ctx.lineCap = 'round';
        ctx.stroke();
      };

      drawHand(rawH * 30 + rawM * 0.5, 0.54, 0.1, 5.2, textColor);
      drawHand(rawM * 6 + rawS * 0.1, 0.74, 0.12, 3.2, textColor);
      if (clock.showSeconds) {
        drawHand(rawS * 6, 0.78, 0.18, 1.8, '#E54D3E');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = textColor;
      ctx.fill();
    } else {
      const innerR = r * 0.86;
      ctx.strokeStyle = lightMode ? 'rgba(15, 17, 21, 0.16)' : 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = textColor;
      ctx.lineWidth = 3.2 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (rawS / 60) * Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = subColor;
      ctx.lineWidth = 2.4 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, -Math.PI / 2, -Math.PI / 2 + ((rawM + rawS / 60) / 60) * Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `500 ${Math.round(r * 0.42)}px "Outfit", sans-serif`;
      ctx.fillText(`${hours}:${minutes}`, cx, cy - (clock.showSeconds || periodText ? r * 0.08 : 0));
      if (clock.showSeconds || periodText) {
        ctx.fillStyle = subColor;
        ctx.font = `500 ${Math.round(r * 0.14)}px "JetBrains Mono", monospace`;
        const subTime = [clock.showSeconds ? `:${seconds}` : '', periodText].filter(Boolean).join(' ');
        ctx.fillText(subTime, cx, cy + r * 0.24);
      }
    }

    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = `500 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, cx, cy + r + Math.round(24 * scale));
    }

    ctx.restore();
    return;
  }

  // Typographic & tile clock styles
  const timeFontSize = Math.round(
    (clock.style === 'mono' ? 96 : clock.style === 'editorial' ? 148 : 132) * scale * sizeMult
  );
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

  if (clock.style === 'stacked') {
    const lineStep = Math.round(timeFontSize * 0.86);
    const topY = clock.position === 'center' ? y - lineStep * 0.35 : y;
    const botY = topY + lineStep;
    ctx.font = `600 ${timeFontSize}px "Outfit", "Noto Sans JP", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.fillText(hours, x, topY);
    ctx.fillStyle = subColor;
    ctx.fillText(minutes, x, botY);
    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, x, botY + Math.round(48 * scale));
    }
  } else if (clock.style === 'flip') {
    const units = clock.showSeconds ? [hours, minutes, seconds] : [hours, minutes];
    const tileW = Math.round(138 * scale * sizeMult);
    const tileH = Math.round(148 * scale * sizeMult);
    const gap = Math.round(16 * scale * sizeMult);
    const totalW = units.length * tileW + (units.length - 1) * gap;
    const startX =
      align === 'center' ? x - totalW / 2 : align === 'right' ? x - totalW : x;
    const topY = y - tileH * 0.72;

    units.forEach((unit, idx) => {
      const tx = startX + idx * (tileW + gap);
      ctx.fillStyle = lightMode ? 'rgba(250, 249, 245, 0.92)' : 'rgba(17, 19, 24, 0.9)';
      ctx.strokeStyle = lightMode ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = Math.max(1, 1.5 * scale);
      ctx.beginPath();
      ctx.roundRect(tx, topY, tileW, tileH, 16 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.round(tileH * 0.62)}px "Outfit", sans-serif`;
      ctx.fillText(unit, tx + tileW / 2, topY + tileH / 2 + 2 * scale);

      ctx.fillStyle = lightMode ? 'rgba(0, 0, 0, 0.14)' : 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(tx, topY + tileH / 2, tileW, Math.max(1, 1.5 * scale));
    });

    if (clock.showDate) {
      ctx.textAlign = align;
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = subColor;
      ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, x, topY + tileH + Math.round(44 * scale));
    }
  } else if (clock.style === 'outline') {
    ctx.font = `700 ${timeFontSize}px "Outfit", "Noto Sans JP", sans-serif`;
    ctx.fillStyle = lightMode ? 'rgba(15, 17, 21, 0.05)' : 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = textColor;
    ctx.lineWidth = Math.max(1.5, 2.4 * scale * sizeMult);
    ctx.fillText(displayTime, x, y);
    ctx.strokeText(displayTime, x, y);
    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, x, y + Math.round(44 * scale));
    }
  } else if (clock.style === 'mono') {
    ctx.font = `400 ${timeFontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = textColor;
    ctx.fillText(displayTime, x, y);
    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.font = `400 ${Math.round(dateFontSize * 0.86)}px "JetBrains Mono", "Noto Sans JP", monospace`;
      ctx.fillText(`${isoDateText}  ·  ${dateText}`, x, y + Math.round(42 * scale));
    }
  } else if (clock.style === 'editorial') {
    ctx.font = `300 ${timeFontSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillStyle = textColor;
    ctx.fillText(displayTime, x, y);
    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, x, y + Math.round(48 * scale));
    }
  } else {
    ctx.font = `300 ${timeFontSize}px "Outfit", "Noto Sans JP", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.fillText(displayTime, x, y);
    if (clock.showDate) {
      ctx.fillStyle = subColor;
      ctx.font = `400 ${dateFontSize}px "Noto Sans JP", "Outfit", sans-serif`;
      ctx.fillText(dateText, x, y + Math.round(44 * scale));
    }
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
