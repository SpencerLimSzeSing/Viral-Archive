import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOfficialEmbedUrl,
  detectPlatformFromUrl,
  resolveEmbedConfig,
  validateVideoUrl,
} from './videoEmbed';

test('detectPlatformFromUrl identifies supported social video domains', () => {
  assert.equal(detectPlatformFromUrl('https://www.tiktok.com/@user/video/728192019283'), 'TikTok');
  assert.equal(detectPlatformFromUrl('https://www.instagram.com/reel/Cx8910AbC/'), 'Instagram');
  assert.equal(detectPlatformFromUrl('https://fb.watch/abc123XYZ/'), 'Facebook');
  assert.equal(detectPlatformFromUrl('https://youtu.be/dQw4w9WgXcQ'), 'YouTube');
  assert.equal(detectPlatformFromUrl('https://x.com/someone/status/12345'), 'X');
  assert.equal(detectPlatformFromUrl('https://example.org/clip'), null);
});

test('validateVideoUrl validates and normalizes URLs', () => {
  assert.equal(validateVideoUrl('').valid, false);
  assert.equal(validateVideoUrl('not-a-domain').valid, false);
  const ok = validateVideoUrl('tiktok.com/@demo/video/12345');
  assert.equal(ok.valid, true);
  assert.equal(ok.normalizedUrl, 'https://tiktok.com/@demo/video/12345');
});

test('buildOfficialEmbedUrl generates non-autoplaying official embed URLs', () => {
  const tiktokEmbed = buildOfficialEmbedUrl(
    'TikTok',
    'https://www.tiktok.com/@creator/video/7123456789012345678'
  );
  assert.equal(
    tiktokEmbed,
    'https://www.tiktok.com/embed/v2/7123456789012345678?autoplay=0'
  );

  const ytEmbed = buildOfficialEmbedUrl(
    'YouTube',
    'https://www.youtube.com/watch?v=abc123DEF45'
  );
  assert.equal(
    ytEmbed,
    'https://www.youtube-nocookie.com/embed/abc123DEF45?autoplay=0&rel=0'
  );
});

test('resolveEmbedConfig resolves official embeds and falls back safely for unsupported URLs', () => {
  const igEmbed = buildOfficialEmbedUrl(
    'Instagram',
    'https://www.instagram.com/p/Dfquuy8iug-/'
  );
  assert.equal(
    igEmbed,
    'https://www.instagram.com/p/Dfquuy8iug-/embed/captioned/'
  );

  const igResolved = resolveEmbedConfig({
    platform: 'Instagram',
    original_url: 'https://www.instagram.com/p/Dfquuy8iug-/',
    embed_url: null,
  });
  assert.equal(igResolved.canEmbed, true);
  assert.equal(
    igResolved.embedUrl,
    'https://www.instagram.com/p/Dfquuy8iug-/embed/captioned/'
  );

  const unsupported = resolveEmbedConfig({
    platform: 'X',
    original_url: 'https://x.com/user/status/999',
    embed_url: null,
  });
  assert.equal(unsupported.canEmbed, false);

  const ytWithRawEmbed = resolveEmbedConfig({
    platform: 'Instagram',
    original_url: 'https://www.youtube.com/watch?v=KFAA-QigRM0',
    embed_url: 'https://www.youtube.com/watch?v=KFAA-QigRM0',
  });
  assert.equal(ytWithRawEmbed.canEmbed, true);
  assert.equal(ytWithRawEmbed.platformLabel, 'YouTube');
  assert.equal(
    ytWithRawEmbed.embedUrl,
    'https://www.youtube-nocookie.com/embed/KFAA-QigRM0?autoplay=0&rel=0'
  );

  const igWithRawEmbed = resolveEmbedConfig({
    platform: 'Instagram',
    original_url: 'https://www.instagram.com/p/Dfrw6yvhQ_a/',
    embed_url: 'https://www.instagram.com/p/Dfrw6yvhQ_a/',
  });
  assert.equal(igWithRawEmbed.canEmbed, true);
  assert.equal(
    igWithRawEmbed.embedUrl,
    'https://www.instagram.com/p/Dfrw6yvhQ_a/embed/captioned/'
  );
});
