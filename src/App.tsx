/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  isValidClockStyle,
  sanitizeBeamsConfig,
} from './utils/wallpaperConfig';
import {
  type AllDesignConfigs,
  DEFAULT_DESIGN_CONFIGS,
  DEFAULT_UI_UNLOCK_MODE,
  DESIGN_PRESETS,
  type DesignPresetItem,
  type UiUnlockMode,
  type WallpaperDesignId,
  createRandomDesignConfig,
  getBackgroundColorForDesign,
  getUiUnlockModeMeta,
  isLightModeForDesign,
  isValidDesignId,
  isValidUiUnlockMode,
  parseStudioUrlQuery,
  serializeStudioUrlQuery,
} from './utils/wallpaperDesigns';
import { exportWallpaperFile } from './utils/wallpaperExporter';

const CUSTOM_PRESETS_STORAGE_KEY = 'kosen_custom_presets_v2';
const ACTIVE_SESSION_STORAGE_KEY = 'kosen_session_v2';

const LONG_PRESS_REVEAL_DELAY_MS = 350;
const LONG_PRESS_DURATION_MS = 1200;
const CORNER_ZONE_PX = 96;

interface SavedSession {
  designId: WallpaperDesignId;
  presetId: string;
  configs: AllDesignConfigs;
  clock: ClockConfig;
  autoHideSeconds: number;
  uiUnlockMode: UiUnlockMode;
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
        'crystalized-ball': {
          ...DEFAULT_DESIGN_CONFIGS['crystalized-ball'],
          ...parsed.configs?.['crystalized-ball'],
        },
        scanner: { ...DEFAULT_DESIGN_CONFIGS.scanner, ...parsed.configs?.scanner },
        topography: { ...DEFAULT_DESIGN_CONFIGS.topography, ...parsed.configs?.topography },
        'cursor-grid': {
          ...DEFAULT_DESIGN_CONFIGS['cursor-grid'],
          ...parsed.configs?.['cursor-grid'],
        },
        'side-rays': { ...DEFAULT_DESIGN_CONFIGS['side-rays'], ...parsed.configs?.['side-rays'] },
        'soft-aurora': {
          ...DEFAULT_DESIGN_CONFIGS['soft-aurora'],
          ...parsed.configs?.['soft-aurora'],
        },
      },
      clock: {
        ...DEFAULT_CLOCK_CONFIG,
        ...parsed.clock,
        style: isValidClockStyle(parsed.clock?.style)
          ? parsed.clock.style
          : DEFAULT_CLOCK_CONFIG.style,
      },
      autoHideSeconds: [0, 3, 5, 10].includes(Number(parsed.autoHideSeconds))
        ? Number(parsed.autoHideSeconds)
        : 0,
      uiUnlockMode: isValidUiUnlockMode(parsed.uiUnlockMode)
        ? parsed.uiUnlockMode
        : DEFAULT_UI_UNLOCK_MODE,
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
        uiUnlockMode: query.uiUnlockMode,
      };
    }
    const saved = loadSavedSession();
    if (saved) {
      return {
        ...saved,
        uiHidden: true,
      };
    }
    return {
      designId: 'beams' as WallpaperDesignId,
      presetId: DESIGN_PRESETS.beams[0].id,
      configs: DEFAULT_DESIGN_CONFIGS,
      clock: DEFAULT_CLOCK_CONFIG,
      uiHidden: true,
      autoHideSeconds: 0,
      uiUnlockMode: DEFAULT_UI_UNLOCK_MODE,
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

  const [dockOpen, setDockOpen] = useState<boolean>(true);
  const [uiHidden, setUiHidden] = useState<boolean>(initial.uiHidden);
  const [autoHideSeconds, setAutoHideSeconds] = useState<number>(initial.autoHideSeconds);
  const [uiUnlockMode, setUiUnlockMode] = useState<UiUnlockMode>(initial.uiUnlockMode);
  const [hideHintVisible, setHideHintVisible] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [holdIndicator, setHoldIndicator] = useState<{
    x: number;
    y: number;
    progress: number;
  } | null>(null);

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
  const lastNonLockedModeRef = useRef<UiUnlockMode>(
    initial.uiUnlockMode === 'locked' ? DEFAULT_UI_UNLOCK_MODE : initial.uiUnlockMode
  );
  const pointerDownRef = useRef<{
    active: boolean;
    pointerId: number;
    x: number;
    y: number;
    time: number;
    moved: boolean;
  }>({ active: false, pointerId: -1, x: 0, y: 0, time: 0, moved: false });
  const tapStreakRef = useRef<{ count: number; lastTime: number; x: number; y: number }>({
    count: 0,
    lastTime: 0,
    x: 0,
    y: 0,
  });
  const holdRafRef = useRef<number>(0);

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
        uiUnlockMode,
      };
      window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [activePresetId, autoHideSeconds, clock, configs, designId, uiUnlockMode]);

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

  const cancelHoldGesture = useCallback(() => {
    if (holdRafRef.current) {
      window.cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = 0;
    }
    pointerDownRef.current.active = false;
    setHoldIndicator(null);
  }, []);

  const enterCompleteHide = useCallback(
    (showBriefHint = true) => {
      cancelHoldGesture();
      tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
      setUiHidden(true);
      window.clearTimeout(hideHintTimerRef.current);
      if (showBriefHint) {
        setHideHintVisible(true);
        hideHintTimerRef.current = window.setTimeout(() => {
          setHideHintVisible(false);
        }, 2600);
      } else {
        setHideHintVisible(false);
      }
    },
    [cancelHoldGesture]
  );

  const showUi = useCallback(() => {
    cancelHoldGesture();
    tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
    window.clearTimeout(hideHintTimerRef.current);
    setHideHintVisible(false);
    setUiHidden(false);
    setDockOpen(true);
  }, [cancelHoldGesture]);

  const handleChangeUiUnlockMode = useCallback(
    (nextMode: UiUnlockMode) => {
      cancelHoldGesture();
      tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
      if (nextMode !== 'locked') {
        lastNonLockedModeRef.current = nextMode;
      }
      setUiUnlockMode(nextMode);
    },
    [cancelHoldGesture]
  );

  const handleToggleQuickLock = useCallback(() => {
    setUiUnlockMode((prev) => {
      if (prev === 'locked') {
        return lastNonLockedModeRef.current;
      }
      lastNonLockedModeRef.current = prev;
      return 'locked';
    });
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(hideHintTimerRef.current);
      if (holdRafRef.current) {
        window.cancelAnimationFrame(holdRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!uiHidden) {
      cancelHoldGesture();
    }
  }, [cancelHoldGesture, uiHidden]);

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
      if (designId === 'crystalized-ball') {
        return {
          ...prev,
          'crystalized-ball': {
            ...prev['crystalized-ball'],
            paused: !prev['crystalized-ball'].paused,
          },
        };
      }
      if (designId === 'cursor-grid') {
        const currAmbient = prev['cursor-grid'].ambient;
        return {
          ...prev,
          'cursor-grid': {
            ...prev['cursor-grid'],
            ambient: currAmbient === 0 ? DEFAULT_DESIGN_CONFIGS['cursor-grid'].ambient : 0,
          },
        };
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
                    : designId === 'grainient'
                      ? configs.grainient.colors[3]
                      : designId === 'crystalized-ball'
                        ? configs['crystalized-ball'].color
                        : designId === 'scanner'
                          ? configs.scanner.color2
                          : designId === 'topography'
                            ? configs.topography.color
                            : designId === 'cursor-grid'
                              ? configs['cursor-grid'].color
                              : designId === 'side-rays'
                                ? configs['side-rays'].rayColor1
                                : configs['soft-aurora'].color2;

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
      uiUnlockMode,
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
  }, [activePresetId, autoHideSeconds, clock, configs, designId, uiUnlockMode]);

  // Global keyboard shortcuts (single-key triggers are disabled while UI is hidden to prevent accidental opening)
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

      const key = event.key.toLowerCase();

      // Safe modifier shortcut: Ctrl+Shift+U (or Cmd+Shift+U) always toggles UI even in locked mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && !event.altKey && key === 'u') {
        event.preventDefault();
        if (uiHidden) showUi();
        else enterCompleteHide(true);
        return;
      }

      // When UI is hidden, ignore all single-key shortcuts to prevent accidental triggers
      if (uiHidden) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (key === 'h' || key === 'escape') {
        event.preventDefault();
        enterCompleteHide(true);
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

  const handleViewportPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!uiHidden || uiUnlockMode === 'locked') return;
      if (!e.isPrimary) {
        cancelHoldGesture();
        return;
      }
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const startTime = performance.now();
      const startX = e.clientX;
      const startY = e.clientY;
      pointerDownRef.current = {
        active: true,
        pointerId: e.pointerId,
        x: startX,
        y: startY,
        time: startTime,
        moved: false,
      };

      if (uiUnlockMode === 'long-press') {
        if (holdRafRef.current) {
          window.cancelAnimationFrame(holdRafRef.current);
          holdRafRef.current = 0;
        }
        const tick = (now: number) => {
          if (!pointerDownRef.current.active || pointerDownRef.current.moved) {
            setHoldIndicator(null);
            holdRafRef.current = 0;
            return;
          }
          const elapsed = now - startTime;
          if (elapsed >= LONG_PRESS_DURATION_MS) {
            holdRafRef.current = 0;
            setHoldIndicator(null);
            pointerDownRef.current.active = false;
            showUi();
            return;
          }
          if (elapsed >= LONG_PRESS_REVEAL_DELAY_MS) {
            const progress = Math.min(
              1,
              (elapsed - LONG_PRESS_REVEAL_DELAY_MS) /
                (LONG_PRESS_DURATION_MS - LONG_PRESS_REVEAL_DELAY_MS)
            );
            setHoldIndicator({ x: startX, y: startY, progress });
          }
          holdRafRef.current = window.requestAnimationFrame(tick);
        };
        holdRafRef.current = window.requestAnimationFrame(tick);
      }
    },
    [cancelHoldGesture, showUi, uiHidden, uiUnlockMode]
  );

  const handleViewportPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const down = pointerDownRef.current;
      if (!down.active || down.pointerId !== e.pointerId) return;
      const drift = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const maxDrift = uiUnlockMode === 'long-press' ? 12 : 14;
      if (drift > maxDrift) {
        down.moved = true;
        if (uiUnlockMode === 'long-press') {
          cancelHoldGesture();
        }
      }
    },
    [cancelHoldGesture, uiUnlockMode]
  );

  const handleViewportPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const down = pointerDownRef.current;
      const wasActive = down.active && down.pointerId === e.pointerId;
      const wasMoved = down.moved;
      const pressDuration = performance.now() - down.time;
      const endDrift = Math.hypot(e.clientX - down.x, e.clientY - down.y);

      cancelHoldGesture();

      if (!uiHidden || uiUnlockMode === 'locked' || uiUnlockMode === 'long-press') return;
      if (!wasActive || wasMoved || endDrift > 14 || pressDuration > 450) {
        tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
        return;
      }

      if (uiUnlockMode === 'corner-double') {
        const inTopRightCorner =
          e.clientX >= window.innerWidth - CORNER_ZONE_PX && e.clientY <= CORNER_ZONE_PX;
        if (!inTopRightCorner) {
          tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
          return;
        }
      }

      const now = Date.now();
      const prev = tapStreakRef.current;
      const maxInterval = uiUnlockMode === 'corner-double' ? 360 : 380;
      const requiredTaps = uiUnlockMode === 'corner-double' ? 2 : 3;
      const distFromPrev = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);

      if (prev.count > 0 && now - prev.lastTime <= maxInterval && distFromPrev <= 32) {
        const nextCount = prev.count + 1;
        if (nextCount >= requiredTaps) {
          tapStreakRef.current = { count: 0, lastTime: 0, x: 0, y: 0 };
          showUi();
        } else {
          tapStreakRef.current = { count: nextCount, lastTime: now, x: e.clientX, y: e.clientY };
        }
      } else {
        tapStreakRef.current = { count: 1, lastTime: now, x: e.clientX, y: e.clientY };
      }
    },
    [cancelHoldGesture, showUi, uiHidden, uiUnlockMode]
  );

  const unlockMeta = getUiUnlockModeMeta(uiUnlockMode);

  const hintSurface = lightMode
    ? 'bg-[#F6F5F1]/92 border-black/14 text-neutral-900'
    : 'bg-[#0C0D10]/90 border-white/14 text-neutral-100';

  const holdRingCircumference = 2 * Math.PI * 16;

  return (
    <main
      data-zen={uiHidden ? 'true' : 'false'}
      data-ui-hidden={uiHidden ? 'true' : 'false'}
      data-unlock-mode={uiUnlockMode}
      data-design={designId}
      data-theme={lightMode ? 'light' : 'dark'}
      data-preset={activePresetId}
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{ backgroundColor }}
    >
      {/* Full-bleed React Bits WebGL2 Wallpaper Canvas (13 switchable designs) */}
      <div
        ref={viewportRef}
        data-testid="wallpaper-viewport"
        className="fixed inset-0 h-full w-full touch-manipulation"
        onPointerDown={handleViewportPointerDown}
        onPointerMove={handleViewportPointerMove}
        onPointerUp={handleViewportPointerUp}
        onPointerCancel={cancelHoldGesture}
        onPointerLeave={cancelHoldGesture}
      >
        <WallpaperCanvas
          designId={designId}
          configs={configs}
          beamsClockRef={beamsClockRef}
        />
      </div>

      {/* Subtle long-press progress ring (only rendered after 350ms of stationary hold in long-press mode) */}
      {uiHidden && holdIndicator && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: holdIndicator.x, top: holdIndicator.y }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={lightMode ? 'rgba(15,17,21,0.18)' : 'rgba(255,255,255,0.22)'}
              strokeWidth="2.5"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={lightMode ? '#0f1115' : '#ffffff'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={holdRingCircumference}
              strokeDashoffset={holdRingCircumference * (1 - holdIndicator.progress)}
            />
          </svg>
        </div>
      )}

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
        uiUnlockMode={uiUnlockMode}
        onChangeUiUnlockMode={handleChangeUiUnlockMode}
        onToggleQuickLock={handleToggleQuickLock}
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

      {/* Brief self-dismissing hint when manually entering Complete Hide (never shown on initial load) */}
      {uiHidden && hideHintVisible && (
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed bottom-20 sm:bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-lg border px-4 py-2 text-xs font-medium whitespace-nowrap ${hintSurface}`}
        >
          完全非表示にしました — {unlockMeta.hintText} でUIを再表示
        </div>
      )}
    </main>
  );
}
