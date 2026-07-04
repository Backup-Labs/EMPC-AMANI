"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { CustomerProfile } from "@/types/database";

export default function PortalProfile() {
  const [profile, setProfile] = useState<Partial<CustomerProfile>>({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);
      const { data } = await supabase.from("customer_profiles").select("*").eq("id", session.user.id).maybeSingle();
      setProfile(data || {
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
        email: session.user.email || "",
        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
        phone: "", address: "", city: "", country: "Rwanda", newsletter_subscribed: true,
      });
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("customer_profiles").upsert([{
      id: userId,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      address: profile.address,
      city: profile.city,
      country: profile.country,
      newsletter_subscribed: profile.newsletter_subscribed,
    }]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /></div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">Account</span>
        <h1 className="font-black text-[2rem] leading-none tracking-tight mt-2 m-0">My Profile</h1>
      </div>

      <div className="card-elevated p-8 flex flex-col items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10 border-2 border-border">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center font-black text-2xl text-primary">
              {(profile.full_name || profile.email || "?")[0]}
            </div>
          )}
        </div>
        <p className="font-bold text-sm text-foreground/50 m-0">{profile.email}</p>
      </div>

      <form onSubmit={handleSave} className="card-elevated p-6 flex flex-col gap-4">
        {[
          { key: "full_name", label: "Full Name" },
          { key: "phone", label: "Phone" },
          { key: "address", label: "Address" },
          { key: "city", label: "City" },
          { key: "country", label: "Country" },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/45">{label}</label>
            <input
              value={(profile as Record<string, string>)[key] || ""}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              className="h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:outline-none focus:border-primary"
            />
          </div>
        ))}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={profile.newsletter_subscribed ?? true}
            onChange={(e) => setProfile({ ...profile, newsletter_subscribed: e.target.checked })}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium text-foreground/70">Subscribe to newsletter</span>
        </label>

        <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-background font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 mt-2">
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
