/**
 * EMPC database seed script
 * Usage: npm run seed
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DATABASE_URL  (recommended — enables schema migration before seeding)
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { runMigrations } from "./migrate.mjs";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

function missingColumn(message) {
  const postgrest = message.match(/Could not find the '(\w+)' column/);
  if (postgrest) return postgrest[1];
  const pg = message.match(/column "(\w+)" (?:of relation "\w+" )?does not exist/i);
  if (pg) return pg[1];
  return null;
}

/** Strip columns the DB doesn't have yet, retry until insert succeeds or hard-fails */
async function upsertAdaptive(table, rows, options = {}) {
  let payload = rows.map((r) => ({ ...r }));
  let opts = { ...options };

  for (let attempt = 0; attempt < 30; attempt++) {
    const { error } = await supabase.from(table).upsert(payload, opts);

    if (!error) return { ok: true, count: payload.length };

    const col = missingColumn(error.message);
    if (col) {
      payload = payload.map((row) => {
        const next = { ...row };
        delete next[col];
        return next;
      });
      if (opts.onConflict === col) {
        const { onConflict: _, ...rest } = opts;
        opts = rest;
      }
      continue;
    }

    if (error.message.includes("invalid input syntax for type uuid") && payload.some((r) => r.id)) {
      payload = payload.map((row) => {
        const next = { ...row };
        delete next.id;
        return next;
      });
      continue;
    }

    if (error.message.includes("no unique or exclusion constraint") && opts.onConflict) {
      const { onConflict: _, ...rest } = opts;
      opts = rest;
      continue;
    }

    const tableMatch = error.message.match(/Could not find the table 'public\.(\w+)'/);
    if (tableMatch) {
      return { ok: false, missingTable: tableMatch[1], error: error.message };
    }

    return { ok: false, error: error.message };
  }

  return { ok: false, error: "Too many schema mismatches — run npm run migrate first" };
}

async function insertAdaptive(table, rows) {
  let payload = rows.map((r) => ({ ...r }));

  for (let attempt = 0; attempt < 30; attempt++) {
    const { error } = await supabase.from(table).insert(payload);

    if (!error) return { ok: true, count: payload.length };

    if (error.message.includes("duplicate") || error.code === "23505") {
      return { ok: true, skipped: true };
    }

    const col = missingColumn(error.message);
    if (col) {
      payload = payload.map((row) => {
        const next = { ...row };
        delete next[col];
        return next;
      });
      if (opts.onConflict === col) {
        const { onConflict: _, ...rest } = opts;
        opts = rest;
      }
      continue;
    }

    if (error.message.includes("invalid input syntax for type uuid") && payload.some((r) => r.id)) {
      payload = payload.map((row) => {
        const next = { ...row };
        delete next.id;
        return next;
      });
      continue;
    }

    const tableMatch = error.message.match(/Could not find the table 'public\.(\w+)'/);
    if (tableMatch) {
      return { ok: false, missingTable: tableMatch[1], error: error.message };
    }

    return { ok: false, error: error.message };
  }

  return { ok: false, error: "Too many schema mismatches — run npm run migrate first" };
}

