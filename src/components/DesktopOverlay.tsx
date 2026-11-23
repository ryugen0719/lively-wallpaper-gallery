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

  const { hours, minutes, seconds, timeText, periodText, dateText, isoDateText } =
    formatJapaneseClock(now, clock.use24Hour, clock.showSeconds);

  const isCenter = clock.position === 'center';
  const isRight = clock.position === 'top-right' || clock.position === 'bottom-right';
  const alignItemsClass = isCenter ? 'items-center text-center' : isRight ? 'items-end text-right' : 'items-start text-left';

  const primaryTextColor = lightMode ? 'text-neutral-950/92' : 'text-white/95';
  const secondaryTextColor = lightMode ? 'text-neutral-800/72' : 'text-white/72';
  const subtleLineColor = lightMode ? 'bg-neutral-900/20' : 'bg-white/25';

  const textShadow = lightMode
    ? '0 2px 24px rgba(255,255,255,0.5)'
    : '0 4px 32px rgba(0,0,0,0.5)';
  const dateShadow = lightMode
    ? '0 1px 12px rgba(255,255,255,0.45)'
    : '0 2px 16px rgba(0,0,0,0.5)';

  const positionClass =
    clock.position === 'center'
      ? `inset-0 flex flex-col items-center justify-center text-center px-6 ${
          !zenMode && dockOpen ? 'pb-80 sm:pb-76' : 'pb-10'
        }`
      : clock.position === 'top-left'
        ? `${zenMode ? 'top-10' : 'top-20 sm:top-24'} left-6 sm:left-14 flex flex-col items-start text-left`
        : clock.position === 'top-right'
          ? `${zenMode ? 'top-10' : 'top-20 sm:top-24'} right-6 sm:right-14 flex flex-col items-end text-right`
          : clock.position === 'bottom-right'
            ? `${zenMode ? 'bottom-20 sm:bottom-24' : dockOpen ? 'bottom-[26rem] sm:bottom-[23rem]' : 'bottom-32 sm:bottom-36'} right-6 sm:right-14 flex flex-col items-end text-right`
            : `${zenMode ? 'bottom-20 sm:bottom-24' : dockOpen ? 'bottom-[26rem] sm:bottom-[23rem]' : 'bottom-32 sm:bottom-36'} left-6 sm:left-14 flex flex-col items-start text-left`;

  const minimalFontSize = isCenter
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

  // Precision analog & ring angles
  const rawH = now.getHours() % 12;
  const rawM = now.getMinutes();
  const rawS = now.getSeconds();
  const hourAngle = rawH * 30 + rawM * 0.5;
  const minuteAngle = rawM * 6 + rawS * 0.1;
  const secondAngle = rawS * 6;
  const secondProgress = rawS / 60;
  const minuteProgress = (rawM + rawS / 60) / 60;

  const dialPx = isCenter
    ? clock.size === 'sm'
      ? 176
      : clock.size === 'lg'
        ? 304
        : 240
    : clock.size === 'sm'
      ? 132
      : clock.size === 'lg'
        ? 220
        : 176;

  const renderClockFace = () => {
    switch (clock.style) {
      case 'editorial': {
        const serifSize = isCenter
          ? clock.size === 'sm'
            ? 'clamp(3.5rem, 8.5vw, 6.5rem)'
            : clock.size === 'lg'
              ? 'clamp(5.4rem, 15vw, 12rem)'
              : 'clamp(4.5rem, 12vw, 9.5rem)'
          : clock.size === 'sm'
            ? 'clamp(2.5rem, 5vw, 4rem)'
            : clock.size === 'lg'
              ? 'clamp(4rem, 8.8vw, 7.2rem)'
              : 'clamp(3.2rem, 6.6vw, 5.4rem)';
        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div
              className={`font-light tracking-[0.03em] tabular-nums leading-[0.94] ${primaryTextColor}`}
              style={{
                fontFamily: 'var(--font-clock-serif)',
                fontSize: serifSize,
                textShadow,
              }}
            >
              <span>{hours}</span>
              <span className="mx-[0.06em] opacity-50 font-light">:</span>
              <span>{minutes}</span>
              {clock.showSeconds && (
                <span className="ml-[0.14em] text-[0.42em] opacity-65 align-baseline">
                  {seconds}
                </span>
              )}
              {periodText && (
                <span className="ml-3 font-display text-[0.2em] font-medium tracking-[0.22em] opacity-70 align-middle">
                  {periodText}
                </span>
              )}
            </div>
            {clock.showDate && (
              <div className={`mt-3.5 flex flex-col gap-2 ${alignItemsClass}`}>
                <span className={`h-px w-10 ${subtleLineColor}`} aria-hidden="true" />
                <p
                  className={`font-medium tracking-[0.14em] ${dateSizeClass} ${secondaryTextColor}`}
                  style={{ textShadow: dateShadow }}
                >
                  {dateText}
                </p>
              </div>
            )}
          </div>
        );
      }

      case 'stacked': {
        const stackedSize = isCenter
          ? clock.size === 'sm'
            ? 'clamp(3.6rem, 8.5vw, 6.2rem)'
            : clock.size === 'lg'
              ? 'clamp(5.6rem, 15vw, 11.2rem)'
              : 'clamp(4.6rem, 11.5vw, 8.8rem)'
          : clock.size === 'sm'
            ? 'clamp(2.6rem, 5vw, 4rem)'
            : clock.size === 'lg'
              ? 'clamp(4.1rem, 8.5vw, 6.8rem)'
              : 'clamp(3.3rem, 6.5vw, 5.2rem)';
        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div
              className={`flex flex-col font-display font-semibold tracking-[-0.04em] tabular-nums leading-[0.84] ${primaryTextColor}`}
              style={{ fontSize: stackedSize, textShadow }}
            >
              <span>{hours}</span>
              <div className="flex items-baseline gap-2.5">
                <span className="opacity-82">{minutes}</span>
                {(clock.showSeconds || periodText) && (
                  <div className="flex flex-col items-start gap-0.5 text-[0.22em] font-mono font-medium tracking-[0.14em] opacity-70 leading-tight">
                    {clock.showSeconds && <span>:{seconds}</span>}
                    {periodText && <span>{periodText}</span>}
                  </div>
                )}
              </div>
            </div>
            {clock.showDate && (
              <p
                className={`mt-4 font-medium tracking-[0.1em] ${dateSizeClass} ${secondaryTextColor}`}
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
      }

      case 'flip': {
        const tileBg = lightMode
          ? 'bg-[#FAF9F5]/92 border-black/14 text-neutral-950 shadow-lg shadow-black/8'
          : 'bg-[#111318]/90 border-white/14 text-white shadow-2xl shadow-black/45';
        const tileBottomShade = lightMode ? 'bg-black/[0.035]' : 'bg-white/[0.035]';
        const hingeColor = lightMode ? 'bg-black/14' : 'bg-black/65';
        const tileSizeClass = isCenter
          ? clock.size === 'sm'
            ? 'min-w-[4.5rem] sm:min-w-[5.5rem] px-3.5 py-3 text-5xl sm:text-6xl'
            : clock.size === 'lg'
              ? 'min-w-[6.75rem] sm:min-w-[8.75rem] px-5 py-5 text-7xl sm:text-9xl'
              : 'min-w-[5.5rem] sm:min-w-[7.25rem] px-4 py-4 text-6xl sm:text-8xl'
          : clock.size === 'sm'
            ? 'min-w-[3.4rem] px-2.5 py-2 text-3xl sm:text-4xl'
            : clock.size === 'lg'
              ? 'min-w-[5.2rem] px-4 py-3.5 text-5xl sm:text-6xl'
              : 'min-w-[4.25rem] px-3 py-2.5 text-4xl sm:text-5xl';

        const tiles = clock.showSeconds ? [hours, minutes, seconds] : [hours, minutes];
        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {tiles.map((unit, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl border font-display font-semibold tracking-[-0.03em] tabular-nums leading-none text-center ${tileBg} ${tileSizeClass}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ${tileBottomShade}`}
                  />
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 ${hingeColor}`}
                  />
                  <span className="relative z-10">{unit}</span>
                  {idx === 0 && periodText && (
                    <span className="absolute top-1.5 left-2 z-10 font-mono text-[10px] font-medium tracking-[0.14em] opacity-55">
                      {periodText}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {clock.showDate && (
              <p
                className={`mt-3.5 font-medium tracking-[0.08em] ${dateSizeClass} ${secondaryTextColor}`}
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
      }

      case 'mono': {
        const frameClass = lightMode
          ? 'border-black/16 bg-[#F7F6F2]/80 text-neutral-950'
          : 'border-white/16 bg-[#0B0C10]/76 text-white';
        const barTrack = lightMode ? 'bg-black/12' : 'bg-white/14';
        const barFill = lightMode ? 'bg-neutral-950/80' : 'bg-white/85';
        const monoFontSize = isCenter
          ? clock.size === 'sm'
            ? 'clamp(2.2rem, 5.2vw, 3.8rem)'
            : clock.size === 'lg'
              ? 'clamp(3.6rem, 9.5vw, 7rem)'
              : 'clamp(2.9rem, 7.2vw, 5.4rem)'
          : clock.size === 'sm'
            ? 'clamp(1.6rem, 3.4vw, 2.5rem)'
            : clock.size === 'lg'
              ? 'clamp(2.6rem, 5.8vw, 4.4rem)'
              : 'clamp(2.1rem, 4.4vw, 3.4rem)';

        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div className={`rounded-lg border px-5 py-3.5 sm:px-6 sm:py-4 ${frameClass}`}>
              <div
                className="font-mono font-normal tracking-[-0.02em] tabular-nums leading-none"
                style={{ fontSize: monoFontSize }}
              >
                <span>{timeText}</span>
                {periodText && (
                  <span className="ml-2.5 text-[0.3em] tracking-[0.16em] opacity-65">
                    {periodText}
                  </span>
                )}
              </div>
              <div className={`mt-3 h-[2px] w-full overflow-hidden rounded-full ${barTrack}`}>
                <div
                  className={`h-full transition-all duration-300 ${barFill}`}
                  style={{ width: `${Math.max(2, (rawS / 59) * 100)}%` }}
                />
              </div>
              {clock.showDate && (
                <div className="mt-2.5 flex items-center justify-between gap-4 font-mono text-[11px] sm:text-xs tracking-[0.1em] opacity-72">
                  <span>{isoDateText}</span>
                  <span>{dateText}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'outline': {
        const strokeColor = lightMode ? 'rgba(15, 17, 21, 0.86)' : 'rgba(255, 255, 255, 0.9)';
        const fillTint = lightMode ? 'rgba(15, 17, 21, 0.05)' : 'rgba(255, 255, 255, 0.06)';
        const strokeWidth = clock.size === 'sm' ? '1.35px' : clock.size === 'lg' ? '2.25px' : '1.75px';
        const outlineSize = isCenter
          ? clock.size === 'sm'
            ? 'clamp(3.4rem, 8.2vw, 6.2rem)'
            : clock.size === 'lg'
              ? 'clamp(5.4rem, 15vw, 11.8rem)'
              : 'clamp(4.4rem, 11.5vw, 9.2rem)'
          : clock.size === 'sm'
            ? 'clamp(2.5rem, 4.8vw, 3.9rem)'
            : clock.size === 'lg'
              ? 'clamp(4rem, 8.5vw, 7rem)'
              : 'clamp(3.1rem, 6.5vw, 5.2rem)';

        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div
              className="font-display font-bold tracking-[-0.02em] tabular-nums leading-none"
              style={{
                fontSize: outlineSize,
                color: fillTint,
                WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
                filter: lightMode
                  ? 'drop-shadow(0 2px 16px rgba(255,255,255,0.4))'
                  : 'drop-shadow(0 4px 24px rgba(0,0,0,0.45))',
              }}
            >
              <span>{timeText}</span>
              {periodText && (
                <span
                  className="ml-3 text-[0.28em] font-semibold tracking-[0.16em]"
                  style={{
                    color: strokeColor,
                    WebkitTextStroke: '0px transparent',
                  }}
                >
                  {periodText}
                </span>
              )}
            </div>
            {clock.showDate && (
              <p
                className={`mt-3 font-medium tracking-[0.12em] ${dateSizeClass} ${secondaryTextColor}`}
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
      }

      case 'analog': {
        const dialStroke = lightMode ? 'rgba(15, 17, 21, 0.24)' : 'rgba(255, 255, 255, 0.28)';
        const dialFill = lightMode ? 'rgba(248, 247, 243, 0.42)' : 'rgba(10, 12, 16, 0.36)';
        const majorTick = lightMode ? 'rgba(15, 17, 21, 0.85)' : 'rgba(255, 255, 255, 0.88)';
        const minorTick = lightMode ? 'rgba(15, 17, 21, 0.28)' : 'rgba(255, 255, 255, 0.3)';
        const handColor = lightMode ? '#111318' : '#FFFFFF';
        const secondHandColor = '#E54D3E';

        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <svg
              width={dialPx}
              height={dialPx}
              viewBox="0 0 200 200"
              aria-label={`現在時刻 ${timeText}`}
              className="overflow-visible"
              style={{
                filter: lightMode
                  ? 'drop-shadow(0 6px 20px rgba(0,0,0,0.08))'
                  : 'drop-shadow(0 10px 28px rgba(0,0,0,0.45))',
              }}
            >
              <circle cx="100" cy="100" r="94" fill={dialFill} stroke={dialStroke} strokeWidth="1.5" />
              {Array.from({ length: 60 }).map((_, i) => {
                const isHour = i % 5 === 0;
                const angle = i * 6;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1={isHour ? '13' : '15'}
                    x2="100"
                    y2={isHour ? '24' : '20'}
                    stroke={isHour ? majorTick : minorTick}
                    strokeWidth={isHour ? (i % 15 === 0 ? '2.6' : '1.8') : '1'}
                    strokeLinecap="round"
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}

              {/* Hour hand */}
              <line
                x1="100"
                y1="109"
                x2="100"
                y2="48"
                stroke={handColor}
                strokeWidth="4.4"
                strokeLinecap="round"
                transform={`rotate(${hourAngle} 100 100)`}
              />
              {/* Minute hand */}
              <line
                x1="100"
                y1="112"
                x2="100"
                y2="29"
                stroke={handColor}
                strokeWidth="2.8"
                strokeLinecap="round"
                transform={`rotate(${minuteAngle} 100 100)`}
              />
              {/* Second hand (Swiss accent) */}
              {clock.showSeconds && (
                <g transform={`rotate(${secondAngle} 100 100)`}>
                  <line
                    x1="100"
                    y1="118"
                    x2="100"
                    y2="24"
                    stroke={secondHandColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="24" r="3.2" fill={secondHandColor} />
                </g>
              )}
              <circle cx="100" cy="100" r="4.5" fill={handColor} />
              <circle cx="100" cy="100" r="1.8" fill={clock.showSeconds ? secondHandColor : dialFill} />
            </svg>

            {clock.showDate && (
              <p
                className={`mt-3.5 font-medium tracking-[0.08em] ${dateSizeClass} ${secondaryTextColor}`}
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
      }

      case 'ring': {
        const ringPx = isCenter
          ? clock.size === 'sm'
            ? 192
            : clock.size === 'lg'
              ? 320
              : 256
          : clock.size === 'sm'
            ? 148
            : clock.size === 'lg'
              ? 236
              : 188;
        const outerR = 90;
        const innerR = 78;
        const outerCirc = 2 * Math.PI * outerR;
        const innerCirc = 2 * Math.PI * innerR;
        const trackStroke = lightMode ? 'rgba(15, 17, 21, 0.14)' : 'rgba(255, 255, 255, 0.16)';
        const innerStroke = lightMode ? 'rgba(15, 17, 21, 0.52)' : 'rgba(255, 255, 255, 0.55)';
        const outerStroke = lightMode ? 'rgba(15, 17, 21, 0.92)' : 'rgba(255, 255, 255, 0.95)';
        const secRad = (secondProgress * 360 - 90) * (Math.PI / 180);
        const dotX = 100 + outerR * Math.cos(secRad);
        const dotY = 100 + outerR * Math.sin(secRad);

        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div
              className="relative flex items-center justify-center"
              style={{ width: ringPx, height: ringPx }}
            >
              <svg
                width={ringPx}
                height={ringPx}
                viewBox="0 0 200 200"
                aria-hidden="true"
                className="overflow-visible"
              >
                {/* Outer second track + arc */}
                <circle cx="100" cy="100" r={outerR} fill="none" stroke={trackStroke} strokeWidth="2" />
                <circle
                  cx="100"
                  cy="100"
                  r={outerR}
                  fill="none"
                  stroke={outerStroke}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray={outerCirc}
                  strokeDashoffset={outerCirc * (1 - secondProgress)}
                  transform="rotate(-90 100 100)"
                />
                {/* Inner minute track + arc */}
                <circle cx="100" cy="100" r={innerR} fill="none" stroke={trackStroke} strokeWidth="1.5" />
                <circle
                  cx="100"
                  cy="100"
                  r={innerR}
                  fill="none"
                  stroke={innerStroke}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeDasharray={innerCirc}
                  strokeDashoffset={innerCirc * (1 - minuteProgress)}
                  transform="rotate(-90 100 100)"
                />
                {/* Orbital tip marker */}
                <circle cx={dotX} cy={dotY} r="3.4" fill={outerStroke} />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div
                  className={`font-display font-medium tracking-[-0.03em] tabular-nums leading-none ${primaryTextColor}`}
                  style={{
                    fontSize: `${Math.round(ringPx * 0.2)}px`,
                    textShadow,
                  }}
                >
                  {hours}:{minutes}
                </div>
                {(clock.showSeconds || periodText) && (
                  <div
                    className={`mt-1.5 font-mono font-medium tracking-[0.16em] tabular-nums ${secondaryTextColor}`}
                    style={{ fontSize: `${Math.max(10, Math.round(ringPx * 0.062))}px` }}
                  >
                    {clock.showSeconds ? `:${seconds}` : ''}
                    {clock.showSeconds && periodText ? ' ' : ''}
                    {periodText}
                  </div>
                )}
              </div>
            </div>

            {clock.showDate && (
              <p
                className={`mt-3 font-medium tracking-[0.08em] ${dateSizeClass} ${secondaryTextColor}`}
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
      }

      case 'minimal':
      default:
        return (
          <div className={`flex flex-col ${alignItemsClass}`}>
            <div
              className={`font-display font-light tracking-[-0.03em] tabular-nums leading-none ${primaryTextColor}`}
              style={{
                fontSize: minimalFontSize,
                textShadow,
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
                style={{ textShadow: dateShadow }}
              >
                {dateText}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <>
      {clock.position !== 'off' && (
        <div
          data-testid="desktop-clock"
          data-clock-position={clock.position}
          data-clock-size={clock.size}
          data-clock-style={clock.style}
          aria-live="off"
          className={`pointer-events-none fixed z-10 select-none transition-all duration-300 ${positionClass}`}
        >
          {renderClockFace()}
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
