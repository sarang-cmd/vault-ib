import { useState, useEffect, useCallback } from 'react';
import { Resource, VaultRoute } from './types';
import { getStoredResources } from './lib/supabase';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { BoardView } from './components/BoardView';
import { CategoryView } from './components/CategoryView';
import { DashboardView } from './components/DashboardView';
import { AboutView } from './components/AboutView';
import { SubmitModal } from './components/SubmitModal';
import { AdminView } from './components/AdminView';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { ReportModal } from './components/ReportModal';
import { AddFavoriteModal } from './components/AddFavoriteModal';
import { exportCategoryToPdf } from './lib/pdfExport';
import { Printer } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './context/ThemeContext';

const FAVORITES_STORAGE_KEY = 'ibvault_favorites';

export function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load resources on mount
  useEffect(() => {
    let mounted = true;
    getStoredResources().then(data => {
      if (mounted) {
        setResources(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Navigation route state
  const [currentRoute, setCurrentRoute] = useState<VaultRoute>(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const hash = window.location.hash.replace(/^#\/?/, '');

    const effectivePath = hash ? `/${hash}` : path;

    if (effectivePath === '/about') return { view: 'about' };
    if (effectivePath === '/submit') return { view: 'submit' };
    if (effectivePath === '/admin') return { view: 'admin' };
    if (effectivePath === '/dashboard') return { view: 'dashboard' };
    if (effectivePath.startsWith('/category/')) {
      const slug = effectivePath.replace('/category/', '');
      return { view: 'category', slug };
    }
    return { view: 'board' };
  });

  // Modals & Drawers state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAddFavoriteModalOpen, setIsAddFavoriteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [reportTargetResource, setReportTargetResource] = useState<Resource | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Sync favorites with localStorage
  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving favorites', e);
      }
      return next;
    });
  }, []);

  const handleClearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }, []);

  const handleRefreshResources = useCallback(async () => {
    const data = await getStoredResources();
    setResources(data);
  }, []);

  // Route navigation helper
  const navigate = useCallback((route: VaultRoute) => {
    setCurrentRoute(route);
    let url = '/';
    if (route.view === 'about') url = '/about';
    else if (route.view === 'submit') url = '/submit';
    else if (route.view === 'admin') url = '/admin';
    else if (route.view === 'dashboard') url = '/dashboard';
    else if (route.view === 'category') url = `/category/${route.slug}`;

    window.history.pushState(null, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash.replace(/^#\/?/, '');
      const effectivePath = hash ? `/${hash}` : path;

      if (effectivePath === '/about') setCurrentRoute({ view: 'about' });
      else if (effectivePath === '/submit') setCurrentRoute({ view: 'submit' });
      else if (effectivePath === '/admin') setCurrentRoute({ view: 'admin' });
      else if (effectivePath.startsWith('/category/')) {
        const slug = effectivePath.replace('/category/', '');
        setCurrentRoute({ view: 'category', slug });
      } else {
        setCurrentRoute({ view: 'board' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcuts (Cmd+K or / for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to column on the board
  const handleScrollToColumn = (colId: string) => {
    if (currentRoute.view !== 'board') {
      navigate({ view: 'board' });
      setTimeout(() => {
        const el = document.getElementById(colId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(colId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExportCurrentPdf = () => {
    if (currentRoute.view === 'category') {
      const catResources = resources.filter(
        r => r.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === currentRoute.slug
      );
      exportCategoryToPdf(catResources[0]?.category || 'Category', catResources);
    } else {
      exportCategoryToPdf('Full Vault IB Directory', resources);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
        <Analytics />
        <SpeedInsights />
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-[var(--bg-page)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-[var(--brand-logo)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[var(--text-muted)]">Loading Vault IB...</p>
            </div>
          </div>
        )}
        {/* Sticky Top Bar */}
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNavigateHome={() => navigate({ view: 'board' })}
          onNavigateDashboard={() => navigate({ view: 'dashboard' })}
          onOpenSubmit={() => setIsSubmitModalOpen(true)}
          totalCount={resources.length}
        />

        {/* Main Content Views */}
        <main className="flex-1">
          {currentRoute.view === 'dashboard' && (
            <DashboardView
              resources={resources}
              onNavigateBoard={() => navigate({ view: 'board' })}
              onNavigateCategory={(slug) => navigate({ view: 'category', slug })}
            />
          )}

          {currentRoute.view === 'board' && (
            <BoardView
              resources={resources}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectResource={(res) => setSelectedResource(res)}
              onOpenAddFavoriteModal={() => setIsAddFavoriteModalOpen(true)}
              onViewCategory={(slug) => navigate({ view: 'category', slug })}
              isReorderMode={isReorderMode}
            />
          )}

          {currentRoute.view === 'category' && (
            <CategoryView
              slug={currentRoute.slug}
              resources={resources}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectResource={(res) => setSelectedResource(res)}
              onNavigateHome={() => navigate({ view: 'board' })}
              onSelectCategory={(slug) => navigate({ view: 'category', slug })}
              onReportResource={(res) => setReportTargetResource(res)}
            />
          )}

          {currentRoute.view === 'about' && (
            <AboutView
              resources={resources}
              onNavigateHome={() => navigate({ view: 'board' })}
              onNavigateSubmit={() => navigate({ view: 'submit' })}
              onOpenReportModal={() => setReportTargetResource(resources[0] || null)}
            />
          )}

          {currentRoute.view === 'submit' && (
            <SubmitModal
              isOpen={true}
              isStandalonePage={true}
              onClose={() => navigate({ view: 'board' })}
              onNavigateHome={() => navigate({ view: 'board' })}
            />
          )}

          {currentRoute.view === 'admin' && (
            <AdminView
              resources={resources}
              onRefreshResources={handleRefreshResources}
              onNavigateHome={() => navigate({ view: 'board' })}
            />
          )}
        </main>

        {/* Sidebar Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigateHome={() => navigate({ view: 'board' })}
          onNavigateDashboard={() => navigate({ view: 'dashboard' })}
          onNavigateAbout={() => navigate({ view: 'about' })}
          onNavigateSubmit={() => {
            setIsSubmitModalOpen(true);
          }}
          onNavigateAdmin={() => navigate({ view: 'admin' })}
          onSelectCategory={(slug) => navigate({ view: 'category', slug })}
          onScrollToColumn={handleScrollToColumn}
          onExportPdf={handleExportCurrentPdf}
          favoritesCount={favorites.length}
          activeCategorySlug={currentRoute.view === 'category' ? currentRoute.slug : undefined}
          isCategoryView={currentRoute.view === 'category'}
        />

        {/* Global Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          resources={resources}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectResource={(res) => setSelectedResource(res)}
        onViewCategory={(slug) => navigate({ view: 'category', slug })}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        favorites={favorites}
        resources={resources}
        onClearFavorites={handleClearFavorites}
        onNavigateAdmin={() => navigate({ view: 'admin' })}
        isReorderMode={isReorderMode}
        onToggleReorderMode={setIsReorderMode}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        isFavorite={selectedResource ? favorites.includes(selectedResource.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onViewCategory={(slug) => {
          setSelectedResource(null);
          navigate({ view: 'category', slug });
        }}
        onReportResource={(res) => {
          setSelectedResource(null);
          setReportTargetResource(res);
        }}
      />

      {/* Report Broken Link Modal */}
      <ReportModal
        isOpen={!!reportTargetResource}
        resource={reportTargetResource}
        onClose={() => setReportTargetResource(null)}
        onRefreshResources={handleRefreshResources}
      />

      {/* Add Favorite Quick Selector Modal */}
      <AddFavoriteModal
        isOpen={isAddFavoriteModalOpen}
        onClose={() => setIsAddFavoriteModalOpen(false)}
        resources={resources}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Submit Modal (when triggered via top bar or button) */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onNavigateHome={() => {
          setIsSubmitModalOpen(false);
          navigate({ view: 'board' });
        }}
      />

      {/* Floating circular PDF-export icon (bottom-right of screen as required by Part 1.6) */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          type="button"
          onClick={handleExportCurrentPdf}
          className="w-11 h-11 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] hover:bg-[var(--brand-logo)] shadow-lg flex items-center justify-center transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[var(--brand-logo)]"
          title="Export current view as printable PDF"
          aria-label="Export as printable PDF"
        >
          <Printer className="w-5 h-5 group-hover:scale-105 transition-transform" />
        </button>
      </div>
    </div>
  </ThemeProvider>
  );
}

export default App;
