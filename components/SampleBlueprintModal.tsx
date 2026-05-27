import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface SampleBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleBlueprintModal({ isOpen, onClose }: SampleBlueprintModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden flex flex-col max-h-[85vh] relative shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 z-20 bg-zinc-950">
              <h3 className="font-serif text-2xl text-[#f5f0e8] tracking-wide font-light">Sample Dossier: 7 Days in Rajasthan</h3>
              <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-8 overflow-y-auto custom-scrollbar relative z-10 pb-32">
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 1</h4>
              <h5 className="font-serif text-3xl text-white/90 mb-6">Arrival & Pacing</h5>
              
              <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                <p>
                  Upon landing in Jaipur, the immediate shift in climate and sensory input can be overwhelming. Avoid the common mistake of scheduling major sightseeing (like the Amer Fort) on your first afternoon. Instead, allow your circadian rhythm to reset by checking into your heritage haveli and spending the evening in the quieter, pedestrian-friendly zones of the Pink City.
                </p>

                {/* Local Insight Box */}
                <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 p-5 rounded-sm flex gap-4">
                  <Lightbulb className="text-[#c9a96e] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h6 className="text-[#c9a96e] font-medium text-xs tracking-widest uppercase mb-1">Local Insight</h6>
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      Most tourist maps direct you to Bapu Bazaar for evening shopping, but locals prefer the Johari Bazaar for authentic textiles. Additionally, pre-book your airport transfer through your hotel rather than negotiating with taxi touts outside the arrival gates, which often leads to "commission-driven" detours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 2</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">The Royal Ascendancy</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    Start early to beat the heat and the crowds. The Amer Fort opens at 8:00 AM, but arriving at 7:30 AM allows you to photograph the reflection of the fort in Maota Lake undisturbed. Avoid the elephant rides at the entrance—opt for a jeep or a brisk walk up the cobbled path.
                  </p>
                  <p>
                    By noon, retreat to a shaded courtyard cafe in the old city. For lunch, skip the highly-marketed tourist buffets and seek out a traditional Rajasthani thali at a local institution. The afternoon should be reserved for the City Palace, specifically the private quarters which require a slightly more expensive ticket but offer unparalleled architectural details away from the crowds.
                  </p>
                  <p>
                    In the evening, consider a sunset view from Nahargarh Fort, but avoid the main restaurant which is often overpriced. Instead, pack a small thermos of chai and enjoy the panoramic view of the city lighting up from the fort's western walls.
                  </p>
                </div>
              </div>

              {/* Day 3 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 3</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">The Indigo Labyrinth (Jodhpur)</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    Depart Jaipur after an early breakfast. The drive to Jodhpur takes approximately 5-6 hours. Request your driver to take the slightly longer but vastly more scenic route via Pushkar if you wish to break the journey at the holy lake, though beware of aggressive temple priests offering "blessings."
                  </p>
                  <p>
                    Arrive in Jodhpur by mid-afternoon. Check into your boutique stay—preferably one located within the old city walls directly beneath Mehrangarh Fort. Spend the late afternoon getting lost in the blue-washed alleyways of the Brahmpuri district, a paradise for street photography. 
                  </p>
                </div>
              </div>

              {/* Day 4 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 4</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">Citadel of the Sun</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    Dedicate your morning to Mehrangarh Fort. This is arguably the best-preserved and most magnificent fort in India. The audio guide here is exceptionally well-produced—do not skip it. Ensure you visit the Phool Mahal (Palace of Flowers) and take time to observe the intricate stonework.
                  </p>
                  <p>
                    After descending from the fort, walk through the Sardar Market surrounding the iconic Clock Tower. The sensory overload here is real: a chaotic symphony of spice vendors, textiles, and street food. For lunch, seek out the famous Makhaniya Lassi at Shri Mishrilal Hotel, an institution operating since 1927.
                  </p>
                  <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 p-5 rounded-sm flex gap-4 mt-6">
                    <Lightbulb className="text-[#c9a96e] flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <h6 className="text-[#c9a96e] font-medium text-xs tracking-widest uppercase mb-1">Local Insight</h6>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        Rather than dining at the highly-commercialized rooftop restaurants marketed heavily on TripAdvisor, ask your hotel to arrange a private dinner near the Toorji Ka Jhalra (a beautifully restored 18th-century stepwell) for a much more atmospheric and intimate evening.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 5 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 5</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">Transit to the Venice of the East (Udaipur)</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    The 5-hour drive south from Jodhpur to Udaipur is one of the most picturesque in Rajasthan, winding through the Aravalli hills. Midway, a stop at the Ranakpur Jain Temple is non-negotiable. This 15th-century marble marvel features 1,444 intricately carved pillars, no two of which are identical.
                  </p>
                  <p>
                    Note: The temple enforces a strict dress code (no shorts, bare shoulders, or leather items including belts and wallets). Plan accordingly. 
                  </p>
                  <p>
                    Arrive in Udaipur, the City of Lakes, just before sunset. Check into your lakeside haveli and enjoy a quiet evening watching the lights of the City Palace reflect on the waters of Lake Pichola.
                  </p>
                </div>
              </div>

              {/* Day 6 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 6</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">Palaces & Pristine Waters</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    Begin with the sprawling City Palace complex. The architecture here shifts from Rajput military functionality to delicate, glass-inlaid luxury. Afterward, take a short walk to the Jagdish Temple to observe morning rituals.
                  </p>
                  <p>
                    In the late afternoon, bypass the crowded shared boat rides from the municipal dock. Instead, charter a private, smaller boat around 4:30 PM. This guarantees you unobstructed views and the freedom to pause near Jag Mandir island exactly as the sun dips below the Aravallis, turning the lake into liquid gold.
                  </p>
                </div>
              </div>

              {/* Day 7 */}
              <div className="mt-12 relative">
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] mb-2">Day 7</h4>
                <h5 className="font-serif text-3xl text-white/90 mb-6">Departure & Final Reflections</h5>
                <div className="space-y-6 text-sm text-zinc-300 font-light leading-relaxed font-sans">
                  <p>
                    Enjoy a slow, final morning. If your flight is later in the day, take an early morning walk to the Ghats—Ambrai Ghat is particularly peaceful at dawn, offering spectacular views of the City Palace waking up across the water.
                  </p>
                  <p>
                    Your private driver will coordinate your transfer to the Maharana Pratap Airport based on your flight schedule. Take a moment to reflect on the architectural marvels, the warmth of the locals, and the seamless pacing of your curated journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Conversion CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent z-30 pt-20 pointer-events-auto">
              <Link href="/plan" onClick={onClose} className="w-full max-w-sm">
                <button className="w-full relative px-8 py-4 border border-[#c9a96e] bg-[#c9a96e] hover:bg-[#b0925e] text-black rounded-sm cursor-pointer transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(201,169,110,0.3)] flex items-center justify-center gap-3">
                  <Lock size={16} />
                  <span className="font-sans tracking-widest text-xs uppercase font-bold">Unlock Your Custom Blueprint - $39</span>
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
