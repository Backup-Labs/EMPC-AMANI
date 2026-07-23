import { createClient } from "@/lib/supabase/client";

type BrowserClient = ReturnType<typeof createClient>;

let _client: BrowserClient | null = null;

function getClient(): BrowserClient {
  if (!_client) _client = createClient();
  return _client;
}

/** Lazy browser Supabase client — safe to import without crashing `next build`. */
export const supabase = new Proxy({} as BrowserClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
