import type { NewsPost } from "@/types";

export const newsPosts: NewsPost[] = [
  {
    slug: "the-heritage-of-wood",
    title: "The Heritage of Wood",
    excerpt: "Exploring how traditional timber joinery is reshaping the modern home aesthetic with soul and longevity.",
    date: "20.03.26",
    author: "Amani",
    category: "Craftsmanship",
    tags: ["Wood", "Tradition", "Joinery"],
    image: "/images/hero.png",
    readTime: "6 min read",
    content: [
      { type: "p", text: "Working with timber is a conversation with time. At EMPC-AMANI, we believe that every knot and grain pattern in the wood tells a story of the forest it came from." },
      { type: "h2", text: "The Master's Touch" },
      { type: "p", text: "Traditional joinery—without screws or nails—remains the gold standard of high-end carpentry. Our artisans spend years mastering dovetails and mortise-and-tenon joints to ensure every piece of furniture lasts for generations." },
      { type: "image", src: "/images/project1.png", alt: "Artisan at work" },
      { type: "p", text: "But craftsmanship isn't just about the past. We integrate modern precision tools to achieve tolerances that were once impossible, creating a perfect marriage of old-world soul and new-world accuracy." },
      { type: "h2", text: "Sustainable Sourcing" },
      { type: "p", text: "Every board that enters our workshop is traceable to its origin. We partner with certified sustainable forestry operations across East Africa, ensuring that our craft supports rather than depletes the natural world." },
      { type: "h3", text: "Why Solid Wood Matters" },
      { type: "p", text: "Unlike engineered alternatives, solid wood develops a patina that deepens with age. Scratches can be sanded away, finishes can be refreshed, and the piece can be passed down through generations — a true heirloom." },
    ],
  },
  {
    slug: "art-of-joinery",
    title: "Art of Joinery",
    excerpt: "Dovetails and tenons: we deep dive into the pros and cons of traditional vs. modern assembly techniques.",
    date: "15.03.26",
    author: "Elena",
    category: "Technique",
    tags: ["Joinery", "Technique", "Dovetail"],
    image: "/images/project1.png",
    readTime: "8 min read",
    content: [
      { type: "p", text: "Joinery is the invisible architecture of fine furniture. The joints you never see are often what determine whether a piece lasts decades or falls apart in years." },
      { type: "h2", text: "Dovetail Joints" },
      { type: "p", text: "The dovetail is perhaps the most celebrated joint in woodworking. Its interlocking pins and tails create a mechanical bond that resists pulling apart — ideal for drawer construction where daily use demands durability." },
      { type: "image", src: "/images/project2.png", alt: "Dovetail joint detail" },
      { type: "h2", text: "Mortise and Tenon" },
      { type: "p", text: "For frame construction — table legs, chair rails, door frames — the mortise and tenon remains unrivaled. We cut these by hand for our premium line, achieving a fit so precise that glue is almost unnecessary." },
      { type: "h3", text: "Modern Complements" },
      { type: "p", text: "CNC machining allows us to produce complex joints at scale without sacrificing quality. The key is knowing when to use machine precision and when to rely on the craftsman's eye." },
    ],
  },
  {
    slug: "workshop-milestones",
    title: "Workshop Milestones",
    excerpt: "Reflecting on our 14-year journey from two workbenches to a premier vocational training hub.",
    date: "10.03.26",
    author: "Marco",
    category: "Heritage",
    tags: ["History", "Training", "RTB"],
    image: "/images/project2.png",
    readTime: "5 min read",
    content: [
      { type: "p", text: "Fourteen years ago, EMPC-AMANI started with two workbenches, a handful of chisels, and an unwavering belief that Rwanda could produce world-class furniture." },
      { type: "h2", text: "From Workshop to Academy" },
      { type: "p", text: "What began as a small custom furniture operation has grown into a dual-purpose institution: a production workshop serving clients across East Africa, and a vocational training center certified by RTB." },
      { type: "image", src: "/images/hero.png", alt: "EMPC workshop" },
      { type: "h2", text: "Looking Forward" },
      { type: "p", text: "Our next chapter includes expanding the training campus, launching an apprenticeship exchange program with European master craftsmen, and opening a design showroom in Kigali's city center." },
      { type: "h3", text: "By the Numbers" },
      { type: "p", text: "2,500+ bespoke pieces delivered. 85 master artisans trained. 14 years of continuous operation. And we're just getting started." },
    ],
  },
];

export function getNewsPost(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 2): NewsPost[] {
  const current = getNewsPost(slug);
  if (!current) return newsPosts.slice(0, limit);
  return newsPosts.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}
