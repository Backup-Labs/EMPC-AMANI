"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";

const CONTENT_SECTIONS = [
  { key: "hero_title", label: "Hero Title", section: "Landing Page", multiline: false },
  { key: "hero_subtitle", label: "Hero Subtitle", section: "Landing Page", multiline: true },
  { key: "about_intro", label: "About Introduction", section: "About Section", multiline: true },
  { key: "services_intro", label: "Services Introduction", section: "Services Section", multiline: true },
  { key: "footer_tagline", label: "Footer Tagline", section: "Footer", multiline: false },
  { key: "contact_intro", label: "Contact Page Intro", section: "Contact", multiline: true },
  { key: "faq_intro", label: "FAQ Section Description", section: "FAQ", multiline: true },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("key, value").like("key", "content_%");
    const map: Record<string, string> = {};
    CONTENT_SECTIONS.forEach((s) => { map[s.key] = ""; });
    (data || []).forEach((row: { key: string; value: string }) => {
      const shortKey = row.key.replace("content_", "");
      map[shortKey] = row.value;
    });
    setValues(map);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = Object.entries(values).map(([key, value]) => ({ key: `content_${key}`, value }));
    await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
  };

  const sections = [...new Set(CONTENT_SECTIONS.map((s) => s.section))];

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <AdminPageHeader
        label="Content"
        title="Site Content Manager"
        description="Edit dynamic website sections without touching code."
        actions={
          <button onClick={handleSave} disabled={saving} className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      {sections.map((section) => (
        <div key={section} className="card-elevated p-6 flex flex-col gap-4">
          <h2 className="font-black text-sm uppercase tracking-wide m-0">{section}</h2>
          {CONTENT_SECTIONS.filter((s) => s.section === section).map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">{field.label}</label>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={values[field.key] || ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary resize-y"
                />
              ) : (
                <input
                  value={values[field.key] || ""}
                  onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                  className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
