"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  tags: string[];
  created_at: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle("");
    setCategory("");
    setPrice("");
    setImageUrl("");
    setTagsInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category || "");
    setPrice(product.price ? product.price.toString() : "");
    setImageUrl(product.image_url || "");
    setTagsInput(product.tags ? product.tags.join(", ") : "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please verify database table exists.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSubmitting(true);
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const payload = {
      title,
      category: category || null,
      price: price ? parseFloat(price) : null,
      image_url: imageUrl || null,
      tags: parsedTags,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert(err.message || "Failed to save product. Please check database configuration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">Catalog</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            Products Manager
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Add, update, or remove furniture inventory items.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex h-12 items-center px-6 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
        >
          Add Product <Plus size={16} className="ml-2" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No products found in the catalog.</p>
        </div>
      ) : (
        <div className="card-layered overflow-hidden shadow-xs border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Item</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Category</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Price</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Tags</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {p.image_url ? (
                          <div className="h-12 w-12 rounded-lg overflow-hidden relative border border-border bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image_url} alt={p.title} className="object-cover h-full w-full" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-lg border border-border flex items-center justify-center text-xs font-bold text-foreground/40 bg-muted">
                            No Img
                          </div>
                        )}
                        <span className="font-bold text-base text-foreground">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-foreground/75 uppercase tracking-wide">
                      {p.category || "—"}
                    </td>
                    <td className="p-5 text-sm font-bold text-primary">
                      {p.price ? `$${p.price.toLocaleString()}` : "Contact for price"}
                    </td>
                    <td className="p-5 text-xs">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags?.map((t) => (
                          <span key={t} className="bg-muted px-2.5 py-1 rounded-full text-foreground/60 font-bold uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/60 border border-border hover:bg-primary hover:text-background transition-colors cursor-pointer"
                          aria-label="Edit product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-red-500 border border-border hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Delete product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-black text-xl uppercase tracking-wider text-foreground">
                {editingProduct ? "Edit Product" : "Create Product"}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Siam Teak Table"
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Dining"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Price (USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/hero.png or external link"
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Hardwood, Bespoke, Luxury"
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : editingProduct ? "Update Catalog" : "Add to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
