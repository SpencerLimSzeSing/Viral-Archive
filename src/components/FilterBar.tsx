import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { FilterState, SortOption, VideoCategory } from '../types/video';
import type { FilterOptions } from '../utils/archiveLogic';

interface FilterBarProps {
  filters: FilterState;
  options: FilterOptions;
  totalCount: number;
  filteredCount: number;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'random', label: 'Random' },
];

export function FilterBar({
  filters,
  options,
  totalCount,
  filteredCount,
  onChange,
  onReset,
}: FilterBarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount =
    (filters.country !== 'ALL' ? 1 : 0) +
    (filters.year !== 'ALL' ? 1 : 0) +
    (filters.month !== 'ALL' ? 1 : 0) +
    filters.categories.length;

  const hasActiveFilters = filters.search.trim() !== '' || activeFilterCount > 0;

  const toggleCategory = (cat: VideoCategory) => {
    const exists = filters.categories.includes(cat);
    const nextCategories = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: nextCategories });
  };

  return (
    <section aria-label="Search and filter viral videos" className="space-y-3.5 sm:space-y-4">
      {/* Search bar + mobile filter toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <label htmlFor="archive-search" className="sr-only">
            Search viral videos, events, people or keywords
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            id="archive-search"
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search viral videos, events, people or keywords..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pr-10 pl-10 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-[#FACC15] focus:outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              aria-label="Clear search query"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          aria-expanded={mobileFiltersOpen}
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-700 bg-emerald-950 px-3 py-2.5 text-xs font-semibold text-emerald-100 whitespace-nowrap shrink-0 sm:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
        </button>
      </div>

      {/* Country, Year, Month & Categories: always visible on sm+, toggleable on mobile */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} space-y-3.5 sm:block`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap">
            Filter by:
          </span>

          <div className="relative">
            <label htmlFor="filter-country" className="sr-only">
              Filter by country
            </label>
            <select
              id="filter-country"
              value={filters.country}
              onChange={(e) => onChange({ ...filters, country: e.target.value })}
              className="h-8 appearance-none rounded-lg border border-emerald-700/80 bg-emerald-950 pr-7 pl-2.5 text-xs font-medium text-emerald-100 transition-colors hover:border-emerald-500 focus:border-emerald-400 focus:outline-none"
            >
              <option value="ALL" className="bg-zinc-900 text-emerald-100">
                Country
              </option>
              {options.countries.map((country) => (
                <option key={country} value={country} className="bg-zinc-900 text-emerald-100">
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-300"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <label htmlFor="filter-year" className="sr-only">
              Filter by year
            </label>
            <select
              id="filter-year"
              value={filters.year}
              onChange={(e) => onChange({ ...filters, year: e.target.value })}
              className="h-8 appearance-none rounded-lg border border-emerald-700/80 bg-emerald-950 pr-7 pl-2.5 text-xs font-medium text-emerald-100 transition-colors hover:border-emerald-500 focus:border-emerald-400 focus:outline-none"
            >
              <option value="ALL" className="bg-zinc-900 text-emerald-100">
                Year
              </option>
              {options.years.map((year) => (
                <option key={year} value={year} className="bg-zinc-900 text-emerald-100">
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-300"
              aria-hidden="true"
            />
          </div>

          <div className="relative">
            <label htmlFor="filter-month" className="sr-only">
              Filter by month
            </label>
            <select
              id="filter-month"
              value={filters.month}
              onChange={(e) => onChange({ ...filters, month: e.target.value })}
              className="h-8 appearance-none rounded-lg border border-emerald-700/80 bg-emerald-950 pr-7 pl-2.5 text-xs font-medium text-emerald-100 transition-colors hover:border-emerald-500 focus:border-emerald-400 focus:outline-none"
            >
              <option value="ALL" className="bg-zinc-900 text-emerald-100">
                Month
              </option>
              {options.months.map((m) => (
                <option key={m.value} value={m.value} className="bg-zinc-900 text-emerald-100">
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-300"
              aria-hidden="true"
            />
          </div>
        </div>

        {(options.categories.length > 0 || hasActiveFilters) && (
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-300">
                Categories (match any selected)
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
            {options.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {options.categories.map((category) => {
                  const active = filters.categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCategory(category)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
                        active
                          ? 'border-emerald-400 bg-emerald-800 text-white'
                          : 'border-emerald-800 bg-emerald-950 text-emerald-200 hover:border-emerald-600 hover:bg-emerald-900'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sort options & result counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-zinc-800 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sort videos">
          {SORT_OPTIONS.map((opt) => {
            const active = filters.sort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, sort: opt.value })}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
                  active
                    ? 'bg-emerald-900 font-semibold text-emerald-100 ring-1 ring-emerald-500'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <p className="font-mono text-xs text-zinc-400 tabular-nums">
          Showing {filteredCount} of {totalCount} records
        </p>
      </div>
    </section>
  );
}
