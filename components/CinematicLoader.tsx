"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHRASES = [
  "Analyzing routing logistics...",
  "Vetting heritage properties...",
  "Optimizing transit windows...",
  "Generating custom vector blueprint..."
];

export default function CinematicLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0806]/90 backdrop-blur-md text-[#f5f0e8] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center max-w-md px-6 relative z-20"
      >
        <div className="relative w-16 h-16 mb-8 mx-auto">
          {/* Subtle pulsating gold accent */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-[#c9a96e] shadow-[0_0_20px_rgba(201,169,110,0.5)]"
          />
          <div className="absolute inset-2 rounded-full border-t border-l border-[#c9a96e]/60 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-xl" style={{ color: "#c9a96e" }}>BT</div>
        </div>
        
        <div className="h-6 relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <p className="text-xs font-light tracking-widest uppercase text-white/70">
                {PHRASES[index]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
