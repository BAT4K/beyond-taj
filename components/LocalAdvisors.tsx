"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Globe } from "lucide-react";

const advisors = [
  {
    id: "devyansh",
    name: "Devyansh Tiwari",
    region: "Delhi & Jaipur",
    bio: "Born in Delhi and forever between the capital and Jaipur, Devyansh knows which neighborhoods are worth staying in, which havelis are real heritage, and exactly where the scams hit.",
    image: "/images/advisors/devyansh.jpeg"
  },
  {
    id: "ashutosh",
    name: "Ashutosh Negi",
    region: "Himachal & Spiti",
    bio: "A Himachali by birth, Ashutosh has spent a decade trekking and driving every corner of Himachal and Spiti. He knows which passes open in May and which \"viewpoints\" are tourist bait.",
    image: "/images/advisors/ashutosh%20negi.jpeg"
  },
  {
    id: "nikhil",
    name: "Nikhil Sangwan",
    region: "Kashmir & Ladakh",
    bio: "Born in Haryana but settled in the mountains for years, Nikhil knows the high-altitude north like home. He'll tell you which Ladakh routes are open in June, which Kashmir valleys are calm right now, and which homestays are worth the climb.",
    image: "/images/advisors/nikhil%20sangwan.jpeg"
  },
  {
    id: "parth",
    name: "Parth Ahir",
    region: "Gujarat & Nearby",
    bio: "Gujarat-born and a real traveller at heart, Parth has covered every corner of his home state and the regions around it. He knows the white salt of the Rann, the lion country of Gir, and which routes into Rajasthan or Maharashtra are actually worth the drive.",
    image: "/images/advisors/parth%20ahir.jpeg"
  },
  {
    id: "eshaan",
    name: "Eshaan Chaudhary",
    region: "Goa, Mumbai & Konkan",
    bio: "At home in both Mumbai and Goa, Eshaan covers the west coast and the Konkan stretch in between. He knows which Goa beaches still feel like Goa, which Mumbai neighborhoods are actually worth staying in, and the quieter coastal towns most foreigners never find.",
    image: "/images/advisors/eshaan%20chaudhary.jpeg"
  },
  {
    id: "akshun",
    name: "Akshun",
    region: "Meghalaya & Northeast",
    bio: "Lives in Shillong. Knows the living root bridges, the right window for Cherrapunji, and which roads wash out in monsoon.",
    image: "/images/advisors/akshun%20.jpeg"
  },
  {
    id: "deepak",
    name: "Deepak",
    region: "Varanasi & the Ganges",
    bio: "Varanasi-born. Knows the real ghats from the tourist ones, where to catch the aarti without the crowd, and when to leave the city for Sarnath.",
    image: "/images/advisors/deepak.jpg"
  },
  {
    id: "jaideep",
    name: "Jaideep Singh",
    region: "Rishikesh & Haridwar",
    bio: "Years spent on the banks of the Ganges, Jaideep knows the spiritual stretch of Uttarakhand inside out. He'll tell you which ashrams are the real deal versus the Instagram traps, which rafting operators are actually safe, and which ghats to avoid during festival season when the crowds turn dangerous.",
    image: "/images/advisors/jaideep%20singh.jpeg"
  },
  {
    id: "network",
    name: "The Wider Network",
    region: "Across India",
    bio: "Beyond the featured advisors, BeyondTaj draws on a wider circle of local contributors — including Harsh Tyagi, Aradhya Chandra, Shreyansh Gaur, and 20+ other respected travelers across India. South, central, the Northeast, the small towns most blogs never cover. Wherever your trip takes you, someone we know has actually been there.",
    image: "/master-hero-poster.webp"
  }
];

// Fallback image in case the user hasn't added the specific photo yet
const FALLBACK_IMAGE = "/master-hero-poster.webp";

export default function LocalAdvisors() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    // Add a 10px buffer to account for rounding errors on some displays
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth + 10) < scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0806] border-t border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#c9a96e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row items-end justify-between gap-6 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-[#c9a96e] uppercase tracking-[0.2em] text-xs font-semibold mb-4 flex items-center gap-2">
            <Globe size={14} /> The Human Element
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-white/90 leading-tight">
            Know Your Local Advisors.
          </h3>
          <p className="mt-4 text-white/60 font-light text-base md:text-lg max-w-xl leading-relaxed">
            Humanizing a luxury brand starts with the experts behind the scenes. We draw on a deep network of local travelers, natives, and explorers to ensure every detail of your journey is authentic.
          </p>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-12 h-12 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0806] transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#c9a96e]/10 disabled:hover:text-[#c9a96e]"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Carousel */}
      <div className="relative w-full z-10">
        <ul
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex overflow-x-auto snap-x snap-mandatory custom-scrollbar px-4 sm:px-6 lg:px-8 pb-10 pt-4 gap-6 scroll-smooth items-start"
        >
          {advisors.map((advisor, index) => (
            <li
              key={advisor.id}
              className="snap-start shrink-0 w-[300px] md:w-[360px] group flex flex-col h-auto"
            >
              {/* Split Layout Card: Image Top, Content Bottom */}
              <div className="relative w-full h-full flex flex-col rounded-3xl overflow-hidden bg-[#0a0806] border border-white/10 hover:border-[#c9a96e]/30 transition-colors duration-500 shadow-2xl">
                
                {/* Top Image Section (Fixed height, completely unblocked) */}
                <div className="relative w-full h-[300px] md:h-[360px] shrink-0 overflow-hidden">
                  <Image
                    src={advisor.image}
                    alt={advisor.name}
                    fill
                    sizes="(max-width: 768px) 300px, 360px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== FALLBACK_IMAGE) {
                        target.src = FALLBACK_IMAGE;
                      }
                    }}
                  />
                  {/* Subtle vignette purely for luxury feel, not for text readability */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                {/* Bottom Content Section (Grows dynamically to fit text) */}
                <div className="flex-1 p-6 md:p-8 flex flex-col bg-gradient-to-b from-[#110e0a] to-[#0a0806] border-t border-white/5">
                  
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-serif text-2xl md:text-3xl text-white font-medium tracking-wide group-hover:text-[#c9a96e] transition-colors duration-300">
                      {advisor.name}
                    </h4>
                    {/* Verified Badge */}
                    <div className="w-5 h-5 rounded-full bg-[#c9a96e]/20 flex items-center justify-center shrink-0 ml-2">
                      <svg className="w-3 h-3 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#c9a96e]/80 text-xs uppercase tracking-widest font-semibold mb-5">
                    <MapPin size={14} className="text-[#c9a96e]" />
                    {advisor.region}
                  </div>

                  {/* Bio Text (Fully visible, dictates card height natively) */}
                  <p className="text-white/60 font-sans text-sm md:text-[15px] leading-relaxed font-light">
                    {advisor.bio}
                  </p>
                  
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
