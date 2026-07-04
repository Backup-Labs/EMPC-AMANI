import type { ServiceItem, MilestoneItem, AboutValue } from "./settings-types";

export const DEFAULT_SERVICES: ServiceItem[] = [
  { num: "01", title: "Bespoke Furniture", desc: "From concept sketches to the final coat of oil. We craft tables, chairs, and cabinets that become the heart of any room.", stat: 2500, suffix: "+", statLabel: "Crafted Pieces", image: "/images/hero.png" },
  { num: "02", title: "Commercial Woodwork", desc: "Large-scale carpentry for boutique hotels, modern offices, and artisanal retail environments.", stat: 85, suffix: "+", statLabel: "Enterprises", image: "/images/project1.png" },
  { num: "03", title: "Restoration & Care", desc: "Breathe new life into heritage timber. We restore, rework, and refine existing woodwork with expert care.", stat: 150, suffix: "+", statLabel: "Master Restorations", image: "/images/project2.png" },
  { num: "04", title: "Internships & Training", desc: "Empowering the next generation with certified vocational training in partnership with RTB.", stat: 500, suffix: "+", statLabel: "Certified Artisans", image: "/images/project1.png" },
];

export const DEFAULT_MILESTONES: MilestoneItem[] = [
  { year: "1990", title: "Workshop Founded", desc: "EMPC-AMANI begins with two benches and a passion for solid wood.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2010", title: "Industrial Expansion", desc: "Scale production for boutique hotels and luxury offices began.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2020", title: "Vocational Partnership", desc: "Launched our first student certification program with RTB.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "2021", title: "Mastery Hub", desc: "Expanding our campus to become the premier carpentry training hub.", images: ["/images/hero.png", "/images/project1.png"] },
];

export const DEFAULT_ABOUT_VALUES: AboutValue[] = [
  { title: "Honest Materials", desc: "We only work with sustainably sourced timber, ensuring our impact on the earth is as beautiful as our work." },
  { title: "Lifelong Mastery", desc: "Our workshop is a school of life. We believe in continuous learning and the preservation of heritage skills." },
  { title: "Future Leaders", desc: "Through our partnership with RTB, we empower the youth with certified skills and real-world industrial experience." },
];
