"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AlertTriangle, Info, Sparkles, Check, Plus } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800";

interface DestinationCardProps {
  id: string;
  name: string;
  region: string;
  imageSrc: string;
  isSelected: boolean;
  isDisabled: boolean;
  reasons: string[];
  borderColor: string;
  isPriority: boolean;
  index: number;
  onCardClick: (id: string) => void;
  onToggle: (id: string) => void;
}

const DestinationCard = React.memo(function DestinationCard({
  id,
  name,
  region,
  imageSrc,
  isSelected,
  isDisabled,
  reasons,
  borderColor,
  isPriority,
  index,
  onCardClick,
  onToggle,
}: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={isDisabled ? undefined : { y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      onClick={() => !isDisabled && onCardClick(id)}
      className={`relative h-[360px] group rounded-sm overflow-hidden border bg-zinc-900 cursor-pointer touch-manipulation active:scale-[0.98] will-change-transform ${
        isDisabled ? 'opacity-30 grayscale pointer-events-none' : ''
      }`}
      style={{ 
        borderColor, 
        transform: 'translate3d(0,0,0)',
      }}
    >
      <Image
        src={imageSrc || FALLBACK_IMAGE}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover w-full h-full transition-all duration-700 ease-out ${
          isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
        }`}
        priority={isPriority}
        loading={isPriority ? undefined : "lazy"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/20 to-transparent z-10 pointer-events-none" />

      {/* Top Left Badges (Reasons) */}
      {reasons.length > 0 && (
        <div className="absolute top-4 left-4 right-14 z-30 flex flex-row flex-wrap gap-1.5 pointer-events-none items-start">
          {reasons.map((r, i) => {
            const isWarning = r.includes('Required') || r.includes('Warning') || r.includes('Off') || r.includes('Complex');
            const isSuggested = r === 'Suggested';
            return (
              <div key={i} className={`px-2 py-1 text-[8px] uppercase tracking-widest font-semibold rounded-full backdrop-blur-md shadow-lg flex items-center gap-1 border transition-all ${
                isWarning
                  ? 'bg-black/80 text-white/70 border-white/10'
                  : isSuggested
                    ? 'bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/40 shadow-[0_0_15px_rgba(201,169,110,0.15)]'
                    : 'bg-black/60 text-[#c9a96e] border-[#c9a96e]/30'
              }`}>
                {isWarning ? <AlertTriangle size={9} className="text-white/40" /> : isSuggested ? <Sparkles size={9} className="text-[#c9a96e]" /> : <Info size={9} className="text-[#c9a96e]/70" />}
                {r}
              </div>
            );
          })}
        </div>
      )}

      {/* Top Right Toggle Button */}
      <div className="absolute top-5 right-5 z-30">
        <button
          onClick={(e) => { e.stopPropagation(); if (!isDisabled) onToggle(id); }}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl ${
            isSelected
              ? 'bg-[#c9a96e] text-black border border-[#c9a96e]'
              : 'bg-black/40 text-white/70 border border-white/20 hover:bg-black/60 hover:text-white hover:border-white/40 hover:scale-110 active:scale-95 touch-manipulation'
          }`}
        >
          {isSelected ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end z-20 pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest mb-2 text-[#c9a96e] drop-shadow-md">{region}</p>
        <h3 className="font-serif text-2xl md:text-3xl leading-tight text-white drop-shadow-lg">{name}</h3>
      </div>
    </motion.div>
  );
}, (prev, next) => {
  // Custom comparison — only re-render if these specific props change
  return (
    prev.isSelected === next.isSelected &&
    prev.isDisabled === next.isDisabled &&
    prev.borderColor === next.borderColor &&
    prev.reasons.length === next.reasons.length &&
    prev.reasons.every((r, i) => r === next.reasons[i])
  );
});

DestinationCard.displayName = "DestinationCard";

export default DestinationCard;
