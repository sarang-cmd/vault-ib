import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Resource } from '../types';
import { CATEGORY_DEFINITIONS, PINNED_COLUMNS } from '../data/categories';
import { Column } from './Column';
import { Filter, ArrowUp } from 'lucide-react';

interface ColumnConfig {
  id: string;
  title: string;
  slug?: string;
  color: string;
  textColor: string;
  iconName: string;
  isPinned?: boolean;
  isFavoritesColumn?: boolean;
  isNewToolsColumn?: boolean;
  resources: Resource[];
}

const STORAGE_KEY = 'vault-ib-column-order';

const DEFAULT_COLUMN_ORDER = [
  'col-trending',
  'col-favorites',
  'col-new-tools',
  ...CATEGORY_DEFINITIONS.map(c => `col-${c.slug}`)
];

function getSavedColumnOrder(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse column order', e);
  }
  return DEFAULT_COLUMN_ORDER;
}

function saveColumnOrder(order: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch (e) {
    console.warn('Failed to save column order', e);
  }
}

export const BoardView: React.FC<BoardViewProps> = ({
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onOpenAddFavoriteModal,
  onViewCategory,
  isReorderMode = false,
}) => {
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('vault-ib-subject-group');
      return saved || 'all';
    } catch {
      return 'all';
    }
  });
  const [columnOrder, setColumnOrder] = useState<string[]>(() => getSavedColumnOrder());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [clickCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('vault-ib-click-counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save subject group to localStorage
  useEffect(() => {
    localStorage.setItem('vault-ib-subject-group', selectedSubjectGroup);
  }, [selectedSubjectGroup]);

  // Save column order to localStorage when it changes
  useEffect(() => {
    saveColumnOrder(columnOrder);
  }, [columnOrder]);


  // Save column order to localStorage when it changes
  useEffect(() => {
    saveColumnOrder(columnOrder);
  }, [columnOrder]);

  // 1. Trending This Week: top 5 by click count, fallback to curated, then high-rated
  const trendingResources = useMemo(() => {
    const curatedTopIds = [
      'pirateib-master-hubs-repositories',
      'pestle-current-past-papers-question-banks',
      'christos-nikolaidis-practice-questions-mathematics-aa-hl',
      'richard-thornley-ib-chem-vids-chemistry-hl',
      'ibenglishguys-com-english-langlit-sl'
    ];

    // Sort all resources by click count (descending)
    const sortedByClicks = [...resources].sort((a, b) => 
      (clickCounts[b.id] || 0) - (clickCounts[a.id] || 0)
    );

    // Get top 5 by clicks, but filter out those with 0 clicks
    const topByClicks = sortedByClicks
      .filter(r => (clickCounts[r.id] || 0) > 0)
      .slice(0, 5);

    if (topByClicks.length >= 5) {
      return topByClicks;
    }

    // Fallback 1: curated top IDs
    const curatedTop = resources.filter(r => curatedTopIds.includes(r.id));
    const combined = [...topByClicks];
    for (const r of curatedTop) {
      if (!combined.find(c => c.id === r.id)) {
        combined.push(r);
      }
      if (combined.length >= 5) break;
    }

    if (combined.length >= 5) {
      return combined.slice(0, 5);
    }

    // Fallback 2: high-rated (5 stars) resources
    const highRated = resources
      .filter(r => r.rank === 5 && !combined.find(c => c.id === r.id))
      .slice(0, 5 - combined.length);

    return [...combined, ...highRated].slice(0, 5);
  }, [resources, clickCounts]);

  // 2. Favorites column resources
  const favoriteResources = useMemo(() => {
    return resources.filter(r => favorites.includes(r.id));
  }, [resources, favorites]);

  // 3. New Tools column: entries flagged is_new: true, sorted by added_date desc
  const newToolsResources = useMemo(() => {
    return resources
      .filter(r => r.is_new)
      .sort((a, b) => (b.added_date || '').localeCompare(a.added_date || ''))
      .slice(0, 7);
  }, [resources]);

  // Subject group filtering for fast navigation across the 18 columns
  const subjectGroups = [
    { id: 'all', label: 'All Columns' },
    { id: 'maths-science', label: 'Maths & Sciences' },
    { id: 'humanities-lang', label: 'Humanities & Languages' },
    { id: 'core-hubs', label: 'Core, Repos & Exemplars' },
    { id: 'tools-media', label: 'Calculators, AI & Media' },
  ];

  const filteredCategories = useMemo(() => {
    if (selectedSubjectGroup === 'all') {
      return CATEGORY_DEFINITIONS;
    }
    if (selectedSubjectGroup === 'maths-science') {
      return CATEGORY_DEFINITIONS.filter(c =>
        ['mathematics-aa-hl', 'physics-hl', 'chemistry-hl'].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'humanities-lang') {
      return CATEGORY_DEFINITIONS.filter(c =>
        ['geography-sl', 'english-langlit-sl', 'german-langlit-sl'].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'core-hubs') {
      return CATEGORY_DEFINITIONS.filter(c =>
        [
          'master-hubs-repositories',
          'past-papers-question-banks',
          'ia-ee-tok-exemplars-guides',
          'textbooks-ebooks',
          'document-paywall-access'
        ].includes(c.slug)
      );
    }
    if (selectedSubjectGroup === 'tools-media') {
      return CATEGORY_DEFINITIONS.filter(c =>
        [
          'ai-study-tools',
          'grade-score-calculators',
          'flashcards-active-recall',
          'youtube-channels',
          'communities',
          'databases-research',
          'university-application-prep'
        ].includes(c.slug)
      );
    }
    return CATEGORY_DEFINITIONS;
  }, [selectedSubjectGroup]);

  // Filter resources by cost, category, status
  // Build column configs - only show pinned columns when "All Columns" is selected
  const columnConfigs = useMemo((): ColumnConfig[] => {
    const configs: ColumnConfig[] = [];

    // Only show pinned columns when "All Columns" is selected
    if (selectedSubjectGroup === 'all') {
      configs.push(
        {
          id: 'col-trending',
          title: PINNED_COLUMNS.trending.name,
          color: PINNED_COLUMNS.trending.color,
          textColor: PINNED_COLUMNS.trending.textColor,
          iconName: PINNED_COLUMNS.trending.iconName,
          isPinned: true,
          resources: trendingResources,
        },
        {
          id: 'col-favorites',
          title: PINNED_COLUMNS.favorites.name,
          color: PINNED_COLUMNS.favorites.color,
          textColor: PINNED_COLUMNS.favorites.textColor,
          iconName: PINNED_COLUMNS.favorites.iconName,
          isPinned: true,
          isFavoritesColumn: true,
          resources: favoriteResources,
        },
        {
          id: 'col-new-tools',
          title: PINNED_COLUMNS.newTools.name,
          color: PINNED_COLUMNS.newTools.color,
          textColor: PINNED_COLUMNS.newTools.textColor,
          iconName: PINNED_COLUMNS.newTools.iconName,
          isPinned: true,
          isNewToolsColumn: true,
          resources: newToolsResources,
        }
      );
    }

    // Category columns based on selected filter
    configs.push(
      ...filteredCategories.map((cat) => ({
        id: `col-${cat.slug}`,
        title: cat.name,
        slug: cat.slug,
        color: cat.color,
        textColor: cat.textColor,
        iconName: cat.iconName,
        resources: resources.filter(
          r => r.category.toLowerCase() === cat.name.toLowerCase()
        ),
      }))
    );

    return configs;
  }, [trendingResources, favoriteResources, newToolsResources, filteredCategories, resources, selectedSubjectGroup]);

  // Sort columns by saved order
  const sortedColumns = useMemo(() => {
    const configMap = new Map(columnConfigs.map(c => [c.id, c]));
    
    // When "All Columns" is selected, always put pinned columns first in fixed order
    if (selectedSubjectGroup === 'all') {
      const pinnedOrder = ['col-trending', 'col-favorites', 'col-new-tools'];
      const pinnedCols = pinnedOrder
        .map(id => configMap.get(id))
        .filter((c): c is ColumnConfig => c !== undefined);
      
      // Get non-pinned columns from saved order
      const nonPinnedOrder = columnOrder.filter(id => !['col-trending', 'col-favorites', 'col-new-tools'].includes(id));
      const orderedNonPinned = nonPinnedOrder
        .map(id => configMap.get(id))
        .filter((c): c is ColumnConfig => c !== undefined);
      
      // Add any new non-pinned columns not in saved order
      const pinnedIds = new Set(['col-trending', 'col-favorites', 'col-new-tools']);
      const remaining = columnConfigs
        .filter(c => !pinnedIds.has(c.id) && !columnOrder.includes(c.id));
      
      return [...pinnedCols, ...orderedNonPinned, ...remaining];
    }
    
    // For filtered views, use saved order for all columns
    const configMap2 = new Map(columnConfigs.map(c => [c.id, c]));
    const ordered = columnOrder
      .map(id => configMap2.get(id))
      .filter((c): c is ColumnConfig => c !== undefined);
    const remaining = columnConfigs.filter(c => !columnOrder.includes(c.id));
    return [...ordered, ...remaining];
  }, [columnConfigs, columnOrder, selectedSubjectGroup]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggedId) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragOverId === id) {
      setDragOverId(null);
    }
  }, [dragOverId]);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setColumnOrder(prev => {
      const sourceIndex = prev.indexOf(sourceId);
      const targetIndex = prev.indexOf(targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const newOrder = [...prev];
      const [removed] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      return newOrder;
    });

    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync columnOrder with localStorage on mount (in case of new columns)
  useEffect(() => {
    const saved = getSavedColumnOrder();
    setColumnOrder(saved);
  }, []);

  // Ensure new columns are added to order
  useEffect(() => {
    setColumnOrder(prev => {
      const configIds = new Set(columnConfigs.map(c => c.id));
      const filtered = prev.filter(id => configIds.has(id));
      const missing = columnConfigs
        .filter(c => !prev.includes(c.id))
        .map(c => c.id);
      return [...filtered, ...missing];
    });
  }, [columnConfigs]);

  return (
    <div className="pb-16 pt-4 px-4 sm:px-6 max-w-full mx-auto">
      {/* Subject Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-column">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-text-primary" />
            <span>Filter board</span>
          </span>
          {subjectGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedSubjectGroup(group.id)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedSubjectGroup === group.id
                  ? 'bg-text-primary text-bg-page font-medium'
                  : 'bg-bg-card text-text-body border border-border-color hover:bg-border-column hover:text-text-primary'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>
            Showing <strong>{selectedSubjectGroup === 'all' ? filteredCategories.length + 3 : filteredCategories.length}</strong> columns and <strong>{resources.length}</strong> resources
          </span>
        </div>
      </div>

      {/* Responsive CSS Grid of Columns with Drag & Drop */}
      <div
        className="grid gap-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          alignItems: 'start',
        }}
        role="list"
        aria-label="Resource columns"
      >
        {sortedColumns.map((col, index) => (
          <div
            key={col.id}
            onDragStart={(e) => handleDragStart(e, col.id)}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            onDragEnd={handleDragEnd}
            draggable
            role="listitem"
            aria-label={`Column: ${col.title}, position ${index + 1}`}
            className={dragOverId === col.id ? 'ring-2 ring-brand-logo' : ''}
          >
            <Column
              {...col}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectResource={onSelectResource}
              onOpenAddFavoriteModal={onOpenAddFavoriteModal}
              onViewCategory={onViewCategory}
              dragHandleProps={isReorderMode ? {
                onDragStart: (e) => handleDragStart(e, col.id),
                onDragOver: (e) => handleDragOver(e, col.id),
                onDragLeave: (e) => handleDragLeave(e, col.id),
                onDrop: (e) => handleDrop(e, col.id),
                onDragEnd: handleDragEnd,
              } : undefined}
            />
          </div>
        ))}
      </div>

      {/* Floating Back to Top Button */}
      <div className="mt-12 pt-6 border-t border-border-column flex items-center justify-between text-xs text-text-muted">
        <p>
          Vault IB is a free non-commercial directory for IB Diploma Programme candidates
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border-color rounded text-text-body hover:text-text-primary hover:border-text-primary bg-bg-card transition-colors cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-text-primary" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );
};

interface BoardViewProps {
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onOpenAddFavoriteModal: () => void;
  onViewCategory: (slug: string) => void;
  isReorderMode?: boolean;
}

export default BoardView;