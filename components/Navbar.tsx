"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();

  const theme = {
    gold: "#c9a96e",
  };

  return (
    <header className="w-full px-6 md:px-10 py-6 flex justify-between items-center z-50 fixed top-0 bg-[#0a0806]/80 backdrop-blur-md border-b border-white/5 text-white">
      <div>
        <Link href="/" className="font-serif text-xl tracking-wide text-white opacity-80 hover:opacity-100 transition-opacity">
          Beyond the Taj
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {status === "unauthenticated" && (
          <button
            onClick={() => signIn()}
            className="text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Client Login
          </button>
        )}
        
        {status === "authenticated" && (
          <>
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-widest font-bold transition-colors hover:opacity-80"
              style={{ color: theme.gold }}
            >
              My Dossiers
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
