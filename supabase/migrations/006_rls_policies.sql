-- Public + form RLS policies for EMPC site
-- Run in Supabase → SQL Editor if tables have RLS on but no policies

-- Products
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products"
ON products FOR SELECT TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Auth manage products" ON products;
CREATE POLICY "Auth manage products"
ON products FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Gallery
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery"
ON gallery FOR SELECT TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Auth manage gallery" ON gallery;
CREATE POLICY "Auth manage gallery"
ON gallery FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Posts
DROP POLICY IF EXISTS "Public read posts" ON posts;
CREATE POLICY "Public read posts"
ON posts FOR SELECT TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Auth manage posts" ON posts;
CREATE POLICY "Auth manage posts"
ON posts FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Testimonials
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials"
ON testimonials FOR SELECT TO anon, authenticated
USING (approved = true);

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON testimonials;
CREATE POLICY "Anyone can insert testimonials"
ON testimonials FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage testimonials" ON testimonials;
CREATE POLICY "Auth manage testimonials"
ON testimonials FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- FAQs
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
CREATE POLICY "Public read faqs"
ON faqs FOR SELECT TO anon, authenticated
USING (COALESCE(published, true) = true);

DROP POLICY IF EXISTS "Auth manage faqs" ON faqs;
CREATE POLICY "Auth manage faqs"
ON faqs FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Settings (public read for CMS content / site settings)
DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings"
ON settings FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Auth manage settings" ON settings;
CREATE POLICY "Auth manage settings"
ON settings FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Inquiries / subscribers (public insert)
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON inquiries;
CREATE POLICY "Anyone can insert inquiries"
ON inquiries FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth read inquiries" ON inquiries;
CREATE POLICY "Auth read inquiries"
ON inquiries FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Auth manage inquiries" ON inquiries;
CREATE POLICY "Auth manage inquiries"
ON inquiries FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert subscribers" ON subscribers;
CREATE POLICY "Anyone can insert subscribers"
ON subscribers FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage subscribers" ON subscribers;
CREATE POLICY "Auth manage subscribers"
ON subscribers FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Media library
DROP POLICY IF EXISTS "Auth manage media" ON media_library;
CREATE POLICY "Auth manage media"
ON media_library FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Public read media" ON media_library;
CREATE POLICY "Public read media"
ON media_library FOR SELECT TO anon, authenticated
USING (true);

-- Newsletter campaigns (admin)
DROP POLICY IF EXISTS "Auth manage campaigns" ON newsletter_campaigns;
CREATE POLICY "Auth manage campaigns"
ON newsletter_campaigns FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Orders / wishlist / notifications / training (authenticated)
DROP POLICY IF EXISTS "Auth manage orders" ON orders;
CREATE POLICY "Auth manage orders"
ON orders FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage wishlist" ON wishlist;
CREATE POLICY "Auth manage wishlist"
ON wishlist FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage notifications" ON notifications;
CREATE POLICY "Auth manage notifications"
ON notifications FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Auth manage training" ON training_enrollments;
CREATE POLICY "Auth manage training"
ON training_enrollments FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Customer profiles
DROP POLICY IF EXISTS "Users read own profile" ON customer_profiles;
CREATE POLICY "Users read own profile"
ON customer_profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON customer_profiles;
CREATE POLICY "Users update own profile"
ON customer_profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON customer_profiles;
CREATE POLICY "Users insert own profile"
ON customer_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);
