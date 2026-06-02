"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, X, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blogs';

export default function FeaturedBlogWidget({ blogs }: { blogs: BlogPost[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Handle initial fade-in delay
  useEffect(() => {
    if (isDismissed || blogs.length === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [isDismissed, blogs.length]);

  // Handle 10-second rotation loop
  useEffect(() => {
    if (!isVisible || isDismissed || blogs.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % blogs.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed, blogs.length, isHovered]);

  if (!blogs || blogs.length === 0) return null;
  const currentBlog = blogs[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-3rem)] md:w-80"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl group hover:border-[#c9a96e]/50 transition-colors duration-500">
            {/* Subtle glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/5 to-transparent pointer-events-none" />
            
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full transition-colors z-20"
              aria-label="Dismiss widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <Link href={`/journal/${currentBlog.slug}`} className="block p-5 pl-6 pt-6 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span className="text-[9px] uppercase tracking-widest text-[#c9a96e] font-semibold">
                  Featured Guide
                </span>
              </div>
              
              <div className="min-h-[56px] flex items-center pr-4">
                <AnimatePresence mode="wait">
                  <motion.h4 
                    key={currentBlog.slug}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="font-serif text-lg text-white/90 leading-tight group-hover:text-[#c9a96e] transition-colors duration-300"
                  >
                    {currentBlog.title}
                  </motion.h4>
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#c9a96e] transition-colors duration-300 mt-4 font-semibold">
                Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Visual Progress Bar Indicator */}
            {blogs.length > 1 && (
              <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full z-20">
                <motion.div 
                  className="h-full bg-[#c9a96e]/50"
                  key={currentIndex + (isHovered ? "-paused" : "")}
                  initial={{ width: isHovered ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: isHovered ? 0 : 10, 
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
