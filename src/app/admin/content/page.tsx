"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { MilestoneItem, AboutValue, ServiceItem } from "@/lib/cms/settings-types";
import { DEFAULT_SERVICES } from "@/lib/cms/defaults";

const CONTENT_SECTIONS = [
  { key: "hero_title", label: "Hero Title", section: "Landing Page", multiline: false },
  { key: "hero_subtitle", label: "Hero Subtitle", section: "Landing Page", multiline: true },
  { key: "about_heading", label: "About Heading", section: "About Page", multiline: false },
  { key: "about_intro", label: "About Introduction", section: "About Page", multiline: true },
  { key: "about_stat_artisans", label: "Trained Artisans Stat", section: "About Page", multiline: false },
  { key: "about_stat_heritage", label: "Years of Heritage Stat", section: "About Page", multiline: false },
  { key: "services_intro", label: "Services Introduction", section: "Services Section", multiline: true },
  { key: "footer_tagline", label: "Footer Tagline", section: "Footer", multiline: false },
  { key: "contact_intro", label: "Contact Page Intro", section: "Contact", multiline: true },
  { key: "faq_intro", label: "FAQ Section Description", section: "FAQ", multiline: true },
];

const EMPTY_MILESTONE: MilestoneItem = { year: "", title: "", desc: "", images: ["", ""] };
const EMPTY_VALUE: AboutValue = { title: "", desc: "" };

