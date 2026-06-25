"use client";

import React from "react";
import Link from "next/link";
import { Users, Settings, ArrowRight } from "lucide-react";

export default function PortalsHub() {
  return (
    <div className="bg-background min-h-screen relative text-foreground pt-36 pb-24 px-6 md:px-12 lg:px-16 transition-colors duration-300 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full text-center mb-16">
        <span className="font-black text-[11px] uppercase tracking-widest text-primary">
          EMPC Workspaces
        </span>
        <h1 className="font-black text-[2.5rem] md:text-[3.5rem] leading-none tracking-[-0.05em] mt-4 mb-0 uppercase">
          Welcome to EMPC Portals.
        </h1>
        <p className="text-foreground/50 font-bold text-base max-w-2xl mx-auto mt-4 mb-0">
          Choose a portal to manage your custom orders, check training enrollments, or administrate site content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full">
        {/* Customer Portal Card */}
        <Link
          href="/portal/dashboard"
          className="group card-layered p-10 md:p-12 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 no-underline cursor-pointer border border-border/40 hover:border-primary/40 relative overflow-hidden"
        >
          <div className="flex flex-col gap-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <Users size={28} />
            </div>
            <div>
              <h2 className="font-black text-2xl tracking-tighter text-foreground m-0 uppercase">
                Customer Portal
              </h2>
              <p className="text-foreground/60 text-sm mt-4 mb-0 leading-relaxed font-bold">
                Submit custom furniture inquiry tickets, track orders, or view enrollments for vocational training courses.
              </p>
            </div>
          </div>
          <div className="mt-12 flex items-center text-primary font-black uppercase text-xs tracking-wider gap-2">
            Access Dashboard <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Staff / Admin Portal Card */}
        <Link
          href="/admin"
          className="group card-layered p-10 md:p-12 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 no-underline cursor-pointer border border-border/40 hover:border-primary/40 relative overflow-hidden"
        >
          <div className="flex flex-col gap-6">
            <div className="h-14 w-14 rounded-2xl bg-foreground/5 text-foreground flex items-center justify-center transition-transform group-hover:scale-110">
              <Settings size={28} />
            </div>
            <div>
              <h2 className="font-black text-2xl tracking-tighter text-foreground m-0 uppercase">
                Staff Portal
              </h2>
              <p className="text-foreground/60 text-sm mt-4 mb-0 leading-relaxed font-bold">
                Manage catalogs, update training entries, approve reviews, publish news articles, or adjust AI chatbot prompts.
              </p>
            </div>
          </div>
          <div className="mt-12 flex items-center text-foreground font-black uppercase text-xs tracking-wider gap-2 group-hover:text-primary transition-colors">
            Administrate Site <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
