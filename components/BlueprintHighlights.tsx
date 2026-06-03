"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, Hotel, ShieldAlert, Phone } from "lucide-react";

const HIGHLIGHTS = [
  {
    id: "routing",
    title: "Day-by-day routing that works",
    icon: Map,
    desc: "No “Day 1: Arrive Delhi 9 a.m., visit Red Fort 10 a.m.” nonsense. You get options, not a schedule. The places worth your time, the order that minimizes backtracking, the days each place is actually open. You pick the pace."
  },
  {
    id: "vetted",
    title: "Hotels, restaurants, and trains with real names",
    icon: Hotel,
    desc: "Specific properties at every price tier. The good Karim’s in Old Delhi vs the tourist-trap Karim’s. The Rajdhani train numbers that are worth booking 60 days out. Direct booking links — you keep 100% of your money, we don’t take commissions."
  },
  {
    id: "scams",
    title: "The scam list for your specific route",
    icon: ShieldAlert,
    desc: "The fake tourism office at New Delhi Station. The “your hotel burned down” taxi scam at Indira Gandhi airport. The cumin scam at Sadar Bazaar. We list every common scam at every stop on your trip, with the exact lines and the exact prices."
  },
  {
    id: "emergency",
    title: "Phone numbers that matter",
    icon: Phone,
    desc: "Embassy hotlines for your nationality. The Apollo Hospital in each city. The tourist police office. Your driver’s WhatsApp template. The one hotel you can crash at if your night train gets cancelled."
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
          className="mb-12 md:mb-16 flex flex-col gap-4 max-w-2xl"
        >
          <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs font-sans">
            WHAT’S IN A BLUEPRINT
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight text-balance">
            What you actually get for $39
          </h2>
          <p className="text-white/40 text-sm md:text-base tracking-wide leading-relaxed">
            A 40+ page PDF you can read offline, sized for your phone or print.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
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
                
                <h3 className="font-serif text-xl md:text-2xl text-white mb-4 text-balance">
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
