"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const theme = {
  bg: "#0a0806",
  gold: "#c9a96e",
  cream: "#f5f0e8",
};

export default function Hero() {
  return (
    <div
      className="h-[100svh] w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: theme.bg, color: theme.cream }}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="/master-hero-poster.webp"
          alt="Hero background"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <video
          suppressHydrationWarning
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        >
          <source src="/master-hero.mp4" type="video/mp4" media="(min-width: 768px)" />
        </video>
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <div
        className="relative z-20 flex flex-col items-center text-center px-4 md:px-0 drop-shadow-2xl w-full"
      >
        <p style={{ color: theme.gold }} className="tracking-[0.3em] uppercase text-sm mb-5 font-sans">
          Curated Indian Journeys
        </p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="h-[1px] mb-6"
          style={{ backgroundColor: theme.gold, opacity: 0.5 }}
        />

        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12 font-light tracking-tight leading-[1.1]"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}
        >
          Beyond Taj
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto px-4 md:px-0">
          <Link href="/plan" className="w-full md:w-auto">
            <button
              className="group relative min-h-[48px] py-4 px-6 md:py-5 md:px-10 border overflow-hidden rounded-sm cursor-pointer touch-manipulation transition duration-200 bg-black/20 backdrop-blur-md md:hover:bg-[#c9a96e] md:hover:border-[#c9a96e] text-[#f5f0e8] md:hover:text-[#0a0806] shadow-xl md:hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] w-full md:w-auto flex items-center justify-center active:scale-95 active:bg-[#c9a96e]/30"
            >
              <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-semibold">
                Plan Your Journey <ChevronRight size={16} className="md:group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          
          <a
            href="/beyondtaj-jessica-blueprint.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative min-h-[48px] py-4 px-6 md:py-5 md:px-8 border border-white/20 rounded-sm cursor-pointer touch-manipulation transition duration-200 bg-transparent md:hover:border-white/50 text-white/70 md:hover:text-white w-full md:w-auto flex items-center justify-center active:scale-95 active:bg-white/10"
          >
            <span className="relative font-sans tracking-widest text-xs uppercase font-medium">
              View a Sample Blueprint
            </span>
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-12 md:bottom-10 w-full px-4 z-20 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[9px] md:text-xs tracking-[0.15em] md:tracking-[0.3em] uppercase text-white/90 drop-shadow-lg font-sans text-center"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
      >
        <span className="whitespace-nowrap">Real-Local Routing</span>
        <span className="text-white/40 hidden sm:inline">•</span>
        <span className="whitespace-nowrap">Honest Itineraries</span>
        <span className="text-white/40 hidden sm:inline">•</span>
        <span className="whitespace-nowrap">Foreigner-First Routing</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1, duration: 1 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-[#c9a96e]/70"
      >
        <ChevronDown size={24} />
      </motion.div>
    </div>
  );
}
