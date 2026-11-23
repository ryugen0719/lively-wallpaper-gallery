/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { DesktopOverlay } from './components/DesktopOverlay';
import { StudioDock } from './components/StudioDock';
import { TopBar, type StudioTab } from './components/TopBar';
import { WallpaperCanvas } from './components/WallpaperCanvas';
import {
  type ClockConfig,
  DEFAULT_CLOCK_CONFIG,
  type ExportFormat,
  RESOLUTION_OPTIONS,
  type ResolutionOption,
  sanitizeBeamsConfig,
} from './utils/wallpaperConfig';
import {
  type AllDesignConfigs,
  DEFAULT_DESIGN_CONFIGS,
  DESIGN_PRESETS,
  type DesignPresetItem,
  type WallpaperDesignId,
  createRandomDesignConfig,
  getBackgroundColorForDesign,
  isLightModeForDesign,
  isValidDesignId,
  parseStudioUrlQuery,
  serializeStudioUrlQuery,
} from './utils/wallpaperDesigns';
import { exportWallpaperFile } from './utils/wallpaperExporter';

const CUSTOM_PRESETS_STORAGE_KEY = 'kosen_custom_presets_v2';
const ACTIVE_SESSION_STORAGE_KEY = 'kosen_session_v2';

interface SavedSession {
  designId: WallpaperDesignId;
  presetId: string;
  configs: AllDesignConfigs;
  clock: ClockConfig;
  autoHideSeconds: number;
}

function loadSavedSession(): SavedSession | null {
  try {
    const raw = window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !isValidDesignId(parsed.designId)) return null;
    return {
      designId: parsed.designId,
      presetId: typeof parsed.presetId === 'string' ? parsed.presetId : 'custom',
      configs: {
        beams: sanitizeBeamsConfig(parsed.configs?.beams),
        'pixel-snow': { ...DEFAULT_DESIGN_CONFIGS['pixel-snow'], ...parsed.configs?.['pixel-snow'] },
        'holo-mosaic': {
          ...DEFAULT_DESIGN_CONFIGS['holo-mosaic'],
          ...parsed.configs?.['holo-mosaic'],
        },
        aurora: { ...DEFAULT_DESIGN_CONFIGS.aurora, ...parsed.configs?.aurora },
        'gradient-ascii': {
          ...DEFAULT_DESIGN_CONFIGS['gradient-ascii'],
          ...parsed.configs?.['gradient-ascii'],
        },
        'letter-glitch': {
          ...DEFAULT_DESIGN_CONFIGS['letter-glitch'],
          ...parsed.configs?.['letter-glitch'],
        },
        grainient: { ...DEFAULT_DESIGN_CONFIGS.grainient, ...parsed.configs?.grainient },
      },
      clock: { ...DEFAULT_CLOCK_CONFIG, ...parsed.clock },
      autoHideSeconds: [0, 3, 5, 10].includes(Number(parsed.autoHideSeconds))
        ? Number(parsed.autoHideSeconds)
        : 0,
    };
  } catch {
    return null;
  }
}

function loadSavedCustomPresets(): DesignPresetItem[] {
  try {
    const raw = window.localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          isValidDesignId(item.designId)
      )
      .map((item) => ({
        id: item.id,
        designId: item.designId,
        slug: item.slug || 'custom',
        name: item.name,
        subtitle: item.subtitle || 'マイプリセット',
        swatch:
          Array.isArray(item.swatch) && item.swatch.length === 2
            ? [String(item.swatch[0]), String(item.swatch[1])]
            : ['#050507', '#ffffff'],
        lightMode: Boolean(item.lightMode),
        config:
          item.designId === 'beams'
            ? sanitizeBeamsConfig(item.config)
            : { ...DEFAULT_DESIGN_CONFIGS[item.designId as WallpaperDesignId], ...item.config },
        isCustom: true,
      }));
  } catch {
    return [];
  }
}

