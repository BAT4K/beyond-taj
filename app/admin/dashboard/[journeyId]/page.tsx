import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Calendar, Compass, Phone, Mail, Clock, CreditCard } from "lucide-react";

export default async function AdminJourneyDetails({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;
  
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId }
  });

  if (!journey) {
    return (
      <div className="min-h-screen bg-[#0a0806] text-white p-8 pt-24 font-sans flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Journey Not Found</h1>
        <Link href="/admin/dashboard" className="text-[#c9a96e] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch destination names if possible
  const destinationIds = (journey.destinations || []) as string[];
  const destinations = await prisma.destination.findMany({
    where: { id: { in: destinationIds } },
    select: { id: true, name: true, region: true }
  });

  return (
    <div className="min-h-screen bg-[#0a0806] text-white p-4 pt-32 md:p-8 md:pt-32 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="font-serif text-3xl text-white">Journey Details</h1>
              <p className="text-white/50 text-sm mt-1 font-mono" title={journey.id}>
                ID: {journey.id.split('-')[0].toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-sm text-xs uppercase tracking-widest font-medium ${
                journey.status === 'paid' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-white/5 text-white/50 border border-white/10'
              }`}>
                {journey.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer Info */}
          <div className="bg-[#12100e] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <User size={14} /> Client Profile
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Name</p>
                <p className="text-white/90">{journey.customerName}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1"><Mail size={10}/> Email</p>
                <p className="text-white/80">{journey.customerEmail}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1"><Phone size={10}/> WhatsApp</p>
                <p className="text-white/80">{journey.customerWhatsapp ? `+${journey.customerWhatsapp}` : 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Residency</p>
                <p className="text-white/80">{journey.residency}</p>
              </div>
            </div>
          </div>

          {/* Trip Configuration */}
          <div className="bg-[#12100e] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Compass size={14} /> Trip Configuration
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1"><Calendar size={10}/> Duration</p>
                  <p className="text-white/90">{journey.days} Days</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">Travel Style</p>
                  <p className="text-white/90">{journey.travelStyle}</p>
                </div>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1"><MapPin size={10}/> Start Location</p>
                <p className="text-white/80">{journey.startLocation || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1"><Clock size={10}/> Created At</p>
                <p className="text-white/80">{new Date(journey.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Selected Landscapes */}
          <div className="bg-[#12100e] border border-white/10 p-6 rounded-sm md:col-span-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <MapPin size={14} /> Selected Landscapes
            </h2>
            {journey.landscapes && journey.landscapes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {journey.landscapes.map((landscape) => (
                  <span key={landscape} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-sm rounded-sm">
                    {landscape}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white/30 italic text-sm">No landscapes selected.</p>
            )}
          </div>

          {/* Selected Destinations */}
          <div className="bg-[#12100e] border border-white/10 p-6 rounded-sm md:col-span-2">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <MapPin size={14} /> Selected Destinations
            </h2>
            {destinations.length > 0 ? (
              <ul className="space-y-2">
                {destinations.map((dest) => (
                  <li key={dest.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/90">{dest.name}</span>
                    <span className="text-white/40 text-xs">{dest.region}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/30 italic text-sm">No specific destinations matched or selected.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
