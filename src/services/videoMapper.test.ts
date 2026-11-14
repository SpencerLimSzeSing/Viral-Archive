import test from 'node:test';
import assert from 'node:assert/strict';
import { mapSupabaseRowToViralVideo } from './videoMapper';

test('mapSupabaseRowToViralVideo maps standard PostgreSQL row fields cleanly', () => {
  const mapped = mapSupabaseRowToViralVideo({
    id: 'my-kl-rain-01',
    platform: 'TikTok',
    original_url: 'https://www.tiktok.com/@creator/video/7281920192831234567',
    embed_url: null,
    thumbnail_url: 'https://cdn.example.com/frame.jpg',
    title: 'KL Commuter Helps Stray Kitten Cross Busy Road',
    description: '',
    uploader: '@klstreetwatch',
    country: 'Malaysia',
    date_added: '2026-04-15T00:00:00Z',
    categories: ['Wholesome moments', 'Animals', 'Street Food', 'animals'],
    tags: ['kuala lumpur', 'kitten', 'commute'],
    what_happened: 'A motorcyclist paused traffic briefly to scoop a kitten onto the sidewalk.',
    background_story: 'Heavy evening traffic near Masjid Jamek after rain.',
    why_viral: 'Drivers immediately waited and gave a thumbs-up.',
    additional_context: 'Follow-up post showed the kitten adopted by a nearby cafe.',
    is_published: true,
  });

  assert.equal(mapped.id, 'my-kl-rain-01');
  assert.equal(mapped.platform, 'TikTok');
  assert.equal(
    mapped.embed_url,
    'https://www.tiktok.com/embed/v2/7281920192831234567?autoplay=0'
  );
  assert.equal(mapped.date_added, '2026-04-15');
  assert.deepEqual(mapped.categories, ['Wholesome moments', 'Animals', 'Street Food']);
});

test('mapSupabaseRowToViralVideo parses comma-separated strings and falls back safely', () => {
  const mapped = mapSupabaseRowToViralVideo({
    id: 'row-2',
    platform: 'UnknownPlatform',
    original_url: 'https://example.org/post/1',
    title: 'Sample Supabase Row',
    uploader: 'Curator',
    categories: 'Funny, Unexpected',
    tags: '{malaysia,viral}',
    what_happened: 'Unexpected crowd reaction.',
    background_story: 'Afternoon street event.',
    why_viral: 'Perfect comic timing.',
  });

  assert.equal(mapped.platform, 'TikTok');
  assert.deepEqual(mapped.categories, ['Funny', 'Unexpected']);
  assert.deepEqual(mapped.tags, ['malaysia', 'viral']);
  assert.equal(mapped.country, 'Malaysia');
  assert.equal(mapped.date_added, '2026-01-01');
});

test('mapSupabaseRowToViralVideo detects YouTube from URL and normalizes raw watch embed_url', () => {
  const mapped = mapSupabaseRowToViralVideo({
    id: 'viral_007',
    platform: 'Instagram',
    original_url: 'https://www.youtube.com/watch?v=KFAA-QigRM0',
    embed_url: 'https://www.youtube.com/watch?v=KFAA-QigRM0',
    title: 'This Is My Kingdom Come',
    uploader: 'Xaptus_4',
    what_happened: 'Sample clip.',
    background_story: 'Sample story.',
    why_viral: 'Sample viral reason.',
  });

  assert.equal(mapped.platform, 'YouTube');
  assert.equal(
    mapped.embed_url,
    'https://www.youtube-nocookie.com/embed/KFAA-QigRM0?autoplay=0&rel=0'
  );
});
