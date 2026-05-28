"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Sun, Sunset, Moon, Diamond, ShieldCheck, Wallet, AlertTriangle, MessageCircle, FileDown } from "lucide-react";
import CinematicLoader from "./CinematicLoader";
import { useReactToPrint } from "react-to-print";

const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#12100e] flex items-center justify-center">
      <p className="text-white/40 uppercase tracking-widest text-xs animate-pulse">Loading Map Engine...</p>
    </div>
  )
});

interface ItineraryResponse {
  tripSummary: string;
  dailyItinerary: {
    day: number;
    location: string;
    morningActivity: string;
    afternoonActivity: string;
    eveningActivity: string;
    accommodationVibe: string;
  }[];
  hiddenGems: string[];
  antiScamTips: string[];
}

interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface DashboardClientProps {
  journeyId: string;
  destinations: Destination[];
}

export default function DashboardClient({ journeyId, destinations }: DashboardClientProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryResponse | null>(null);
  const [loadingText, setLoadingText] = useState("Consulting local specialists...");

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Beyond-Taj-Blueprint-${journeyId}`,
    pageStyle: `
      @page { margin: 0; size: A4; }
      html, body { 
        background-color: #0a0806 !important; 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
      }
    `,
  });

  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    darker: "#12100e",
    border: "#2a241e",
  };

  useEffect(() => {
    generateJourney(journeyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId]);

  const generateJourney = async (id: string) => {
    setIsGenerating(true);
    setGenerationError(null);

    const textInterval = setInterval(() => {
      setLoadingText(prev =>
        prev === "Consulting local specialists..."
          ? "Drafting your bespoke itinerary..."
          : prev === "Drafting your bespoke itinerary..."
            ? "Refining exclusive arrangements..."
            : "Consulting local specialists..."
      );
    }, 3000);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout to allow for server-side exponential backoff

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journeyId: id }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate itinerary");
      }

      setItineraryData(data);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setGenerationError("Our routing engine experienced a temporal anomaly. Please try generating your blueprint again.");
      } else {
        console.error("Generation error:", err);
        setGenerationError(err.message);
      }
    } finally {
      clearInterval(textInterval);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <CinematicLoader />;
  }

  if (generationError) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0806] text-[#f5f0e8] px-4">
        <div className="bg-[#0a0806] border border-red-900/30 p-8 rounded-sm text-center max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/[0.05] to-transparent pointer-events-none" />
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-4 opacity-80" />
          <p className="text-red-200/80 mb-6 leading-relaxed relative z-10">{generationError}</p>
          <div className="flex justify-center relative">
            <button onClick={() => generateJourney(journeyId)} className="relative z-10 px-8 py-3 border border-red-900/50 hover:bg-red-950/30 text-red-200 uppercase tracking-widest text-xs transition-colors rounded-sm cursor-pointer">
              Retry Generation
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!itineraryData) return null;

  return (
    <div className="min-h-screen w-full bg-[#0a0806] text-[#f5f0e8] font-sans">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 pb-20 pt-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16 print:hidden">
          <p className="uppercase tracking-widest text-xs" style={{ color: theme.gold }}>Your Finalised Journey</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight">
            A Curated Experience
          </h2>
          <p className="text-lg font-light text-white/60 leading-relaxed">
            {itineraryData.tripSummary}
          </p>

          <div className="pt-6 flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              onClick={() => handlePrint()}
              style={{ backgroundColor: theme.gold, color: theme.bg }}
              className="px-10 py-4 uppercase tracking-widest text-sm font-bold rounded-sm hover:bg-white transition-colors cursor-pointer shadow-lg inline-flex items-center justify-center gap-3 w-full md:w-auto"
            >
              <FileDown size={18} />
              Download Offline Dossier (PDF)
            </button>
            <a
              href={`https://wa.me/1234567890?text=Hi,%20I%20need%20help%20with%20my%20Beyond%20Taj%20blueprint.%20My%20Journey%20ID%20is:%20${journeyId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-4 uppercase tracking-widest text-sm font-bold rounded-sm bg-white/[0.05] border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors cursor-pointer text-white w-full md:w-auto"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Open WhatsApp Support
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10">
          {/* Left Column: Timeline & Tips */}
          <div
            ref={printRef}
            className="w-full lg:w-1/2 space-y-16 lg:h-[80vh] overflow-y-auto custom-scrollbar pr-4 pb-10 print:h-auto print:overflow-visible print:w-full print:p-8 print:text-[#f5f0e8] print:space-y-8 relative"
          >
            {/* Force page background in Chrome */}
            <div className="hidden print:block fixed inset-0 w-full h-full bg-[#0a0806] -z-10" />

            {/* Header only visible in print */}
            <div className="hidden print:block text-center mb-6 pb-6 border-b border-white/10 pt-4">
              <h1 className="font-serif text-4xl mb-4 text-white">Beyond Taj</h1>
              <p className="uppercase tracking-widest text-sm text-[#c9a96e] mb-6">Official Travel Blueprint</p>
              <p className="text-base font-light text-white/70 leading-relaxed max-w-2xl mx-auto">
                {itineraryData.tripSummary}
              </p>
            </div>

            {/* Timeline */}
            <div className="relative py-10 w-full">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

              <div className="space-y-16">
                {itineraryData.dailyItinerary.map((day, idx) => (
                  <div key={idx} className="relative flex flex-row items-start">
                    {/* Center Dot */}
                    <div className="absolute left-8 w-8 h-8 rounded-full border-4 flex items-center justify-center -translate-x-1/2 mt-1 z-10 shadow-[0_0_15px_rgba(201,169,110,0.2)] bg-[#12100e] border-[#c9a96e]">
                      <span className="text-xs font-bold text-[#c9a96e]">{day.day}</span>
                    </div>

                    {/* Content */}
                    <div className="pl-16 w-full">
                      <div className="p-6 md:p-8 rounded-sm border shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-[#0a0806] border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent print:break-inside-avoid">
                        <p className="text-xs uppercase tracking-widest mb-2 text-[#c9a96e]">Day {day.day}</p>
                        <h4 className="font-serif text-2xl md:text-3xl mb-4 text-white">{day.location}</h4>
                        <div className="border-l border-[#c9a96e]/30 pl-4 mb-8">
                          <p className="text-xs text-white/60 normal-case italic font-light leading-relaxed">{day.accommodationVibe}</p>
                        </div>

                        <div className="space-y-6 text-sm font-light text-white/70 text-left">
                          {[
                            { timeKey: "Morning", activity: day.morningActivity, Icon: Sun },
                            { timeKey: "Afternoon", activity: day.afternoonActivity, Icon: Sunset },
                            { timeKey: "Evening", activity: day.eveningActivity, Icon: Moon }
                          ].map(({ timeKey, activity, Icon }, idx) => {
                            if (!activity || ["none", "n/a"].includes(activity.toLowerCase())) return null;
                            const cleanTime = timeKey.replace(/[^a-zA-Z]/g, '').toUpperCase();

                            return (
                              <div key={idx} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <Icon size={12} className="text-white/40" />
                                  <strong className="text-white uppercase text-[10px] tracking-widest opacity-50">{cleanTime}</strong>
                                </div>
                                <p className="leading-relaxed pl-6">{activity}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gems and Tips */}
            <div className="flex flex-col gap-8 pt-10 border-t border-[#2a241e] print:break-inside-avoid">
              <div className="p-8 border rounded-sm bg-[#12100e] border-[#2a241e]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-full bg-black">
                    <Diamond size={24} className="text-[#c9a96e]" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">Hidden Gems</h3>
                </div>
                <ul className="space-y-5">
                  {itineraryData.hiddenGems.map((gem, idx) => (
                    <li key={idx} className="flex gap-4 text-sm font-light text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: theme.gold }} />
                      <span className="leading-relaxed">{gem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 border rounded-sm bg-[#12100e] border-[#2a241e] print:break-inside-avoid">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-full bg-black">
                    <ShieldCheck size={24} className="text-[#c9a96e]" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">Security & Protocol</h3>
                </div>
                <ul className="space-y-5">
                  {itineraryData.antiScamTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-4 text-sm font-light text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: theme.gold }} />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Map */}
          <div className="w-full lg:w-1/2 sticky top-24 h-[calc(100vh-8rem)] rounded-sm overflow-hidden border border-white/10 shadow-2xl print:hidden">
            <ItineraryMap destinations={destinations} />
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme.gold}; opacity: 0.5; }
      `}} />
    </div>
  );
}
