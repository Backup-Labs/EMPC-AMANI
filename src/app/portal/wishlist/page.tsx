"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { WishlistItem } from "@/types/database";

export default function PortalWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);
      const { data } = await supabase.from("wishlist").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const remove = async (id: string) => {
    await supabase.from("wishlist").delete().eq("id", id);
    setItems(items.filter((i) => i.id !== id));
  };

  const formatPrice = (n?: number) =>
    n ? new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n) : "";

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">Account</span>
        <h1 className="font-black text-[2rem] leading-none tracking-tight mt-2 m-0">My Wishlist</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div>
      ) : items.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <Heart size={32} className="mx-auto text-foreground/25 mb-4" />
          <p className="font-bold text-foreground/50 m-0">Your wishlist is empty.</p>
          <Link href="/products" className="inline-block mt-4 text-sm font-bold text-primary no-underline">Discover Products →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card-elevated overflow-hidden flex">
              {item.product_image && (
                <div className="relative w-24 shrink-0 bg-muted">
                  <Image src={item.product_image} alt="" fill sizes="96px" className="object-cover" />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product_id}`} className="font-bold text-sm text-foreground no-underline hover:text-primary">{item.product_title}</Link>
                  {item.product_price && <p className="font-black text-primary text-sm m-0 mt-1">{formatPrice(item.product_price)}</p>}
                </div>
                <button onClick={() => remove(item.id)} className="self-end h-8 w-8 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer mt-2">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
