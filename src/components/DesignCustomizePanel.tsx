import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { AllDesignConfigs, WallpaperDesignId } from '../utils/wallpaperDesigns';

interface DesignCustomizePanelProps {
  designId: WallpaperDesignId;
  configs: AllDesignConfigs;
  onPatchDesignConfig: <K extends WallpaperDesignId>(
    id: K,
    patch: Partial<AllDesignConfigs[K]>
  ) => void;
  onReset: () => void;
  lightMode: boolean;
}

type BeamsSubGroup = 'color' | 'geometry' | 'texture';

interface SliderControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (val: number) => void;
  lightMode: boolean;
}

function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  lightMode,
}: SliderControlProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <label
          htmlFor={id}
          className={`font-medium whitespace-nowrap ${
            lightMode ? 'text-neutral-700' : 'text-neutral-300'
          }`}
        >
          {label}
        </label>
        <span
          className={`font-mono text-[11px] tabular-nums ${
            lightMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="studio-range"
        style={
          {
            '--range-track': lightMode ? 'rgba(15, 17, 21, 0.16)' : 'rgba(255, 255, 255, 0.18)',
            '--range-thumb': lightMode ? '#111318' : '#ffffff',
            '--range-thumb-border': lightMode ? '#f5f4f0' : '#0b0c0e',
          } as React.CSSProperties
        }
      />
    </div>
  );
}

interface ColorSwatchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  lightMode: boolean;
}

function ColorSwatchInput({ id, label, value, onChange, lightMode }: ColorSwatchInputProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label htmlFor={id} className="text-xs font-medium whitespace-nowrap">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-7 w-8 cursor-pointer rounded border bg-transparent p-0.5 ${
            lightMode ? 'border-black/20' : 'border-white/20'
          }`}
        />
        <span
          className={`font-mono text-[11px] uppercase tabular-nums ${
            lightMode ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export function DesignCustomizePanel({
  designId,
  configs,
  onPatchDesignConfig,
  onReset,
  lightMode,
}: DesignCustomizePanelProps) {
  const [beamsGroup, setBeamsGroup] = useState<BeamsSubGroup>('color');

  const segmentTrack = lightMode ? 'bg-black/6' : 'bg-white/8';
  const segmentActive = lightMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950';
  const segmentIdle = lightMode
    ? 'text-neutral-700 hover:text-neutral-950'
    : 'text-neutral-300 hover:text-white';
  const mutedText = lightMode ? 'text-neutral-600' : 'text-neutral-400';
  const secondaryBtn = lightMode
    ? 'border border-black/14 bg-white/70 text-neutral-900 hover:bg-white'
    : 'border border-white/14 bg-white/6 text-neutral-100 hover:bg-white/12';

  if (designId === 'beams') {
    const c = configs.beams;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="調整カテゴリ"
            className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}
          >
            {(
              [
                { id: 'color', label: '色と光' },
                { id: 'geometry', label: '形状と動き' },
                { id: 'texture', label: '質感と反応' },
              ] as const
            ).map((grp) => (
              <button
                key={grp.id}
                type="button"
                role="tab"
                aria-selected={beamsGroup === grp.id}
                onClick={() => setBeamsGroup(grp.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  beamsGroup === grp.id ? segmentActive : segmentIdle
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>初期値に戻す</span>
          </button>
        </div>

        {beamsGroup === 'color' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <ColorSwatchInput
              id="beam-color-input"
              label="光線カラー"
              value={c.color}
              onChange={(color) => onPatchDesignConfig('beams', { color })}
              lightMode={lightMode}
            />
            <ColorSwatchInput
              id="bg-color-input"
              label="背景カラー"
              value={c.backgroundColor}
              onChange={(backgroundColor) => onPatchDesignConfig('beams', { backgroundColor })}
              lightMode={lightMode}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium">ベース表現</span>
              <div className={`inline-flex rounded-lg p-0.5 ${segmentTrack}`}>
                <button
                  type="button"
                  onClick={() =>
                    onPatchDesignConfig('beams', {
                      lightMode: false,
                      backgroundColor: c.lightMode ? '#050507' : c.backgroundColor,
                      color: c.lightMode ? '#ffffff' : c.color,
                    })
                  }
                  aria-pressed={!c.lightMode}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    !c.lightMode ? segmentActive : segmentIdle
                  }`}
                >
                  ダーク
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onPatchDesignConfig('beams', {
                      lightMode: true,
                      backgroundColor: !c.lightMode ? '#f3f1ec' : c.backgroundColor,
                      color: !c.lightMode ? '#2c303a' : c.color,
                    })
                  }
                  aria-pressed={c.lightMode}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    c.lightMode ? segmentActive : segmentIdle
                  }`}
                >
                  ライト
                </button>
              </div>
            </div>
            <SliderControl
              id="slider-brightness"
              label="明るさ"
              value={c.brightness}
              min={0.4}
              max={3.0}
              step={0.05}
              displayValue={c.brightness.toFixed(2)}
              onChange={(brightness) => onPatchDesignConfig('beams', { brightness })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-glow"
              label="グロー強度"
              value={c.glow}
              min={0}
              max={1.8}
              step={0.05}
              displayValue={c.glow.toFixed(2)}
              onChange={(glow) => onPatchDesignConfig('beams', { glow })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-fill-light"
              label="補助光"
              value={c.fillLight}
              min={0}
              max={1.5}
              step={0.05}
              displayValue={c.fillLight.toFixed(2)}
              onChange={(fillLight) => onPatchDesignConfig('beams', { fillLight })}
              lightMode={lightMode}
            />
          </div>
        )}

        {beamsGroup === 'geometry' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <SliderControl
              id="slider-beam-width"
              label="ビーム幅"
              value={c.beamWidth}
              min={30}
              max={320}
              step={2}
              displayValue={`${c.beamWidth}px`}
              onChange={(beamWidth) => onPatchDesignConfig('beams', { beamWidth })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-rotation"
              label="角度"
              value={c.rotation}
              min={-180}
              max={180}
              step={1}
              displayValue={`${c.rotation}°`}
              onChange={(rotation) => onPatchDesignConfig('beams', { rotation })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-wave-length"
              label="波長"
              value={c.waveLength}
              min={60}
              max={500}
              step={5}
              displayValue={`${c.waveLength}px`}
              onChange={(waveLength) => onPatchDesignConfig('beams', { waveLength })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-depth"
              label="立体感"
              value={c.depth}
              min={0}
              max={2.5}
              step={0.05}
              displayValue={c.depth.toFixed(2)}
              onChange={(depth) => onPatchDesignConfig('beams', { depth })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-twist"
              label="ねじれ"
              value={c.twist}
              min={0}
              max={2.0}
              step={0.05}
              displayValue={c.twist.toFixed(2)}
              onChange={(twist) => onPatchDesignConfig('beams', { twist })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-speed"
              label="速度"
              value={c.speed}
              min={0}
              max={3.0}
              step={0.05}
              displayValue={`${c.speed.toFixed(2)}x`}
              onChange={(speed) => onPatchDesignConfig('beams', { speed })}
              lightMode={lightMode}
            />
          </div>
        )}

        {beamsGroup === 'texture' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
            <SliderControl
              id="slider-sharpness"
              label="シャープネス"
              value={c.sharpness}
              min={0}
              max={1}
              step={0.02}
              displayValue={c.sharpness.toFixed(2)}
              onChange={(sharpness) => onPatchDesignConfig('beams', { sharpness })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-grain"
              label="フィルム粒子"
              value={c.grain}
              min={0}
              max={1}
              step={0.02}
              displayValue={c.grain.toFixed(2)}
              onChange={(grain) => onPatchDesignConfig('beams', { grain })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-fade"
              label="周辺フェード"
              value={c.fade}
              min={0}
              max={0.6}
              step={0.02}
              displayValue={c.fade.toFixed(2)}
              onChange={(fade) => onPatchDesignConfig('beams', { fade })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-variation"
              label="パターンシード"
              value={c.variation}
              min={0}
              max={100}
              step={1}
              displayValue={`#${c.variation}`}
              onChange={(variation) => onPatchDesignConfig('beams', { variation })}
              lightMode={lightMode}
            />
            <SliderControl
              id="slider-mouse-strength"
              label="カーソル反応強度"
              value={c.mouseStrength}
              min={0}
              max={2}
              step={0.05}
              displayValue={c.mouseStrength.toFixed(2)}
              onChange={(mouseStrength) => onPatchDesignConfig('beams', { mouseStrength })}
              lightMode={lightMode}
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <label htmlFor="toggle-mouse-interaction" className="text-xs font-medium">
                カーソル追従
              </label>
              <button
                id="toggle-mouse-interaction"
                type="button"
                role="switch"
                aria-checked={c.mouseInteraction}
                onClick={() =>
                  onPatchDesignConfig('beams', { mouseInteraction: !c.mouseInteraction })
                }
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                  c.mouseInteraction ? segmentActive : secondaryBtn
                }`}
              >
                {c.mouseInteraction ? 'オン' : 'オフ'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (designId === 'pixel-snow') {
    const c = configs['pixel-snow'];
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
            {(
              [
                { id: 'snowflake', label: '雪結晶' },
                { id: 'round', label: '丸粒' },
                { id: 'square', label: 'ドット' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={c.variant === v.id}
                onClick={() => onPatchDesignConfig('pixel-snow', { variant: v.id })}
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                  c.variant === v.id ? segmentActive : segmentIdle
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={c.accumulate}
                onChange={(e) => onPatchDesignConfig('pixel-snow', { accumulate: e.target.checked })}
                className="h-3.5 w-3.5 accent-current cursor-pointer"
              />
              <span>積雪あり</span>
            </label>
            <button
              type="button"
              onClick={onReset}
              className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>初期化</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          <ColorSwatchInput
            id="snow-color"
            label="雪カラー"
            value={c.color}
            onChange={(color) => onPatchDesignConfig('pixel-snow', { color })}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="snow-bg"
            label="背景カラー"
            value={c.backgroundColor}
            onChange={(backgroundColor) => onPatchDesignConfig('pixel-snow', { backgroundColor })}
            lightMode={lightMode}
          />
          <SliderControl
            id="snow-density"
            label="雪の密度"
            value={c.density}
            min={0.1}
            max={1}
            step={0.02}
            displayValue={c.density.toFixed(2)}
            onChange={(density) => onPatchDesignConfig('pixel-snow', { density })}
            lightMode={lightMode}
          />
          <SliderControl
            id="snow-speed"
            label="落下速度"
            value={c.speed}
            min={0}
            max={2.5}
            step={0.05}
            displayValue={`${c.speed.toFixed(2)}x`}
            onChange={(speed) => onPatchDesignConfig('pixel-snow', { speed })}
            lightMode={lightMode}
          />
          <SliderControl
            id="snow-wind"
            label="風向き"
            value={c.wind}
            min={-2}
            max={2}
            step={0.05}
            displayValue={c.wind.toFixed(2)}
            onChange={(wind) => onPatchDesignConfig('pixel-snow', { wind })}
            lightMode={lightMode}
          />
          <SliderControl
            id="snow-pixel"
            label="ドット粒度"
            value={c.pixelSize}
            min={1}
            max={8}
            step={1}
            displayValue={`${c.pixelSize}px`}
            onChange={(pixelSize) => onPatchDesignConfig('pixel-snow', { pixelSize })}
            lightMode={lightMode}
          />
        </div>
      </div>
    );
  }

  if (designId === 'holo-mosaic') {
    const c = configs['holo-mosaic'];
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
              {(
                [
                  { id: 'full', label: 'フル虹色' },
                  { id: 'warm', label: '暖色' },
                  { id: 'cool', label: '寒色' },
                  { id: 'pearl', label: 'パール' },
                ] as const
              ).map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  aria-pressed={c.spectrum === sp.id}
                  onClick={() => onPatchDesignConfig('holo-mosaic', { spectrum: sp.id })}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    c.spectrum === sp.id ? segmentActive : segmentIdle
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
            <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
              {(
                [
                  { id: 'none', label: '通常' },
                  { id: 'dither', label: 'ディザー' },
                  { id: 'ascii', label: 'ASCII' },
                ] as const
              ).map((flt) => (
                <button
                  key={flt.id}
                  type="button"
                  aria-pressed={c.filter === flt.id}
                  onClick={() => onPatchDesignConfig('holo-mosaic', { filter: flt.id })}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    c.filter === flt.id ? segmentActive : segmentIdle
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>初期化</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          <ColorSwatchInput
            id="holo-base"
            label="ベース色"
            value={c.color}
            onChange={(color) => onPatchDesignConfig('holo-mosaic', { color })}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="holo-metal"
            label="反射メタル色"
            value={c.metalColor}
            onChange={(metalColor) => onPatchDesignConfig('holo-mosaic', { metalColor })}
            lightMode={lightMode}
          />
          <SliderControl
            id="holo-tile"
            label="タイルサイズ"
            value={c.tileSize}
            min={0.4}
            max={2.4}
            step={0.05}
            displayValue={c.tileSize.toFixed(2)}
            onChange={(tileSize) => onPatchDesignConfig('holo-mosaic', { tileSize })}
            lightMode={lightMode}
          />
          <SliderControl
            id="holo-rotation"
            label="角度"
            value={c.rotation}
            min={-90}
            max={90}
            step={1}
            displayValue={`${c.rotation}°`}
            onChange={(rotation) => onPatchDesignConfig('holo-mosaic', { rotation })}
            lightMode={lightMode}
          />
          <SliderControl
            id="holo-saturation"
            label="彩度"
            value={c.saturation}
            min={0}
            max={1}
            step={0.02}
            displayValue={c.saturation.toFixed(2)}
            onChange={(saturation) => onPatchDesignConfig('holo-mosaic', { saturation })}
            lightMode={lightMode}
          />
          <SliderControl
            id="holo-speed"
            label="速度"
            value={c.speed}
            min={0}
            max={2}
            step={0.05}
            displayValue={`${c.speed.toFixed(2)}x`}
            onChange={(speed) => onPatchDesignConfig('holo-mosaic', { speed })}
            lightMode={lightMode}
          />
        </div>
      </div>
    );
  }

  if (designId === 'aurora') {
    const c = configs.aurora;
    const setStop = (index: 0 | 1 | 2, hex: string) => {
      const next: [string, string, string] = [...c.colorStops] as [string, string, string];
      next[index] = hex;
      onPatchDesignConfig('aurora', { colorStops: next });
    };
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
              {(
                [
                  { id: 'top', label: '上部カーテン' },
                  { id: 'bottom', label: '下部カーテン' },
                ] as const
              ).map((dir) => (
                <button
                  key={dir.id}
                  type="button"
                  aria-pressed={c.direction === dir.id}
                  onClick={() => onPatchDesignConfig('aurora', { direction: dir.id })}
                  className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    c.direction === dir.id ? segmentActive : segmentIdle
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
            <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
              {[1, 2, 3].map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={c.layers === l}
                  onClick={() => onPatchDesignConfig('aurora', { layers: l })}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    c.layers === l ? segmentActive : segmentIdle
                  }`}
                >
                  {l}層
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>初期化</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          <ColorSwatchInput
            id="aurora-c1"
            label="極光色 1"
            value={c.colorStops[0]}
            onChange={(hex) => setStop(0, hex)}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="aurora-c2"
            label="極光色 2"
            value={c.colorStops[1]}
            onChange={(hex) => setStop(1, hex)}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="aurora-c3"
            label="極光色 3"
            value={c.colorStops[2]}
            onChange={(hex) => setStop(2, hex)}
            lightMode={lightMode}
          />
          <SliderControl
            id="aurora-amp"
            label="波の振幅"
            value={c.amplitude}
            min={0.2}
            max={2.2}
            step={0.05}
            displayValue={c.amplitude.toFixed(2)}
            onChange={(amplitude) => onPatchDesignConfig('aurora', { amplitude })}
            lightMode={lightMode}
          />
          <SliderControl
            id="aurora-blend"
            label="広がり"
            value={c.blend}
            min={0.1}
            max={1}
            step={0.02}
            displayValue={c.blend.toFixed(2)}
            onChange={(blend) => onPatchDesignConfig('aurora', { blend })}
            lightMode={lightMode}
          />
          <SliderControl
            id="aurora-speed"
            label="速度"
            value={c.speed}
            min={0}
            max={2.5}
            step={0.05}
            displayValue={`${c.speed.toFixed(2)}x`}
            onChange={(speed) => onPatchDesignConfig('aurora', { speed })}
            lightMode={lightMode}
          />
        </div>
      </div>
    );
  }

  if (designId === 'gradient-ascii') {
    const c = configs['gradient-ascii'];
    const setColor = (index: 0 | 1 | 2 | 3, hex: string) => {
      const next = [...c.colors] as [string, string, string, string];
      next[index] = hex;
      onPatchDesignConfig('gradient-ascii', { colors: next });
    };
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
            {(
              [
                { id: 'horizon', label: 'ホライズン' },
                { id: 'pinch', label: 'ピンチ' },
                { id: 'rise', label: 'ライズ' },
                { id: 'eclipse', label: 'エクリプス' },
              ] as const
            ).map((sh) => (
              <button
                key={sh.id}
                type="button"
                aria-pressed={c.shape === sh.id}
                onClick={() => onPatchDesignConfig('gradient-ascii', { shape: sh.id })}
                className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                  c.shape === sh.id ? segmentActive : segmentIdle
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>初期化</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          <ColorSwatchInput
            id="ascii-c1"
            label="カラー 1"
            value={c.colors[0]}
            onChange={(hex) => setColor(0, hex)}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="ascii-c2"
            label="カラー 2"
            value={c.colors[3]}
            onChange={(hex) => setColor(3, hex)}
            lightMode={lightMode}
          />
          <SliderControl
            id="ascii-cell"
            label="文字サイズ"
            value={c.cellSize}
            min={10}
            max={38}
            step={1}
            displayValue={`${c.cellSize}px`}
            onChange={(cellSize) => onPatchDesignConfig('gradient-ascii', { cellSize })}
            lightMode={lightMode}
          />
          <SliderControl
            id="ascii-density"
            label="密度"
            value={c.density}
            min={0.2}
            max={1}
            step={0.02}
            displayValue={c.density.toFixed(2)}
            onChange={(density) => onPatchDesignConfig('gradient-ascii', { density })}
            lightMode={lightMode}
          />
          <SliderControl
            id="ascii-flow"
            label="うねり"
            value={c.flow}
            min={0}
            max={1.5}
            step={0.05}
            displayValue={c.flow.toFixed(2)}
            onChange={(flow) => onPatchDesignConfig('gradient-ascii', { flow })}
            lightMode={lightMode}
          />
          <SliderControl
            id="ascii-speed"
            label="速度"
            value={c.speed}
            min={0}
            max={2.5}
            step={0.05}
            displayValue={`${c.speed.toFixed(2)}x`}
            onChange={(speed) => onPatchDesignConfig('gradient-ascii', { speed })}
            lightMode={lightMode}
          />
        </div>
      </div>
    );
  }

  if (designId === 'letter-glitch') {
    const c = configs['letter-glitch'];
    const setGlitchColor = (index: 0 | 1, hex: string) => {
      const next: [string, string] = [...c.glitchColors] as [string, string];
      next[index] = hex;
      onPatchDesignConfig('letter-glitch', { glitchColors: next });
    };
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
            {(
              [
                { id: 'tear', label: 'クリック: ティア' },
                { id: 'burst', label: 'クリック: バースト' },
              ] as const
            ).map((eff) => (
              <button
                key={eff.id}
                type="button"
                aria-pressed={c.clickEffect === eff.id}
                onClick={() => onPatchDesignConfig('letter-glitch', { clickEffect: eff.id })}
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                  c.clickEffect === eff.id ? segmentActive : segmentIdle
                }`}
              >
                {eff.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>初期化</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
          <ColorSwatchInput
            id="glitch-c1"
            label="アクセント色 1"
            value={c.glitchColors[0]}
            onChange={(hex) => setGlitchColor(0, hex)}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="glitch-c2"
            label="アクセント色 2"
            value={c.glitchColors[1]}
            onChange={(hex) => setGlitchColor(1, hex)}
            lightMode={lightMode}
          />
          <ColorSwatchInput
            id="glitch-bg"
            label="背景カラー"
            value={c.backgroundColor}
            onChange={(backgroundColor) =>
              onPatchDesignConfig('letter-glitch', { backgroundColor })
            }
            lightMode={lightMode}
          />
          <SliderControl
            id="glitch-size"
            label="文字サイズ"
            value={c.fontSize}
            min={10}
            max={28}
            step={1}
            displayValue={`${c.fontSize}px`}
            onChange={(fontSize) => onPatchDesignConfig('letter-glitch', { fontSize })}
            lightMode={lightMode}
          />
          <SliderControl
            id="glitch-amount"
            label="グリッチ量"
            value={c.glitchAmount}
            min={0.05}
            max={1}
            step={0.02}
            displayValue={c.glitchAmount.toFixed(2)}
            onChange={(glitchAmount) => onPatchDesignConfig('letter-glitch', { glitchAmount })}
            lightMode={lightMode}
          />
          <SliderControl
            id="glitch-speed"
            label="速度"
            value={c.speed}
            min={0}
            max={2.5}
            step={0.05}
            displayValue={`${c.speed.toFixed(2)}x`}
            onChange={(speed) => onPatchDesignConfig('letter-glitch', { speed })}
            lightMode={lightMode}
          />
        </div>
      </div>
    );
  }

  // grainient
  const c = configs.grainient;
  const setGColor = (index: 0 | 2 | 3, hex: string) => {
    const next = [...c.colors] as [string, string, string, string, string];
    next[index] = hex;
    onPatchDesignConfig('grainient', { colors: next });
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={`inline-flex items-center gap-1 rounded-lg p-1 ${segmentTrack}`}>
          {(
            [
              { id: 'linear', label: 'リニア' },
              { id: 'radial', label: 'ラジアル' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={c.type === t.id}
              onClick={() => onPatchDesignConfig('grainient', { type: t.id })}
              className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                c.type === t.id ? segmentActive : segmentIdle
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onReset}
          className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>初期化</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3.5">
        <ColorSwatchInput
          id="grain-c0"
          label="ベース色"
          value={c.colors[0]}
          onChange={(hex) => setGColor(0, hex)}
          lightMode={lightMode}
        />
        <ColorSwatchInput
          id="grain-c2"
          label="中間色"
          value={c.colors[2]}
          onChange={(hex) => setGColor(2, hex)}
          lightMode={lightMode}
        />
        <ColorSwatchInput
          id="grain-c3"
          label="ハイライト色"
          value={c.colors[3]}
          onChange={(hex) => setGColor(3, hex)}
          lightMode={lightMode}
        />
        <SliderControl
          id="grain-angle"
          label="角度"
          value={c.angle}
          min={0}
          max={360}
          step={1}
          displayValue={`${c.angle}°`}
          onChange={(angle) => onPatchDesignConfig('grainient', { angle })}
          lightMode={lightMode}
        />
        <SliderControl
          id="grain-silk"
          label="シルク感"
          value={c.silk}
          min={0}
          max={1}
          step={0.02}
          displayValue={c.silk.toFixed(2)}
          onChange={(silk) => onPatchDesignConfig('grainient', { silk })}
          lightMode={lightMode}
        />
        <SliderControl
          id="grain-amount"
          label="粒子感"
          value={c.grainAmount}
          min={0}
          max={0.3}
          step={0.01}
          displayValue={c.grainAmount.toFixed(2)}
          onChange={(grainAmount) => onPatchDesignConfig('grainient', { grainAmount })}
          lightMode={lightMode}
        />
      </div>
    </div>
  );
}
