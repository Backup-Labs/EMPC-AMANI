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

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}
