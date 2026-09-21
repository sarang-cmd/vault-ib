import React from 'react';
import { Menu, Search, Settings, PlusCircle, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  onOpenSubmit: () => void;
  onNavigateDashboard: () => void;
  totalCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenSettings,
  onNavigateHome,
  onOpenSubmit,
  onNavigateDashboard,
  totalCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 bg-bg-page border-b border-border-column transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Left: Hamburger & Wordmark Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded text-text-primary hover:bg-border-column transition-colors focus:outline-none focus:ring-1 focus:ring-brand-logo"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
          >
            <img src="/favicon.svg" alt="" className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
            <span className="font-logo font-extrabold text-2xl sm:text-[26px] tracking-tight text-brand-logo leading-none select-none">
              VAULT IB
            </span>
            <span className="hidden md:inline-block text-[12px] font-medium text-text-muted border-l border-border-color pl-2 leading-none">
              {totalCount} Free DP Resources
            </span>
          </button>
        </div>

        {/* Center/Right: Quick Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dashboard Link */}
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-border-color text-text-body hover:text-text-primary hover:border-text-primary bg-bg-card transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-text-primary" />
            <span>Dashboard</span>
          </button>

          {/* Quick Submit link */}
          <button
            type="button"
            onClick={onOpenSubmit}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-border-color text-text-body hover:text-text-primary hover:border-text-primary bg-bg-card transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-text-primary" />
            <span>Suggest Link</span>
          </button>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted bg-bg-card border border-border-color rounded hover:border-brand-logo hover:text-text-primary transition-colors shadow-2xs focus:outline-none focus:ring-1 focus:ring-brand-logo cursor-pointer"
            aria-label="Search resources"
          >
            <Search className="w-4 h-4 text-text-primary" />
            <span className="hidden sm:inline text-xs font-medium text-text-muted">
              Search vault...
            </span>
            <kbd className="hidden sm:inline-block text-[10px] uppercase font-sans font-medium px-1.5 py-0.5 bg-bg-page text-text-muted border border-border-color rounded">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded text-text-muted hover:text-text-primary hover:bg-border-column transition-colors focus:outline-none focus:ring-1 focus:ring-brand-logo cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Sun className="w-4.5 h-4.5 text-text-primary" /> : <Moon className="w-4.5 h-4.5 text-text-primary" />}
          </button>

          {/* Settings / Gear */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded text-text-muted hover:text-text-primary hover:bg-border-column transition-colors focus:outline-none focus:ring-1 focus:ring-brand-logo cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="w-4.5 h-4.5 text-text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
