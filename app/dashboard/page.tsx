import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Map, Calendar, ArrowRight, LogOut } from "lucide-react";

export const metadata = {
  title: "Your Blueprints | Beyond Taj",
};

export default async function UserPortal() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch journeys using userId matching the logged in user's ID
  const journeys = await prisma.journey.findMany({
    where: {
      // @ts-ignore
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    darker: "#12100e",
    border: "#2a241e",
  };

  return (
    <div className="min-h-screen w-full font-sans" style={{ backgroundColor: theme.bg, color: theme.cream }}>
      <main className="w-full max-w-7xl mx-auto px-4 md:px-10 pt-32 pb-16">
        <div className="mb-16">
          <p className="uppercase tracking-widest text-xs mb-3" style={{ color: theme.gold }}>The Intelligence Portal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight mb-4">
            Your Travel Blueprints
          </h1>
          <p className="text-lg font-light text-white/60 max-w-2xl">
            Access your secure, honest blueprints. These itineraries have been mathematically optimized and verified by local specialists.
          </p>
        </div>

        {journeys.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-sm" style={{ borderColor: theme.border, backgroundColor: theme.darker }}>
            <Map size={48} className="mx-auto mb-6 text-white/20" />
            <h2 className="font-serif text-2xl text-white mb-3">No Active Blueprints</h2>
            <p className="text-white/50 font-light mb-8 max-w-md mx-auto">
              You haven't generated any travel blueprints yet. Return to the concierge to begin crafting your journey.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-3 uppercase tracking-widest text-xs font-bold rounded-sm transition hover:bg-white"
              style={{ backgroundColor: theme.gold, color: theme.bg }}
            >
              Start New Journey <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeys.map((journey: any) => (
              <div
                key={journey.id}
                className="group relative flex flex-col justify-between p-8 rounded-sm border transition duration-500 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
                style={{ borderColor: theme.border, backgroundColor: theme.darker }}
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 mb-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="uppercase tracking-widest text-[10px] font-bold px-3 py-1 rounded-full border border-white/10" style={{ color: journey.status === 'completed' ? theme.gold : (journey.status === 'inquiry_submitted' ? '#3b82f6' : 'rgba(255,255,255,0.4)'), backgroundColor: journey.status === 'completed' ? `${theme.gold}10` : (journey.status === 'inquiry_submitted' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)') }}>
                      {journey.status === 'completed' ? 'Active Blueprint' : (journey.status === 'inquiry_submitted' ? 'Inquiry Submitted' : 'Pending Payment')}
                    </span>
                    <span className="text-xs font-light text-white/40 flex items-center gap-2">
                      <Calendar size={12} />
                      {new Date(journey.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-white mb-2 leading-tight group-hover:text-[#c9a96e] transition-colors">
                    {journey.days} Days in India
                  </h3>
                  <p className="text-sm font-light text-white/60 mb-6 capitalize">
                    {journey.travelStyle.replace(/-/g, ' ')} Explorer
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {journey.landscapes.slice(0, 3).map((l: string, i: number) => (
                      <span key={i} className="text-xs text-white/40 bg-black px-2 py-1 rounded-sm border border-white/5 capitalize">
                        {l}
                      </span>
                    ))}
                    {journey.landscapes.length > 3 && (
                      <span className="text-xs text-white/40 bg-black px-2 py-1 rounded-sm border border-white/5">
                        +{journey.landscapes.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/5 mt-auto">
                  <Link
                    href={journey.status === 'pending' ? `/checkout/${journey.id}` : `/dashboard/${journey.id}`}
                    className={`flex items-center justify-between w-full uppercase tracking-widest text-xs font-bold transition-colors hover:text-white`}
                    style={{ color: journey.status === 'pending' ? 'rgba(255,255,255,0.4)' : theme.gold }}
                  >
                    <span>{journey.status === 'pending' ? 'Complete Inquiry' : 'View Blueprint'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
