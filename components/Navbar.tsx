"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  const theme = {
    gold: "#c9a96e",
  };

  return (
    <header className="w-full px-4 md:px-10 py-4 md:py-6 flex justify-between items-center z-50 fixed top-0 bg-[#0a0806]/80 backdrop-blur-md border-b border-white/5 text-white">
      <div>
        <Link href="/" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-all active:scale-95 active:opacity-50 active:duration-150">
          <img
            src="/logo.png"
            alt="Beyond Taj Emblem"
            className="h-10 md:h-11 w-auto object-contain"
          />
          <span className="hidden sm:block font-serif text-xl md:text-2xl tracking-wide text-white">Beyond Taj</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <Link
          href="/review"
          className="whitespace-nowrap text-[10px] sm:text-xs uppercase tracking-widest text-white/70 hover:text-white transition-all active:scale-95 active:opacity-50 active:duration-150"
        >
          Review Us
        </Link>

        {status === "unauthenticated" && (
          <button
            onClick={() => signIn()}
            className="whitespace-nowrap text-[10px] sm:text-xs uppercase tracking-widest text-white/70 hover:text-white transition-all cursor-pointer active:scale-95 active:opacity-50 active:duration-150"
          >
            Client Login
          </button>
        )}

        {status === "authenticated" && (
          <>
            <Link
              href="/dashboard"
              className="whitespace-nowrap text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all hover:opacity-80 active:scale-95 active:opacity-50 active:duration-150"
              style={{ color: theme.gold }}
            >
              My Dossiers
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="whitespace-nowrap text-[10px] sm:text-xs uppercase tracking-widest text-white/50 hover:text-white transition-all cursor-pointer active:scale-95 active:opacity-50 active:duration-150"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
