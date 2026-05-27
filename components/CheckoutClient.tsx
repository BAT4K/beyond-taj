"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, Lock, ShieldCheck, Mail, ArrowRight, Loader2 } from "lucide-react";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import { useSession, signIn } from "next-auth/react";

interface CheckoutClientProps {
  journeyId: string;
  selectedDays: number;
  travelStyle: string;
  destinations: { id: string; name: string }[];
}

export default function CheckoutClient({
  journeyId,
  selectedDays,
  travelStyle,
  destinations,
}: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    load({ mode: "sandbox" }).then((cf: any) => {
      setCashfree(cf);
    });
  }, []);

  useEffect(() => {
    // Post-Payment Routing check: Cashfree returnUrl appends ?order_id=
    if (searchParams.get("order_id")) {
      router.push(`/dashboard/${journeyId}`);
    }
  }, [searchParams, router, journeyId]);

  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    border: "#2a241e",
  };

  const handleDepositClick = async () => {
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journeyId,
          amount: 39,
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }
      
      if (cashfree && data.payment_session_id) {
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
        });
      } else {
        throw new Error("Payment SDK not initialized or session missing");
      }
    } catch(err) {
       console.error("Payment flow error:", err);
       setIsProcessing(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessing(true);
    const result = await signIn("email", { 
      email, 
      redirect: false,
      callbackUrl: window.location.href 
    });
    
    setIsProcessing(false);
    if (result && !result.error) {
      setIsAuthSuccess(true);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans pt-32 pb-16"
      style={{ backgroundColor: theme.bg, color: theme.cream }}
    >
      <main className="flex-1 w-full max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4 text-white drop-shadow-md">
              Your Bespoke Journey
            </h2>
            <p className="text-white/50 text-sm italic tracking-wide">
              Crafted for the extraordinary.
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-sm relative overflow-hidden bg-[#0a0806] border border-white/5 border-t-2 border-t-[#c9a96e] bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Duration</p>
                <p className="font-serif text-xl">{selectedDays} Days</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Pace & Style</p>
                <p className="font-serif text-xl">{travelStyle}</p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Destinations</p>
              <div className="flex flex-wrap gap-2">
                {destinations.length > 0 ? (
                  destinations.map((d: any) => (
                    <span
                      key={d.id}
                      className="px-3 py-1 border rounded-full text-sm bg-white/5 text-white/90 hover:border-[#c9a96e]/50 transition-colors cursor-default"
                      style={{ borderColor: theme.border }}
                    >
                      {d.name}
                    </span>
                  ))
                ) : (
                  <span className="text-white/30 italic">Open exploration</span>
                )}
              </div>
            </div>

            <div className="border-t pt-8 mb-10" style={{ borderColor: theme.border }}>
              <div className="p-6 md:p-8 rounded-sm border border-white/5 bg-gradient-to-br from-[#c9a96e]/[0.06] via-transparent to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />
                
                <div className="flex justify-between items-start mb-6">
                  <p className="text-xs uppercase tracking-widest text-white/40">Blueprint Deliverables</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: theme.gold }}>Included in $39 Fee</p>
                </div>

                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <span style={{ color: theme.gold }} className="mt-0.5 shrink-0">✦</span>
                    <div>
                      <p className="text-sm text-white/90 font-medium mb-1 tracking-wide">Curated Day-by-Day Itinerary</p>
                      <p className="text-xs text-white/50 leading-relaxed">A seamless, personalized route perfectly optimized for your {travelStyle.toLowerCase()} pace.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span style={{ color: theme.gold }} className="mt-0.5 shrink-0">✦</span>
                    <div>
                      <p className="text-sm text-white/90 font-medium mb-1 tracking-wide">Hand-Picked Accommodations</p>
                      <p className="text-xs text-white/50 leading-relaxed">Exclusive property recommendations tailored exactly to your aesthetic.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span style={{ color: theme.gold }} className="mt-0.5 shrink-0">✦</span>
                    <div>
                      <p className="text-sm text-white/90 font-medium mb-1 tracking-wide">Logistics & Transport Engine</p>
                      <p className="text-xs text-white/50 leading-relaxed">Smart routing guidance spanning domestic flights, private transfers, and rail.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {status === "loading" ? (
              <div className="flex flex-col items-center justify-center py-6 gap-4 border border-white/5 rounded-sm" style={{ backgroundColor: theme.bg }}>
                <Loader2 size={24} className="animate-spin text-white/40" />
                <span className="text-xs uppercase tracking-widest text-white/40">Verifying Identity...</span>
              </div>
            ) : status === "unauthenticated" ? (
              <div className="p-6 md:p-8 rounded-sm border" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                {isAuthSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-4" style={{ borderColor: theme.gold }}>
                      <Mail size={20} style={{ color: theme.gold }} />
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-2">Secure Link Dispatched</h3>
                    <p className="text-xs text-white/50 font-light max-w-[250px] mx-auto leading-relaxed">
                      We have sent an encrypted access link to <span className="text-white">{email}</span>. Click it to unlock this blueprint.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="font-serif text-xl text-white mb-2">Secure Your Blueprint</h3>
                      <p className="text-xs text-white/50 font-light">
                        Enter your email to verify your identity and attach this journey to your private dossier.
                      </p>
                    </div>
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={14} className="text-white/30" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="traveler@example.com"
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border focus:outline-none transition-all duration-300 text-sm font-light placeholder-white/20 text-white"
                          style={{ borderColor: theme.border }}
                          onFocus={(e) => e.target.style.borderColor = theme.gold}
                          onBlur={(e) => e.target.style.borderColor = theme.border}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing || email.length === 0}
                        className="w-full py-3.5 uppercase tracking-widest text-xs font-bold rounded-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        style={{ backgroundColor: theme.gold, color: theme.bg }}
                      >
                        {isProcessing ? "Sending Secure Link..." : "Authenticate to Continue"}
                        {!isProcessing && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  disabled={isProcessing || !cashfree}
                  onClick={handleDepositClick}
                  style={{ backgroundColor: theme.gold, color: theme.bg }}
                  className="w-full py-4 text-sm uppercase tracking-widest font-bold hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span>Connecting to Secure Gateway...</span>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Lock size={16} />
                      Unlock Your Custom Blueprint — $39
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/40 uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  Secure, encrypted processing via Cashfree
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
