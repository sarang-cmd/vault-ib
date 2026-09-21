import React, { useState } from 'react';
import { Resource } from '../types';
import { Bookmark, Star, ExternalLink, Info, AlertTriangle } from 'lucide-react';

interface ResourceItemProps {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectResource: (resource: Resource) => void;
  showAddedDate?: boolean;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  isFavorite,
  onToggleFavorite,
  onSelectResource,
  showAddedDate = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    onSelectResource(resource);
  };

  return (
    <div
      className="relative py-1 group/item cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-baseline justify-between gap-1.5 leading-snug">
        {/* Resource Name: Plain black underlined text - click opens details modal */}
        <div className="flex-1 min-w-0 flex items-baseline flex-wrap gap-x-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectResource(resource);
            }}
            className="text-primary underline decoration-1 underline-offset-2 hover:text-brand-logo hover:decoration-brand-logo transition-colors font-medium text-[14.5px] break-words cursor-pointer text-left"
          >
            {resource.name}
          </button>

          {/* NEW Badge pill */}
          {resource.is_new && (
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-500 text-white tracking-wide align-middle select-none">
              NEW
            </span>
          )}

          {/* Broken link indicator if flagged */}
          {resource.status === 'broken' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-600 align-middle select-none" title="Reported as broken mirror">
              <AlertTriangle className="w-2.5 h-2.5 text-primary" />
              <span>broken</span>
            </span>
          )}
        </div>

        {/* Subtle quick action controls on hover */}
        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(resource.id);
            }}
            className={`p-0.5 rounded transition-colors cursor-pointer ${
              isFavorite
                ? 'text-pink-600'
                : 'text-muted hover:text-pink-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-primary' : ''} text-primary`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectResource(resource);
            }}
            className="p-0.5 text-muted hover:text-primary transition-colors cursor-pointer"
            title="View details & review"
            aria-label="View details"
          >
            <Info className="w-3.5 h-3.5 text-primary" />
          </button>

          {/* External link icon on hover - opens in new tab */}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-0.5 text-muted hover:text-primary transition-colors cursor-pointer"
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </a>
        </div>
      </div>

      {/* Added date sub-line for New Tools column or newly added */}
      {(showAddedDate || resource.added_date) && (
        <div className="text-[11.5px] text-muted font-normal leading-tight mt-0.5">
          Added {resource.added_date}
        </div>
      )}

      {/* Hover Tooltip (clean index card style, no neon glow, neutral cream background) */}
      {isHovered && (
        <div
          className="absolute z-40 left-0 sm:left-4 top-full mt-1.5 w-72 max-w-[90vw] p-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded shadow-md pointer-events-auto"
          role="tooltip"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--border-color)] pb-1.5 mb-2">
            <div>
              <div className="font-semibold text-xs text-[var(--text-primary)]">{resource.name}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{resource.category}</div>
            </div>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                resource.cost === 'Free'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              }`}
            >
              {resource.cost}
            </span>
          </div>

          <p className="text-xs text-[var(--text-body)] leading-relaxed mb-2.5">
            {resource.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-0.5 text-[var(--brand-logo)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < resource.rank
                      ? 'fill-[var(--brand-logo)] text-[var(--brand-logo)]'
                      : 'text-[var(--border-color)]'
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] text-[var(--text-muted)] font-medium">{resource.rank}/5</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectResource(resource)}
                className="underline hover:text-[var(--brand-logo)] cursor-pointer"
              >
                More info
              </button>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium underline text-[var(--brand-logo)] hover:text-[var(--brand-logo)] cursor-pointer"
              >
                <span>Visit</span>
                <ExternalLink className="w-2.5 h-2.5 text-[var(--brand-logo)]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};