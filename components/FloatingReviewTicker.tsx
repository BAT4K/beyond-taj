"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Priya Nair",
    location: "Kochi",
    text: "Finally someone who gets that you can't do Ladakh in 3 days lol. Saved us from a terrible itinerary.",
    rating: 5,
  },
  {
    name: "Rohan M.",
    location: "Pune",
    text: "It was good. Helped us plan Meghalaya without overthinking.",
    rating: 4,
  },
  {
    name: "Ananya Sharma",
    location: "Delhi",
    text: "Used this for our anniversary trip to Kerala. The pacing was perfect, we didn't feel rushed at all.",
    rating: 5,
  },
  {
    name: "Tom H.",
    location: "Bristol",
    text: "Wish we'd found this before booking our first India trip. Would have avoided the monsoon disaster in Goa.",
    rating: 4,
  },
  {
    name: "Sneha R.",
    location: "Bangalore",
    text: "Glad I chose this over planning everything on Google. So much easier.",
    rating: 4,
  },
  {
    name: "Vikram Joshi",
    location: "Mumbai",
    text: "The route suggestions were spot on. Rajasthan in 10 days felt effortless.",
    rating: 5,
  },
  {
    name: "Claire D.",
    location: "Melbourne",
    text: "Really helpful for first-timers. We felt so much more confident about the whole trip.",
    rating: 4,
  },
  {
    name: "Arjun K.",
    location: "Hyderabad",
    text: "Took my parents on the Varanasi route. They loved every minute. Thank you guys.",
    rating: 5,
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    text: "Not bad. Some hotel recs were mid but the overall planning was solid.",
    rating: 4,
  },
  {
    name: "Aditya Singh",
    location: "Jaipur",
    text: "10/10. The weather warnings alone saved us from a wasted day in Darjeeling.",
    rating: 5,
  },
  {
    name: "Lisa W.",
    location: "Toronto",
    text: "We did the Northeast circuit. Absolutely unreal. Never would have planned it ourselves.",
    rating: 5,
  },
  {
    name: "Kavita P.",
    location: "Ahmedabad",
    text: "Simple and clean. Did exactly what it promised.",
    rating: 4,
  },
  {
    name: "Nikhil Deshmukh",
    location: "Nagpur",
    text: "Finally a travel tool that doesn't try to upsell you on everything. Just honest planning.",
    rating: 5,
  },
  {
    name: "James R.",
    location: "Edinburgh",
    text: "Good stuff. Only complaint is I wanted more options for South India.",
    rating: 4,
  },
  {
    name: "Divya Menon",
    location: "Trivandrum",
    text: "Our group of 6 used this for a Himachal trip. Zero arguments about the plan for once 😂",
    rating: 5,
  },
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
