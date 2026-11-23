import { useState } from 'react';
import {
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  EyeOff,
  Lock,
  LockOpen,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import {
  type ClockConfig,
  type ClockPosition,
  type ClockSize,
  type ExportFormat,
  type OsPreviewFrame,
  RESOLUTION_OPTIONS,
  type ResolutionOption,
} from '../utils/wallpaperConfig';
import {
  type AllDesignConfigs,
  DESIGN_LIST,
  type DesignPresetItem,
  UI_UNLOCK_MODES,
  type UiUnlockMode,
  type WallpaperDesignId,
  getUiUnlockModeMeta,
  isLightModeForDesign,
  isPausedForDesign,
} from '../utils/wallpaperDesigns';
import { DesignCustomizePanel } from './DesignCustomizePanel';
import type { StudioTab } from './TopBar';

interface StudioDockProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  designId: WallpaperDesignId;
  onSelectDesign: (id: WallpaperDesignId) => void;
  configs: AllDesignConfigs;
  onPatchDesignConfig: <K extends WallpaperDesignId>(
    id: K,
    patch: Partial<AllDesignConfigs[K]>
  ) => void;
  onTogglePause: () => void;
  clock: ClockConfig;
  onChangeClock: (patch: Partial<ClockConfig>) => void;
  autoHideSeconds: number;
  onChangeAutoHideSeconds: (sec: number) => void;
  uiUnlockMode: UiUnlockMode;
  onChangeUiUnlockMode: (mode: UiUnlockMode) => void;
  onToggleQuickLock: () => void;
  presets: DesignPresetItem[];
  activePresetId: string;
  onSelectPreset: (preset: DesignPresetItem) => void;
  onSaveCustomPreset: (name: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  onRandomize: () => void;
  onReset: () => void;
  dockOpen: boolean;
  onToggleDock: () => void;
  uiHidden: boolean;
  onHideAllUi: () => void;
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
  onCopyLivelyUrl: () => void;
  copiedUrl: boolean;
}

export function StudioDock({
  activeTab,
  onSelectTab,
  designId,
  onSelectDesign,
  configs,
  onPatchDesignConfig,
  onTogglePause,
  clock,
  onChangeClock,
  autoHideSeconds,
  onChangeAutoHideSeconds,
  uiUnlockMode,
  onChangeUiUnlockMode,
  onToggleQuickLock,
  presets,
  activePresetId,
  onSelectPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onRandomize,
  onReset,
  dockOpen,
  onToggleDock,
  uiHidden,
  onHideAllUi,
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
  onCopyLivelyUrl,
  copiedUrl,
}: StudioDockProps) {
  const [customName, setCustomName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const lightMode = isLightModeForDesign(designId, configs);
  const paused = isPausedForDesign(designId, configs);
  const activeDesignMeta = DESIGN_LIST.find((d) => d.id === designId) ?? DESIGN_LIST[0];
  const activePreset = presets.find((p) => p.id === activePresetId);
  const activeUnlockMeta = getUiUnlockModeMeta(uiUnlockMode);
  const isUiLocked = uiUnlockMode === 'locked';

  const panelSurface = lightMode
    ? 'bg-[#F6F5F1]/92 border-black/12 text-neutral-900 shadow-lg shadow-black/5'
    : 'bg-[#0C0D10]/90 border-white/12 text-neutral-100 shadow-2xl shadow-black/50';

  const subtleDivider = lightMode ? 'border-black/10' : 'border-white/10';
  const mutedText = lightMode ? 'text-neutral-600' : 'text-neutral-400';

  const iconBtnClass = lightMode
    ? 'text-neutral-700 hover:bg-black/6 hover:text-neutral-950 focus-visible:outline-neutral-950'
    : 'text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-white';

  const segmentTrack = lightMode ? 'bg-black/6' : 'bg-white/8';
  const segmentActive = lightMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950';
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
      aria-hidden={uiHidden}
      className={`fixed bottom-16 sm:bottom-20 left-1/2 z-20 w-[min(940px,94vw)] -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        uiHidden ? 'translate-y-[170%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top dock handle bar */}
      <div className="mb-2 flex items-center justify-between gap-2.5 px-1">
        <button
          type="button"
          tabIndex={uiHidden ? -1 : 0}
          onClick={onToggleDock}
          aria-expanded={dockOpen}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${panelSurface}`}
        >
          {dockOpen ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{dockOpen ? 'ドックを畳む' : 'ドックを開く'}</span>
        </button>

        {/* High-contrast unboxed metadata summary over matching dock surface */}
        <div
          className={`hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${panelSurface}`}
        >
          <span className="font-display tracking-wide">{activeDesignMeta.label}</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span>{activePreset ? activePreset.name : 'カスタム構成'}</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span>{lightMode ? 'ライト' : 'ダーク'}</span>
        </div>

        {/* Compact quick actions */}
        <div className={`flex items-center gap-1 rounded-lg border p-1 ${panelSurface}`}>
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={onTogglePause}
            aria-label={paused ? 'アニメーションを再生' : 'アニメーションを一時停止'}
            title={paused ? '再生 (Space)' : '一時停止 (Space)'}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={() =>
              onChangeClock({ position: clock.position === 'off' ? 'center' : 'off' })
            }
            aria-pressed={clock.position !== 'off'}
            aria-label={clock.position === 'off' ? '時計を表示' : '時計を非表示'}
            title={clock.position === 'off' ? '時計を表示' : '時計を非表示'}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
              clock.position !== 'off' ? segmentActive : iconBtnClass
            }`}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={onRandomize}
            aria-label="壁紙デザインをランダム生成"
            title="ランダム生成 (R)"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
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
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={onToggleQuickLock}
            aria-pressed={isUiLocked}
            aria-label={isUiLocked ? 'UI完全ロックを解除' : '誤操作防止のためUIを完全ロック'}
            title={
              isUiLocked
                ? '完全ロック中（Ctrl+Shift+Uのみで開く）'
                : `誤操作防止ロック切替（現在: ${activeUnlockMeta.shortLabel}）`
            }
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${
              isUiLocked ? segmentActive : iconBtnClass
            }`}
          >
            {isUiLocked ? (
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <LockOpen className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={onHideAllUi}
            aria-label="すべてのUIを完全に隠す"
            title="完全非表示 (H)"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer ${iconBtnClass}`}
          >
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main collapsible dock panel */}
      {dockOpen && (
        <div
          className={`max-h-[calc(100dvh-12rem)] overflow-y-auto rounded-xl border transition-colors duration-200 ${panelSurface}`}
        >
          {/* Mobile-only clean 4-tab selector (desktop uses TopBar nav) */}
          <div
            role="tablist"
            aria-label="モバイルスタジオタブ"
            className={`grid grid-cols-4 border-b p-1.5 md:hidden ${subtleDivider}`}
          >
            {(
              [
                { id: 'presets', label: 'デザイン' },
                { id: 'customize', label: '詳細調整' },
                { id: 'display', label: '時計・表示' },
                { id: 'export', label: '書き出し' },
              ] as Array<{ id: StudioTab; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                tabIndex={uiHidden ? -1 : 0}
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
              <div className="space-y-3.5">
                {/* 13 React Bits Design Engine Selector */}
                <div
                  role="tablist"
                  aria-label="壁紙デザイン切替"
                  className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7"
                >
                  {DESIGN_LIST.map((design) => {
                    const selected = design.id === designId;
                    return (
                      <button
                        key={design.id}
                        type="button"
                        role="tab"
                        tabIndex={uiHidden ? -1 : 0}
                        aria-selected={selected}
                        onClick={() => onSelectDesign(design.id)}
                        className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                          selected
                            ? lightMode
                              ? 'border-neutral-950 bg-neutral-950 text-white'
                              : 'border-white bg-white text-neutral-950'
                            : lightMode
                              ? 'border-black/10 bg-black/3 text-neutral-700 hover:border-black/30 hover:text-neutral-950'
                              : 'border-white/10 bg-white/4 text-neutral-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 shrink-0 rounded-sm border border-black/15"
                          style={{
                            background: `linear-gradient(135deg, ${design.accentSwatch[0]} 25%, ${design.accentSwatch[1]} 100%)`,
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[11px] font-semibold leading-tight">
                            {design.label}
                          </span>
                          <span className="block truncate text-[10px] leading-tight opacity-70">
                            {design.jaLabel}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Curated + Custom Presets for Selected Design */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-h-[196px] overflow-y-auto pr-0.5">
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
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSaveForm(true)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${secondaryBtn}`}
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>マイプリセット保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={onReset}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${mutedText} hover:underline`}
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>初期化</span>
                      </button>
                    </div>
                  )}

                  <span className={`text-[11px] ${mutedText}`}>
                    再表示: {activeUnlockMeta.hintText} · H 非表示 · Space 一時停止
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'customize' && (
              <DesignCustomizePanel
                designId={designId}
                configs={configs}
                onPatchDesignConfig={onPatchDesignConfig}
                onReset={onReset}
                lightMode={lightMode}
              />
            )}

            {activeTab === 'display' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold">デスクトップ時計オーバーレイ</div>
                      <div className={`inline-flex gap-1 rounded-lg p-0.5 ${segmentTrack}`}>
                        {(
                          [
                            { id: 'sm', label: '小' },
                            { id: 'md', label: '中' },
                            { id: 'lg', label: '大' },
                          ] as Array<{ id: ClockSize; label: string }>
                        ).map((sz) => (
                          <button
                            key={sz.id}
                            type="button"
                            aria-pressed={clock.size === sz.id}
                            onClick={() => onChangeClock({ size: sz.id })}
                            className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                              clock.size === sz.id ? segmentActive : segmentIdle
                            }`}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={`inline-flex flex-wrap gap-1 rounded-lg p-1 ${segmentTrack}`}>
                      {(
                        [
                          { id: 'off', label: '非表示' },
                          { id: 'center', label: '中央' },
                          { id: 'top-left', label: '左上' },
                          { id: 'top-right', label: '右上' },
                          { id: 'bottom-left', label: '左下' },
                          { id: 'bottom-right', label: '右下' },
                        ] as Array<{ id: ClockPosition; label: string }>
                      ).map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          aria-pressed={clock.position === pos.id}
                          onClick={() => onChangeClock({ position: pos.id })}
                          className={`rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            clock.position === pos.id ? segmentActive : segmentIdle
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
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

                    <div className="pt-1 space-y-1.5">
                      <div className="text-xs font-semibold">OSタスクバー仮プレビュー</div>
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
                            className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                              clock.osFrame === os.id ? segmentActive : segmentIdle
                            }`}
                          >
                            {os.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lively Wallpaper Complete-Hide & Anti-Accidental-Open Guard Panel */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold">
                      Lively Wallpaper 完全非表示・誤操作防止
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs ${mutedText}`}>UIを開く操作</span>
                        <span className={`font-mono text-[10px] ${mutedText}`}>
                          非常時: Ctrl+Shift+U
                        </span>
                      </div>
                      <div className={`inline-flex flex-wrap gap-1 rounded-lg p-1 ${segmentTrack}`}>
                        {UI_UNLOCK_MODES.map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            aria-pressed={uiUnlockMode === mode.id}
                            onClick={() => onChangeUiUnlockMode(mode.id)}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                              uiUnlockMode === mode.id ? segmentActive : segmentIdle
                            }`}
                          >
                            {mode.shortLabel}
                          </button>
                        ))}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${mutedText}`}>
                        {activeUnlockMeta.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-xs ${mutedText}`}>無操作で自動非表示</span>
                      <div className={`inline-flex gap-1 rounded-lg p-1 ${segmentTrack}`}>
                        {[0, 3, 5, 10].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            aria-pressed={autoHideSeconds === sec}
                            onClick={() => onChangeAutoHideSeconds(sec)}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium tabular-nums whitespace-nowrap cursor-pointer ${
                              autoHideSeconds === sec ? segmentActive : segmentIdle
                            }`}
                          >
                            {sec === 0 ? 'オフ' : `${sec}秒`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={onHideAllUi}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer ${primaryBtn}`}
                      >
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>今すぐ完全非表示</span>
                      </button>
                      <button
                        type="button"
                        onClick={onCopyLivelyUrl}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap cursor-pointer ${secondaryBtn}`}
                      >
                        {copiedUrl ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{copiedUrl ? 'Lively用URLをコピー済' : 'Lively用URLをコピー'}</span>
                      </button>
                    </div>
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
                      onClick={onCopyLivelyUrl}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${secondaryBtn}`}
                    >
                      {copiedUrl ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>
                        {copiedUrl ? 'Lively用URLをコピーしました' : 'Lively Wallpaper用URLをコピー'}
                      </span>
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
