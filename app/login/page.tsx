"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    darker: "#12100e",
    border: "#2a241e",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.bg, color: theme.cream }}>
      <main className="flex-grow flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md p-8 md:p-10 rounded-sm border shadow-2xl relative overflow-hidden" style={{ backgroundColor: theme.darker, borderColor: theme.border }}>
          {/* Subtle gold glow behind the form */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[150px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: theme.gold }} />

          <div className="relative z-10 text-center mb-8">
            <h1 className="font-serif text-3xl mb-3 text-white">Access Portal</h1>
            <p className="text-white/50 text-sm font-light leading-relaxed">
              Enter your email address to receive a secure, passwordless magic link to your travel dossiers.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 border" style={{ borderColor: theme.gold, backgroundColor: `${theme.gold}15` }}>
                <CheckCircle2 size={32} style={{ color: theme.gold }} />
              </div>
              <h2 className="font-serif text-2xl text-white mb-2">Check Your Inbox</h2>
              <p className="text-white/60 text-sm font-light">
                We've sent a secure access link to <strong className="text-white">{email}</strong>. Please check your spam folder if it doesn't arrive within a minute.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="uppercase tracking-widest text-[10px] text-white/50 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-white/30" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="traveler@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0806] transition duration-300 text-sm font-light placeholder-white/20 text-white"
                    style={{ borderColor: theme.border }}
                    onFocus={(e) => e.target.style.borderColor = theme.gold}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || email.length === 0}
                className="w-full py-4 uppercase tracking-widest text-xs font-bold rounded-sm hover:bg-white transition duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{ backgroundColor: theme.gold, color: theme.bg }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? "Generating Link..." : "Request Access Link"}
                  {!isLoading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
