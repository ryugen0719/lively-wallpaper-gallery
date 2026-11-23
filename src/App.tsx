/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import Beams from './components/Beams';
import { DesktopOverlay } from './components/DesktopOverlay';
import { StudioDock } from './components/StudioDock';
import { TopBar, type StudioTab } from './components/TopBar';
import {
  type BeamsConfig,
  type ClockConfig,
  DEFAULT_BEAMS_CONFIG,
  DEFAULT_CLOCK_CONFIG,
  type ExportFormat,
  RESOLUTION_OPTIONS,
  type ResolutionOption,
  WALLPAPER_PRESETS,
  type WallpaperPreset,
  createRandomConfig,
  parseConfigFromQuery,
  sanitizeBeamsConfig,
  serializeConfigToQuery,
} from './utils/wallpaperConfig';
import { exportWallpaperFile } from './utils/wallpaperExporter';

const CUSTOM_PRESETS_STORAGE_KEY = 'kosen_custom_presets_v1';

function loadSavedCustomPresets(): WallpaperPreset[] {
  try {
    const raw = window.localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string')
      .map((item) => ({
        id: item.id,
        slug: item.slug || 'custom',
        name: item.name,
        subtitle: item.subtitle || 'マイプリセット',
        swatch:
          Array.isArray(item.swatch) && item.swatch.length === 2
            ? [String(item.swatch[0]), String(item.swatch[1])]
            : ['#050507', '#ffffff'],
        config: sanitizeBeamsConfig(item.config),
        isCustom: true,
      }));
  } catch {
    return [];
  }
}

