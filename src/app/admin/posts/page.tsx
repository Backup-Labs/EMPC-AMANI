"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  created_at: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Form/Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      // Auto-generate slug for new posts
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      setSlug(generated);
    }
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setPublished(false);
    setUploadFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setCoverImage(post.cover_image || "");
    setPublished(post.published || false);
    setUploadFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ published: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, published: !currentStatus } : p
        )
      );
    } catch (err) {
      console.error("Error toggling publish status:", err);
      alert("Failed to toggle publish status.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) return;

    setSubmitting(true);
    let currentCoverUrl = coverImage;

    try {
      // 1. Optional storage file upload using Cloudinary API route
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to upload cover image to Cloudinary.");
        }

        const data = await res.json();
        currentCoverUrl = data.url;
      }

      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: currentCoverUrl || null,
        published,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", editingPost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert([payload]);
        if (error) throw error;
      }

      setModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      console.error("Error saving post:", err);
      alert(err.message || "Failed to save post. Verify database table schema and unique slug.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-black text-[12px] uppercase tracking-widest text-primary">Content</span>
          <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
            News & Blog Manager
          </h1>
          <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
            Create, edit, and publish posts to the EMPC stories section.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex h-12 items-center px-6 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
        >
          New Post <Plus size={16} className="ml-2" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-muted p-16 rounded-3xl border border-border/40 text-center">
          <p className="text-foreground/60 text-lg font-bold m-0">No posts in the database yet.</p>
        </div>
      ) : (
        <div className="card-layered overflow-hidden shadow-xs border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Post</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Slug</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Created At</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-wider text-foreground/45 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {post.cover_image ? (
                          <div className="h-12 w-16 rounded-lg overflow-hidden relative border border-border bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.cover_image} alt={post.title} className="object-cover h-full w-full" />
                          </div>
                        ) : (
                          <div className="h-12 w-16 rounded-lg border border-border flex items-center justify-center text-xs font-bold text-foreground/40 bg-muted">
                            Text
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold text-base text-foreground leading-snug">{post.title}</span>
                          <span className="text-[11px] text-foreground/50 line-clamp-1">{post.excerpt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-mono text-foreground/60">{post.slug}</td>
                    <td className="p-5 text-sm font-bold text-foreground/75">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer ${
                          post.published ? "text-primary animate-pulse-once" : "text-foreground/40"
                        }`}
                      >
                        {post.published ? (
                          <>
                            <Eye size={14} /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/60 border border-border hover:bg-primary hover:text-background transition-colors cursor-pointer"
                          aria-label="Edit post"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="h-9 w-9 rounded-full flex items-center justify-center text-red-500 border border-border hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Delete post"
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
            className="w-full max-w-2xl bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-black text-xl uppercase tracking-wider text-foreground">
                {editingPost ? "Edit Blog Post" : "Create Blog Post"}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Art of Modern Joinery"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Slug</label>
                  <input
                    required
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="art-of-modern-joinery"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summarize the article in one sentence..."
                  className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/images/hero.png"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Upload Cover File (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 text-sm font-bold text-foreground/60 cursor-pointer file:cursor-pointer file:h-10 file:px-4 file:rounded-full file:border-0 file:bg-muted file:text-foreground file:font-black file:text-xs file:uppercase file:tracking-wide file:mr-4 hover:file:opacity-90"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Content (Markdown/HTML)</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the blog post contents..."
                  className="bg-transparent border border-border rounded-xl focus:border-foreground outline-none font-bold text-sm transition-colors resize-none p-4"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="published" className="text-sm font-bold text-foreground/75 cursor-pointer select-none">
                  Publish article immediately
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : editingPost ? "Update Story" : "Publish Story"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
