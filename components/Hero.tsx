"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import SampleBlueprintModal from "./SampleBlueprintModal";

const theme = {
  bg: "#0a0806",
  gold: "#c9a96e",
  cream: "#f5f0e8",
};

export default function Hero() {
  const [showSample, setShowSample] = React.useState(false);
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: theme.bg, color: theme.cream }}
    >
      <div className="absolute inset-0 z-0">
        <video
          suppressHydrationWarning
          autoPlay
          loop
          muted
          playsInline
          src="/master-hero.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex flex-col items-center text-center px-4 drop-shadow-2xl"
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
          className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12 font-light tracking-tight"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}
        >
          Beyond Taj
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/plan">
            <button
              style={{ borderColor: theme.gold }}
              className="group relative px-10 py-5 border overflow-hidden rounded-sm cursor-pointer transition-all duration-500 bg-black/20 backdrop-blur-md hover:bg-[#c9a96e] hover:border-[#c9a96e] text-[#f5f0e8] hover:text-[#0a0806] shadow-xl hover:shadow-[0_0_30px_rgba(201,169,110,0.4)]"
            >
              <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-semibold">
                Plan Your Journey <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          
          <button
            onClick={() => setShowSample(true)}
            className="group relative px-8 py-5 border border-white/20 rounded-sm cursor-pointer transition-all duration-500 bg-transparent hover:border-white/50 text-white/70 hover:text-white"
          >
            <span className="relative font-sans tracking-widest text-xs uppercase font-medium">
              View a Sample Blueprint
            </span>
          </button>
        </div>
      </motion.div>

      <SampleBlueprintModal isOpen={showSample} onClose={() => setShowSample(false)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex whitespace-nowrap items-center gap-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/90 drop-shadow-lg font-sans"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
      >
        <span>AI-Engineered Routing</span>
        <span className="text-white/40">•</span>
        <span>Bespoke Itineraries</span>
        <span className="text-white/40">•</span>
        <span>Secure Processing</span>
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
