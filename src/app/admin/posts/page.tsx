"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminSearchBar } from "@/components/admin/ui/AdminSearchBar";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { useToast } from "@/components/ui/Toast";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { stripHtml } from "@/lib/sanitize";
import type { Post } from "@/types/database";

export default function AdminPosts() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postType, setPostType] = useState<"internal" | "external">("internal");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalSource, setExternalSource] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [author, setAuthor] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [published, setPublished] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Error loading posts:", err);
      toast("Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...posts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.external_source?.toLowerCase().includes(q)
      );
    }
    if (typeFilter === "internal") list = list.filter((p) => (p.post_type || "internal") === "internal");
    if (typeFilter === "external") list = list.filter((p) => p.post_type === "external");
    if (typeFilter === "published") list = list.filter((p) => p.published);
    if (typeFilter === "draft") list = list.filter((p) => !p.published);
    return list;
  }, [posts, search, typeFilter]);

  const typeTabs = [
    { id: "all", label: "All", count: posts.length },
    { id: "internal", label: "Blog", count: posts.filter((p) => (p.post_type || "internal") === "internal").length },
    { id: "external", label: "Media", count: posts.filter((p) => p.post_type === "external").length },
    { id: "published", label: "Live", count: posts.filter((p) => p.published).length },
    { id: "draft", label: "Drafts", count: posts.filter((p) => !p.published).length },
  ];

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim());
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setPostType("internal");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setExternalUrl("");
    setExternalSource("");
    setCategory("");
    setTagsInput("");
    setAuthor("");
    setScheduledAt("");
    setPublished(false);
    setUploadFile(null);
  };

  const handleOpenCreate = (type: "internal" | "external" = "internal") => {
    resetForm();
    setPostType(type);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setPostType(post.post_type || "internal");
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setCoverImage(post.cover_image || "");
    setExternalUrl(post.external_url || "");
    setExternalSource(post.external_source || "");
    setCategory(post.category || "");
    setTagsInput(post.tags?.join(", ") || "");
    setAuthor(post.author || "");
    setScheduledAt(post.scheduled_at ? post.scheduled_at.slice(0, 16) : "");
    setPublished(post.published || false);
    setUploadFile(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
      toast("Post deleted");
    } catch {
      toast("Failed to delete post", "error");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("posts").update({ published: !currentStatus }).eq("id", id);
      if (error) throw error;
      setPosts(posts.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p)));
      toast(!currentStatus ? "Post published" : "Post unpublished");
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    if (postType === "internal" && !stripHtml(content).trim()) return;
    if (postType === "external" && !externalUrl) return;

    setSubmitting(true);
    let currentCoverUrl = coverImage;

    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("bucket", "news");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to upload cover image.");
        }
        const data = await res.json();
        currentCoverUrl = data.url;
      }

      const parsedTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        content: postType === "external" ? (content || excerpt || title) : content,
        cover_image: currentCoverUrl || null,
        published: scheduledAt ? false : published,
        post_type: postType,
        external_url: postType === "external" ? externalUrl : null,
        external_source: postType === "external" ? externalSource || null : null,
        category: category || null,
        tags: parsedTags,
        author: author || null,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };

      if (editingPost) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editingPost.id);
        if (error) throw error;
        toast("Post updated");
      } else {
        const { error } = await supabase.from("posts").insert([payload]);
        if (error) throw error;
        toast(scheduledAt ? "Post scheduled" : published ? "Post published" : "Draft saved");
      }

      setModalOpen(false);
      fetchPosts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save post";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        label="Content"
        title="News & Blog Manager"
        description="Internal articles, external media coverage, scheduling, and draft/publish workflow."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleOpenCreate("internal")} className="inline-flex h-11 items-center px-5 rounded-full bg-primary text-background font-black hover:opacity-90 text-sm cursor-pointer shadow-md">
              New Article <Plus size={16} className="ml-2" />
            </button>
            <button onClick={() => handleOpenCreate("external")} className="inline-flex h-11 items-center px-5 rounded-full border-2 border-primary text-primary font-black hover:bg-primary/5 text-sm cursor-pointer">
              Add Media Link <ExternalLink size={16} className="ml-2" />
            </button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <AdminFilterTabs tabs={typeTabs} active={typeFilter} onChange={setTypeFilter} />
        <AdminSearchBar value={search} onChange={setSearch} placeholder="Search posts..." />
      </div>

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmptyState icon={BookOpen} title="No posts yet" description="Create a blog article or add external media coverage." />
      ) : (
        <div className="card-elevated overflow-hidden border border-border/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Post</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Type</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Date</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-foreground/45 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <div className="h-11 w-14 rounded-lg overflow-hidden border border-border bg-white shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.cover_image} alt={post.title} className="object-cover h-full w-full" />
                          </div>
                        ) : (
                          <div className="h-11 w-14 rounded-lg border border-border flex items-center justify-center text-[10px] font-bold text-foreground/40 bg-muted shrink-0">
                            {post.post_type === "external" ? "🔗" : "📝"}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-sm text-foreground">{post.title}</span>
                          {post.external_source && (
                            <span className="block text-[10px] text-foreground/45 font-bold">{post.external_source}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                        post.post_type === "external" ? "bg-indigo-100 text-indigo-700" : "bg-muted text-foreground/60"
                      }`}>
                        {post.post_type === "external" ? "Media" : "Blog"}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-foreground/70">
                      {post.scheduled_at && !post.published
                        ? `Scheduled ${new Date(post.scheduled_at).toLocaleDateString()}`
                        : new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                          post.published ? "text-emerald-600" : "text-foreground/40"
                        }`}
                      >
                        {post.published ? <><Eye size={12} /> Live</> : <><EyeOff size={12} /> Draft</>}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {post.external_url && (
                          <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full flex items-center justify-center text-indigo-600 border border-border hover:bg-indigo-50 transition-colors" aria-label="Open external link">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button onClick={() => handleOpenEdit(post)} className="h-8 w-8 rounded-full flex items-center justify-center text-foreground/60 border border-border hover:bg-primary hover:text-background transition-colors cursor-pointer" aria-label="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="h-8 w-8 rounded-full flex items-center justify-center text-rose-500 border border-border hover:bg-rose-50 transition-colors cursor-pointer" aria-label="Delete">
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
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={postType === "external" ? (editingPost ? "Edit Media Coverage" : "Add Media Coverage") : (editingPost ? "Edit Article" : "Create Article")}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-2">
            <button type="button" onClick={() => setPostType("internal")} className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer ${postType === "internal" ? "bg-primary text-background" : "bg-muted text-foreground/60"}`}>
              Internal Blog
            </button>
            <button type="button" onClick={() => setPostType("external")} className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer ${postType === "external" ? "bg-primary text-background" : "bg-muted text-foreground/60"}`}>
              External Media
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Title</label>
              <input required type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Slug</label>
              <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm font-mono" />
            </div>
          </div>

          {postType === "external" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-700/70">External URL</label>
                <input required type="url" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://..." className="h-11 bg-white border border-indigo-100 rounded-lg px-3 outline-none font-bold text-sm focus:border-indigo-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-700/70">Publication Name</label>
                <input type="text" value={externalSource} onChange={(e) => setExternalSource(e.target.value)} placeholder="e.g. The New Times" className="h-11 bg-white border border-indigo-100 rounded-lg px-3 outline-none font-bold text-sm focus:border-indigo-400" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Excerpt</label>
            <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Tags</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="craft, design" className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Cover Image URL</label>
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Upload Cover</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])} className="mt-2 text-xs font-bold file:h-9 file:px-3 file:rounded-full file:border-0 file:bg-muted file:font-black file:text-[10px] file:uppercase cursor-pointer" />
            </div>
          </div>

          {postType === "internal" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Content</label>
              <RichTextEditor value={content} onChange={setContent} placeholder="Write your article — use the toolbar for formatting..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Schedule Publish</label>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="h-11 px-3 rounded-xl border border-border bg-muted/30 font-bold text-sm focus:border-primary outline-none" />
            </div>
            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer h-11">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} disabled={!!scheduledAt} className="h-4 w-4 rounded accent-primary" />
              Publish immediately
            </label>
          </div>

          <button type="submit" disabled={submitting} className="h-12 bg-primary text-background font-black rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer">
            {submitting ? "Saving..." : editingPost ? "Update" : scheduledAt ? "Schedule" : published ? "Publish" : "Save Draft"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
