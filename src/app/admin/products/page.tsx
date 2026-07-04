"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { useToast } from "@/components/ui/Toast";
import { ProductImageManager, imagesToPayload, payloadToImages, type ProductImage } from "@/components/admin/ProductImageManager";
import { AdminTableSkeleton } from "@/components/admin/ui/AdminSkeleton";
import type { Product } from "@/types/database";
import { slugify } from "@/lib/format";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "price">("newest");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      toast("Failed to load products. Check database configuration.", "error");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))] as string[],
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (statusFilter === "published") list = list.filter((p) => p.published !== false);
    if (statusFilter === "draft") list = list.filter((p) => p.published === false);
    if (statusFilter === "featured") list = list.filter((p) => p.featured);
    if (statusFilter === "out_of_stock") list = list.filter((p) => p.in_stock === false);
    if (categoryFilter !== "all") list = list.filter((p) => p.category === categoryFilter);

    list.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "price") return (b.price || 0) - (a.price || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [products, search, statusFilter, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, statusFilter, categoryFilter, sortBy]);

  const resetForm = () => {
    setEditingProduct(null);
    setTitle("");
    setCategory("");
    setPrice("");
    setProductImages([]);
    setDescription("");
    setTagsInput("");
    setPublished(true);
    setFeatured(false);
    setInStock(true);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category || "");
    setPrice(product.price ? product.price.toString() : "");
    setProductImages(payloadToImages(product.image_url, (product as Product & { images?: string[] }).images));
    setDescription(product.description || "");
    setTagsInput(product.tags ? product.tags.join(", ") : "");
    setPublished(product.published !== false);
    setFeatured(!!product.featured);
    setInStock(product.in_stock !== false);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
      toast("Product deleted");
    } catch {
      toast("Failed to delete product", "error");
    }
  };

  const handleTogglePublish = async (product: Product) => {
    const next = product.published === false;
    try {
      const { error } = await supabase.from("products").update({ published: next }).eq("id", product.id);
      if (error) throw error;
      setProducts(products.map((p) => (p.id === product.id ? { ...p, published: next } : p)));
      toast(next ? "Product published" : "Product moved to draft");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);

    const parsedTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const { image_url, images } = imagesToPayload(productImages);
    const payload = {
      title,
      slug: slugify(title),
      category: category || null,
      price: price ? parseFloat(price) : null,
      image_url,
      images,
      description: description || null,
      tags: parsedTags,
      published,
      featured,
      in_stock: inStock,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
        toast("Product updated");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        toast("Product created");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statusTabs = [
    { id: "all", label: "All", count: products.length },
    { id: "published", label: "Published", count: products.filter((p) => p.published !== false).length },
    { id: "draft", label: "Drafts", count: products.filter((p) => p.published === false).length },
    { id: "featured", label: "Featured", count: products.filter((p) => p.featured).length },
    { id: "out_of_stock", label: "Out of Stock", count: products.filter((p) => p.in_stock === false).length },
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        label="Catalog"
        title="Products Manager"
        description="Full CRUD for inventory — search, filter, draft/publish, and featured products."
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex h-11 items-center px-5 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
          >
            Add Product <Plus size={16} className="ml-2" />
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <AdminFilterTabs tabs={statusTabs} active={statusFilter} onChange={setStatusFilter} />
        <div className="flex flex-wrap gap-3 items-center">
          <AdminSearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 px-4 rounded-full border border-border bg-muted/50 text-sm font-bold focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-11 px-4 rounded-full border border-border bg-muted/50 text-sm font-bold focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="title">Title A–Z</option>
            <option value="price">Price High–Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <AdminEmptyState icon={Package} title="No products found" description="Adjust filters or add your first product." />
      ) : (
        <>
          <div className="card-elevated overflow-hidden border border-border/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Item</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Category</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Price</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <div className="h-11 w-11 rounded-lg overflow-hidden border border-border bg-white shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.image_url} alt={p.title} className="object-cover h-full w-full" />
                            </div>
                          ) : (
                            <div className="h-11 w-11 rounded-lg border border-border flex items-center justify-center text-[10px] font-bold text-foreground/40 bg-muted shrink-0">—</div>
                          )}
                          <div>
                            <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                              {p.title}
                              {p.featured && <Star size={12} className="fill-amber-400 text-amber-400" />}
                            </span>
                            {p.tags?.length > 0 && (
                              <span className="text-[10px] text-foreground/45 font-bold">{p.tags.slice(0, 2).join(" · ")}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-foreground/70 uppercase">{p.category || "—"}</td>
                      <td className="p-4 text-sm font-bold text-primary">
                        {p.price ? `$${p.price.toLocaleString()}` : "Quote"}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider cursor-pointer w-fit ${
                              p.published !== false ? "text-emerald-600" : "text-foreground/40"
                            }`}
                          >
                            {p.published !== false ? <><Eye size={12} /> Live</> : <><EyeOff size={12} /> Draft</>}
                          </button>
                          {p.in_stock === false && (
                            <span className="text-[10px] font-bold text-rose-500 uppercase">Out of stock</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEdit(p)} className="h-8 w-8 rounded-full flex items-center justify-center text-foreground/60 border border-border hover:bg-primary hover:text-background transition-colors cursor-pointer" aria-label="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 border border-border hover:bg-rose-50 transition-colors cursor-pointer" aria-label="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground/50 m-0">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-9 px-4 rounded-full border border-border text-sm font-bold disabled:opacity-40 cursor-pointer">Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-9 px-4 rounded-full border border-border text-sm font-bold disabled:opacity-40 cursor-pointer">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? "Edit Product" : "Create Product"} size="xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Siam Teak Table" className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Dining" className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Price (RWF)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4850000" className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Product Images</label>
            <ProductImageManager images={productImages} onChange={setProductImages} bucket="products" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." className="bg-transparent border border-border rounded-xl focus:border-foreground outline-none font-medium text-sm p-3 resize-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Tags (comma-separated)</label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Hardwood, Bespoke" className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
          </div>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
              In Stock
            </label>
          </div>
          <button type="submit" disabled={submitting} className="h-12 bg-primary text-background font-black rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer">
            {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
