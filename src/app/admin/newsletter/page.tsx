"use client";

import React, { useState, useEffect } from "react";
import { Send, Save, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminFilterTabs } from "@/components/admin/ui/AdminFilterTabs";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { NewsletterCampaign } from "@/types/database";

export default function AdminNewsletter() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [{ data: camps }, { count }] = await Promise.all([
      supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
    ]);
    if (camps) setCampaigns(camps);
    setSubCount(count || 0);
    setLoading(false);
  };

  const saveDraft = async () => {
    if (!subject.trim()) return;
    setSaving(true);
    await supabase.from("newsletter_campaigns").insert([{ subject, content, status: "draft" }]);
    setSaving(false);
    setSubject(""); setContent("");
    load();
  };

  const sendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) return;
    if (!confirm(`Send to ${subCount} subscribers?`)) return;
    setSaving(true);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed");
      alert(`Newsletter sent to ${json.sent} subscribers.`);
      setSubject("");
      setContent("");
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send newsletter");
    } finally {
      setSaving(false);
    }
  };

  const filtered = campaigns.filter((c) => filter === "all" || c.status === filter);

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <AdminPageHeader
        label="Communications"
        title="Newsletter Composer"
        description={`Compose and send newsletters to ${subCount} subscribers.`}
      />

      <div className="card-elevated p-6 flex flex-col gap-5">
        <h2 className="font-black text-sm uppercase tracking-wide m-0">Compose Newsletter</h2>
        <input
          placeholder="Subject line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-bold focus:outline-none focus:border-primary"
        />
        <textarea
          placeholder="Write your newsletter content here... (supports HTML)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-sm leading-relaxed focus:outline-none focus:border-primary resize-y font-medium"
        />
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPreviewOpen(true)} className="inline-flex h-10 items-center gap-2 px-5 rounded-full border border-border font-bold text-xs hover:bg-muted cursor-pointer transition-colors">
            <Eye size={14} /> Preview
          </button>
          <button onClick={saveDraft} disabled={saving} className="inline-flex h-10 items-center gap-2 px-5 rounded-full border border-border font-bold text-xs hover:bg-muted cursor-pointer transition-colors disabled:opacity-50">
            <Save size={14} /> Save Draft
          </button>
          <button onClick={sendNewsletter} disabled={saving || !subject || !content} className="inline-flex h-10 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-xs hover:opacity-90 cursor-pointer disabled:opacity-50">
            <Send size={14} /> Send to {subCount} Subscribers
          </button>
        </div>
      </div>

      <AdminFilterTabs
        tabs={[
          { id: "all", label: "All", count: campaigns.length },
          { id: "draft", label: "Drafts", count: campaigns.filter((c) => c.status === "draft").length },
          { id: "sent", label: "Sent", count: campaigns.filter((c) => c.status === "sent").length },
        ]}
        active={filter}
        onChange={setFilter}
      />

      <div className="flex flex-col gap-3">
        {filtered.map((camp) => (
          <div key={camp.id} className="card-elevated p-5 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm m-0">{camp.subject}</p>
              <p className="text-xs text-foreground/45 m-0 mt-1">
                {camp.status === "sent" ? `Sent to ${camp.recipient_count} · ${new Date(camp.sent_at!).toLocaleDateString()}` : "Draft"}
              </p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${camp.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {camp.status}
            </span>
          </div>
        ))}
      </div>

      <AdminModal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Newsletter Preview" size="lg">
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-primary p-4"><p className="font-black text-background m-0">{subject || "Subject"}</p></div>
          <div className="p-6 prose-article" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }} />
        </div>
      </AdminModal>
    </div>
  );
}
