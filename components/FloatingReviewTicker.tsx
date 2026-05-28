"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: "Sarah M.",
    location: "London",
    text: "The seasonal alerts saved my trip to North India! Slashed weeks of stress.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "David K.",
    location: "Berlin",
    text: "Avoided a massive heatwave mistake in Delhi thanks to the custom pacing.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    name: "Elena R.",
    location: "Madrid",
    text: "The scam prevention guide alone was worth it. Felt completely safe.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "James L.",
    location: "New York",
    text: "Incredible local insights. We skipped the tourist traps entirely.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Aisha T.",
    location: "Dubai",
    text: "Our Rajasthan route was flawless. The transport tips were a lifesaver.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/31.jpg"
  },
  {
    name: "Marcus P.",
    location: "Sydney",
    text: "Loved the curated hotels, though the pacing on day 3 was a bit fast for us.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/71.jpg"
  },
  {
    name: "Chloe W.",
    location: "Toronto",
    text: "Beyond Taj nailed the cultural immersion. We experienced Diwali like locals!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  },
  {
    name: "Terrence J.",
    location: "Atlanta",
    text: "The tailored culinary recommendations were phenomenal. Every meal was a hit.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    name: "Sophie L.",
    location: "Paris",
    text: "Great itinerary, but we wish we had booked more buffer days for shopping.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg"
  },
  {
    name: "Liam O.",
    location: "Dublin",
    text: "Having the exact train routes and booking timelines mapped out was priceless.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    name: "Emma C.",
    location: "Vancouver",
    text: "The architecture walking tours suggested were stunning. Highly recommended.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    name: "Julian B.",
    location: "Amsterdam",
    text: "Very well structured. We missed one temple due to traffic, but overall amazing.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/84.jpg"
  }
];

export default function FloatingReviewTicker() {
  const [index, setIndex] = useState<number | null>(null);
  const [shuffledReviews, setShuffledReviews] = useState(REVIEWS);

  useEffect(() => {
    // Client-side shuffle to avoid Next.js hydration mismatch
    const shuffled = [...REVIEWS].sort(() => Math.random() - 0.5);
    setShuffledReviews(shuffled);

    // Silently preload all images in the background to prevent layout buffer/lag
    shuffled.forEach((review) => {
      const img = new Image();
      img.src = review.avatar;
    });

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
              <img 
                src={shuffledReviews[index].avatar} 
                alt={`${shuffledReviews[index].name}'s avatar`}
                className="flex-shrink-0 w-10 h-10 rounded-full object-cover border border-white/10"
              />
              
              <div className="flex flex-col gap-0.5">
                {/* Name & Location */}
                <p className="text-base font-semibold text-white">
                  {shuffledReviews[index].name} <span className="font-light text-sm text-zinc-400">from {shuffledReviews[index].location}</span>
                </p>
                {/* Star Rating */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => {
                    const isFilled = i < shuffledReviews[index].rating;
                    return (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={isFilled ? "currentColor" : "transparent"} 
                        className={isFilled ? "text-amber-400" : "text-zinc-600"} 
                      />
                    );
                  })}
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