export default function App() {
  const initial = useMemo(() => {
    const query = parseStudioUrlQuery(window.location.search);
    if (query.hasParams) {
      return {
        designId: query.designId,
        presetId: query.presetId,
        configs: query.configs,
        clock: query.clock,
        uiHidden: query.uiHidden,
        autoHideSeconds: query.autoHideSeconds,
      };
    }
    const saved = loadSavedSession();
    if (saved) {
      return {
        ...saved,
        uiHidden: false,
      };
    }
    return {
      designId: 'beams' as WallpaperDesignId,
      presetId: DESIGN_PRESETS.beams[0].id,
      configs: DEFAULT_DESIGN_CONFIGS,
      clock: DEFAULT_CLOCK_CONFIG,
      uiHidden: false,
      autoHideSeconds: 0,
    };
  }, []);

  const [designId, setDesignId] = useState<WallpaperDesignId>(initial.designId);
  const [configs, setConfigs] = useState<AllDesignConfigs>(initial.configs);
  const [clock, setClock] = useState<ClockConfig>(initial.clock);
  const [activeTab, setActiveTab] = useState<StudioTab>('presets');
  const [activePresetId, setActivePresetId] = useState<string>(initial.presetId);
  const [customPresets, setCustomPresets] = useState<DesignPresetItem[]>(() =>
    loadSavedCustomPresets()
  );

  const [dockOpen, setDockOpen] = useState<boolean>(!initial.uiHidden);
  const [uiHidden, setUiHidden] = useState<boolean>(initial.uiHidden);
  const [autoHideSeconds, setAutoHideSeconds] = useState<number>(initial.autoHideSeconds);
  const [hideHintVisible, setHideHintVisible] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>(
    RESOLUTION_OPTIONS[2] // 4K UHD default
  );
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [bakeClock, setBakeClock] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const beamsClockRef = useRef<number>(0);
  const hideHintTimerRef = useRef<number>(0);

  const lightMode = isLightModeForDesign(designId, configs);
  const backgroundColor = getBackgroundColorForDesign(designId, configs);

  const activeDesignPresets = useMemo(
    () => [
      ...DESIGN_PRESETS[designId],
      ...customPresets.filter((p) => p.designId === designId),
    ],
    [customPresets, designId]
  );

  // Persist custom presets to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    } catch {
      // Ignore quota errors
    }
  }, [customPresets]);

  // Auto-persist active design & config so Lively Wallpaper restores user's chosen setup
  useEffect(() => {
    try {
      const payload: SavedSession = {
        designId,
        presetId: activePresetId,
        configs,
        clock,
        autoHideSeconds,
      };
      window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [activePresetId, autoHideSeconds, clock, configs, designId]);

  // Sync fullscreen document state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Optional auto-hide idle timer (ideal for Lively Wallpaper)
  useEffect(() => {
    if (autoHideSeconds <= 0 || uiHidden) return undefined;
    let timer = window.setTimeout(() => {
      setUiHidden(true);
    }, autoHideSeconds * 1000);

    const resetTimer = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setUiHidden(true);
      }, autoHideSeconds * 1000);
    };

    window.addEventListener('pointermove', resetTimer, { passive: true });
    window.addEventListener('pointerdown', resetTimer, { passive: true });
    window.addEventListener('keydown', resetTimer, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', resetTimer);
      window.removeEventListener('pointerdown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [autoHideSeconds, uiHidden]);

  const enterCompleteHide = useCallback((showBriefHint = true) => {
    setUiHidden(true);
    window.clearTimeout(hideHintTimerRef.current);
    if (showBriefHint) {
      setHideHintVisible(true);
      hideHintTimerRef.current = window.setTimeout(() => {
        setHideHintVisible(false);
      }, 2000);
    } else {
      setHideHintVisible(false);
    }
  }, []);

  const showUi = useCallback(() => {
    window.clearTimeout(hideHintTimerRef.current);
    setHideHintVisible(false);
    setUiHidden(false);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(hideHintTimerRef.current);
  }, []);

  const handleSelectDesign = useCallback((nextDesignId: WallpaperDesignId) => {
    setDesignId(nextDesignId);
    setActivePresetId(DESIGN_PRESETS[nextDesignId][0].id);
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handlePatchDesignConfig = useCallback(
    <K extends WallpaperDesignId>(id: K, patch: Partial<AllDesignConfigs[K]>) => {
      setConfigs((prev) => {
        const nextVal =
          id === 'beams'
            ? sanitizeBeamsConfig({ ...prev.beams, ...(patch as Partial<AllDesignConfigs['beams']>) })
            : { ...prev[id], ...patch };
        return { ...prev, [id]: nextVal };
      });
      setActivePresetId('custom');
      setExportStatus(null);
      setExportError(null);
    },
    []
  );

  const handleTogglePause = useCallback(() => {
    setConfigs((prev) => {
      if (designId === 'beams') {
        return { ...prev, beams: { ...prev.beams, paused: !prev.beams.paused } };
      }
      if (designId === 'pixel-snow') {
        return {
          ...prev,
          'pixel-snow': { ...prev['pixel-snow'], paused: !prev['pixel-snow'].paused },
        };
      }
      if (designId === 'holo-mosaic') {
        return {
          ...prev,
          'holo-mosaic': { ...prev['holo-mosaic'], paused: !prev['holo-mosaic'].paused },
        };
      }
      if (designId === 'aurora') {
        return { ...prev, aurora: { ...prev.aurora, paused: !prev.aurora.paused } };
      }
      const currSpeed = prev[designId].speed;
      const nextSpeed = currSpeed === 0 ? DEFAULT_DESIGN_CONFIGS[designId].speed : 0;
      return { ...prev, [designId]: { ...prev[designId], speed: nextSpeed } };
    });
  }, [designId]);

  const handleChangeClock = useCallback((patch: Partial<ClockConfig>) => {
    setClock((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSelectPreset = useCallback((preset: DesignPresetItem) => {
    setDesignId(preset.designId);
    setConfigs((prev) => ({
      ...prev,
      [preset.designId]: { ...preset.config },
    }));
    setActivePresetId(preset.id);
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handleSaveCustomPreset = useCallback(
    (name: string) => {
      const id = `custom-${Date.now()}`;
      const currentCfg = configs[designId];
      const fgColor =
        designId === 'beams'
          ? configs.beams.color
          : designId === 'pixel-snow'
            ? configs['pixel-snow'].color
            : designId === 'holo-mosaic'
              ? configs['holo-mosaic'].metalColor
              : designId === 'aurora'
                ? configs.aurora.colorStops[1]
                : designId === 'gradient-ascii'
                  ? configs['gradient-ascii'].colors[3]
                  : designId === 'letter-glitch'
                    ? configs['letter-glitch'].glitchColors[1]
                    : configs.grainient.colors[3];

      const newPreset: DesignPresetItem = {
        id,
        designId,
        slug: name,
        name,
        subtitle: lightMode ? 'マイプリセット · ライト' : 'マイプリセット · ダーク',
        swatch: [backgroundColor, fgColor],
        lightMode,
        config: { ...currentCfg },
        isCustom: true,
      };
      setCustomPresets((prev) => [newPreset, ...prev]);
      setActivePresetId(id);
    },
    [backgroundColor, configs, designId, lightMode]
  );

  const handleDeleteCustomPreset = useCallback((id: string) => {
    setCustomPresets((prev) => prev.filter((item) => item.id !== id));
    setActivePresetId((curr) => (curr === id ? 'custom' : curr));
  }, []);

  const handleRandomize = useCallback(() => {
    const nextCfg = createRandomDesignConfig(designId);
    setConfigs((prev) => ({ ...prev, [designId]: nextCfg }));
    setActivePresetId('custom');
    setExportStatus(null);
    setExportError(null);
  }, [designId]);

  const handleReset = useCallback(() => {
    setConfigs((prev) => ({
      ...prev,
      [designId]: { ...DEFAULT_DESIGN_CONFIGS[designId] },
    }));
    setActivePresetId(DESIGN_PRESETS[designId][0].id);
    setExportStatus(null);
    setExportError(null);
  }, [designId]);

  const handleSelectTab = useCallback((tab: StudioTab) => {
    setActiveTab(tab);
    setDockOpen(true);
    setUiHidden(false);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      enterCompleteHide(true);
    }
  }, [enterCompleteHide]);

  const handleExportWallpaper = useCallback(async () => {
    setExporting(true);
    setExportError(null);
    setExportStatus(null);
    try {
      const activePreset = activeDesignPresets.find((p) => p.id === activePresetId);
      const sourceCanvas = viewportRef.current?.querySelector('canvas') ?? null;
      const result = await exportWallpaperFile({
        designId,
        beamsConfig: configs.beams,
        backgroundColor,
        lightMode,
        sourceCanvas,
        clock,
        bakeClock,
        clockTimeSeconds: beamsClockRef.current,
        width: selectedResolution.width,
        height: selectedResolution.height,
        format: exportFormat,
        presetSlug: activePreset?.slug ?? designId,
      });
      const sizeKb = Math.max(1, Math.round(result.sizeBytes / 1024));
      const sizeLabel = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb} KB`;
      setExportStatus(
        `${result.width} × ${result.height} (${exportFormat.toUpperCase()}) を書き出しました · ${sizeLabel}`
      );
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : '壁紙の書き出し中にエラーが発生しました。'
      );
    } finally {
      setExporting(false);
    }
  }, [
    activeDesignPresets,
    activePresetId,
    backgroundColor,
    bakeClock,
    clock,
    configs.beams,
    designId,
    exportFormat,
    lightMode,
    selectedResolution,
  ]);

  const handleCopyLivelyUrl = useCallback(async () => {
    const query = serializeStudioUrlQuery({
      designId,
      presetId: activePresetId,
      config: configs[designId],
      clock,
      lively: true,
      autoHideSeconds,
    });
    const url = `${window.location.origin}${window.location.pathname}${query}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2400);
    } catch {
      window.history.replaceState(null, '', query);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2400);
    }
  }, [activePresetId, autoHideSeconds, clock, configs, designId]);

  // Global keyboard shortcuts (disabled when typing inside inputs)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === 'h') {
        event.preventDefault();
        if (uiHidden) showUi();
        else enterCompleteHide(true);
      } else if (key === 'escape') {
        event.preventDefault();
        if (uiHidden) showUi();
        else enterCompleteHide(true);
      } else if (key === ' ') {
        event.preventDefault();
        handleTogglePause();
      } else if (key === 'r') {
        event.preventDefault();
        handleRandomize();
      } else if (key === 'f') {
        event.preventDefault();
        void handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enterCompleteHide, handleRandomize, handleToggleFullscreen, handleTogglePause, showUi, uiHidden]);

  const cornerRevealSurface = lightMode
    ? 'bg-[#F6F5F1]/92 border-black/14 text-neutral-900 hover:bg-white'
    : 'bg-[#0C0D10]/90 border-white/14 text-neutral-100 hover:bg-[#171920]';

  return (
    <main
      data-zen={uiHidden ? 'true' : 'false'}
      data-ui-hidden={uiHidden ? 'true' : 'false'}
      data-design={designId}
      data-theme={lightMode ? 'light' : 'dark'}
      data-preset={activePresetId}
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor }}
    >
      {/* Full-bleed React Bits WebGL2 Wallpaper Canvas (7 switchable designs) */}
      <div
        ref={viewportRef}
        data-testid="wallpaper-viewport"
        className="fixed inset-0 h-full w-full"
        onDoubleClick={() => {
          if (uiHidden) showUi();
          else enterCompleteHide(true);
        }}
      >
        <WallpaperCanvas
          designId={designId}
          configs={configs}
          beamsClockRef={beamsClockRef}
        />
      </div>

      {/* Optional Desktop Clock & OS Taskbar Silhouette */}
      <DesktopOverlay
        clock={clock}
        lightMode={lightMode}
        zenMode={uiHidden}
        dockOpen={dockOpen}
      />

      {/* Minimal 3-Zone Top Bar (completely hidden in Lively / Complete Hide mode) */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onHideAllUi={() => enterCompleteHide(true)}
        lightMode={lightMode}
        uiHidden={uiHidden}
      />

      {/* Unified Collapsible Bottom Studio Dock */}
      <StudioDock
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        designId={designId}
        onSelectDesign={handleSelectDesign}
        configs={configs}
        onPatchDesignConfig={handlePatchDesignConfig}
        onTogglePause={handleTogglePause}
        clock={clock}
        onChangeClock={handleChangeClock}
        autoHideSeconds={autoHideSeconds}
        onChangeAutoHideSeconds={setAutoHideSeconds}
        presets={activeDesignPresets}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onSaveCustomPreset={handleSaveCustomPreset}
        onDeleteCustomPreset={handleDeleteCustomPreset}
        onRandomize={handleRandomize}
        onReset={handleReset}
        dockOpen={dockOpen}
        onToggleDock={() => setDockOpen((prev) => !prev)}
        uiHidden={uiHidden}
        onHideAllUi={() => enterCompleteHide(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        selectedResolution={selectedResolution}
        onSelectResolution={setSelectedResolution}
        exportFormat={exportFormat}
        onSelectExportFormat={setExportFormat}
        bakeClock={bakeClock}
        onToggleBakeClock={setBakeClock}
        exporting={exporting}
        exportStatus={exportStatus}
        exportError={exportError}
        onExportWallpaper={handleExportWallpaper}
        onCopyLivelyUrl={handleCopyLivelyUrl}
        copiedUrl={copiedUrl}
      />

      {/* Brief self-dismissing hint when manually entering Complete Hide (never shown on ?lively=1 load) */}
      {uiHidden && hideHintVisible && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-lg border px-4 py-2 text-xs font-medium whitespace-nowrap ${cornerRevealSurface}`}
        >
          完全非表示にしました — ダブルクリック または H キーでUIを再表示
        </div>
      )}

      {/* Truly 0%-opacity invisible corner hotzone in Complete Hide mode (0 pixels visible at rest for Lively Wallpaper) */}
      {uiHidden && (
        <div className="group fixed right-0 bottom-0 z-30 flex h-20 w-44 items-end justify-end p-4">
          <button
            type="button"
            onClick={showUi}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 cursor-pointer ${cornerRevealSurface}`}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>UIを表示 (H)</span>
          </button>
        </div>
      )}
    </main>
  );
}
