import { useEffect, useState } from 'react';
import { type ClockConfig, formatJapaneseClock } from '../utils/wallpaperConfig';

interface DesktopOverlayProps {
  clock: ClockConfig;
  lightMode: boolean;
  zenMode: boolean;
  dockOpen: boolean;
}

export function DesktopOverlay({ clock, lightMode, zenMode, dockOpen }: DesktopOverlayProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (clock.position === 'off' && clock.osFrame === 'none') return;
    setNow(new Date());
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(interval);
  }, [clock.position, clock.osFrame]);

  const { timeText, periodText, dateText } = formatJapaneseClock(
    now,
    clock.use24Hour,
    clock.showSeconds
  );

  const primaryTextColor = lightMode ? 'text-neutral-950/90' : 'text-white/95';
  const secondaryTextColor = lightMode ? 'text-neutral-800/70' : 'text-white/70';

  const positionClass =
    clock.position === 'center'
      ? `inset-0 flex flex-col items-center justify-center text-center px-6 ${
          !zenMode && dockOpen ? 'pb-72 sm:pb-60' : 'pb-0'
        }`
      : clock.position === 'top-left'
        ? `${zenMode ? 'top-10' : 'top-20 sm:top-24'} left-6 sm:left-14 flex flex-col items-start text-left`
        : clock.position === 'top-right'
          ? `${zenMode ? 'top-10' : 'top-20 sm:top-24'} right-6 sm:right-14 flex flex-col items-end text-right`
          : clock.position === 'bottom-right'
            ? `${zenMode ? 'bottom-12' : dockOpen ? 'bottom-84 sm:bottom-76' : 'bottom-20'} right-6 sm:right-14 flex flex-col items-end text-right`
            : `${zenMode ? 'bottom-12' : dockOpen ? 'bottom-84 sm:bottom-76' : 'bottom-20'} left-6 sm:left-14 flex flex-col items-start text-left`;

  const clockFontSize =
    clock.position === 'center'
      ? clock.size === 'sm'
        ? 'clamp(3rem, 7.5vw, 5.75rem)'
        : clock.size === 'lg'
          ? 'clamp(4.75rem, 13.5vw, 10.5rem)'
          : 'clamp(4rem, 10.5vw, 8.25rem)'
      : clock.size === 'sm'
        ? 'clamp(2.25rem, 4.5vw, 3.6rem)'
        : clock.size === 'lg'
          ? 'clamp(3.6rem, 8vw, 6.5rem)'
          : 'clamp(2.85rem, 6vw, 4.85rem)';

  const dateSizeClass =
    clock.size === 'sm'
      ? 'text-xs sm:text-sm'
      : clock.size === 'lg'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  return (
    <>
      {clock.position !== 'off' && (
        <div
          data-testid="desktop-clock"
          data-clock-position={clock.position}
          data-clock-size={clock.size}
          aria-live="off"
          className={`pointer-events-none fixed z-10 select-none transition-all duration-300 ${positionClass}`}
        >
          <div
            className={`font-display font-light tracking-[-0.03em] tabular-nums leading-none ${primaryTextColor}`}
            style={{
              fontSize: clockFontSize,
              textShadow: lightMode
                ? '0 2px 24px rgba(255,255,255,0.45)'
                : '0 4px 32px rgba(0,0,0,0.45)',
            }}
          >
            <span>{timeText}</span>
            {periodText && (
              <span className="ml-3 text-[0.28em] font-medium tracking-[0.14em] opacity-75">
                {periodText}
              </span>
            )}
          </div>
          {clock.showDate && (
            <p
              className={`mt-3 font-medium tracking-[0.06em] ${dateSizeClass} ${secondaryTextColor}`}
              style={{
                textShadow: lightMode
                  ? '0 1px 12px rgba(255,255,255,0.45)'
                  : '0 2px 16px rgba(0,0,0,0.45)',
              }}
            >
              {dateText}
            </p>
          )}
        </div>
      )}

      {/* Optional OS desktop silhouette preview (Windows 11 taskbar or macOS menu + dock) */}
      {clock.osFrame === 'windows' && (
        <div
          data-testid="os-frame-windows"
          aria-hidden="true"
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-10 flex h-11 items-center justify-between border-t px-4 ${
            lightMode
              ? 'bg-[#F3F4F6]/90 border-black/10 text-neutral-800'
              : 'bg-[#121316]/90 border-white/10 text-neutral-200'
          }`}
        >
          <div className="w-24 text-[11px] opacity-65 font-mono tabular-nums">18°C 晴れ</div>
          <div className="flex items-center gap-2.5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <span
                key={idx}
                className={`h-6 w-6 rounded-md ${
                  idx === 0
                    ? 'bg-sky-500/85'
                    : lightMode
                      ? 'bg-neutral-900/15'
                      : 'bg-white/18'
                }`}
              />
            ))}
          </div>
          <div className="w-24 text-right text-[11px] leading-tight font-mono tabular-nums opacity-80">
            <div>{timeText}</div>
          </div>
        </div>
      )}

      {clock.osFrame === 'macos' && (
        <>
          <div
            data-testid="os-frame-macos"
            aria-hidden="true"
            className={`pointer-events-none fixed inset-x-0 top-0 z-10 flex h-7 items-center justify-between px-4 text-[11px] font-medium ${
              lightMode
                ? 'bg-[#F5F4F0]/88 text-neutral-900 border-b border-black/10'
                : 'bg-[#0E1014]/86 text-neutral-100 border-b border-white/10'
            }`}
          >
            <div className="flex items-center gap-4 opacity-85">
              <span className="font-semibold">Finder</span>
              <span>ファイル</span>
              <span>編集</span>
              <span>表示</span>
            </div>
            <div className="font-mono tabular-nums opacity-85">{timeText}</div>
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border px-3 py-2 ${
              lightMode
                ? 'bg-[#F5F4F0]/88 border-black/12'
                : 'bg-[#14161A]/88 border-white/14'
            }`}
          >
            {Array.from({ length: 7 }).map((_, idx) => (
              <span
                key={idx}
                className={`h-8 w-8 rounded-xl ${
                  lightMode ? 'bg-neutral-900/15' : 'bg-white/18'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
