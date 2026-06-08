import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Beyond Taj",
};

export default async function AdminDashboard() {
  const journeys = await prisma.journey.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const paidCount = journeys.filter(j => j.status === 'paid' || j.status === 'completed').length;
  const pendingCount = journeys.filter(j => j.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#0a0806] text-white p-8 pt-32 md:pt-32 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-white/10 pb-6 gap-6 sm:gap-4">
          <div>
            <h1 className="font-serif text-3xl text-white drop-shadow-md">Admin Dashboard</h1>
            <p className="text-white/50 text-sm mt-2">Manage requested journeys and fulfillment.</p>
          </div>
          <div className="flex gap-8 sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs text-white/40 uppercase tracking-widest">Paid</p>
              <p className="font-serif text-2xl text-[#c9a96e]">{paidCount}</p>
            </div>
            <div className="text-left sm:text-right" title="Journeys that were generated but no inquiry was submitted (abandoned carts)">
              <p className="text-xs text-white/40 uppercase tracking-widest">Abandoned</p>
              <p className="font-serif text-2xl text-white/30">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto border border-white/10 rounded-sm bg-[#12100e]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Style & Days</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {journeys.filter(j => j.status !== 'pending').length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/30 italic">No submitted inquiries found.</td>
                </tr>
              ) : (
                journeys.filter(j => j.status !== 'pending').map((journey) => (
                  <tr key={journey.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white/90 font-medium">{journey.customerName}</p>
                      <p className="text-white/50 text-xs">{journey.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      {journey.customerWhatsapp ? (
                        <a href={`https://wa.me/${journey.customerWhatsapp}`} target="_blank" rel="noreferrer" className="text-[#c9a96e] hover:underline">
                          +{journey.customerWhatsapp}
                        </a>
                      ) : (
                        <span className="text-white/30">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(journey.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white/80">{journey.travelStyle}</p>
                      <p className="text-white/50 text-xs">{journey.days} Days</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs uppercase tracking-widest font-medium ${
                        journey.status === 'paid' || journey.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        {journey.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/dashboard/${journey.id}`} className="text-xs uppercase tracking-widest text-[#c9a96e] hover:text-[#d4b47a] transition-colors">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {journeys.filter(j => j.status !== 'pending').length === 0 ? (
            <div className="p-8 text-center text-white/30 italic border border-white/10 rounded-sm bg-[#12100e]">
              No submitted inquiries found.
            </div>
          ) : (
            journeys.filter(j => j.status !== 'pending').map((journey) => (
              <div key={journey.id} className="p-5 border border-white/10 rounded-sm bg-[#12100e] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/90 font-medium">{journey.customerName}</p>
                    <p className="text-white/50 text-xs">{journey.customerEmail}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-widest font-medium ${
                    journey.status === 'paid' || journey.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-white/5 text-white/50 border border-white/10'
                  }`}>
                    {journey.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-white/40 uppercase tracking-widest mb-1 text-[10px]">Date</p>
                    <p className="text-white/70">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(journey.createdAt))}</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-widest mb-1 text-[10px]">WhatsApp</p>
                    {journey.customerWhatsapp ? (
                      <a href={`https://wa.me/${journey.customerWhatsapp}`} target="_blank" rel="noreferrer" className="text-[#c9a96e] hover:underline">
                        +{journey.customerWhatsapp}
                      </a>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-white/40 uppercase tracking-widest mb-1 text-[10px]">Style & Days</p>
                    <p className="text-white/80">{journey.travelStyle} <span className="text-white/30 mx-1">•</span> {journey.days} Days</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link href={`/admin/dashboard/${journey.id}`} className="block text-xs uppercase tracking-widest text-[#c9a96e] hover:text-black hover:bg-[#c9a96e] transition-colors border border-[#c9a96e]/30 px-4 py-3 rounded-sm w-full text-center font-bold">
                    View Blueprint Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
