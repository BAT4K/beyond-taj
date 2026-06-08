"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MapPin, Calendar, Compass, User, Globe, Activity } from "lucide-react";

const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#12100e] flex items-center justify-center">
      <p className="text-white/40 uppercase tracking-widest text-xs animate-pulse">Loading Map Engine...</p>
    </div>
  )
});

interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface JourneyData {
  days: number;
  travelStyle: string;
  startLocation: string;
  landscapes: string[];
  customerName: string;
  residency: string;
  specificInterests?: string | null;
}

interface DashboardClientProps {
  journeyId: string;
  destinations: Destination[];
  journey?: JourneyData;
}

export default function DashboardClient({ journeyId, destinations, journey }: DashboardClientProps) {
  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    darker: "#12100e",
    border: "#2a241e",
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0806] text-[#f5f0e8] font-sans">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 pb-20 pt-32">
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <p className="uppercase tracking-widest text-xs" style={{ color: theme.gold }}>Inquiry Received</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight">
            We have your request!
          </h2>
          <p className="text-lg font-light text-white/60 leading-relaxed">
            We will be contacting you soon via WhatsApp or email with your PayPal.me link to secure your blueprint.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-3 mt-4 bg-white/5 border border-white/10 rounded-sm">
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Blueprint ID</span>
            <span className="text-white font-mono text-sm tracking-widest">{journeyId.split('-')[0].toUpperCase()}</span>
          </div>


        </div>

        {journey && (
          <div className="max-w-5xl mx-auto mb-16">
            <h3 className="text-white/80 font-serif text-2xl mb-8 border-b border-white/10 pb-4">Your Blueprint Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-[#12100e] border border-white/5 p-6 rounded-sm hover:border-[#c9a96e]/30 transition-colors">
                <div className="flex items-center gap-3 text-[#c9a96e] mb-4">
                  <User size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-white/50">Traveler</span>
                </div>
                <p className="text-white/90 text-lg">{journey.customerName}</p>
                <p className="text-white/40 text-sm mt-1">{journey.residency}</p>
              </div>

              <div className="bg-[#12100e] border border-white/5 p-6 rounded-sm hover:border-[#c9a96e]/30 transition-colors">
                <div className="flex items-center gap-3 text-[#c9a96e] mb-4">
                  <Calendar size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-white/50">Duration</span>
                </div>
                <p className="text-white/90 text-lg">{journey.days} Days</p>
                <p className="text-white/40 text-sm mt-1">Starting in {journey.startLocation}</p>
              </div>

              <div className="bg-[#12100e] border border-white/5 p-6 rounded-sm hover:border-[#c9a96e]/30 transition-colors">
                <div className="flex items-center gap-3 text-[#c9a96e] mb-4">
                  <Compass size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold text-white/50">Pacing</span>
                </div>
                <p className="text-white/90 text-lg capitalize">{journey.travelStyle}</p>
                <p className="text-white/40 text-sm mt-1">Travel Style</p>
              </div>

              {journey.landscapes.length > 0 && (
                <div className="bg-[#12100e] border border-white/5 p-6 rounded-sm hover:border-[#c9a96e]/30 transition-colors md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-3 text-[#c9a96e] mb-4">
                    <MapPin size={18} />
                    <span className="text-xs uppercase tracking-widest font-bold text-white/50">Selected Landscapes</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {journey.landscapes.map(l => (
                      <span key={l} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-sm rounded-sm">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {journey.specificInterests && (
                <div className="bg-[#12100e] border border-white/5 p-6 rounded-sm hover:border-[#c9a96e]/30 transition-colors md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-3 text-[#c9a96e] mb-4">
                    <Activity size={18} />
                    <span className="text-xs uppercase tracking-widest font-bold text-white/50">Specific Interests & Constraints</span>
                  </div>
                  <p className="text-white/70 leading-relaxed italic border-l-2 border-[#c9a96e]/30 pl-4">{journey.specificInterests}</p>
                </div>
              )}

            </div>
          </div>
        )}

        {destinations.length > 0 && (
          <div className="w-full max-w-5xl mx-auto h-[60vh] border border-white/10 rounded-sm overflow-hidden relative shadow-2xl">
            <ItineraryMap destinations={destinations} />
          </div>
        )}
      </main>
    </div>
  );
}
