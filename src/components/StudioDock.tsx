import { useState } from 'react';
import {
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import {
  type BeamsConfig,
  type ClockConfig,
  type ClockPosition,
  type ExportFormat,
  type OsPreviewFrame,
  RESOLUTION_OPTIONS,
  type ResolutionOption,
  type WallpaperPreset,
} from '../utils/wallpaperConfig';
import type { StudioTab } from './TopBar';

interface StudioDockProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  config: BeamsConfig;
  onChangeConfig: (patch: Partial<BeamsConfig>) => void;
  clock: ClockConfig;
  onChangeClock: (patch: Partial<ClockConfig>) => void;
  presets: WallpaperPreset[];
  activePresetId: string;
  onSelectPreset: (preset: WallpaperPreset) => void;
  onSaveCustomPreset: (name: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  onRandomize: () => void;
  onReset: () => void;
  dockOpen: boolean;
  onToggleDock: () => void;
  zenMode: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  selectedResolution: ResolutionOption;
  onSelectResolution: (res: ResolutionOption) => void;
  exportFormat: ExportFormat;
  onSelectExportFormat: (fmt: ExportFormat) => void;
  bakeClock: boolean;
  onToggleBakeClock: (bake: boolean) => void;
  exporting: boolean;
  exportStatus: string | null;
  exportError: string | null;
  onExportWallpaper: () => void;
  onCopyShareUrl: () => void;
  copiedUrl: boolean;
}

type CustomizeGroup = 'color' | 'geometry' | 'texture';

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

export function StudioDock({
  activeTab,
  onSelectTab,
  config,
  onChangeConfig,
  clock,
  onChangeClock,
  presets,
  activePresetId,
  onSelectPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onRandomize,
  onReset,
  dockOpen,
  onToggleDock,
  zenMode,
  isFullscreen,
  onToggleFullscreen,
  selectedResolution,
  onSelectResolution,
  exportFormat,
  onSelectExportFormat,
  bakeClock,
  onToggleBakeClock,
  exporting,
  exportStatus,
  exportError,
  onExportWallpaper,
  onCopyShareUrl,
  copiedUrl,
}: StudioDockProps) {
  const [customizeGroup, setCustomizeGroup] = useState<CustomizeGroup>('color');
  const [customName, setCustomName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const lightMode = config.lightMode;
  const activePreset = presets.find((p) => p.id === activePresetId);

  const panelSurface = lightMode
    ? 'bg-[#F6F5F1]/92 border-black/12 text-neutral-900 shadow-lg shadow-black/5'
    : 'bg-[#0C0D10]/90 border-white/12 text-neutral-100 shadow-2xl shadow-black/50';

  const subtleDivider = lightMode ? 'border-black/10' : 'border-white/10';
  const mutedText = lightMode ? 'text-neutral-600' : 'text-neutral-400';

  const iconBtnClass = lightMode
    ? 'text-neutral-700 hover:bg-black/6 hover:text-neutral-950 focus-visible:outline-neutral-950'
    : 'text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-white';

  const segmentTrack = lightMode ? 'bg-black/6' : 'bg-white/8';
  const segmentActive = lightMode
    ? 'bg-neutral-950 text-white'
    : 'bg-white text-neutral-950';
  const segmentIdle = lightMode
    ? 'text-neutral-700 hover:text-neutral-950'
    : 'text-neutral-300 hover:text-white';

  const primaryBtn = lightMode
    ? 'bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-50'
    : 'bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-50';

  const secondaryBtn = lightMode
    ? 'border border-black/14 bg-white/70 text-neutral-900 hover:bg-white'
    : 'border border-white/14 bg-white/6 text-neutral-100 hover:bg-white/12';

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    if (!trimmed) return;
    onSaveCustomPreset(trimmed);
    setCustomName('');
    setShowSaveForm(false);
  };

  return (
    <section
      aria-label="壁紙コントロールパネル"
      className={`fixed bottom-4 sm:bottom-5 left-1/2 z-20 w-[min(920px,94vw)] -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        zenMode ? 'translate-y-[140%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top dock handle bar */}
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          onClick={onToggleDock}
          aria-expanded={dockOpen}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${panelSurface}`}
        >
          {dockOpen ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{dockOpen ? 'コントロールを隠す' : 'コントロールを表示'}</span>
        </button>

        {/* High-contrast unboxed metadata summary over matching dock surface */}
        <div
          className={`hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${panelSurface}`}
        >
          <span>{activePreset ? activePreset.name : 'カスタム構成'}</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span className="font-mono tabular-nums">{config.rotation}°</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span className="font-mono tabular-nums">{config.beamWidth}px</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span>{config.lightMode ? 'ライト' : 'ダーク'}</span>
        </div>

        {/* Compact quick actions */}
        <div className={`flex items-center gap-1 rounded-lg border p-1 ${panelSurface}`}>
          <button
            type="button"
            onClick={() => onChangeConfig({ paused: !config.paused })}
            aria-label={config.paused ? 'アニメーションを再生' : 'アニメーションを一時停止'}
            title={config.paused ? '再生 (Space)' : '一時停止 (Space)'}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            {config.paused ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={onRandomize}
            aria-label="壁紙デザインをランダム生成"
            title="ランダム生成 (R)"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'フルスクリーンを終了' : 'フルスクリーン表示'}
            title="フルスクリーン (F)"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Main collapsible dock panel */}
      {dockOpen && (
        <div className={`rounded-xl border transition-colors duration-200 ${panelSurface}`}>
          {/* Mobile-only clean 4-tab selector (desktop uses TopBar nav) */}
          <div
            role="tablist"
            aria-label="モバイルスタジオタブ"
            className={`grid grid-cols-4 border-b p-1.5 md:hidden ${subtleDivider}`}
          >
            {(
              [
                { id: 'presets', label: 'プリセット' },
                { id: 'customize', label: '詳細調整' },
                { id: 'display', label: '時計・表示' },
                { id: 'export', label: '書き出し' },
              ] as Array<{ id: StudioTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`rounded-md py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id ? segmentActive : segmentIdle
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-3.5 sm:p-5">
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-h-[236px] sm:max-h-[210px] overflow-y-auto pr-0.5">
                  {presets.map((preset) => {
                    const isSelected = preset.id === activePresetId;
                    return (
                      <div key={preset.id} className="relative group">
                        <button
                          type="button"
                          onClick={() => onSelectPreset(preset)}
                          aria-pressed={isSelected}
                          className={`flex w-full items-center gap-2.5 sm:gap-3 rounded-lg border p-2 sm:p-2.5 text-left transition-colors cursor-pointer ${
                            isSelected
                              ? lightMode
                                ? 'border-neutral-950 bg-black/5'
                                : 'border-white/75 bg-white/10'
                              : lightMode
                                ? 'border-black/10 hover:border-black/30 hover:bg-black/3'
                                : 'border-white/10 hover:border-white/25 hover:bg-white/5'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-md border border-black/15"
                            style={{
                              background: `linear-gradient(135deg, ${preset.swatch[0]} 35%, ${preset.swatch[1]} 100%)`,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-semibold">{preset.name}</div>
                            <div className={`truncate text-[10px] sm:text-[11px] ${mutedText}`}>
                              {preset.subtitle}
                            </div>
                          </div>
                        </button>
                        {preset.isCustom && (
                          <button
                            type="button"
                            onClick={() => onDeleteCustomPreset(preset.id)}
                            aria-label={`カスタムプリセット「${preset.name}」を削除`}
                            className={`absolute top-1.5 right-1.5 rounded p-1 opacity-75 hover:opacity-100 cursor-pointer ${iconBtnClass}`}
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Preset footer actions */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 border-t pt-3 ${subtleDivider}`}
                >
                  {showSaveForm ? (
                    <form
                      onSubmit={handleSaveSubmit}
                      className="flex flex-1 items-center gap-2 max-w-md"
                    >
                      <label htmlFor="custom-preset-name" className="sr-only">
                        カスタムプリセット名
                      </label>
                      <input
                        id="custom-preset-name"
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="プリセット名を入力（例：深夜の書斎）"
                        maxLength={24}
                        autoFocus
                        className={`flex-1 rounded-lg border px-3 py-1.5 text-xs outline-none ${
                          lightMode
                            ? 'border-black/15 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900'
                            : 'border-white/15 bg-black/40 text-white placeholder:text-neutral-500 focus:border-white/60'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={!customName.trim()}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${primaryBtn}`}
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSaveForm(false)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap cursor-pointer ${mutedText} hover:underline`}
                      >
                        キャンセル
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSaveForm(true)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${secondaryBtn}`}
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>現在の設定をマイプリセットに保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={onReset}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${mutedText} hover:underline`}
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>初期化</span>
                      </button>
                    </div>
                  )}

                  <span className={`text-[11px] ${mutedText}`}>
                    ショートカット: H 表示切替 · Space 一時停止 · F 全画面
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'customize' && (
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
                        aria-selected={customizeGroup === grp.id}
                        onClick={() => setCustomizeGroup(grp.id)}
                        className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          customizeGroup === grp.id ? segmentActive : segmentIdle
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

                {customizeGroup === 'color' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="beam-color-input" className="text-xs font-medium">
                        光線カラー
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="beam-color-input"
                          type="color"
                          value={config.color}
                          onChange={(e) => onChangeConfig({ color: e.target.value })}
                          className="h-7 w-9 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                        />
                        <span className={`font-mono text-xs uppercase tabular-nums ${mutedText}`}>
                          {config.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="bg-color-input" className="text-xs font-medium">
                        背景カラー
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="bg-color-input"
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => onChangeConfig({ backgroundColor: e.target.value })}
                          className="h-7 w-9 cursor-pointer rounded border border-white/20 bg-transparent p-0.5"
                        />
                        <span className={`font-mono text-xs uppercase tabular-nums ${mutedText}`}>
                          {config.backgroundColor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium">ベース表現</span>
                      <div className={`inline-flex rounded-lg p-0.5 ${segmentTrack}`}>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeConfig({
                              lightMode: false,
                              backgroundColor: config.lightMode ? '#050507' : config.backgroundColor,
                              color: config.lightMode ? '#ffffff' : config.color,
                            })
                          }
                          aria-pressed={!config.lightMode}
                          className={`rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                            !config.lightMode ? segmentActive : segmentIdle
                          }`}
                        >
                          ダーク発光
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeConfig({
                              lightMode: true,
                              backgroundColor: !config.lightMode
                                ? '#f3f1ec'
                                : config.backgroundColor,
                              color: !config.lightMode ? '#2c303a' : config.color,
                            })
                          }
                          aria-pressed={config.lightMode}
                          className={`rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                            config.lightMode ? segmentActive : segmentIdle
                          }`}
                        >
                          ライト墨調
                        </button>
                      </div>
                    </div>

                    <SliderControl
                      id="slider-brightness"
                      label="明るさ"
                      value={config.brightness}
                      min={0.4}
                      max={3.0}
                      step={0.05}
                      displayValue={config.brightness.toFixed(2)}
                      onChange={(brightness) => onChangeConfig({ brightness })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-glow"
                      label="グロー強度"
                      value={config.glow}
                      min={0}
                      max={1.8}
                      step={0.05}
                      displayValue={config.glow.toFixed(2)}
                      onChange={(glow) => onChangeConfig({ glow })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-fill-light"
                      label="補助光"
                      value={config.fillLight}
                      min={0}
                      max={1.5}
                      step={0.05}
                      displayValue={config.fillLight.toFixed(2)}
                      onChange={(fillLight) => onChangeConfig({ fillLight })}
                      lightMode={lightMode}
                    />
                  </div>
                )}

                {customizeGroup === 'geometry' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <SliderControl
                      id="slider-beam-width"
                      label="ビーム幅"
                      value={config.beamWidth}
                      min={30}
                      max={320}
                      step={2}
                      displayValue={`${config.beamWidth}px`}
                      onChange={(beamWidth) => onChangeConfig({ beamWidth })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-rotation"
                      label="角度"
                      value={config.rotation}
                      min={-180}
                      max={180}
                      step={1}
                      displayValue={`${config.rotation}°`}
                      onChange={(rotation) => onChangeConfig({ rotation })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-wave-length"
                      label="波長"
                      value={config.waveLength}
                      min={60}
                      max={500}
                      step={5}
                      displayValue={`${config.waveLength}px`}
                      onChange={(waveLength) => onChangeConfig({ waveLength })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-depth"
                      label="立体感"
                      value={config.depth}
                      min={0}
                      max={2.5}
                      step={0.05}
                      displayValue={config.depth.toFixed(2)}
                      onChange={(depth) => onChangeConfig({ depth })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-twist"
                      label="ねじれ"
                      value={config.twist}
                      min={0}
                      max={2.0}
                      step={0.05}
                      displayValue={config.twist.toFixed(2)}
                      onChange={(twist) => onChangeConfig({ twist })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-speed"
                      label="アニメーション速度"
                      value={config.speed}
                      min={0}
                      max={3.0}
                      step={0.05}
                      displayValue={`${config.speed.toFixed(2)}x`}
                      onChange={(speed) => onChangeConfig({ speed })}
                      lightMode={lightMode}
                    />
                  </div>
                )}

                {customizeGroup === 'texture' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <SliderControl
                      id="slider-sharpness"
                      label="シャープネス"
                      value={config.sharpness}
                      min={0}
                      max={1}
                      step={0.02}
                      displayValue={config.sharpness.toFixed(2)}
                      onChange={(sharpness) => onChangeConfig({ sharpness })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-grain"
                      label="フィルム粒子"
                      value={config.grain}
                      min={0}
                      max={1}
                      step={0.02}
                      displayValue={config.grain.toFixed(2)}
                      onChange={(grain) => onChangeConfig({ grain })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-fade"
                      label="周辺フェード"
                      value={config.fade}
                      min={0}
                      max={0.6}
                      step={0.02}
                      displayValue={config.fade.toFixed(2)}
                      onChange={(fade) => onChangeConfig({ fade })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-variation"
                      label="パターンシード"
                      value={config.variation}
                      min={0}
                      max={100}
                      step={1}
                      displayValue={`#${config.variation}`}
                      onChange={(variation) => onChangeConfig({ variation })}
                      lightMode={lightMode}
                    />
                    <SliderControl
                      id="slider-mouse-strength"
                      label="カーソル反応強度"
                      value={config.mouseStrength}
                      min={0}
                      max={2}
                      step={0.05}
                      displayValue={config.mouseStrength.toFixed(2)}
                      onChange={(mouseStrength) => onChangeConfig({ mouseStrength })}
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
                        aria-checked={config.mouseInteraction}
                        onClick={() =>
                          onChangeConfig({ mouseInteraction: !config.mouseInteraction })
                        }
                        className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
                          config.mouseInteraction ? segmentActive : secondaryBtn
                        }`}
                      >
                        {config.mouseInteraction ? 'オン' : 'オフ'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold">デスクトップ時計オーバーレイ</div>
                    <div className={`inline-flex flex-wrap gap-1 rounded-lg p-1 ${segmentTrack}`}>
                      {(
                        [
                          { id: 'off', label: '非表示' },
                          { id: 'center', label: '中央' },
                          { id: 'top-left', label: '左上' },
                          { id: 'bottom-left', label: '左下' },
                        ] as Array<{ id: ClockPosition; label: string }>
                      ).map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          aria-pressed={clock.position === pos.id}
                          onClick={() => onChangeClock({ position: pos.id })}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            clock.position === pos.id ? segmentActive : segmentIdle
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={clock.use24Hour}
                          onChange={(e) => onChangeClock({ use24Hour: e.target.checked })}
                          className="h-3.5 w-3.5 accent-current cursor-pointer"
                        />
                        <span>24時間表記</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={clock.showSeconds}
                          onChange={(e) => onChangeClock({ showSeconds: e.target.checked })}
                          className="h-3.5 w-3.5 accent-current cursor-pointer"
                        />
                        <span>秒を表示</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={clock.showDate}
                          onChange={(e) => onChangeClock({ showDate: e.target.checked })}
                          className="h-3.5 w-3.5 accent-current cursor-pointer"
                        />
                        <span>日付を表示</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold">OSデスクトップ環境プレビュー</div>
                    <div className={`inline-flex flex-wrap gap-1 rounded-lg p-1 ${segmentTrack}`}>
                      {(
                        [
                          { id: 'none', label: 'なし' },
                          { id: 'windows', label: 'Windows 11' },
                          { id: 'macos', label: 'macOS' },
                        ] as Array<{ id: OsPreviewFrame; label: string }>
                      ).map((os) => (
                        <button
                          key={os.id}
                          type="button"
                          aria-pressed={clock.osFrame === os.id}
                          onClick={() => onChangeClock({ osFrame: os.id })}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            clock.osFrame === os.id ? segmentActive : segmentIdle
                          }`}
                        >
                          {os.label}
                        </button>
                      ))}
                    </div>
                    <p className={`text-[11px] leading-relaxed ${mutedText}`}>
                      タスクバーやDockを仮配置して、実際のPCデスクトップでの視認性を確認できます。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {RESOLUTION_OPTIONS.map((res) => {
                    const isSelected = selectedResolution.id === res.id;
                    return (
                      <button
                        key={res.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelectResolution(res)}
                        className={`rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${
                          isSelected
                            ? lightMode
                              ? 'border-neutral-950 bg-black/6'
                              : 'border-white/75 bg-white/12'
                            : lightMode
                              ? 'border-black/10 hover:border-black/30'
                              : 'border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="text-xs font-semibold whitespace-nowrap">{res.label}</div>
                        <div className={`mt-0.5 font-mono text-[11px] tabular-nums ${mutedText}`}>
                          {res.width}×{res.height}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  className={`flex flex-wrap items-center justify-between gap-3 border-t pt-3.5 ${subtleDivider}`}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className={`inline-flex rounded-lg p-0.5 ${segmentTrack}`}>
                      {(['png', 'jpeg'] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          aria-pressed={exportFormat === fmt}
                          onClick={() => onSelectExportFormat(fmt)}
                          className={`rounded-md px-3 py-1 text-xs font-medium uppercase whitespace-nowrap cursor-pointer ${
                            exportFormat === fmt ? segmentActive : segmentIdle
                          }`}
                        >
                          {fmt === 'png' ? 'PNG 無劣化' : 'JPEG 軽量'}
                        </button>
                      ))}
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bakeClock}
                        disabled={clock.position === 'off'}
                        onChange={(e) => onToggleBakeClock(e.target.checked)}
                        className="h-3.5 w-3.5 accent-current cursor-pointer disabled:opacity-40"
                      />
                      <span className={clock.position === 'off' ? 'opacity-45' : ''}>
                        時計を画像に含める
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onCopyShareUrl}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${secondaryBtn}`}
                    >
                      {copiedUrl ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{copiedUrl ? 'URLをコピーしました' : 'ライブ壁紙URLをコピー'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={exporting}
                      onClick={onExportWallpaper}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${primaryBtn}`}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {exporting
                          ? '書き出し中...'
                          : `${selectedResolution.width}×${selectedResolution.height} をダウンロード`}
                      </span>
                    </button>
                  </div>
                </div>

                {(exportStatus || exportError) && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`text-xs font-medium ${
                      exportError
                        ? lightMode
                          ? 'text-red-700'
                          : 'text-red-400'
                        : lightMode
                          ? 'text-emerald-800'
                          : 'text-emerald-300'
                    }`}
                  >
                    {exportError || exportStatus}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
