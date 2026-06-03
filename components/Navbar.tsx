"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import FounderNoteModal from "./FounderNoteModal";

export default function Navbar() {
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFounderNoteOpen, setIsFounderNoteOpen] = useState(false);
  const pathname = usePathname();

  // Automatically close mobile menu when pathname changes (navigation completes)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const theme = {
    gold: "#c9a96e",
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="w-full px-4 md:px-10 py-4 md:py-6 flex justify-between items-center z-50 fixed top-0 bg-[#0a0806]/80 backdrop-blur-md border-b border-white/5 text-white">
        <div className="flex items-center gap-12">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition active:scale-95 active:opacity-50 active:duration-150">
            <Image
              src="/logo.svg"
              alt="Beyond Taj Emblem"
              width={120}
              height={56}
              priority
              className="h-12 md:h-14 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-serif text-xl md:text-2xl tracking-wide text-white">Beyond Taj</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex gap-8 items-center text-xs tracking-widest font-sans font-light uppercase mt-1">
            <Link href="/destinations" className="text-white/60 hover:text-[#c9a96e] transition-colors">Destinations</Link>
            <Link href="/journal" className="text-white/60 hover:text-[#c9a96e] transition-colors">The Journal</Link>
            <Link href="/about" className="text-white/60 hover:text-[#c9a96e] transition-colors">About</Link>
            <button onClick={() => setIsFounderNoteOpen(true)} className="text-white/60 hover:text-[#c9a96e] transition-colors uppercase tracking-widest text-xs cursor-pointer">
              Founder's Note
            </button>
          </div>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/review"
            className="whitespace-nowrap text-xs uppercase tracking-widest text-white/70 hover:text-white transition active:scale-95 active:opacity-50 active:duration-150"
          >
            Review Us
          </Link>

          {status === "unauthenticated" && (
            <button
              type="button"
              onClick={() => signIn()}
              className="whitespace-nowrap text-xs uppercase tracking-widest text-white/70 hover:text-white transition cursor-pointer active:scale-95 active:opacity-50 active:duration-150"
            >
              Client Login
            </button>
          )}

          {status === "authenticated" && (
            <>
              <Link
                href="/dashboard"
                className="whitespace-nowrap text-xs uppercase tracking-widest font-bold transition hover:opacity-80 active:scale-95 active:opacity-50 active:duration-150"
                style={{ color: theme.gold }}
              >
                My Dossiers
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="whitespace-nowrap text-xs uppercase tracking-widest text-white/50 hover:text-white transition cursor-pointer active:scale-95 active:opacity-50 active:duration-150"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
          className="lg:hidden p-2 text-white/80 hover:text-white transition-colors active:scale-95 active:opacity-50"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0a0806] pt-28 px-6 pb-6 flex flex-col lg:hidden"
          >
            <nav className="flex flex-col gap-8 text-center mt-12">
              <Link href="/destinations" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 transition duration-150">Destinations</Link>
              <Link href="/journal" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 transition duration-150">The Journal</Link>
              <Link href="/about" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 transition duration-150">About Us</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsFounderNoteOpen(true); }} className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 transition duration-150">Founder's Note</button>
              <Link href="/review" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 transition duration-150">Review Us</Link>
              
              <div className="w-12 h-px bg-white/10 mx-auto my-4" />
              
              {status === "unauthenticated" && (
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); signIn(); }}
                  className="text-sm uppercase tracking-widest text-[#c9a96e] hover:text-[#d4b47a] active:scale-95 active:opacity-50 transition duration-150"
                >
                  Client Login
                </button>
              )}

              {status === "authenticated" && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm uppercase tracking-widest font-bold active:scale-95 active:opacity-50 transition duration-150"
                    style={{ color: theme.gold }}
                  >
                    My Dossiers
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="text-sm uppercase tracking-widest text-white/50 hover:text-white active:scale-95 active:opacity-50 transition duration-150 mt-4"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <FounderNoteModal isOpen={isFounderNoteOpen} onClose={() => setIsFounderNoteOpen(false)} />
    </>
  );
}
