"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for project details
const projectData: Record<string, any> = {
  "coastal-serenity": {
    title: "Coastal Serenity",
    category: "Vacation / Coastal",
    image: "/images/hero.png",
    client: "The Shoreline Group",
    location: "Malibu, California",
    year: "2024",
    concept: "Oceanic Bliss",
    style: "Modern Minimalist",
    description: "A sanctuary designed to blur the lines between indoor luxury and the vast horizon of the Pacific Ocean. Using natural stone, light timbers, and a palette inspired by seafoam and sand, we created a space that breathes with the tides.",
    gallery: ["/images/project1.png", "/images/project2.png", "/images/hero.png"]
  },
  "azure-hallway": {
    title: "Azure Hallway",
    category: "Commercial / Office",
    image: "/images/project1.png",
    client: "Azure Tech Corp",
    location: "Seattle, WA",
    year: "2025",
    concept: "Flowing Connectivity",
    style: "Industrial Chic",
    description: "An office space that prioritizes movement and collaborative energy. The Azure Hallway uses bold architectural lines and deep blue accents to guide employees through a series of dynamic zones.",
    gallery: ["/images/project2.png", "/images/hero.png", "/images/project1.png"]
  }
};

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = projectData[slug] || projectData["coastal-serenity"]; // Default fallback

  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      {/* ── HERO ── */}
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        <Image src={project.image} alt={project.title} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/70" />
        
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/40 text-white text-[11px] font-bold tracking-widest uppercase backdrop-blur-md mb-6">
              {project.category}
            </span>
            <h1 className="font-extrabold text-[3rem] md:text-[5rem] lg:text-[7rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── INFO BAR ── */}
      <section className="bg-white border-b border-[#e0e0e0] px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto py-10 lg:py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
            {[
              { label: "Client", value: project.client },
              { label: "Location", value: project.location },
              { label: "Year", value: project.year },
              { label: "Concept", value: project.concept },
              { label: "Style", value: project.style },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#888] uppercase mb-2">{item.label}</p>
                <p className="text-[#111] text-sm md:text-base font-bold m-0">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="flex flex-col gap-6 md:gap-8">
              <h2 className="font-bold text-[1.8rem] md:text-[2.2rem] lg:text-[2.8rem] leading-tight tracking-tight m-0">Concept &amp; Objective</h2>
              <p className="text-[#555] text-base md:text-lg leading-relaxed m-0 max-w-lg">
                {project.description}
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-sm">
              <Image src={project.gallery[0]} alt="Process" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-16 md:mt-24 lg:mt-32">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto md:row-span-2 shadow-sm group">
              <Image src={project.gallery[1]} alt="Interior 1" fill sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm group">
              <Image src={project.gallery[2]} alt="Interior 2" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm group">
              <Image src={project.image} alt="Interior 3" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto border-t border-[#e0e0e0] pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link href="/projects" className="inline-flex items-center gap-2 font-bold text-sm md:text-base text-[#111] hover:underline underline-offset-8 decoration-2 order-2 sm:order-1">
            <ArrowLeft size={18} /> Back to Projects
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-sm md:text-base text-[#111] hover:underline underline-offset-8 decoration-2 order-1 sm:order-2">
            Start a Project <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
