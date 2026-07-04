"use client";

import React, { useState, useEffect } from "react";
import { UserCog } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/ui/AdminEmptyState";
import { AdminLoading } from "@/components/admin/ui/AdminLoading";
import type { AdminProfile } from "@/types/database";

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  editor: "bg-blue-100 text-blue-700",
  viewer: "bg-foreground/10 text-foreground/60",
};

export default function AdminStaff() {
  const [staff, setStaff] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_profiles").select("*");
    setStaff(data || []);
    setLoading(false);
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <AdminPageHeader
        label="System"
        title="Staff Management"
        description="View staff accounts and roles. Use setup-admin.mjs to invite new admins."
      />

      {staff.length === 0 ? (
        <AdminEmptyState icon={UserCog} title="No staff profiles" description="Run scripts/setup-admin.mjs to create the first admin account." />
      ) : (
        <div className="flex flex-col gap-3">
          {staff.map((member) => (
            <div key={member.id} className="card-elevated p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
                  {(member.full_name || "A")[0]}
                </div>
                <div>
                  <p className="font-bold text-sm m-0">{member.full_name || "Staff Member"}</p>
                  <p className="text-xs text-foreground/45 m-0">{member.id.slice(0, 8)}...</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${roleColors[member.role] || roleColors.viewer}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="card-elevated p-5 bg-muted/50">
        <p className="text-sm text-foreground/60 m-0 leading-relaxed">
          <strong className="text-foreground">Role permissions:</strong> Admins have full access. Editors can manage content but not system settings. Viewers have read-only access.
        </p>
      </div>
    </div>
  );
}
