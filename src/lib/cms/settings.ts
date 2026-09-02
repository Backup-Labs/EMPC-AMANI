import { createClient } from "@/lib/supabase/server";
import type { SiteContent, SiteSettings, FaqItem } from "./settings-types";
import { DEFAULT_SERVICES, DEFAULT_MILESTONES, DEFAULT_ABOUT_VALUES } from "./defaults";

export type { ServiceItem, MilestoneItem, AboutValue, SiteContent, SiteSettings, FaqItem } from "./settings-types";
export { DEFAULT_SERVICES } from "./defaults";

export const dynamic = "force-dynamic";

const DEFAULTS: SiteContent = {
  hero_title: "Craftsmanship Rooted in Heritage",
  hero_subtitle: "Bespoke carpentry and furniture from Kigali, Rwanda.",
  hero_image: "",
  about_intro: "EMPC-AMANI began as a humble carpentry workshop with a singular goal: to master the art of joinery and furniture design. Today, we stand as a beacon of artisanal excellence, blending traditional woodworking secrets with modern engineering.",
  about_heading: "Rooted in Craft. Driven by Heritage.",
  about_stat_artisans: 250,
  about_stat_heritage: 14,
  services_intro: "Master-grade carpentry and vocational training services tailored for excellence.",
  footer_tagline: "Master carpentry & vocational excellence.",
  contact_intro: "",
  faq_intro: "",
  partners: [],
  services: DEFAULT_SERVICES,
  milestones: DEFAULT_MILESTONES,
  about_values: DEFAULT_ABOUT_VALUES,
};

function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value").like("key", "content_%");

  const content = { ...DEFAULTS, milestones: [...DEFAULT_MILESTONES], about_values: [...DEFAULT_ABOUT_VALUES], services: [...DEFAULT_SERVICES] };
  (data || []).forEach((row: { key: string; value: string }) => {
    const key = row.key.replace("content_", "");
    if (key === "partners") {
      content.partners = parseJsonField(row.value, []);
    } else if (key === "services") {
      const parsed = parseJsonField<SiteContent["services"]>(row.value, []);
      content.services = parsed.length ? parsed : [...DEFAULT_SERVICES];
    } else if (key === "milestones") {
      content.milestones = parseJsonField(row.value, DEFAULT_MILESTONES);
    } else if (key === "about_values") {
      content.about_values = parseJsonField(row.value, DEFAULT_ABOUT_VALUES);
    } else if (key === "about_stat_artisans") {
      content.about_stat_artisans = parseInt(row.value, 10) || DEFAULTS.about_stat_artisans;
    } else if (key === "about_stat_heritage") {
      content.about_stat_heritage = parseInt(row.value, 10) || DEFAULTS.about_stat_heritage;
    } else if (key in content) {
      (content as Record<string, unknown>)[key] = row.value;
    }
  });
  if (!content.services.length) content.services = [...DEFAULT_SERVICES];
  return content;
}

const SETTINGS_DEFAULTS: SiteSettings = {
  company_name: "EMPC-AMANI",
  company_tagline: "Artisanal Workshop & Master Carpentry",
  contact_email: "maniraguhapierrecelestin33@gmail.com",
  contact_phone: "+250788516492",
  contact_address: "Musanze, Rwanda",
  social_instagram: "",
  social_facebook: "",
  social_twitter: "",
  social_linkedin: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");

  const settings = { ...SETTINGS_DEFAULTS };
  (data || []).forEach((row: { key: string; value: string }) => {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value;
    }
  });
  return settings;
}

export async function getPublishedFaqs(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data || [];
}
