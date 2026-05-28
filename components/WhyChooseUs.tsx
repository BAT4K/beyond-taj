import React from 'react';

const theme = {
  bg: "#0a0806",
  gold: "#c9a96e",
  cream: "#f5f0e8",
};

export default function WhyChooseUs() {
  return (
    <section className="w-full py-24 px-6 md:px-10 border-t border-white/5" style={{ backgroundColor: theme.bg, color: theme.cream }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-8">
            Travel India With <br/>
            <span style={{ color: theme.gold }} className="italic">Real Local Understanding</span>
          </h2>
          <div className="w-16 h-px bg-white/20 mb-8" />
        </div>
        <div className="flex flex-col gap-6 text-sm md:text-base font-light tracking-wide leading-relaxed text-white/70 font-sans">
          <p>
            India is one of the most rewarding countries in the world to explore — but it can also feel overwhelming if you don’t know where to go, what areas to avoid, or how to navigate the country properly. Our team combines deep local knowledge, real travel experience across India, and practical on-ground understanding to help travelers make smarter decisions throughout their journey.
          </p>
          <p>
            We help you avoid overrated tourist traps, common scams, unsafe situations, poorly planned routes, and unnecessary travel stress. From recommending the right neighborhoods to stay in, to helping you understand local culture, transportation, pacing, and regional differences, our goal is to help you experience India confidently, comfortably, and more authentically. Beyond Taj is designed to help you discover the best of India — while traveling with better awareness, better planning, and better local insight.
          </p>
        </div>
      </div>
    </section>
  );
}
