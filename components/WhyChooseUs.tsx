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
            India is the most rewarding hard country on earth.
          </p>
          <p>
            It is also the country where foreign travelers get scammed by auto-rickshaw drivers, end up in the wrong Delhi neighborhood at midnight, take a 16-hour bus they didn’t need to take, eat the wrong street food on the wrong day, and burn 30% of their trip on tourist traps that look impressive on Instagram and feel pointless in person.
          </p>
          <p className="font-medium text-white/90">
            BeyondTaj exists so that doesn’t happen to you.
          </p>
        </div>
      </div>
    </section>
  );
}
