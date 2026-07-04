// Shared database types — extend Supabase tables as schema evolves

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partial";
export type UserRole = "admin" | "editor" | "viewer";

export interface AdminProfile {
  id: string;
  full_name: string;
  role: UserRole;
  email?: string;
  created_at?: string;
}

export interface CustomerProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  newsletter_subscribed: boolean;
  status: "active" | "suspended";
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id?: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: "draft" | "sent" | "scheduled";
  sent_at: string | null;
  recipient_count: number;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  folder: string;
  mime_type: string;
  size_bytes: number | null;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  category: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  tags: string[];
  description?: string;
  in_stock?: boolean;
  published?: boolean;
  featured?: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  approved: boolean;
  avatar_url?: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  post_type?: "internal" | "external";
  external_url?: string | null;
  external_source?: string | null;
  category?: string | null;
  tags?: string[];
  author?: string | null;
  scheduled_at?: string | null;
  created_at: string;
}

export interface Subscriber {
  email: string;
  created_at?: string;
  status?: "active" | "unsubscribed";
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_title?: string;
  product_image?: string;
  product_price?: number;
  created_at: string;
}
