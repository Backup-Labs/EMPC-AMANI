/**
 * Apply Supabase SQL migrations via direct Postgres connection.
 *
 * Env vars (in .env.local):
 *   DIRECT_URL              — preferred for DDL (Supabase → Database → Direct connection)
 *   DATABASE_URL              — fallback; auto-converted to direct/session if pooler fails
 *   SUPABASE_DB_DIRECT_URL    — alias for DIRECT_URL
 *   SUPABASE_DB_URL           — alias for DATABASE_URL
 */
import pg from "pg";
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "../supabase/migrations");

const ENSURE_SCHEMA_SQL = `
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug) WHERE slug IS NOT NULL;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'internal';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_source TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE settings ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
`;

/** Convert transaction-pooler URI → direct connection (best for DDL) */
function toDirectConnection(url) {
  try {
    const u = new URL(url);
    const refMatch = u.username.match(/^postgres\.([a-z0-9]+)$/i);
    if (refMatch) {
      u.username = "postgres";
      u.hostname = `db.${refMatch[1]}.supabase.co`;
      u.port = "5432";
      return u.toString();
    }
    if (u.hostname.startsWith("db.") && u.hostname.endsWith(".supabase.co")) {
      u.port = u.port || "5432";
      return u.toString();
    }
  } catch {
    /* ignore malformed URL */
  }
  return null;
}

/** Transaction pooler (6543) → session pooler (5432) on same host */
function toSessionPooler(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("pooler.supabase.com") && u.port === "6543") {
      u.port = "5432";
      return u.toString();
    }
  } catch {
    /* ignore */
  }
  return null;
}

function buildConnectionCandidates() {
  const seen = new Set();
  const candidates = [];
  const add = (url, label) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({ url, label });
  };

  const direct = process.env.DIRECT_URL || process.env.SUPABASE_DB_DIRECT_URL;
  const primary = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

  add(direct, "DIRECT_URL");
  if (primary) {
    add(toDirectConnection(primary), "direct connection (auto)");
    add(toSessionPooler(primary), "session pooler (port 5432)");
    add(primary, "DATABASE_URL");
  }

  return candidates;
}

async function connectWithFallback(silent) {
  const candidates = buildConnectionCandidates();
  if (!candidates.length) return null;

  const errors = [];

  for (const { url, label } of candidates) {
    const client = new pg.Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 20000,
    });

    try {
      if (!silent) console.log(`Connecting (${label})...`);
      await client.connect();
      if (!silent) console.log(`✓ Connected via ${label}`);
      return client;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${label}: ${msg}`);
      if (!silent) console.warn(`  ✗ ${label}: ${msg.split("\n")[0]}`);
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }

  const hint = [
    "Could not connect to Postgres. Try:",
    "  1. Supabase Dashboard → Settings → Database → Connection string",
    "  2. Copy **Direct connection** URI (not Transaction pooler)",
    "  3. Set DIRECT_URL in .env.local",
    "  4. URL-encode special characters in your password (@ → %40, # → %23, etc.)",
    "",
    "Or run supabase/migrations/005_schema_ensure.sql in the SQL Editor, then npm run seed",
    "",
    ...errors.map((e) => `  • ${e}`),
  ].join("\n");

  throw new Error(hint);
}

async function applyMigrations(client, silent) {
  if (!silent) console.log("Applying schema updates...");
  await client.query(ENSURE_SCHEMA_SQL);
  if (!silent) console.log("✓ Core columns & faqs table");

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    try {
      await client.query(sql);
      if (!silent) console.log(`✓ ${file}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!silent) console.warn(`⚠ ${file} (non-fatal): ${msg.split("\n")[0]}`);
    }
  }
}

export async function runMigrations({ silent = false } = {}) {
  const candidates = buildConnectionCandidates();
  if (!candidates.length) return false;

  let client;
  try {
    client = await connectWithFallback(silent);
    await applyMigrations(client, silent);
    return true;
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
}

if (process.argv[1]?.endsWith("migrate.mjs")) {
  runMigrations()
    .then((ok) => {
      if (!ok) {
        console.error("Missing DIRECT_URL or DATABASE_URL in .env.local");
        process.exit(1);
      }
      console.log("\nMigrations complete.");
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
