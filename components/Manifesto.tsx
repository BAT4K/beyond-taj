"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-24 px-6 md:px-10 bg-[#0a0806] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-4 font-sans">
            The Curation Standard
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light mb-10 leading-tight">
            The Intelligence Behind the Journey
          </h2>
          
          <div className="h-[1px] w-16 bg-[#c9a96e]/50 mx-auto mb-10" />

          <div className="space-y-6">
            <p className="font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light text-balance">
              Built with local knowledge, not just internet data. AI can show you what's trending, but locals show you what's actually worth it.
            </p>
            <p className="font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light text-balance">
              Every itinerary is crafted by real travelers from the region who understand the culture, hidden gems, authentic food, and the tourist traps to avoid — giving you experiences you won’t find in generic travel guides.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
