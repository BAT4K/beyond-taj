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

          <p className="font-sans text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            We are pure-play travel architects, not a traditional booking agency. Our platform delivers an actionable, algorithmic blueprint that eliminates hours of exhaustive travel research. We provide the exact optimized routing, under-the-radar heritage stays, and precise timing logistics necessary to save you from generic tourist traps, giving you the ultimate data-driven roadmap to experience India flawlessly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
