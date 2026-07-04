-- Quick schema fix for existing Supabase projects
-- Run this in Supabase SQL Editor if `npm run seed` reports missing columns/tables

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

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
