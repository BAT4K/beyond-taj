"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What exactly do I receive for the $40 planning fee?",
    answer: (
      <div className="flex flex-col gap-4">
        <span>A 40+ page downloadable PDF optimized for your phone. It contains your day-by-day routing, specific hotel and train recommendations with direct booking links, a list of common scams on your route, and emergency contacts. No fluff, just the exact logistical data you need.</span>
        <div className="px-4 py-3 bg-white/5 border-l-2 border-[#c9a96e] text-white/70 italic rounded-r-sm text-sm">
          Note: For extended trips of 14 days or longer, the fee is $75 to account for the additional curation required.
        </div>
      </div>
    )
  },
  {
    question: "Is this customized to my specific trip?",
    answer: "Yes, absolutely. Every single blueprint is dynamically built specifically for your exact travel dates, pacing preferences, and chosen destinations. Our routing engine analyzes your inputs to craft a tailored day-by-day itinerary that ensures you aren't rushing, backtracking, or visiting monuments when they're closed. You get a fully customized travel plan without the $500+ price tag of a traditional travel agent."
  },
  {
    question: "How is this different from India Someday or just using Google?",
    answer: "Traditional agencies like India Someday act as middlemen. They plan your trip, but they also book your hotels and take a hidden cut of your money. We just give you the exact blueprint, so you can book directly and keep your budget. As for Google? If you search for an India itinerary, you'll find thousands of confusing blogs written by tourists who only visited once. We give you one clear, honest guide written by people who travel India for a living."
  },
  {
    question: "Do you handle my bookings?",
    answer: "No. We give you the exact links to book the vetted hotels, trains, and flights yourself. You retain 100% control over your money and completely bypass middleman markups and agency commissions."
  },
  {
    question: "Is the planning fee refundable?",
    answer: "Because this is a digital product providing immediate access to our proprietary research, routing, and contacts, the planning fee is strictly non-refundable."
  },
  {
    question: "How is this different from AI trip planners?",
    answer: "Free AI tools like Wanderlog, Trip.com, or ChatGPT just scrape the internet. If you ask an AI for an India itinerary, it will confidently tell you to take a 6-hour bus ride that actually takes 14 hours, or recommend a hotel that hasn't existed since 2019. AI doesn't know that the train station has three fake tourism offices designed to scam you. We do."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-10 bg-[#0a0806] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto">
        <div
          className="text-center mb-16"
        >
          <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-3 font-sans">
            Clarity & Discretion
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
