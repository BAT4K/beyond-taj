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
  const { data: session, status } = useSession();
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .critical-mobile-menu { display: none !important; }
        }
      `}} />
      <header className="w-full px-4 md:px-10 py-4 md:py-6 flex justify-between items-center z-50 fixed top-0 bg-[#0a0806]/80 backdrop-blur-md border-b border-white/5 text-white">
        <div className="flex items-center gap-12">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3 opacity-80 hover:opacity-100 transition active:scale-95 active:opacity-50 touch-manipulation transition duration-200">
            <Image
              src="/logo.svg"
              alt="Beyond Taj Emblem"
              width={43}
              height={56}
              className="h-12 md:h-14 w-auto object-contain"
              priority
              unoptimized
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
            className="whitespace-nowrap text-xs uppercase tracking-widest text-white/70 hover:text-white transition active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
          >
            Review Us
          </Link>

          {status === "loading" && (
            <div className="whitespace-nowrap text-xs uppercase tracking-widest opacity-0 pointer-events-none">
              Client Login
            </div>
          )}

          {status === "unauthenticated" && (
            <button
              type="button"
              onClick={() => signIn()}
              className="whitespace-nowrap text-xs uppercase tracking-widest text-white/70 hover:text-white transition cursor-pointer active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
            >
              Client Login
            </button>
          )}

          {status === "authenticated" && (
            <>
              {session?.user?.isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="whitespace-nowrap text-xs uppercase tracking-widest font-bold transition hover:opacity-80 active:scale-95 active:opacity-50 touch-manipulation transition duration-200 border border-[#c9a96e]/30 px-3 py-1.5 rounded-sm"
                  style={{ color: theme.gold, backgroundColor: "rgba(201,169,110,0.05)" }}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="whitespace-nowrap text-xs uppercase tracking-widest font-bold transition hover:opacity-80 active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
                style={{ color: theme.gold }}
              >
                My Blueprints
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="whitespace-nowrap text-xs uppercase tracking-widest text-white/50 hover:text-white transition cursor-pointer active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
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
          className="critical-mobile-menu lg:hidden p-2 text-white/80 hover:text-white transition-colors active:scale-95 active:opacity-50"
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
              <Link href="/destinations" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 touch-manipulation transition duration-200">Destinations</Link>
              <Link href="/journal" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 touch-manipulation transition duration-200">The Journal</Link>
              <Link href="/about" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 touch-manipulation transition duration-200">About Us</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setIsFounderNoteOpen(true); }} className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 touch-manipulation transition duration-200">Founder's Note</button>
              <Link href="/review" className="text-xl font-serif text-white/80 hover:text-[#c9a96e] active:scale-95 active:opacity-50 touch-manipulation transition duration-200">Review Us</Link>
              
              <div className="w-12 h-px bg-white/10 mx-auto my-4" />
              
              {status === "loading" && (
                <div className="text-sm uppercase tracking-widest opacity-0 pointer-events-none">
                  Client Login
                </div>
              )}

              {status === "unauthenticated" && (
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); signIn(); }}
                  className="text-sm uppercase tracking-widest text-[#c9a96e] hover:text-[#d4b47a] active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
                >
                  Client Login
                </button>
              )}

              {status === "authenticated" && (
                <>
                  {session?.user?.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="text-sm uppercase tracking-widest font-bold active:scale-95 active:opacity-50 touch-manipulation transition duration-200 border border-[#c9a96e]/30 px-6 py-2 mx-auto rounded-sm mb-4"
                      style={{ color: theme.gold, backgroundColor: "rgba(201,169,110,0.05)" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="text-sm uppercase tracking-widest font-bold active:scale-95 active:opacity-50 touch-manipulation transition duration-200"
                    style={{ color: theme.gold }}
                  >
                    My Blueprints
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                    className="text-sm uppercase tracking-widest text-white/50 hover:text-white active:scale-95 active:opacity-50 touch-manipulation transition duration-200 mt-4"
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