export default function App() {
  const initialQuery = useMemo(() => parseConfigFromQuery(window.location.search), []);

  const [config, setConfig] = useState<BeamsConfig>(initialQuery.config);
  const [clock, setClock] = useState<ClockConfig>(initialQuery.clock);
  const [activeTab, setActiveTab] = useState<StudioTab>('presets');
  const [activePresetId, setActivePresetId] = useState<string>(
    initialQuery.hasCustomParams ? 'custom' : WALLPAPER_PRESETS[0].id
  );
  const [customPresets, setCustomPresets] = useState<WallpaperPreset[]>(() =>
    loadSavedCustomPresets()
  );

  const [dockOpen, setDockOpen] = useState<boolean>(!initialQuery.zen);
  const [zenMode, setZenMode] = useState<boolean>(initialQuery.zen);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>(
    RESOLUTION_OPTIONS[2] // 4K UHD default for PC wallpapers
  );
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [bakeClock, setBakeClock] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const beamsClockRef = useRef<number>(0);

  const allPresets = useMemo(
    () => [...WALLPAPER_PRESETS, ...customPresets],
    [customPresets]
  );

  // Persist custom presets to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [customPresets]);

  // Sync fullscreen document state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleChangeConfig = useCallback((patch: Partial<BeamsConfig>) => {
    setConfig((prev) => sanitizeBeamsConfig({ ...prev, ...patch }));
    setActivePresetId('custom');
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handleChangeClock = useCallback((patch: Partial<ClockConfig>) => {
    setClock((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSelectPreset = useCallback((preset: WallpaperPreset) => {
    setConfig({ ...preset.config });
    setActivePresetId(preset.id);
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handleSaveCustomPreset = useCallback(
    (name: string) => {
      const id = `custom-${Date.now()}`;
      const newPreset: WallpaperPreset = {
        id,
        slug: name,
        name,
        subtitle: config.lightMode ? 'マイプリセット · ライト' : 'マイプリセット · ダーク',
        swatch: [config.backgroundColor, config.color],
        config: { ...config },
        isCustom: true,
      };
      setCustomPresets((prev) => [newPreset, ...prev]);
      setActivePresetId(id);
    },
    [config]
  );

  const handleDeleteCustomPreset = useCallback((id: string) => {
    setCustomPresets((prev) => prev.filter((item) => item.id !== id));
    setActivePresetId((curr) => (curr === id ? 'custom' : curr));
  }, []);

  const handleRandomize = useCallback(() => {
    setConfig(createRandomConfig());
    setActivePresetId('custom');
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handleReset = useCallback(() => {
    setConfig({ ...DEFAULT_BEAMS_CONFIG });
    setClock({ ...DEFAULT_CLOCK_CONFIG });
    setActivePresetId(WALLPAPER_PRESETS[0].id);
    setExportStatus(null);
    setExportError(null);
  }, []);

  const handleSelectTab = useCallback((tab: StudioTab) => {
    setActiveTab(tab);
    setDockOpen(true);
    setZenMode(false);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: toggle Zen mode cleanly when fullscreen API is blocked by iframe permissions
      setZenMode((prev) => !prev);
    }
  }, []);

  const handleExportWallpaper = useCallback(async () => {
    setExporting(true);
    setExportError(null);
    setExportStatus(null);
    try {
      const activePreset = allPresets.find((p) => p.id === activePresetId);
      const result = await exportWallpaperFile({
        config,
        clock,
        bakeClock,
        clockTimeSeconds: beamsClockRef.current,
        width: selectedResolution.width,
        height: selectedResolution.height,
        format: exportFormat,
        presetSlug: activePreset?.slug ?? 'custom',
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
  }, [activePresetId, allPresets, bakeClock, clock, config, exportFormat, selectedResolution]);

  const handleQuickSaveAction = useCallback(() => {
    if (activeTab === 'export' && dockOpen && !zenMode) {
      void handleExportWallpaper();
    } else {
      setActiveTab('export');
      setDockOpen(true);
      setZenMode(false);
    }
  }, [activeTab, dockOpen, handleExportWallpaper, zenMode]);

  const handleCopyShareUrl = useCallback(async () => {
    const query = serializeConfigToQuery(config, clock, true);
    const url = `${window.location.origin}${window.location.pathname}${query}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      window.history.replaceState(null, '', query);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2200);
    }
  }, [clock, config]);

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
        setZenMode((prev) => !prev);
      } else if (key === ' ') {
        event.preventDefault();
        setConfig((prev) => ({ ...prev, paused: !prev.paused }));
      } else if (key === 'r') {
        event.preventDefault();
        handleRandomize();
      } else if (key === 'f') {
        event.preventDefault();
        void handleToggleFullscreen();
      } else if (key === 'escape' && zenMode) {
        setZenMode(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRandomize, handleToggleFullscreen, zenMode]);

  const zenButtonSurface = config.lightMode
    ? 'bg-[#F6F5F1]/90 border-black/14 text-neutral-900 hover:bg-white'
    : 'bg-[#0C0D10]/88 border-white/14 text-neutral-100 hover:bg-[#171920]';

  return (
    <main
      data-zen={zenMode ? 'true' : 'false'}
      data-theme={config.lightMode ? 'light' : 'dark'}
      data-preset={activePresetId}
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Full-bleed React Bits Beams WebGL2 Wallpaper Canvas */}
      <div
        data-testid="beams-viewport"
        className="fixed inset-0 h-full w-full"
        onDoubleClick={() => setZenMode((prev) => !prev)}
      >
        <Beams
          color={config.color}
          backgroundColor={config.backgroundColor}
          beamWidth={config.beamWidth}
          rotation={config.rotation}
          speed={config.speed}
          waveLength={config.waveLength}
          depth={config.depth}
          sharpness={config.sharpness}
          twist={config.twist}
          fillLight={config.fillLight}
          glow={config.glow}
          brightness={config.brightness}
          variation={config.variation}
          grain={config.grain}
          fade={config.fade}
          mouseInteraction={config.mouseInteraction}
          mouseStrength={config.mouseStrength}
          lightMode={config.lightMode}
          paused={config.paused}
          clockRef={beamsClockRef}
          className="h-full w-full"
        />
      </div>

      {/* Optional Desktop Clock & OS Taskbar Silhouette */}
      <DesktopOverlay
        clock={clock}
        lightMode={config.lightMode}
        zenMode={zenMode}
        dockOpen={dockOpen}
      />

      {/* Minimal 3-Zone Top Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onQuickSaveAction={handleQuickSaveAction}
        lightMode={config.lightMode}
        zenMode={zenMode}
      />

      {/* Unified Collapsible Bottom Studio Dock */}
      <StudioDock
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        config={config}
        onChangeConfig={handleChangeConfig}
        clock={clock}
        onChangeClock={handleChangeClock}
        presets={allPresets}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onSaveCustomPreset={handleSaveCustomPreset}
        onDeleteCustomPreset={handleDeleteCustomPreset}
        onRandomize={handleRandomize}
        onReset={handleReset}
        dockOpen={dockOpen}
        onToggleDock={() => setDockOpen((prev) => !prev)}
        zenMode={zenMode}
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
        onCopyShareUrl={handleCopyShareUrl}
        copiedUrl={copiedUrl}
      />

      {/* Discreet Zen-mode restore trigger (always reachable without obstructing wallpaper) */}
      {zenMode && (
        <button
          type="button"
          onClick={() => setZenMode(false)}
          className={`fixed right-5 bottom-5 z-30 inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium whitespace-nowrap opacity-65 hover:opacity-100 transition-opacity cursor-pointer ${zenButtonSurface}`}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>UIを表示 (H)</span>
        </button>
      )}
    </main>
  );
}
