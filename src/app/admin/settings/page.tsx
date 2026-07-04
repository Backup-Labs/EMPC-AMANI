"use client";

import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";

const SETTING_KEYS = [
  { key: "company_name", label: "Company Name", category: "general", default: "EMPC-AMANI" },
  { key: "company_tagline", label: "Tagline", category: "general", default: "Artisanal Workshop & Master Carpentry" },
  { key: "contact_email", label: "Contact Email", category: "contact", default: "info@empc-amani.com" },
  { key: "contact_phone", label: "Phone", category: "contact", default: "+250 788 000 000" },
  { key: "contact_address", label: "Address", category: "contact", default: "Kigali, Rwanda" },
  { key: "social_instagram", label: "Instagram URL", category: "social", default: "" },
  { key: "social_facebook", label: "Facebook URL", category: "social", default: "" },
  { key: "social_twitter", label: "X (Twitter) URL", category: "social", default: "" },
  { key: "social_linkedin", label: "LinkedIn URL", category: "social", default: "" },
  { key: "seo_title", label: "SEO Title", category: "seo", default: "EMPC-AMANI | Master Carpentry & Furniture" },
  { key: "seo_description", label: "SEO Description", category: "seo", default: "Bespoke carpentry and furniture craftsmanship in Kigali." },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("key, value");
    const map: Record<string, string> = {};
    SETTING_KEYS.forEach((s) => { map[s.key] = s.default; });
    (data || []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
    setValues(map);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
    await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = [...new Set(SETTING_KEYS.map((s) => s.category))];

  if (loading) return <AdminLoading variant="form" />;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <AdminPageHeader
        label="System"
        title="Website Settings"
        description="Manage company info, contact details, social links, and SEO."
        actions={
          <button onClick={handleSave} disabled={saving} className="inline-flex h-11 items-center gap-2 px-5 rounded-full bg-primary text-background font-bold text-sm hover:opacity-90 cursor-pointer disabled:opacity-50">
            <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
          </button>
        }
      />

      {categories.map((cat) => (
        <div key={cat} className="card-elevated p-6 flex flex-col gap-4">
          <h2 className="font-black text-sm uppercase tracking-wide text-foreground m-0 capitalize">{cat}</h2>
          {SETTING_KEYS.filter((s) => s.category === cat).map((setting) => (
            <div key={setting.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">{setting.label}</label>
              <input
                value={values[setting.key] || ""}
                onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
