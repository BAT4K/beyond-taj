"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, Hotel, FileText } from "lucide-react";

const HIGHLIGHTS = [
  {
    id: "routing",
    title: "Optimized Routing Grid",
    icon: Map,
    desc: "We analyze Indian transit networks to catch impossible or exhausting travel legs before they happen. Your blueprint maps the absolute most efficient way to link your bespoke destinations."
  },
  {
    id: "heritage",
    title: "Vetted Heritage Curations",
    icon: Hotel,
    desc: "We bypass generic luxury chains to handpick boutique palaces, restored havelis, and eco-lodges. We provide direct links so you can book them independently and avoid middleman markups."
  },
  {
    id: "dossier",
    title: "Vector Print Dossier",
    icon: FileText,
    desc: "You receive a beautifully formatted, offline-ready PDF blueprint containing dynamic maps, timeline breakdowns, and logistical safety indicators for your entire trip."
  }
];

export default function BlueprintHighlights() {
  return (
    <section className="py-24 bg-[#0a0806] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-3 font-sans">
              Blueprint Highlights
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight">
              What You Unlock
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm tracking-wide leading-relaxed">
            The data, the routing, and the curation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {HIGHLIGHTS.map((highlight, i) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group p-8 md:p-10 rounded-sm bg-white/[0.02] backdrop-blur-sm border border-white/5 md:hover:border-[#c9a96e]/50 transition-colors duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
                
                <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-8 border border-[#c9a96e]/20 md:group-hover:bg-[#c9a96e]/20 transition-colors">
                  <Icon size={20} className="text-[#c9a96e]" />
                </div>
                
                <h3 className="font-serif text-xl md:text-2xl text-white mb-4">
                  {highlight.title}
                </h3>
                
                <p className="text-white/60 text-sm leading-relaxed font-sans font-light">
                  {highlight.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
