import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 * NEXT_PUBLIC_* must be set at build time on Cloudflare (Build variables)
 * so they are inlined into the client bundle.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // During `next build` / CI, env may be missing while collecting page data.
    // Never use this path in the browser — throw so misconfig is obvious.
    if (typeof window === "undefined") {
      return createBrowserClient(
        "https://build-placeholder.supabase.co",
        "build-placeholder-key"
      );
    }
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Set them in .env.local (local) and as Cloudflare Build + Runtime variables (deploy)."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
