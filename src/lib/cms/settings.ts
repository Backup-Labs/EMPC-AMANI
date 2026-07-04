import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  stat: number;
  suffix: string;
  statLabel: string;
  image: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  desc: string;
  images: string[];
}

export interface AboutValue {
  title: string;
  desc: string;
}

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_intro: string;
  about_heading: string;
  about_stat_artisans: number;
  about_stat_heritage: number;
  services_intro: string;
  footer_tagline: string;
  contact_intro: string;
  faq_intro: string;
  partners: { name: string; icon: string }[];
  services: ServiceItem[];
  milestones: MilestoneItem[];
  about_values: AboutValue[];
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  { year: "1990", title: "Workshop Founded", desc: "EMPC-AMANI begins with two benches and a passion for solid wood.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2010", title: "Industrial Expansion", desc: "Scale production for boutique hotels and luxury offices began.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2020", title: "Vocational Partnership", desc: "Launched our first student certification program with RTB.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "2021", title: "Mastery Hub", desc: "Expanding our campus to become the premier carpentry training hub.", images: ["/images/hero.png", "/images/project1.png"] },
];

const DEFAULT_ABOUT_VALUES: AboutValue[] = [
  { title: "Honest Materials", desc: "We only work with sustainably sourced timber, ensuring our impact on the earth is as beautiful as our work." },
  { title: "Lifelong Mastery", desc: "Our workshop is a school of life. We believe in continuous learning and the preservation of heritage skills." },
  { title: "Future Leaders", desc: "Through our partnership with RTB, we empower the youth with certified skills and real-world industrial experience." },
];

const DEFAULTS: SiteContent = {
  hero_title: "Craftsmanship Rooted in Heritage",
  hero_subtitle: "Bespoke carpentry and furniture from Kigali, Rwanda.",
  hero_image: "",
  about_intro: "EMPC-AMANI began as a humble carpentry workshop with a singular goal: to master the art of joinery and furniture design. Today, we stand as a beacon of artisanal excellence, blending traditional woodworking secrets with modern engineering.",
  about_heading: "Rooted in Craft. Driven by Heritage.",
  about_stat_artisans: 250,
  about_stat_heritage: 14,
  services_intro: "",
  footer_tagline: "Master carpentry & vocational excellence.",
  contact_intro: "",
  faq_intro: "",
  partners: [],
  services: [],
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

  const content = { ...DEFAULTS, milestones: [...DEFAULT_MILESTONES], about_values: [...DEFAULT_ABOUT_VALUES] };
  (data || []).forEach((row: { key: string; value: string }) => {
    const key = row.key.replace("content_", "");
    if (key === "partners") {
      content.partners = parseJsonField(row.value, []);
    } else if (key === "services") {
      content.services = parseJsonField(row.value, []);
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
  return content;
}

export interface SiteSettings {
  company_name: string;
  company_tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_instagram: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
}

const SETTINGS_DEFAULTS: SiteSettings = {
  company_name: "EMPC-AMANI",
  company_tagline: "Artisanal Workshop & Master Carpentry",
  contact_email: "info@empc-amani.com",
  contact_phone: "+250 788 123 456",
  contact_address: "Kigali, Rwanda",
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

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
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
