-- EMPC: Storage buckets, FAQs, base schema safety, and sample seed data
-- Run in Supabase SQL Editor after 001 and 002 migrations

-- ── Base tables (safe create if missing) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  price NUMERIC(12,2),
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Residential',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  post_type TEXT DEFAULT 'internal' CHECK (post_type IN ('internal','external')),
  external_url TEXT,
  external_source TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  message TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('furniture','custom_order','training','general')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin','editor','viewer')),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  course_name TEXT NOT NULL,
  sponsor TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Storage buckets ───────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('products', 'products', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery', 'gallery', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('news', 'news', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Public read policies
DO $$ BEGIN
  CREATE POLICY "Public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read news" ON storage.objects FOR SELECT USING (bucket_id = 'news');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Site settings ─────────────────────────────────────────────────────────────

INSERT INTO settings (key, value, category) VALUES
  ('company_name', 'EMPC-AMANI', 'general'),
  ('company_tagline', 'Artisanal Workshop & Master Carpentry', 'general'),
  ('contact_email', 'maniraguhapierrecelestin33@gmail.com', 'contact'),
  ('contact_phone', '+250788516492', 'contact'),
  ('contact_address', 'Musanze, Rwanda', 'contact'),
  ('social_instagram', 'https://instagram.com/empc-amani', 'social'),
  ('social_facebook', 'https://facebook.com/empc-amani', 'social'),
  ('social_twitter', 'https://x.com/empc_amani', 'social'),
  ('social_linkedin', 'https://linkedin.com/company/empc-amani', 'social'),
  ('seo_title', 'EMPC-AMANI | Master Carpentry & Furniture', 'seo'),
  ('seo_description', 'Bespoke carpentry and furniture craftsmanship in Kigali, Rwanda.', 'seo'),
  ('content_hero_title', 'Craftsmanship Rooted in Heritage', 'content'),
  ('content_hero_subtitle', 'Bespoke carpentry and furniture from Kigali, Rwanda — where tradition meets modern design.', 'content'),
  ('content_hero_image', '/images/hero.png', 'content'),
  ('content_about_intro', 'EMPC-AMANI began as a humble carpentry workshop with a singular goal: to master the art of joinery and furniture design.', 'content'),
  ('content_services_intro', 'Master-grade carpentry and vocational training services tailored for excellence.', 'content'),
  ('content_footer_tagline', 'Master carpentry & vocational excellence since 1990.', 'content'),
  ('content_contact_intro', 'Tell us about your vision — our team responds within one business day.', 'content'),
  ('content_faq_intro', 'Common questions about our furniture, custom orders, and training programs.', 'content'),
  ('content_partners', '[{"name":"RTB","icon":"R"},{"name":"WoodMaster","icon":"W"},{"name":"EcoTimber","icon":"E"},{"name":"Heritage","icon":"H"}]', 'content'),
  ('content_services', '[{"num":"01","title":"Bespoke Furniture","desc":"From concept sketches to the final coat of oil. We craft tables, chairs, and cabinets that become the heart of any room.","stat":2500,"suffix":"+","statLabel":"Crafted Pieces","image":"/images/hero.png"},{"num":"02","title":"Commercial Woodwork","desc":"Large-scale carpentry for boutique hotels, modern offices, and artisanal retail environments.","stat":85,"suffix":"+","statLabel":"Enterprises","image":"/images/project1.png"},{"num":"03","title":"Restoration & Care","desc":"Breathe new life into heritage timber. We restore, rework, and refine existing woodwork with expert care.","stat":150,"suffix":"+","statLabel":"Master Restorations","image":"/images/project2.png"},{"num":"04","title":"Internships & Training","desc":"Empowering the next generation with certified vocational training in partnership with RTB.","stat":500,"suffix":"+","statLabel":"Certified Artisans","image":"/images/project1.png"}]', 'content')
ON CONFLICT (key) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────────────────────

INSERT INTO products (id, title, category, price, image_url, tags, description, in_stock, published, featured, specifications, features, images) VALUES
  ('siam-teak-table', 'Siam Teak Dining Table', 'Dining', 4850000, '/images/hero.png', ARRAY['Teak','Bespoke','Dining'],
   'Hand-crafted from sustainably sourced Burmese teak with masterful joinery and a live-edge profile.',
   true, true, true,
   '[{"label":"Material","value":"Solid Burmese Teak"},{"label":"Dimensions","value":"240 × 100 × 75 cm"},{"label":"Finish","value":"Natural Hardwax Oil"}]'::jsonb,
   '["Mortise-and-tenon joinery","Live-edge profile","FSC-certified timber"]'::jsonb,
   '["/images/hero.png","/images/project1.png","/images/project2.png"]'::jsonb),
  ('artisan-credenza', 'Artisan Credenza', 'Storage', 3200000, '/images/project1.png', ARRAY['Walnut','Storage','Modern'],
   'A statement storage piece blending clean modern lines with traditional dovetail drawer construction.',
   true, true, true,
   '[{"label":"Material","value":"American Black Walnut"},{"label":"Dimensions","value":"180 × 45 × 80 cm"}]'::jsonb,
   '["Soft-close dovetail drawers","Hidden cable management"]'::jsonb,
   '["/images/project1.png","/images/hero.png"]'::jsonb),
  ('nordic-lounge-chair', 'Nordic Lounge Chair', 'Seating', 1850000, '/images/project2.png', ARRAY['Oak','Seating','Scandinavian'],
   'Mid-century Scandinavian design with sculpted white oak frame and premium linen upholstery.',
   true, true, false,
   '[{"label":"Frame","value":"Solid White Oak"},{"label":"Upholstery","value":"Premium Belgian Linen"}]'::jsonb,
   '["Ergonomic contour","Removable cushion covers"]'::jsonb,
   '["/images/project2.png","/images/project1.png"]'::jsonb),
  ('floating-bed-frame', 'Floating Bed Frame', 'Bedroom', 2750000, '/images/hero.png', ARRAY['Maple','Modern','Bedroom'],
   'Wall-mounted floating bed frame in hard maple with integrated LED ambient lighting.',
   true, true, true,
   '[]'::jsonb, '["Integrated LED lighting","Hidden storage drawer"]'::jsonb,
   '["/images/hero.png"]'::jsonb),
  ('live-edge-desk', 'Live Edge Desk', 'Office', 2100000, '/images/project2.png', ARRAY['Walnut','Office'],
   'Executive desk featuring a single slab live-edge walnut top on powder-coated steel legs.',
   true, true, false,
   '[]'::jsonb, '["Cable grommet","Leather desk pad included"]'::jsonb,
   '["/images/project2.png"]'::jsonb),
  ('heritage-bookshelf', 'Heritage Bookshelf', 'Storage', 1650000, '/images/project1.png', ARRAY['Oak','Storage'],
   'Five-tier open bookshelf in quarter-sawn white oak with adjustable shelves.',
   true, true, false,
   '[]'::jsonb, '["Adjustable shelves","Anti-tip hardware included"]'::jsonb,
   '["/images/project1.png"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ── Gallery ───────────────────────────────────────────────────────────────────

INSERT INTO gallery (title, description, image_url, category, published) VALUES
  ('Kigali Boutique Hotel Lobby', 'Custom reception desk and wall paneling in African mahogany.', '/images/hero.png', 'Commercial', true),
  ('Modern Dining Suite', 'Complete dining room set for a private residence in Nyarutarama.', '/images/project1.png', 'Residential', true),
  ('Executive Office Fit-out', 'Floor-to-ceiling shelving and conference table for tech startup.', '/images/project2.png', 'Office', true),
  ('Heritage Restoration', 'Restoration of a 1960s teak sideboard to original condition.', '/images/project1.png', 'Residential', true),
  ('RTB Training Workshop', 'Student workshop benches and tool storage built for vocational program.', '/images/hero.png', 'Workshop', true),
  ('Garden Pavilion', 'Outdoor teak pavilion with integrated seating for a luxury villa.', '/images/project2.png', 'Residential', true);

-- ── Posts / News ──────────────────────────────────────────────────────────────

INSERT INTO posts (title, slug, excerpt, content, cover_image, published, category, tags, author) VALUES
  ('The Art of Mortise and Tenon Joinery', 'art-of-mortise-tenon',
   'Why traditional joinery remains the gold standard in fine furniture.',
   '<p>At EMPC-AMANI, every structural connection is a testament to centuries of woodworking wisdom. Mortise and tenon joinery creates bonds that outlast screws and nails by decades.</p><p>Our master craftsmen hand-cut each joint, ensuring a perfect fit that allows wood to breathe and move naturally with seasonal changes.</p>',
   '/images/hero.png', true, 'Craftsmanship', ARRAY['joinery','craft'], 'Jean-Pierre Nkurunziza'),
  ('Sustainable Timber Sourcing in Rwanda', 'sustainable-timber-rwanda',
   'How we partner with local cooperatives for responsibly harvested hardwood.',
   '<p>Sustainability is not a marketing term for us — it is a commitment. We work directly with FSC-certified cooperatives across East Africa to source timber that supports local communities.</p>',
   '/images/project1.png', true, 'Sustainability', ARRAY['timber','environment'], 'Marie Uwimana'),
  ('RTB Partnership: Training the Next Generation', 'rtb-partnership-training',
   'Our vocational program has certified over 500 artisans since 2020.',
   '<p>In partnership with the Rwanda TVET Board, EMPC-AMANI operates a fully equipped training facility where students learn both traditional techniques and modern CNC operations.</p>',
   '/images/project2.png', true, 'Training', ARRAY['RTB','vocational'], 'Patrick Habimana'),
  ('Design Trends: Warm Minimalism in 2026', 'warm-minimalism-2026',
   'Natural materials and clean lines define this year''s interior direction.',
   '<p>Warm minimalism blends the restraint of Scandinavian design with the rich textures of African hardwoods. Think clean silhouettes in teak, walnut, and oak with subtle brass accents.</p>',
   '/images/hero.png', true, 'Design', ARRAY['trends','design'], 'Claire Mukamana')
ON CONFLICT (slug) DO NOTHING;

-- ── Testimonials ──────────────────────────────────────────────────────────────

INSERT INTO testimonials (name, role, message, rating, approved) VALUES
  ('Sarah Niyonsaba', 'Homeowner, Kigali', 'EMPC crafted our entire dining room — the craftsmanship is extraordinary. Every guest asks where the table came from.', 5, true),
  ('David Okello', 'Hotel Manager', 'The lobby fit-out was delivered on time and exceeded our design brief. Professional team from start to finish.', 5, true),
  ('Grace Umutoni', 'Interior Designer', 'I specify EMPC for all my premium residential projects. Their attention to detail is unmatched in Rwanda.', 5, true),
  ('Eric Mugisha', 'RTB Graduate', 'The training program gave me real skills and a job offer on graduation day. Life-changing experience.', 5, true),
  ('Amina Hassan', 'Architect', 'Collaborating with EMPC on commercial projects is seamless. They understand technical drawings and deliver precision.', 4, true);

-- ── FAQs ──────────────────────────────────────────────────────────────────────

INSERT INTO faqs (question, answer, sort_order, published) VALUES
  ('How long does a custom furniture order take?', 'Standard bespoke pieces take 4–8 weeks depending on complexity. We provide a detailed timeline during the consultation phase.', 1, true),
  ('Do you offer delivery outside Kigali?', 'Yes. We deliver throughout Rwanda and can arrange international shipping for select projects. Delivery costs are quoted separately.', 2, true),
  ('What wood species do you work with?', 'We specialize in teak, walnut, oak, mahogany, and local hardwoods. All timber is sustainably sourced with FSC certification where available.', 3, true),
  ('Can I visit the workshop?', 'Absolutely. We welcome studio visits by appointment. Contact us to schedule a tour of our Kigali workshop.', 4, true),
  ('Do you offer furniture restoration services?', 'Yes. Our restoration team handles antique and heritage pieces, from structural repairs to full refinishing.', 5, true),
  ('How do I enroll in the training program?', 'Visit our contact page or submit a training inquiry. Programs run quarterly in partnership with RTB.', 6, true);

-- ── Subscribers ─────────────────────────────────────────────────────────────────

INSERT INTO subscribers (email, status) VALUES
  ('design@example.com', 'active'),
  ('architect.rw@gmail.com', 'active'),
  ('hotel.group@example.com', 'active'),
  ('student@rtb.rw', 'active')
ON CONFLICT (email) DO NOTHING;

-- ── Sample inquiries ──────────────────────────────────────────────────────────

INSERT INTO inquiries (full_name, email, phone, subject, message, inquiry_type, status) VALUES
  ('James Kamanzi', 'james.k@example.com', '+250 788 111 222', 'Custom dining table', 'Looking for a 10-seater dining table in teak for our new home.', 'custom_order', 'new'),
  ('Hotel Serena', 'procurement@serena.rw', '+250 788 333 444', 'Lobby renovation', 'Need quote for lobby furniture package — 15 pieces.', 'furniture', 'in_progress'),
  ('Alice Mutabazi', 'alice.m@example.com', NULL, 'Training enrollment', 'Interested in the 6-month carpentry certification program.', 'training', 'resolved');

-- ── Sample orders ───────────────────────────────────────────────────────────────

INSERT INTO orders (customer_email, customer_name, items, subtotal, total, status, payment_status, shipping_address) VALUES
  ('james.k@example.com', 'James Kamanzi',
   '[{"title":"Siam Teak Dining Table","quantity":1,"unit_price":4850000}]'::jsonb,
   4850000, 4850000, 'confirmed', 'paid', 'KG 15 Rd, Kigali'),
  ('design@example.com', 'Sarah Niyonsaba',
   '[{"title":"Nordic Lounge Chair","quantity":2,"unit_price":1850000},{"title":"Artisan Credenza","quantity":1,"unit_price":3200000}]'::jsonb,
   6900000, 6900000, 'processing', 'paid', 'Nyarutarama, Kigali'),
  ('hotel.group@example.com', 'David Okello',
   '[{"title":"Executive Office Fit-out","quantity":1,"unit_price":8500000}]'::jsonb,
   8500000, 8500000, 'pending', 'unpaid', 'Kacyiru, Kigali');

-- ── Training enrollments ────────────────────────────────────────────────────────

INSERT INTO training_enrollments (full_name, email, phone, course_name, sponsor, message, status) VALUES
  ('Eric Mugisha', 'eric.m@example.com', '+250 788 555 666', 'Master Carpentry Certificate', 'RTB', 'Graduated 2025, seeking advanced placement.', 'confirmed'),
  ('Divine Uwase', 'divine.u@example.com', '+250 788 777 888', 'Furniture Design Fundamentals', 'Self-funded', 'Passionate about woodworking as a career.', 'pending'),
  ('Patrick Nshimiyimana', 'patrick.n@example.com', NULL, 'CNC Woodworking Operations', 'WoodMaster', 'Currently employed, part-time enrollment preferred.', 'pending');

-- ── Newsletter campaign sample ──────────────────────────────────────────────────

INSERT INTO newsletter_campaigns (subject, content, status, recipient_count) VALUES
  ('Welcome to EMPC-AMANI', '<p>Thank you for subscribing to our newsletter. Stay tuned for craft stories, new collections, and workshop events.</p>', 'sent', 4),
  ('Spring Collection Preview', '<p>Preview our new spring collection featuring live-edge dining tables and modular storage systems.</p>', 'draft', 0);
