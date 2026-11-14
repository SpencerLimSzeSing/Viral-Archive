import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

function readEnvCredentials(): { url: string; publishableKey: string } | null {
  const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
  const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();

  if (
    !url ||
    !publishableKey ||
    url.includes('YOUR_PROJECT_REF') ||
    publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY')
  ) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
  } catch {
    return null;
  }

  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return readEnvCredentials() !== null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const creds = readEnvCredentials();
  if (!creds) return null;

  if (!cachedClient) {
    cachedClient = createClient(creds.url, creds.publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}
