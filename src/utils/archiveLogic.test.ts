import test from 'node:test';
import assert from 'node:assert/strict';
import type { ViralVideo } from '../types/video';
import {
  extractFilterOptions,
  filterVideos,
  getRelatedVideos,
  sortVideos,
} from './archiveLogic';

const MOCK_VIDEOS: ViralVideo[] = [
  {
    id: 'v1',
    title: 'Oyen Cat Waits for Teh Tarik',
    description: 'Cat sits politely at a mamak stall.',
    platform: 'TikTok',
    original_url: 'https://example.com/v1',
    embed_url: null,
    thumbnail_url: '/thumb1.jpg',
    uploader: '@mamakfan',
    country: 'Malaysia',
    date_added: '2025-03-14',
    categories: ['Funny', 'Animals'],
    tags: ['oyen', 'mamak', 'cat'],
    background_story: 'Recorded in Bangsar.',
    what_happened: 'Cat climbed onto chair.',
    why_viral: 'Polite posture.',
    additional_context: 'Regular neighborhood cat.',
  },
  {
    id: 'v2',
    title: 'Shah Alam Flood Kayak Commute',
    description: 'Resident kayaks down flooded street.',
    platform: 'Instagram',
    original_url: 'https://example.com/v2',
    embed_url: null,
    thumbnail_url: '/thumb2.jpg',
    uploader: '@klweather',
    country: 'Malaysia',
    date_added: '2024-11-20',
    categories: ['Unexpected', 'Public incidents'],
    tags: ['monsoon', 'kayak', 'shah-alam'],
    background_story: 'Heavy evening downpour.',
    what_happened: 'Neighbor paddled to corner store.',
    why_viral: 'Calm attitude during rain.',
    additional_context: 'Water receded by midnight.',
  },
  {
    id: 'v3',
    title: 'Bishan Otters Use Zebra Crossing',
    description: 'Otter family crosses city road.',
    platform: 'Facebook',
    original_url: 'https://example.com/v3',
    embed_url: null,
    thumbnail_url: '/thumb3.jpg',
    uploader: 'City Watch SG',
    country: 'Singapore',
    date_added: '2025-03-02',
    categories: ['Animals', 'Wholesome moments', 'Street Food'],
    tags: ['otters', 'wildlife', 'traffic'],
    background_story: 'Morning commute.',
    what_happened: 'Drivers stopped for otters.',
    why_viral: 'Single-file crossing.',
    additional_context: 'NParks confirmed safe crossing.',
  },
];

test('extractFilterOptions prioritizes Malaysia and Indonesia and derives years/months/categories from Supabase rows', () => {
  const opts = extractFilterOptions(MOCK_VIDEOS);
  assert.deepEqual(opts.countries, ['Malaysia', 'Indonesia', 'Singapore']);
  assert.deepEqual(opts.years, ['2025', '2024']);
  assert.deepEqual(
    opts.months.map((m) => m.value),
    ['03', '11']
  );
  assert.deepEqual(opts.categories, [
    'Funny',
    'Unexpected',
    'Animals',
    'Public incidents',
    'Wholesome moments',
    'Street Food',
  ]);
});

test('filterVideos combines country, year, month, categories, and keyword search', () => {
  const malaysiaFunny = filterVideos(MOCK_VIDEOS, {
    search: '',
    country: 'Malaysia',
    year: 'ALL',
    month: 'ALL',
    categories: ['Funny'],
    sort: 'newest',
  });
  assert.equal(malaysiaFunny.length, 1);
  assert.equal(malaysiaFunny[0].id, 'v1');

  const searchByTag = filterVideos(MOCK_VIDEOS, {
    search: 'monsoon',
    country: 'ALL',
    year: 'ALL',
    month: 'ALL',
    categories: [],
    sort: 'newest',
  });
  assert.equal(searchByTag.length, 1);
  assert.equal(searchByTag[0].id, 'v2');

  const marchVideos = filterVideos(MOCK_VIDEOS, {
    search: '',
    country: 'ALL',
    year: '2025',
    month: '03',
    categories: [],
    sort: 'newest',
  });
  assert.equal(marchVideos.length, 2);

  const multiCategoryVideos = filterVideos(MOCK_VIDEOS, {
    search: '',
    country: 'ALL',
    year: 'ALL',
    month: 'ALL',
    categories: ['Funny', 'Unexpected'],
    sort: 'newest',
  });
  assert.deepEqual(
    multiCategoryVideos.map((v) => v.id),
    ['v1', 'v2']
  );
});

test('sortVideos orders by newest and oldest', () => {
  assert.equal(sortVideos(MOCK_VIDEOS, 'newest')[0].id, 'v1');
  assert.equal(sortVideos(MOCK_VIDEOS, 'oldest')[0].id, 'v2');
});

test('getRelatedVideos ranks videos sharing categories and country above unrelated ones', () => {
  const related = getRelatedVideos(MOCK_VIDEOS[0], MOCK_VIDEOS, 2);
  assert.equal(related.length, 2);
  // v3 shares 'Animals' (+3), v2 shares 'Malaysia' (+1)
  assert.equal(related[0].id, 'v3');
});
