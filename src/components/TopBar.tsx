import { EyeOff } from 'lucide-react';

export type StudioTab = 'presets' | 'customize' | 'display' | 'export';

interface TopBarProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onHideAllUi: () => void;
  lightMode: boolean;
  uiHidden: boolean;
}

const NAV_ITEMS: Array<{ id: StudioTab; label: string }> = [
  { id: 'presets', label: 'デザイン' },
  { id: 'customize', label: '詳細調整' },
  { id: 'display', label: '時計・表示' },
  { id: 'export', label: '書き出し' },
];

export function TopBar({
  activeTab,
  onSelectTab,
  onHideAllUi,
  lightMode,
  uiHidden,
}: TopBarProps) {
  const surfaceClass = lightMode
    ? 'bg-[#F5F4F0]/90 border-black/10 text-neutral-900'
    : 'bg-[#0B0C0E]/86 border-white/10 text-neutral-100';

  const navIdleClass = lightMode
    ? 'text-neutral-600 hover:text-neutral-950'
    : 'text-neutral-400 hover:text-white';

  const navActiveClass = lightMode
    ? 'text-neutral-950 after:bg-neutral-950'
    : 'text-white after:bg-white';

  const ctaClass = lightMode
    ? 'bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:outline-neutral-950'
    : 'bg-white text-neutral-950 hover:bg-neutral-200 focus-visible:outline-white';

  return (
    <header
      aria-hidden={uiHidden}
      className={`fixed top-0 inset-x-0 z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        uiHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div
        className={`mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-8 border-b px-5 sm:px-8 transition-colors duration-200 ${surfaceClass}`}
      >
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          tabIndex={uiHidden ? -1 : 0}
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('presets');
          }}
          className="font-display text-base font-semibold tracking-[0.18em] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm"
        >
          KŌSEN
        </a>

        {/* Zone 2: 4 clean single-line text links (desktop/tablet) */}
        <nav aria-label="スタジオメニュー" className="hidden md:flex items-center gap-6 lg:gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                tabIndex={uiHidden ? -1 : 0}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-xs sm:text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0.5 after:h-[1.5px] after:transition-opacity ${
                  isActive ? `${navActiveClass} after:opacity-100` : `${navIdleClass} after:opacity-0`
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action — Complete UI Hide for Lively Wallpaper */}
        <div className="shrink-0">
          <button
            type="button"
            tabIndex={uiHidden ? -1 : 0}
            onClick={onHideAllUi}
            title="すべてのUIを完全に隠す (H)"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${ctaClass}`}
          >
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            <span>完全非表示</span>
          </button>
        </div>
      </div>
    </header>
  );
}
