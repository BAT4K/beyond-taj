"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Sarah Jenkins",
    location: "London, UK",
    text: "Honestly, planning a trip to India felt so overwhelming until we found this. The itinerary was flawless and we felt completely safe.",
    rating: 5,
  },
  {
    name: "Michael T.",
    location: "Chicago, USA",
    text: "Saved us from booking a terrible tourist-trap hotel in Agra. The alternative they suggested was an absolute dream.",
    rating: 5,
  },
  {
    name: "Emma & David",
    location: "Sydney, AU",
    text: "We were worried about getting scammed, but having a verified, locally-tested route made our 2-week trip totally stress-free.",
    rating: 5,
  },
  {
    name: "Lucas R.",
    location: "Berlin, DE",
    text: "The transit recommendations alone are worth the money. We didn't waste a single day stuck in bad traffic.",
    rating: 4,
  },
  {
    name: "Sophie M.",
    location: "Toronto, CA",
    text: "I was traveling solo and was incredibly nervous. The engine picked the most peaceful, vetted spots for me. Highly recommend.",
    rating: 5,
  },
  {
    name: "James Carter",
    location: "Auckland, NZ",
    text: "A lifesaver. We completely avoided the monsoon season in Kerala thanks to the seasonal warnings.",
    rating: 5,
  },
  {
    name: "Elena P.",
    location: "Madrid, ES",
    text: "Skip the generic travel blogs and just use this. The pacing was perfect and we actually got to relax.",
    rating: 4,
  },
  {
    name: "The Harrison Family",
    location: "Boston, USA",
    text: "Traveling with two kids in India sounded crazy, but the family-friendly route they built was incredibly smooth.",
    rating: 5,
  },
  {
    name: "Oliver W.",
    location: "Manchester, UK",
    text: "The $40 fee pays for itself immediately. It saved us hundreds of dollars in bad transit choices.",
    rating: 5,
  },
  {
    name: "Isabella G.",
    location: "Rome, IT",
    text: "Beautiful layout and really solid advice. It felt like we had a local friend guiding us.",
    rating: 4,
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

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.replace(/\./g, '').trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

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
              {/* Initial Avatar */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                <span className="text-xs font-medium text-white/60 select-none">
                  {getInitials(shuffledReviews[index].name)}
                </span>
              </div>
              
              <div className="flex flex-col gap-0.5">
                {/* Name & Location */}
                <p className="text-sm font-medium text-white">
                  {shuffledReviews[index].name} <span className="font-light text-xs text-zinc-500">from {shuffledReviews[index].location}</span>
                </p>
                {/* Star Rating */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => {
                    const isFilled = i < shuffledReviews[index].rating;
                    return (
                      <Star 
                        key={i} 
                        size={11} 
                        fill={isFilled ? "currentColor" : "transparent"} 
                        className={isFilled ? "text-amber-400" : "text-zinc-700"} 
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Review Body */}
            <p className="text-sm text-zinc-300 font-light leading-relaxed font-sans">
              {shuffledReviews[index].text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
