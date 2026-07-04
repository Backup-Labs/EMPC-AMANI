-- About page content seed (milestones, values, stats)
-- Run after 003_storage_faqs_seed.sql

INSERT INTO settings (key, value, category) VALUES
  ('content_about_heading', 'Rooted in Craft. Driven by Heritage.', 'content'),
  ('content_about_stat_artisans', '250', 'content'),
  ('content_about_stat_heritage', '14', 'content'),
  ('content_milestones', '[{"year":"1990","title":"Workshop Founded","desc":"EMPC-AMANI begins with two benches and a passion for solid wood.","images":["/images/hero.png","/images/project1.png"]},{"year":"2010","title":"Industrial Expansion","desc":"Scale production for boutique hotels and luxury offices began.","images":["/images/project2.png","/images/hero.png"]},{"year":"2020","title":"Vocational Partnership","desc":"Launched our first student certification program with RTB.","images":["/images/project1.png","/images/project2.png"]},{"year":"2021","title":"Mastery Hub","desc":"Expanding our campus to become the premier carpentry training hub.","images":["/images/hero.png","/images/project1.png"]}]', 'content'),
  ('content_about_values', '[{"title":"Honest Materials","desc":"We only work with sustainably sourced timber, ensuring our impact on the earth is as beautiful as our work."},{"title":"Lifelong Mastery","desc":"Our workshop is a school of life. We believe in continuous learning and the preservation of heritage skills."},{"title":"Future Leaders","desc":"Through our partnership with RTB, we empower the youth with certified skills and real-world industrial experience."}]', 'content')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
