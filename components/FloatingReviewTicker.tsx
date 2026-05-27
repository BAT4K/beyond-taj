"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "London",
    text: "The seasonal alerts saved my trip to North India! Slashed weeks of stress."
  },
  {
    name: "David K.",
    location: "Berlin",
    text: "Avoided a massive heatwave mistake in Delhi thanks to the custom pacing."
  },
  {
    name: "Elena R.",
    location: "Madrid",
    text: "The scam prevention guide alone was worth it. Felt completely safe."
  },
  {
    name: "James L.",
    location: "New York",
    text: "Incredible local insights. We skipped the tourist traps entirely."
  },
  {
    name: "Aisha T.",
    location: "Dubai",
    text: "Our Rajasthan route was flawless. The transport tips were a lifesaver."
  }
];

export default function FloatingReviewTicker() {
  const [index, setIndex] = useState<number | null>(null);
  const [shuffledReviews, setShuffledReviews] = useState(REVIEWS);

  useEffect(() => {
    // Client-side shuffle to avoid Next.js hydration mismatch
    const shuffled = [...REVIEWS].sort(() => Math.random() - 0.5);
    setShuffledReviews(shuffled);

    let cycleTimer: NodeJS.Timeout;

    // 4000ms delay before showing the very first review
    const initialDelay = setTimeout(() => {
      setIndex(0);

      // Start the 7.5s cycle after the initial organic delay
      cycleTimer = setInterval(() => {
        setIndex((prev) => (prev !== null ? (prev + 1) % shuffled.length : 0));
      }, 7500);
      
    }, 4000);

    return () => {
      clearTimeout(initialDelay);
      if (cycleTimer) clearInterval(cycleTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        {index !== null && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-3 p-5 rounded-sm backdrop-blur-md bg-zinc-900/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-md w-full"
          >
            {/* Header Row */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 font-bold text-sm">
                {shuffledReviews[index].name.charAt(0)}
              </div>
              
              <div className="flex flex-col gap-0.5">
                {/* Name & Location */}
                <p className="text-base font-semibold text-white">
                  {shuffledReviews[index].name} <span className="font-light text-sm text-zinc-400">from {shuffledReviews[index].location}</span>
                </p>
                {/* Star Rating */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" className="text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Review Body */}
            <p className="text-sm text-zinc-200 font-light leading-relaxed font-sans italic">
              "{shuffledReviews[index].text}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
