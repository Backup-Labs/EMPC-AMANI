export interface Product {
  id: string;
  slug?: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  tags: string[];
  description?: string;
  images?: string[];
  specifications?: { label: string; value: string }[];
  features?: string[];
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  created_at?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags?: string[];
  image: string;
  content: NewsContentBlock[];
  readTime?: string;
}

export type NewsContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "image"; src: string; alt?: string };
