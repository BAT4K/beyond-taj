import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface FounderNoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderNoteDrawer({ isOpen, onClose }: FounderNoteDrawerProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#0a0806]/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl bg-[#0a0806] border border-[#c9a96e]/20 p-6 sm:p-8 md:p-14 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full backdrop-blur-md"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8 md:mb-10 mt-4 md:mt-0">
              <span className="text-[#c9a96e] uppercase tracking-widest text-xs font-semibold">A Note from the Founder</span>
              <div className="w-12 h-px bg-[#c9a96e]/30 mx-auto mt-4 md:mt-6" />
            </div>

            <div className="font-sans font-light tracking-wide text-[16px] md:text-lg text-white/90 leading-relaxed md:leading-loose space-y-6 md:space-y-8">
              <p>
                "I love travelling India. Genuinely, deeply love it.
              </p>
              <p>
                And for years I've watched foreign travellers arrive full of excitement — and leave having seen almost none of what makes this country extraordinary. Stuck in the chaos of the obvious places, following advice from Instagram reels and YouTube videos made by people who spent three weeks here and called themselves experts.
              </p>
              <p>
                It frustrated me more than I can explain.
              </p>
              <p>
                India has a beauty that most travellers never get close to. Not because it's hidden or hard to reach — but because nobody pointed them in the right direction.
              </p>
              <p>
                That's why I built this. Not to be another travel platform, but to be the honest, knowledgeable friend that every India traveller deserves. Someone who actually knows this country and genuinely wants you to experience it the right way.
              </p>
              <p className="text-[#c9a96e] font-serif text-xl md:text-2xl mt-8 italic">
                India will surprise you. Let it."
              </p>
            </div>

            <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-lg">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#c9a96e]/40 shrink-0 shadow-[0_0_20px_rgba(201,169,110,0.15)]">
                <Image
                  src="/jaideep.jpeg"
                  alt="Jaideep Singh"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover object-[center_95%]"
                />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-serif text-2xl md:text-3xl text-white/90">Jaideep Singh</h4>
                <span className="text-[#c9a96e] uppercase tracking-widest text-[10px] md:text-xs mt-2 block">Founder, Beyond Taj</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
