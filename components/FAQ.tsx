"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Do you handle my bookings?",
    answer: "No. We are pure-play travel architects. We provide the ultimate data-driven blueprint, including direct links to vetted properties. You retain 100% control over your funds, booking where and when you prefer, completely bypassing middleman commissions."
  },
  {
    question: "What exactly do I receive for $300?",
    answer: "You unlock your custom interactive dashboard and a premium downloadable dossier with dynamic routing mapping, curated boutique suggestions, and localized transit strategies."
  },
  {
    question: "How does the routing engine ensure my transit times are realistic?",
    answer: "India's topography and infrastructure can be unpredictable. Our engine cross-references historical transit data and seasonal road conditions to pad travel times, ensuring you are never rushed between your bespoke experiences."
  },
  {
    question: "Is the $300 blueprint fee refundable?",
    answer: "Because our routing engine and travel specialists immediately begin curating and generating your proprietary dossier upon payment, the $300 itinerary design fee is strictly non-refundable."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-10 bg-[#0a0806] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-3 font-sans">
            Clarity & Discretion
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border border-white/10 rounded-sm bg-white/[0.01] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
              >
                <span className="font-serif text-lg md:text-xl text-white/90">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0 ml-4 text-[#c9a96e]"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 md:p-8 pt-0 border-t border-white/5 text-white/50 text-sm md:text-base leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
