import {
  ALL_CATEGORIES,
  type FilterState,
  type SortOption,
  type VideoCategory,
  type ViralVideo,
} from '../types/video';

export interface FilterOptions {
  countries: string[];
  years: string[];
  months: { value: string; label: string }[];
  categories: VideoCategory[];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function extractFilterOptions(videos: ViralVideo[]): FilterOptions {
  const countryMap = new Map<string, string>([
    ['malaysia', 'Malaysia'],
    ['indonesia', 'Indonesia'],
  ]);
  const yearSet = new Set<string>();
  const monthSet = new Set<string>();
  const categoryMap = new Map<string, string>();

  for (const video of videos) {
    const trimmedCountry = video.country.trim();
    if (trimmedCountry) {
      const countryKey = trimmedCountry.toLowerCase();
      if (!countryMap.has(countryKey)) {
        countryMap.set(countryKey, trimmedCountry);
      }
    }

    const parts = video.date_added.split('-');
    if (parts[0] && /^\d{4}$/.test(parts[0])) yearSet.add(parts[0]);
    if (parts[1] && /^(0[1-9]|1[0-2])$/.test(parts[1])) monthSet.add(parts[1]);

    for (const cat of video.categories) {
      const trimmedCat = cat.trim();
      if (!trimmedCat) continue;
      const catKey = trimmedCat.toLowerCase();
      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, trimmedCat);
      }
    }
  }

  const priorityOrder = ['Malaysia', 'Indonesia'];
  const countries = Array.from(countryMap.values()).sort((a, b) => {
    const idxA = priorityOrder.indexOf(a);
    const idxB = priorityOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  const years = Array.from(yearSet).sort((a, b) => b.localeCompare(a));

  const months = Array.from(monthSet)
    .sort((a, b) => a.localeCompare(b))
    .map((m) => ({
      value: m,
      label: MONTH_NAMES[Number(m) - 1] ?? m,
    }));

  const defaultCategoryOrder = new Map(
    ALL_CATEGORIES.map((cat, idx) => [cat.toLowerCase(), idx])
  );
  const categories = Array.from(categoryMap.values()).sort((a, b) => {
    const idxA = defaultCategoryOrder.get(a.toLowerCase());
    const idxB = defaultCategoryOrder.get(b.toLowerCase());
    if (idxA !== undefined && idxB !== undefined) return idxA - idxB;
    if (idxA !== undefined) return -1;
    if (idxB !== undefined) return 1;
    return a.localeCompare(b);
  });

  return {
    countries,
    years,
    months,
    categories,
  };
}

export function filterVideos(videos: ViralVideo[], filters: FilterState): ViralVideo[] {
  const query = filters.search.trim().toLowerCase();

  return videos.filter((video) => {
    if (
      filters.country &&
      filters.country !== 'ALL' &&
      video.country.trim().toLowerCase() !== filters.country.trim().toLowerCase()
    ) {
      return false;
    }

    const [year = '', month = ''] = video.date_added.split('-');
    if (filters.year && filters.year !== 'ALL' && year !== filters.year) {
      return false;
    }

    if (filters.month && filters.month !== 'ALL' && month !== filters.month) {
      return false;
    }

    if (filters.categories.length > 0) {
      const selectedKeys = filters.categories.map((c) => c.toLowerCase());
      const hasAnySelected = video.categories.some((cat) =>
        selectedKeys.includes(cat.toLowerCase())
      );
      if (!hasAnySelected) return false;
    }

    if (query) {
      const searchable = [
        video.title,
        video.description,
        video.background_story,
        video.what_happened,
        video.additional_context,
        video.uploader,
        video.country,
        video.platform,
        ...video.categories,
        ...video.tags,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    return true;
  });
}

export function sortVideos(
  videos: ViralVideo[],
  sort: SortOption,
  randomSeed = 1
): ViralVideo[] {
  const copy = [...videos];

  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.date_added.localeCompare(a.date_added));

    case 'oldest':
      return copy.sort((a, b) => a.date_added.localeCompare(b.date_added));

    case 'random': {
      // Deterministic Fisher-Yates shuffle when seed is passed, enabling reliable testing
      let seed = Math.abs(Math.floor(randomSeed)) || 1;
      const nextRand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(nextRand() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  }
}

export function getRelatedVideos(
  target: ViralVideo,
  allVideos: ViralVideo[],
  limit = 3
): ViralVideo[] {
  const targetTags = new Set(target.tags.map((t) => t.toLowerCase()));
  const targetCats = new Set(target.categories);

  return allVideos
    .filter((candidate) => candidate.id !== target.id)
    .map((candidate) => {
      let score = 0;
      for (const cat of candidate.categories) {
        if (targetCats.has(cat)) score += 3;
      }
      for (const tag of candidate.tags) {
        if (targetTags.has(tag.toLowerCase())) score += 2;
      }
      if (candidate.country === target.country) score += 1;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.candidate);
}

export function formatArchiveDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const monthIdx = Number(month) - 1;
  const shortMonth = MONTH_NAMES[monthIdx]?.slice(0, 3) ?? month;
  return `${Number(day)} ${shortMonth} ${year}`;
}