const EMPTY_SERVICE: ServiceItem = { num: "", title: "", desc: "", stat: 0, suffix: "+", statLabel: "", image: "" };

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [aboutValues, setAboutValues] = useState<AboutValue[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("key, value").like("key", "content_%");
    const map: Record<string, string> = {};
    CONTENT_SECTIONS.forEach((s) => { map[s.key] = ""; });
    let loadedMilestones: MilestoneItem[] = [];
    let loadedValues: AboutValue[] = [];
    let loadedServices: ServiceItem[] = [];

    (data || []).forEach((row: { key: string; value: string }) => {
      const shortKey = row.key.replace("content_", "");
      if (shortKey === "milestones") {
        try { loadedMilestones = JSON.parse(row.value); } catch { /* keep default */ }
      } else if (shortKey === "about_values") {
        try { loadedValues = JSON.parse(row.value); } catch { /* keep default */ }
      } else if (shortKey === "services") {
        try { loadedServices = JSON.parse(row.value); } catch { /* keep default */ }
      } else {
        map[shortKey] = row.value;
      }
    });

    setValues(map);
    setMilestones(loadedMilestones.length ? loadedMilestones : [{ ...EMPTY_MILESTONE }]);
    setAboutValues(loadedValues.length ? loadedValues : [{ ...EMPTY_VALUE }]);
    setServices(loadedServices.length ? loadedServices : [...DEFAULT_SERVICES]);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const rows = [
      ...Object.entries(values).map(([key, value]) => ({ key: `content_${key}`, value })),
      { key: "content_milestones", value: JSON.stringify(milestones.filter((m) => m.year && m.title)) },
      { key: "content_about_values", value: JSON.stringify(aboutValues.filter((v) => v.title)) },
      { key: "content_services", value: JSON.stringify(services.filter((s) => s.title)) },
    ];
    await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
  };

  const sections = [...new Set(CONTENT_SECTIONS.map((s) => s.section))];

  if (loading) return <AdminLoading variant="form" />;

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

      <div className="card-elevated p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-sm uppercase tracking-wide m-0">Services</h2>
          <button type="button" onClick={() => setServices([...services, { ...EMPTY_SERVICE, num: String(services.length + 1).padStart(2, "0") }])} className="inline-flex h-8 items-center gap-1 px-3 rounded-full border border-border text-xs font-bold cursor-pointer hover:bg-muted">
            <Plus size={12} /> Add
          </button>
        </div>
        {services.map((s, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Service {i + 1}</span>
              <button type="button" onClick={() => setServices(services.filter((_, j) => j !== i))} className="h-7 w-7 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"><Trash2 size={12} /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <input placeholder="Num (01)" value={s.num} onChange={(e) => { const n = [...services]; n[i] = { ...s, num: e.target.value }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
              <input placeholder="Title" value={s.title} onChange={(e) => { const n = [...services]; n[i] = { ...s, title: e.target.value }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary md:col-span-2" />
            </div>
            <textarea placeholder="Description" rows={2} value={s.desc} onChange={(e) => { const n = [...services]; n[i] = { ...s, desc: e.target.value }; setServices(n); }} className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-y" />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="Stat" value={s.stat || ""} onChange={(e) => { const n = [...services]; n[i] = { ...s, stat: parseInt(e.target.value, 10) || 0 }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
              <input placeholder="Suffix (+)" value={s.suffix} onChange={(e) => { const n = [...services]; n[i] = { ...s, suffix: e.target.value }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
              <input placeholder="Stat label" value={s.statLabel} onChange={(e) => { const n = [...services]; n[i] = { ...s, statLabel: e.target.value }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
            </div>
            <input placeholder="Image URL" value={s.image} onChange={(e) => { const n = [...services]; n[i] = { ...s, image: e.target.value }; setServices(n); }} className="h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary" />
          </div>
        ))}
      </div>

      <div className="card-elevated p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-sm uppercase tracking-wide m-0">About Values</h2>
          <button type="button" onClick={() => setAboutValues([...aboutValues, { ...EMPTY_VALUE }])} className="inline-flex h-8 items-center gap-1 px-3 rounded-full border border-border text-xs font-bold cursor-pointer hover:bg-muted">
            <Plus size={12} /> Add
          </button>
        </div>
        {aboutValues.map((v, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Value {i + 1}</span>
              <button type="button" onClick={() => setAboutValues(aboutValues.filter((_, j) => j !== i))} className="h-7 w-7 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"><Trash2 size={12} /></button>
            </div>
            <input placeholder="Title" value={v.title} onChange={(e) => { const next = [...aboutValues]; next[i] = { ...v, title: e.target.value }; setAboutValues(next); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary" />
            <textarea placeholder="Description" rows={2} value={v.desc} onChange={(e) => { const next = [...aboutValues]; next[i] = { ...v, desc: e.target.value }; setAboutValues(next); }} className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-y" />
          </div>
        ))}
      </div>

      <div className="card-elevated p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-sm uppercase tracking-wide m-0">Timeline Milestones</h2>
          <button type="button" onClick={() => setMilestones([...milestones, { ...EMPTY_MILESTONE }])} className="inline-flex h-8 items-center gap-1 px-3 rounded-full border border-border text-xs font-bold cursor-pointer hover:bg-muted">
            <Plus size={12} /> Add
          </button>
        </div>
        {milestones.map((m, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Milestone {i + 1}</span>
              <button type="button" onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} className="h-7 w-7 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"><Trash2 size={12} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Year" value={m.year} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, year: e.target.value }; setMilestones(next); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary" />
              <input placeholder="Title" value={m.title} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, title: e.target.value }; setMilestones(next); }} className="h-10 px-3 rounded-lg border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary" />
            </div>
            <textarea placeholder="Description" rows={2} value={m.desc} onChange={(e) => { const next = [...milestones]; next[i] = { ...m, desc: e.target.value }; setMilestones(next); }} className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-y" />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Image URL 1" value={m.images[0] || ""} onChange={(e) => { const next = [...milestones]; const imgs = [...m.images]; imgs[0] = e.target.value; next[i] = { ...m, images: imgs }; setMilestones(next); }} className="h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary" />
              <input placeholder="Image URL 2" value={m.images[1] || ""} onChange={(e) => { const next = [...milestones]; const imgs = [...m.images]; imgs[1] = e.target.value; next[i] = { ...m, images: imgs.filter(Boolean) }; setMilestones(next); }} className="h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
