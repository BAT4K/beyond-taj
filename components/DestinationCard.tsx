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
      className={`relative h-[220px] md:h-[360px] group rounded-sm overflow-hidden border bg-zinc-900 cursor-pointer touch-manipulation active:scale-[0.98] will-change-transform ${
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
        <div className="absolute top-3 left-3 md:top-4 md:left-4 right-12 z-30 flex flex-row flex-wrap gap-1.5 pointer-events-none items-start">
          {reasons.map((r, i) => {
            const isWarning = r.includes('Required') || r.includes('Warning') || r.includes('Off') || r.includes('Complex');
            const isSuggested = r === 'Suggested';
            return (
              <div key={i} className={`px-1.5 py-0.5 md:px-2 md:py-1 text-[7px] md:text-[8px] uppercase tracking-widest font-semibold rounded-full backdrop-blur-md shadow-lg flex items-center gap-1 border transition-all ${
                isWarning
                  ? 'bg-black/80 text-white/70 border-white/10'
                  : isSuggested
                    ? 'bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/40 shadow-[0_0_15px_rgba(201,169,110,0.15)]'
                    : 'bg-black/60 text-[#c9a96e] border-[#c9a96e]/30'
              }`}>
                {isWarning ? <AlertTriangle size={8} className="text-white/40 md:w-[9px] md:h-[9px]" /> : isSuggested ? <Sparkles size={8} className="text-[#c9a96e] md:w-[9px] md:h-[9px]" /> : <Info size={8} className="text-[#c9a96e]/70 md:w-[9px] md:h-[9px]" />}
                {r}
              </div>
            );
          })}
        </div>
      )}

      {/* Top Right Toggle Button */}
      <div className="absolute top-1 right-1 md:top-3 md:right-3 z-30">
        <button
          onClick={(e) => { e.stopPropagation(); if (!isDisabled) onToggle(id); }}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center group/btn touch-manipulation"
        >
          <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl ${
            isSelected
              ? 'bg-[#c9a96e] text-black border border-[#c9a96e]'
              : 'bg-black/40 text-white/70 border border-white/20 group-hover/btn:bg-black/60 group-hover/btn:text-white group-hover/btn:border-white/40 group-hover/btn:scale-110 group-active/btn:scale-95'
          }`}>
            {isSelected ? <Check size={16} className="md:w-[18px] md:h-[18px]" /> : <Plus size={16} className="md:w-[18px] md:h-[18px]" />}
          </div>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-8 flex flex-col justify-end z-20 pointer-events-none">
        <p className="text-[9px] md:text-[10px] uppercase tracking-widest mb-1.5 md:mb-2 text-[#c9a96e] drop-shadow-md">{region}</p>
        <h3 className="font-serif text-base leading-tight md:text-3xl text-white drop-shadow-lg">{name}</h3>
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
