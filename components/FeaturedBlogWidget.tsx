"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, X, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blogs';

export default function FeaturedBlogWidget({ blog }: { blog: BlogPost | undefined }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || !blog) return;

    // Wait 3.5 seconds before showing the widget so it doesn't interrupt the hero section
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [isDismissed, blog]);

  if (!blog) return null;

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-3rem)] md:w-80"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl group hover:border-[#c9a96e]/50 transition-colors duration-500">
            {/* Subtle glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a96e]/5 to-transparent pointer-events-none" />
            
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full transition-colors z-10"
              aria-label="Dismiss widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <Link href={`/journal/${blog.slug}`} className="block p-5 pl-6 pt-6 relative z-0">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[#c9a96e]" />
                <span className="text-[9px] uppercase tracking-widest text-[#c9a96e] font-semibold">
                  Featured Guide
                </span>
              </div>
              
              <h4 className="font-serif text-lg text-white/90 leading-tight mb-2 pr-4 group-hover:text-[#c9a96e] transition-colors duration-300">
                {blog.title}
              </h4>
              
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#c9a96e] transition-colors duration-300 mt-4 font-semibold">
                Start Planning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