async function seed() {
  const hasDbUrl = !!(
    process.env.DIRECT_URL ||
    process.env.SUPABASE_DB_DIRECT_URL ||
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL
  );

  let migrated = false;
  if (hasDbUrl) {
    console.log("Step 1/2 — Applying schema migrations...");
    try {
      migrated = await runMigrations({ silent: false });
      console.log("");
    } catch (err) {
      console.warn("\n⚠ Schema migration failed — continuing with REST seed.");
      console.warn("  Fix: set DIRECT_URL to Supabase **Direct connection** URI in .env.local");
      console.warn("  Or run: supabase/migrations/005_schema_ensure.sql in Supabase SQL Editor\n");
      if (err instanceof Error && err.message) {
        console.warn(err.message.split("\n").slice(0, 6).join("\n") + "\n");
      }
    }
  } else {
    console.warn("⚠ No DIRECT_URL / DATABASE_URL — skipping schema migration.");
    console.warn("  Add DIRECT_URL for full seed (products with all fields, FAQs).\n");
  }

  console.log("Step 2/2 — Inserting seed data...\n");

  const products = [
    {
      slug: "siam-teak-table",
      title: "Siam Teak Dining Table",
      category: "Dining",
      price: 4850000,
      image_url: "/images/hero.png",
      tags: ["Teak", "Bespoke", "Dining"],
      description: "Hand-crafted from sustainably sourced Burmese teak.",
      in_stock: true,
      published: true,
      featured: true,
      images: ["/images/hero.png", "/images/project1.png"],
      specifications: [{ label: "Material", value: "Solid Burmese Teak" }],
      features: ["Mortise-and-tenon joinery"],
    },
    {
      slug: "artisan-credenza",
      title: "Artisan Credenza",
      category: "Storage",
      price: 3200000,
      image_url: "/images/project1.png",
      tags: ["Walnut", "Storage"],
      description: "Modern storage with dovetail drawers.",
      in_stock: true,
      published: true,
      featured: true,
      images: ["/images/project1.png"],
      specifications: [],
      features: [],
    },
    {
      slug: "nordic-lounge-chair",
      title: "Nordic Lounge Chair",
      category: "Seating",
      price: 1850000,
      image_url: "/images/project2.png",
      tags: ["Oak", "Seating"],
      description: "Scandinavian lounge chair in white oak.",
      in_stock: true,
      published: true,
      featured: false,
      images: ["/images/project2.png"],
      specifications: [],
      features: [],
    },
  ];

  const pResult = await upsertAdaptive("products", products, { onConflict: "slug" });
  if (pResult.ok) {
    console.log(`✓ ${pResult.count} products`);
  } else {
    const minimal = products.map(({ title, category, price, image_url, tags }) => ({
      title, category, price, image_url, tags,
    }));
    const fallback = await insertAdaptive("products", minimal);
    if (fallback.ok) console.log(fallback.skipped ? "✓ products (already seeded)" : `✓ ${fallback.count} products (core fields)`);
    else console.warn("Products:", pResult.error || fallback.error);
  }

  const gallery = [
    { title: "Kigali Boutique Hotel Lobby", description: "Custom reception desk in African mahogany.", image_url: "/images/hero.png", category: "Commercial", published: true },
    { title: "Modern Dining Suite", description: "Complete dining room for Nyarutarama residence.", image_url: "/images/project1.png", category: "Residential", published: true },
    { title: "Executive Office Fit-out", description: "Conference table and shelving for tech startup.", image_url: "/images/project2.png", category: "Office", published: true },
  ];
  const gResult = await insertAdaptive("gallery", gallery);
  if (gResult.ok) console.log(gResult.skipped ? "✓ gallery (already seeded)" : "✓ gallery items");
  else console.warn("Gallery:", gResult.error);

  const posts = [
    {
      title: "The Art of Mortise and Tenon Joinery",
      slug: "art-of-mortise-tenon",
      excerpt: "Why traditional joinery remains the gold standard.",
      content: "<p>At EMPC-AMANI, every structural connection is a testament to centuries of woodworking wisdom.</p>",
      cover_image: "/images/hero.png",
      published: true,
      category: "Craftsmanship",
      tags: ["joinery"],
      author: "Jean-Pierre Nkurunziza",
    },
    {
      title: "Sustainable Timber Sourcing in Rwanda",
      slug: "sustainable-timber-rwanda",
      excerpt: "Partnering with local cooperatives.",
      content: "<p>Sustainability is a commitment we take seriously.</p>",
      cover_image: "/images/project1.png",
      published: true,
      category: "Sustainability",
      tags: ["timber"],
      author: "Marie Uwimana",
    },
  ];
  const postResult = await upsertAdaptive("posts", posts, { onConflict: "slug" });
  if (postResult.ok) console.log(`✓ ${postResult.count} posts`);
  else console.warn("Posts:", postResult.error);

  const testimonials = [
    { name: "Sarah Niyonsaba", role: "Homeowner", message: "Extraordinary craftsmanship on our dining room.", rating: 5, approved: true },
    { name: "David Okello", role: "Hotel Manager", message: "Lobby fit-out exceeded our design brief.", rating: 5, approved: true },
  ];
  const tResult = await insertAdaptive("testimonials", testimonials);
  if (tResult.ok) console.log(tResult.skipped ? "✓ testimonials (already seeded)" : "✓ testimonials");
  else console.warn("Testimonials:", tResult.error);

  const faqs = [
    { question: "How long does a custom order take?", answer: "Standard bespoke pieces take 4–8 weeks.", sort_order: 1, published: true },
    { question: "Do you deliver outside Kigali?", answer: "Yes, throughout Rwanda and select international destinations.", sort_order: 2, published: true },
    { question: "Can I visit the workshop?", answer: "Absolutely. We welcome studio visits by appointment.", sort_order: 3, published: true },
  ];
  const fResult = await insertAdaptive("faqs", faqs);
  if (fResult.ok) console.log(fResult.skipped ? "✓ FAQs (already seeded)" : `✓ ${fResult.count} FAQs`);
  else if (fResult.missingTable) {
    console.warn("FAQs: table missing — run `npm run migrate` with DATABASE_URL set");
  } else console.warn("FAQs:", fResult.error);

  const settings = [
    { key: "contact_email", value: "info@empc-amani.com" },
    { key: "contact_phone", value: "+250 788 123 456" },
    { key: "contact_address", value: "KG 7 Ave, Kigali, Rwanda" },
    { key: "company_name", value: "EMPC-AMANI" },
    { key: "company_tagline", value: "Artisanal Workshop & Master Carpentry" },
    { key: "social_instagram", value: "https://instagram.com/empc-amani" },
    { key: "social_facebook", value: "https://facebook.com/empc-amani" },
    { key: "content_hero_title", value: "Craftsmanship Rooted in Heritage" },
    { key: "content_hero_subtitle", value: "Bespoke carpentry and furniture from Kigali, Rwanda." },
    { key: "content_about_heading", value: "Rooted in Craft. Driven by Heritage." },
    { key: "content_about_stat_artisans", value: "250" },
    { key: "content_about_stat_heritage", value: "14" },
  ];
  const { error: sErr } = await supabase.from("settings").upsert(settings, { onConflict: "key" });
  if (sErr) console.warn("Settings:", sErr.message);
  else console.log(`✓ ${settings.length} settings`);

  console.log("\nSeed complete.");
  if (!migrated) {
    console.log("\nTip: For full schema + FAQs, either:");
    console.log("  • Set DIRECT_URL (Supabase → Database → Direct connection) and re-run npm run seed");
    console.log("  • Or paste supabase/migrations/005_schema_ensure.sql into Supabase SQL Editor");
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
