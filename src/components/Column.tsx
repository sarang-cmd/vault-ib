import React from 'react';
import { Resource } from '../types';
import { ResourceItem } from './ResourceItem';
import { CategoryIcon } from './CategoryIcon';
import { Plus, ArrowRight, GripVertical } from 'lucide-react';

interface ColumnProps {
  id: string;
  title: string;
  slug?: string;
  color: string;
  textColor?: string;
  iconName: string;
  resources: Resource[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  onOpenAddFavoriteModal?: () => void;
  onViewCategory?: (slug: string) => void;
  isPinned?: boolean;
  isFavoritesColumn?: boolean;
  isNewToolsColumn?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  slug,
  color,
  textColor = '#FFFFFF',
  iconName,
  resources,
  favorites,
  onToggleFavorite,
  onSelectResource,
  onOpenAddFavoriteModal,
  onViewCategory,
  isFavoritesColumn = false,
  isNewToolsColumn = false,
  dragHandleProps,
}) => {
  return (
    <div
      id={id}
      className="flex flex-col rounded-t-md overflow-visible transition-shadow scroll-mt-20"
      style={{ minWidth: 0, flex: '1 1 280px' }}
      {...dragHandleProps}
    >
      {/* Colored Header Pill */}
      <div
        className="px-3.5 py-2.5 rounded-t-md flex items-center justify-between select-none shadow-2xs"
        style={{ backgroundColor: color, color: textColor }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {dragHandleProps && (
            <div
              className="p-1 rounded hover:bg-black/10 cursor-grab active:cursor-grabbing flex-shrink-0"
              {...dragHandleProps}
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4 opacity-60" />
            </div>
          )}
          <CategoryIcon name={iconName} className="w-4 h-4 flex-shrink-0" color="var(--color-text-primary)" />
          <h2 className="font-semibold text-[13.5px] tracking-tight truncate leading-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
          {/* Item count badge */}
          <span
            className="text-[11px] font-bold px-1.5 py-0.2 rounded-full"
            style={{
              backgroundColor: 'rgba(var(--color-text-primary-rgb), 0.12)',
              color: 'var(--color-text-primary)'
            }}
          >
            {resources.length}
          </span>

          {/* Quick link to full category page if regular category */}
          {slug && onViewCategory && (
            <button
              type="button"
              onClick={() => onViewCategory(slug)}
              className="p-0.5 rounded opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
              title={`View all ${title} resources in full page`}
              aria-label={`Open ${title} category page`}
            >
              <ArrowRight className="w-3.5 h-3.5 text-text-primary" />
            </button>
          )}
        </div>
      </div>

      {/* List Body */}
      <div className="flex-1 bg-bg-column border-x border-b border-border-column rounded-b-md p-3.5 shadow-2xs min-h-[140px] flex flex-col justify-between" style={{ minWidth: 0 }}>
        {resources.length > 0 ? (
          <div className="space-y-0.5 divide-y divide-border-column pt-2">
            {resources.map((resource) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                isFavorite={favorites.includes(resource.id)}
                onToggleFavorite={onToggleFavorite}
                onSelectResource={onSelectResource}
                showAddedDate={isNewToolsColumn}
              />
            ))}
          </div>
        ) : (
          <div className="py-6 px-2 text-center my-auto">
            {isFavoritesColumn ? (
              <div className="space-y-2">
                <p className="text-xs text-text-muted italic">No favorites</p>
                <button
                  type="button"
                  onClick={onOpenAddFavoriteModal}
                  className="inline-flex items-center gap-1 text-xs text-text-primary underline hover:text-brand-logo font-medium cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-text-primary" />
                  <span>Add to favorites</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">No resources found</p>
            )}
          </div>
        )}

        {/* Column footer for favorites if empty or has items */}
        {isFavoritesColumn && resources.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border-column flex items-center justify-between text-[11px] text-text-muted">
            <button
              type="button"
              onClick={onOpenAddFavoriteModal}
              className="inline-flex items-center gap-1 text-text-primary underline hover:text-brand-logo cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add more</span>
            </button>
            <span>Saved in browser</span>
          </div>
        )}
      </div>
    </div>
  );
};