"use client";

import React, { useState, useEffect } from "react";
import { Inbox, MessageSquare, GraduationCap, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Counts {
  inquiries: number;
  testimonials: number;
  enrollments: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    inquiries: 0,
    testimonials: 0,
    enrollments: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch inquiries count (status = 'new')
      const { count: inqCount, error: inqErr } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      
      if (inqErr) throw inqErr;

      // Fetch testimonials count (approved = false)
      const { count: testCount, error: testErr } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("approved", false);
      
      if (testErr) throw testErr;

      // Fetch enrollments count (status = 'pending')
      const { count: enrCount, error: enrErr } = await supabase
        .from("training_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      
      if (enrErr) throw enrErr;

      // Fetch newsletter subscribers count
      const { count: subCount, error: subErr } = await supabase
        .from("subscribers")
        .select("*", { count: "exact", head: true });
      
      if (subErr) throw subErr;

      setCounts({
        inquiries: inqCount || 0,
        testimonials: testCount || 0,
        enrollments: enrCount || 0,
        subscribers: subCount || 0,
      });
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    {
      name: "New Inquiries",
      value: counts.inquiries,
      desc: "Awaiting CRM action",
      icon: Inbox,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      name: "Pending Reviews",
      value: counts.testimonials,
      desc: "Awaiting approval",
      icon: MessageSquare,
      color: "text-yellow-600 bg-yellow-50 border-yellow-100",
    },
    {
      name: "Pending Enrollments",
      value: counts.enrollments,
      desc: "Carpentry course requests",
      icon: GraduationCap,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      name: "Newsletter Subscribers",
      value: counts.subscribers,
      desc: "Total reach",
      icon: Users,
      color: "text-green-600 bg-green-50 border-green-100",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="font-black text-[12px] uppercase tracking-widest text-primary">Overview</span>
        <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
          Executive Dashboard
        </h1>
        <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
          Real-time metrics and quick management actions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="card-layered p-8 flex flex-col justify-between shadow-xs">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-black text-xs uppercase tracking-widest text-foreground/45">
                    {m.name}
                  </span>
                  <div className={`h-10 w-10 rounded-full border flex items-center justify-center ${m.color}`}>
                    <Icon size={18} />
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-black text-[3rem] tracking-[-0.05em] text-primary m-0 leading-none">
                    {m.value}
                  </p>
                  <p className="text-xs text-foreground/50 font-bold mt-4 mb-0">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
