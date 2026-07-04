import type { Product, ProductReview } from "@/types";

export const products: Product[] = [
  {
    id: "siam-teak-table",
    title: "Siam Teak Dining Table",
    category: "Dining",
    price: 4850000,
    image_url: "/images/hero.png",
    images: ["/images/hero.png", "/images/project1.png", "/images/project2.png"],
    tags: ["Teak", "Bespoke", "Dining"],
    description:
      "Hand-crafted from sustainably sourced Burmese teak, the Siam Dining Table showcases masterful joinery and a live-edge profile that celebrates the natural character of the wood. Each piece is finished with natural oil to deepen the grain over time.",
    specifications: [
      { label: "Material", value: "Solid Burmese Teak" },
      { label: "Dimensions", value: "240 × 100 × 75 cm" },
      { label: "Finish", value: "Natural Hardwax Oil" },
      { label: "Weight", value: "68 kg" },
      { label: "Assembly", value: "Delivered fully assembled" },
      { label: "Warranty", value: "10-year craftsmanship guarantee" },
    ],
    features: [
      "Mortise-and-tenon joinery — no screws or nails",
      "Live-edge profile with hand-planed surface",
      "Sustainably sourced, FSC-certified timber",
      "Custom dimensions available on request",
      "Complimentary white-glove delivery in Kigali",
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 24,
  },
  {
    id: "artisan-credenza",
    title: "Artisan Credenza",
    category: "Storage",
    price: 3200000,
    image_url: "/images/project1.png",
    images: ["/images/project1.png", "/images/hero.png", "/images/project2.png"],
    tags: ["Walnut", "Storage", "Modern"],
    description:
      "A statement storage piece blending clean modern lines with traditional dovetail drawer construction. The Artisan Credenza features soft-close hardware and a hand-rubbed walnut finish.",
    specifications: [
      { label: "Material", value: "American Black Walnut" },
      { label: "Dimensions", value: "180 × 45 × 80 cm" },
      { label: "Drawers", value: "4 soft-close dovetail drawers" },
      { label: "Finish", value: "Hand-rubbed satin lacquer" },
      { label: "Hardware", value: "Brushed brass pulls" },
      { label: "Warranty", value: "7-year craftsmanship guarantee" },
    ],
    features: [
      "Full-extension soft-close drawer slides",
      "Hidden cable management compartment",
      "Adjustable interior shelving",
      "Anti-tip wall anchor included",
      "Available in 6 wood species",
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 18,
  },
  {
    id: "nordic-lounge-chair",
    title: "Nordic Lounge Chair",
    category: "Seating",
    price: 1850000,
    image_url: "/images/project2.png",
    images: ["/images/project2.png", "/images/project1.png", "/images/hero.png"],
    tags: ["Oak", "Seating", "Scandinavian"],
    description:
      "Inspired by mid-century Scandinavian design, the Nordic Lounge Chair pairs a sculpted white oak frame with premium linen upholstery. Ergonomically contoured for all-day comfort.",
    specifications: [
      { label: "Frame", value: "Solid White Oak" },
      { label: "Upholstery", value: "Premium Belgian Linen" },
      { label: "Dimensions", value: "72 × 78 × 82 cm" },
      { label: "Seat Height", value: "42 cm" },
      { label: "Weight Capacity", value: "150 kg" },
      { label: "Warranty", value: "5-year frame guarantee" },
    ],
    features: [
      "Steam-bent oak armrests",
      "High-density foam cushioning",
      "Removable, washable cushion covers",
      "Natural wood grain variation on every piece",
      "Matching ottoman available separately",
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: "floating-bed-frame",
    title: "Floating Bed Frame",
    category: "Bedroom",
    price: 2750000,
    image_url: "/images/hero.png",
    images: ["/images/hero.png", "/images/project2.png"],
    tags: ["Maple", "Bedroom", "Modern"],
    description:
      "Create a serene bedroom sanctuary with our Floating Bed Frame. The cantilevered design creates an illusion of weightlessness while providing rock-solid structural support.",
    specifications: [
      { label: "Material", value: "Hard Maple & Steel" },
      { label: "Sizes", value: "Queen / King" },
      { label: "Dimensions", value: "200 × 220 × 35 cm (King)" },
      { label: "LED Lighting", value: "Optional under-glow kit" },
      { label: "Weight Capacity", value: "300 kg" },
      { label: "Warranty", value: "10-year structural guarantee" },
    ],
    features: [
      "Wall-mounted cantilever design",
      "Integrated headboard with reading lights",
      "No box spring required",
      "Silent anti-squeak construction",
      "Professional installation included",
    ],
    inStock: false,
    rating: 4.9,
    reviewCount: 12,
  },
  {
    id: "live-edge-desk",
    title: "Live Edge Executive Desk",
    category: "Office",
    price: 4100000,
    image_url: "/images/project1.png",
    images: ["/images/project1.png", "/images/hero.png"],
    tags: ["Walnut", "Office", "Executive"],
    description:
      "Command your workspace with this striking live-edge executive desk. A single slab of American walnut rests on a powder-coated steel base, with integrated power and data ports.",
    specifications: [
      { label: "Top", value: "Single-slab American Walnut" },
      { label: "Base", value: "Powder-coated steel" },
      { label: "Dimensions", value: "200 × 90 × 75 cm" },
      { label: "Cable Management", value: "Built-in grommets & tray" },
      { label: "Power", value: "2× USB-C, 2× AC outlets" },
      { label: "Warranty", value: "10-year craftsmanship guarantee" },
    ],
    features: [
      "Unique live-edge — no two desks alike",
      "Epoxy-filled natural voids",
      "Leather desk pad included",
      "Modular drawer unit optional",
      "Ergonomic height customization",
    ],
    inStock: true,
    rating: 5.0,
    reviewCount: 8,
  },
  {
    id: "master-suite-set",
    title: "Master Suite Bedroom Set",
    category: "Bedroom",
    price: 8900000,
    image_url: "/images/project2.png",
    images: ["/images/project2.png", "/images/project1.png", "/images/hero.png"],
    tags: ["Oak", "Bedroom", "Collection"],
    description:
      "A complete bedroom collection featuring a platform bed, matching nightstands, and a six-drawer dresser. Crafted from quarter-sawn white oak with a warm honey finish.",
    specifications: [
      { label: "Collection", value: "Bed, 2 Nightstands, Dresser" },
      { label: "Material", value: "Quarter-sawn White Oak" },
      { label: "Bed Size", value: "King (customizable)" },
      { label: "Dresser", value: "160 × 50 × 90 cm" },
      { label: "Finish", value: "Honey stain + matte lacquer" },
      { label: "Warranty", value: "10-year collection guarantee" },
    ],
    features: [
      "Coordinated design language across all pieces",
      "Soft-close drawers throughout",
      "Felt-lined top drawers on dresser",
      "15% savings vs. individual purchase",
      "White-glove delivery and placement",
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 6,
  },
];

export const productReviews: Record<string, ProductReview[]> = {
  "siam-teak-table": [
    { id: "1", author: "Jean-Pierre M.", rating: 5, date: "12.02.26", comment: "Absolutely stunning craftsmanship. The grain on our table is breathtaking — a true centerpiece." },
    { id: "2", author: "Sarah K.", rating: 5, date: "28.01.26", comment: "Worth every franc. Delivery team was professional and the table exceeded our expectations." },
    { id: "3", author: "David R.", rating: 4, date: "15.01.26", comment: "Beautiful piece. Took a bit longer than quoted but the quality makes up for the wait." },
  ],
  "artisan-credenza": [
    { id: "1", author: "Marie L.", rating: 5, date: "05.03.26", comment: "The dovetail drawers are a work of art. Fits perfectly in our living room." },
    { id: "2", author: "Thomas B.", rating: 5, date: "20.02.26", comment: "Impeccable finish and the brass hardware is a lovely touch." },
  ],
  "nordic-lounge-chair": [
    { id: "1", author: "Amina H.", rating: 5, date: "18.02.26", comment: "So comfortable and the oak frame is incredibly solid. Gets compliments daily." },
    { id: "2", author: "Paul N.", rating: 4, date: "02.02.26", comment: "Great chair, beautiful design. Linen upholstery is premium quality." },
  ],
};

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, limit = 3): Product[] {
  const current = getProduct(id);
  if (!current) return products.slice(0, limit);
  return products.filter((p) => p.id !== id && p.category === current.category).slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(price);
}
