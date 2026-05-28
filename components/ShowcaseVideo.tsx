"use client";

import { useEffect, useState } from "react";

export default function ShowcaseVideo() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="py-24 px-4 bg-[#0a0806]">
        <div className="max-w-5xl mx-auto flex flex-col items-center min-h-[400px]">
          {/* Layout placeholder to prevent CLS */}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-[#0a0806]">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#c9a96e] mb-10 text-center tracking-wide drop-shadow-sm">
          India you'll be visiting!
        </h2>
        
        <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/showcase-poster.webp"
            suppressHydrationWarning
            className="w-full h-auto object-cover"
            src="/showcase-720.mp4"
          />
        </div>
      </div>
    </section>
  );
}
