"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";

interface FullscreenLoaderProps {
  title: string | string[]; // Can be static string or array of phrases to cycle through
  subtitle: string;
}

export default function FullscreenLoader({ title, subtitle }: FullscreenLoaderProps) {
  const isAnimated = Array.isArray(title);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isAnimated) return;

    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % title.length);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [isAnimated, title]);

  const currentTitle = isAnimated ? title[index] : title;

  return (
    <div className="min-h-screen fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0806] p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center z-10 text-center px-4 gap-10"
      >
        <Spinner size="lg" />

        <div className="flex flex-col items-center gap-4 text-center mt-2">
          <div className="h-16 flex items-center justify-center" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.h3
                key={currentTitle as string}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-2xl md:text-[28px] lg:text-3xl text-white tracking-wide font-light"
              >
                {currentTitle}
              </motion.h3>
            </AnimatePresence>
          </div>
          <p className="text-[10px] md:text-xs font-sans text-white/40 tracking-[0.2em] uppercase">
            {subtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
