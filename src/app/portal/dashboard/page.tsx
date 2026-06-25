"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Inquiry {
  id: string;
  subject: string;
  message: string;
  inquiry_type: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
}

interface Enrollment {
  id: string;
  course_name: string;
  sponsor: string;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export default function PortalDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // New Inquiry Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("furniture");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchDashboardData = useCallback(async (email: string) => {
    try {
      setLoading(true);

      // Fetch inquiries
      const { data: inqData, error: inqErr } = await supabase
        .from("inquiries")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (inqErr) throw inqErr;
      setInquiries(inqData || []);

      // Fetch enrollments
      const { data: enrData, error: enrErr } = await supabase
        .from("training_enrollments")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (enrErr) throw enrErr;
      setEnrollments(enrData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/portal/login");
      } else {
        const email = session.user.email || "";
        setUserEmail(email);
        fetchDashboardData(email);
      }
    };
    checkAuth();
  }, [router, fetchDashboardData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/portal/login");
  };

  const handleNewInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    setFormSubmitting(true);
    try {
      const { error } = await supabase.from("inquiries").insert([
        {
          full_name: userEmail.split("@")[0], // Fallback name from email
          email: userEmail,
          phone: phone || null,
          subject,
          message,
          inquiry_type: inquiryType,
          status: "new",
        },
      ]);

      if (error) throw error;

      setFormSuccess(true);
      setSubject("");
      setMessage("");
      setPhone("");
      setInquiryType("furniture");
      
      // Refresh dashboard list
      fetchDashboardData(userEmail);

      setTimeout(() => {
        setFormSuccess(false);
        setModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating inquiry:", err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const getInquiryStatusStyle = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getEnrollmentStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-background min-h-screen relative text-foreground pt-32 pb-24 px-6 md:px-12 lg:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border">
          <div>
            <span className="font-black text-[12px] uppercase tracking-widest text-primary">Customer Portal</span>
            <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
              Welcome Back.
            </h1>
            <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">Logged in as {userEmail}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex h-12 items-center px-6 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all text-sm group cursor-pointer shadow-md"
            >
              New Inquiry <Plus size={16} className="ml-2" />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-12 items-center px-6 rounded-full bg-muted border border-border text-foreground font-black hover:bg-foreground/5 active:scale-95 transition-all text-sm cursor-pointer"
            >
              Sign Out <LogOut size={16} className="ml-2" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-16">
            {/* Inquiries Panel */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary block" />
                <h2 className="font-black text-2xl tracking-tight m-0">Inquiries ({inquiries.length})</h2>
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-muted p-10 rounded-2xl border border-border/40 text-center">
                  <p className="text-foreground/50 text-base font-bold m-0">No inquiries found. Click &quot;New Inquiry&quot; to submit one.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="card-layered p-8 flex flex-col gap-4 shadow-xs">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-black text-xl tracking-tight text-foreground line-clamp-1">{inq.subject || "Untitled Inquiry"}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getInquiryStatusStyle(inq.status)}`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed m-0 line-clamp-3">{inq.message}</p>
                      <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-2">
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-wider">
                          Type: {inq.inquiry_type}
                        </span>
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-wider">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enrollments Panel */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary block" />
                <h2 className="font-black text-2xl tracking-tight m-0">Training Enrollments ({enrollments.length})</h2>
              </div>

              {enrollments.length === 0 ? (
                <div className="bg-muted p-10 rounded-2xl border border-border/40 text-center">
                  <p className="text-foreground/50 text-base font-bold m-0">No course enrollments found under this email.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {enrollments.map((enr) => (
                    <div key={enr.id} className="card-layered p-8 flex flex-col gap-4 shadow-xs">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-black text-xl tracking-tight text-foreground line-clamp-1">{enr.course_name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getEnrollmentStatusStyle(enr.status)}`}>
                          {enr.status}
                        </span>
                      </div>
                      {enr.message && <p className="text-sm text-foreground/70 leading-relaxed m-0">{enr.message}</p>}
                      <div className="flex justify-between items-center border-t border-border/40 pt-4 mt-2">
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-wider">
                          Sponsor: {enr.sponsor || "None"}
                        </span>
                        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-wider">
                          {new Date(enr.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Inquiry Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-black text-xl uppercase tracking-wider text-foreground">New CRM Inquiry</span>
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content / Form */}
            {formSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Plus className="rotate-45" size={24} />
                </div>
                <h4 className="font-black text-2xl text-foreground">Inquiry Submitted</h4>
                <p className="text-foreground/60 text-base max-w-xs m-0">
                  Your inquiry has been created successfully. The team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewInquiry} className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Requesting custom dining table pricing"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                      Inquiry Type
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors cursor-pointer appearance-none"
                    >
                      <option value="furniture">Furniture Inquiry</option>
                      <option value="custom_order">Custom Order</option>
                      <option value="training">Carpentry Training</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide specific details about your request..."
                    className="bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors resize-none py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? "Submitting..." : "Send Inquiry"}
                  <ArrowUpRight size={18} className="ml-2" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
