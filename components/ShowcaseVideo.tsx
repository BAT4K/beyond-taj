"use client";

import { useEffect, useState } from "react";

export default function ShowcaseVideo() {
  return (
    <section className="py-24 px-4 bg-[#0a0806]">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <h2 className="font-serif text-3xl md:text-5xl text-white/90 mb-4 tracking-wide drop-shadow-sm">
            India, planned properly.
          </h2>
          <p className="font-sans text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-light text-balance">
            Skip the tourist traps. Avoid the scams. Travel like a foreigner who knows what they’re doing.
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-[#c9a96e] tracking-wide drop-shadow-sm">
            The India you'll be visiting
          </h3>
        </div>
        
        <div className="w-full aspect-video bg-[#12100e] relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            preload="metadata"
            poster="/showcase-poster.webp"
            suppressHydrationWarning
            className="w-full h-full object-cover"
            src="/showcase-720.mp4"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
