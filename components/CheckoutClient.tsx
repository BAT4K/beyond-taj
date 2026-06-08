"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { countries } from "@/lib/countries";
import { Mail, ArrowRight, ChevronDown, Search } from "lucide-react";
import Spinner from "./Spinner";
import { useSession, signIn } from "next-auth/react";

interface CheckoutClientProps {
  journeyId: string;
  selectedDays: number;
  travelStyle: string;
  destinations: { id: string; name: string }[];
  landscapes: string[];
}

export default function CheckoutClient({
  journeyId,
  selectedDays,
  travelStyle,
  destinations,
  landscapes,
}: CheckoutClientProps) {
  const displayStyle = travelStyle.split(' | ')[0];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({ name: "United States", code: "+1", flag: "🇺🇸" });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [specificInterests, setSpecificInterests] = useState("");

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.country-dropdown-container')) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    border: "#2a241e",
  };

  const handleDepositClick = async () => {
    setIsProcessing(true);
    
    try {
      const fullPhone = `${selectedCountry.code}${whatsapp}`;
      const sanitizedPhone = fullPhone.replace(/\D/g, '');
      if (sanitizedPhone.length < 7 || sanitizedPhone.length > 15) {
        alert("Please enter a valid WhatsApp number (7-15 digits including country code)");
        setIsProcessing(false);
        return;
      }

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journeyId,
          customerName: name || "Anonymous",
          customerEmail: session?.user?.email || email || "anonymous@example.com",
          customerWhatsapp: sanitizedPhone,
          specificInterests
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }
      
      window.location.href = `/dashboard/${journeyId}`;
      
    } catch(err) {
       console.error("Inquiry submission error:", err);
       alert("Failed to submit inquiry. Please try again.");
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
              Your Honest Journey
            </h2>
            <p className="text-white/50 text-sm italic tracking-wide">
              Crafted for the extraordinary.
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-sm relative overflow-hidden bg-[#12100e] border border-white/5 border-t-2 border-t-[#c9a96e] bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl">
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

            {landscapes && landscapes.length > 0 && (
              <div className="mb-10">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Preferred Landscapes</p>
                <div className="flex flex-wrap gap-2">
                  {landscapes.map((l: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 border rounded-full text-sm bg-white/5 text-white/90 hover:border-[#c9a96e]/50 transition-colors cursor-default"
                      style={{ borderColor: theme.border }}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-8 mb-10" style={{ borderColor: theme.border }}>
              <div className="p-6 md:p-8 rounded-sm border border-white/5 bg-gradient-to-br from-[#c9a96e]/[0.06] via-transparent to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                  <p className="text-xs uppercase tracking-widest text-white/40">Blueprint Deliverables</p>
                  <p className="w-fit text-[10px] sm:text-xs uppercase tracking-widest px-2 py-1 bg-[#c9a96e]/10 rounded-sm border border-[#c9a96e]/20" style={{ color: theme.gold }}>Included in your blueprint</p>
                </div>

                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <span style={{ color: theme.gold }} className="mt-0.5 shrink-0">✦</span>
                    <div>
                      <p className="text-sm text-white/90 font-medium mb-1 tracking-wide">Curated Day-by-Day Itinerary</p>
                      <p className="text-xs text-white/50 leading-relaxed">A seamless, personalized route perfectly optimized for your {displayStyle.toLowerCase()} pace.</p>
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

                <div className="mt-8 p-4 bg-[#c9a96e]/[0.03] border border-[#c9a96e]/10 rounded-sm flex items-start gap-3">
                  <Mail size={16} className="text-[#c9a96e] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#c9a96e]/80 leading-relaxed">
                    Our concierge will connect with you via WhatsApp or email very soon to begin crafting your journey.
                  </p>
                </div>
              </div>
            </div>

            {status === "loading" ? (
              <div className="flex flex-col items-center justify-center py-6 gap-4 border border-white/5 rounded-sm" style={{ backgroundColor: theme.bg }}>
                <Spinner size="sm" showLogo={false} />
                <span className="text-xs uppercase tracking-widest text-white/40">Verifying Identity…</span>
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
                        Enter your email to verify your identity and attach this journey to your private blueprint.
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
                          autoComplete="email"
                          placeholder="traveler@example.com"
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0806] transition-colors duration-300 text-sm font-light placeholder-white/20 text-white"
                          style={{ borderColor: theme.border }}
                          onFocus={(e) => e.target.style.borderColor = theme.gold}
                          onBlur={(e) => e.target.style.borderColor = theme.border}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing || email.length === 0}
                        className="w-full py-3.5 uppercase tracking-widest text-xs font-bold rounded-sm border border-[#c9a96e]/40 bg-[#c9a96e]/10 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {isProcessing ? "Sending Secure Link…" : "Authenticate to Continue"}
                        {!isProcessing && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="font-serif text-xl text-white mb-2">Almost There</h3>
                  <p className="text-xs text-white/50 font-light">
                    Please provide your name and WhatsApp number for our concierge.
                  </p>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0806] transition-colors duration-300 text-sm font-light placeholder-white/20 text-white"
                    style={{ borderColor: theme.border }}
                    onFocus={(e) => e.target.style.borderColor = theme.gold}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                </div>
                <div className="mb-6 flex gap-3">
                  <div className="relative w-[35%] md:w-1/3 country-dropdown-container">
                    <div 
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full px-3 h-[46px] bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] transition duration-300 text-sm font-light text-white cursor-pointer flex items-center justify-between"
                      style={{ borderColor: theme.border }}
                    >
                      <span className="truncate pr-1">
                        {selectedCountry.flag} {selectedCountry.code}
                      </span>
                      <svg className={`w-4 h-4 fill-current text-white/50 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>

                    {isCountryDropdownOpen && (
                      <div className="absolute z-50 bottom-full mb-2 w-64 bg-[#12100e] border border-white/10 shadow-2xl rounded-sm max-h-64 flex flex-col">
                        <div className="p-2 border-b border-white/10 sticky top-0 bg-[#12100e]">
                          <input
                            type="text"
                            placeholder="Search countries…"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full bg-white/5 border-none px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#c9a96e] rounded-sm"
                            autoFocus
                          />
                        </div>
                        <ul className="overflow-y-auto custom-scrollbar">
                          {filteredCountries.length > 0 ? filteredCountries.map((c, i) => (
                            <li 
                              key={i}
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch("");
                              }}
                              className="px-4 py-2 text-sm text-white/80 hover:bg-[#c9a96e]/10 hover:text-[#c9a96e] cursor-pointer flex justify-between items-center transition-colors"
                            >
                              <span className="truncate pr-4">{c.flag} {c.name}</span>
                              <span className="text-white/40">{c.code}</span>
                            </li>
                          )) : (
                            <li className="px-4 py-3 text-sm text-white/40 text-center">No countries found</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="relative w-[65%] md:w-2/3">
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      required
                      autoComplete="tel"
                      placeholder="WhatsApp Number"
                      className="w-full px-4 h-[46px] bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] transition-colors duration-300 text-sm font-light placeholder-white/20 text-white"
                      style={{ borderColor: theme.border }}
                      onFocus={(e) => e.target.style.borderColor = theme.gold}
                      onBlur={(e) => e.target.style.borderColor = theme.border}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <textarea
                    value={specificInterests}
                    onChange={(e) => setSpecificInterests(e.target.value)}
                    placeholder="Any specific interests, dietary needs, or constraints?"
                    className="w-full px-4 py-3 bg-white/5 border focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] transition-colors duration-300 text-sm font-light placeholder-white/20 text-white min-h-[100px] resize-y custom-scrollbar"
                    style={{ borderColor: theme.border }}
                    onFocus={(e) => e.target.style.borderColor = theme.gold}
                    onBlur={(e) => e.target.style.borderColor = theme.border}
                  />
                </div>
                <button
                  disabled={isProcessing || name.trim().length === 0 || (`${selectedCountry.code}${whatsapp}`).replace(/\D/g, '').length < 7}
                  onClick={handleDepositClick}
                  className="w-full py-4 px-2 text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest font-bold border border-[#c9a96e] bg-[#c9a96e] text-black hover:bg-[#b0935d] hover:scale-[1.02] active:scale-[0.98] transition duration-300 flex justify-center items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(201,169,110,0.2)] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isProcessing ? (
                    <span className="text-center truncate">Submitting Inquiry…</span>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                      SUBMIT INQUIRY
                    </span>
                  )}
                </button>
                <div className="mt-4 text-[10px] text-white/40 uppercase tracking-widest text-center max-w-[260px] mx-auto leading-relaxed">
                  We will contact you via WhatsApp with the next steps
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
