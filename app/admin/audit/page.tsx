import prisma from "@/lib/prisma";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuditDashboard() {
  noStore();
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: { Landscape: true }
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 px-8 pb-8 pt-28 font-mono">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Destination Data Audit</h1>
            <p className="text-zinc-500">Total Records: {destinations.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-900/50 shadow-2xl custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Coordinates</th>
                <th className="px-4 py-3 font-semibold">Min Days</th>
                <th className="px-4 py-3 font-semibold">Peak Months</th>
                <th className="px-4 py-3 font-semibold">Top Highlights</th>
                <th className="px-4 py-3 font-semibold">Short Pitch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {destinations.map((dest) => {
                const isLatInvalid = dest.latitude === null || dest.latitude === undefined || dest.latitude === 0;
                const isLngInvalid = dest.longitude === null || dest.longitude === undefined || dest.longitude === 0;
                const isCoordsInvalid = isLatInvalid || isLngInvalid;
                
                const isPitchInvalid = !dest.shortPitch || dest.shortPitch.length < 10;
                
                const highlights = Array.isArray(dest.topHighlights) ? dest.topHighlights : [];
                const isHighlightsInvalid = highlights.length < 3;
                
                const peakMonths = Array.isArray(dest.peakMonths) ? dest.peakMonths : [];
                const isPeakMonthsInvalid = peakMonths.length === 0;

                const isRegionInvalid = !dest.region || dest.region.trim() === "";

                return (
                  <tr key={dest.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{dest.id}</td>
                    <td className="px-4 py-3 font-medium text-white">{dest.name}</td>
                    <td className={`px-4 py-3 ${isRegionInvalid ? 'bg-red-900/50 text-red-400' : ''}`}>
                      {dest.region || "Missing"}
                    </td>
                    <td className={`px-4 py-3 ${isCoordsInvalid ? 'bg-red-900/50 text-red-400' : ''}`}>
                      {dest.latitude}, {dest.longitude}
                    </td>
                    <td className="px-4 py-3">{dest.minRequiredDays}</td>
                    <td className={`px-4 py-3 ${isPeakMonthsInvalid ? 'bg-red-900/50 text-red-400' : ''}`}>
                      {peakMonths.length > 0 ? peakMonths.join(", ") : "Empty"}
                    </td>
                    <td className={`px-4 py-3 ${isHighlightsInvalid ? 'bg-red-900/50 text-red-400' : ''}`}>
                      {highlights.length} items
                    </td>
                    <td className={`px-4 py-3 max-w-xs truncate ${isPitchInvalid ? 'bg-red-900/50 text-red-400' : ''}`}>
                      {dest.shortPitch || "Missing"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
