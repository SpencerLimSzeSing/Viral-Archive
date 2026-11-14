import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { AppView } from '../types/video';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function Header({
  currentView,
  onNavigate,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: AppView; label: string }[] = [
    { view: 'home', label: 'Archive' },
    { view: 'saved', label: 'Saved' },
    { view: 'about', label: 'About' },
  ];

  const handleNav = (view: AppView) => {
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#121215]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6 sm:py-3.5 lg:px-8">
        <a
          href="#archive"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display text-lg font-bold tracking-tight text-zinc-50 whitespace-nowrap shrink-0 sm:text-xl"
        >
          VIRAL ARCHIVE
        </a>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 text-sm font-medium text-zinc-400 md:flex"
        >
          {navItems.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'home' && currentView === 'detail');
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => handleNav(item.view)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
                  isActive
                    ? 'font-semibold text-zinc-50 underline decoration-[#FACC15] decoration-2 underline-offset-4'
                    : 'hover:text-zinc-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-400 md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile collapsible navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 md:hidden"
        >
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive =
                currentView === item.view ||
                (item.view === 'home' && currentView === 'detail');
              return (
                <button
                  key={item.view}
                  type="button"
                  onClick={() => handleNav(item.view)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FACC15] font-semibold text-zinc-950'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
