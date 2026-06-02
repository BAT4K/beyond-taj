import { ArrowLeft, MapPin, Sun, Sparkles, ChevronRight } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

export default function LoadingDestination() {
  return (
    <main className="min-h-screen bg-[#0a0806] text-white">
      <ScrollToTop />
      {/* Hero Section Skeleton */}
      <div className="relative min-h-[70vh] md:min-h-[85vh] w-full bg-white/5 animate-pulse flex flex-col justify-end">
        <div className="relative z-10 flex flex-col justify-end px-6 md:px-12 pt-32 pb-16 md:pb-24 max-w-6xl mx-auto w-full flex-1">
          <div className="w-32 h-4 bg-white/10 rounded mb-8" />
          
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={16} className="text-[#c9a96e]/50" />
            <div className="w-24 h-4 bg-[#c9a96e]/20 rounded" />
          </div>
          
          <div className="w-3/4 md:w-1/2 h-12 md:h-24 bg-white/10 rounded mb-6" />
          <div className="w-full md:w-2/3 h-5 md:h-6 bg-white/10 rounded mb-2" />
          <div className="w-2/3 md:w-1/2 h-5 md:h-6 bg-white/10 rounded" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Column: Details Skeleton */}
        <div className="lg:col-span-2 space-y-16 animate-pulse">
          <section>
            <div className="w-48 h-8 bg-[#c9a96e]/20 rounded mb-6" />
            <div className="space-y-4">
              <div className="w-full h-4 bg-white/10 rounded" />
              <div className="w-full h-4 bg-white/10 rounded" />
              <div className="w-5/6 h-4 bg-white/10 rounded" />
              <div className="w-4/6 h-4 bg-white/10 rounded" />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-8">
            <div>
              <div className="w-24 h-4 bg-white/10 rounded mb-4" />
              <div className="space-y-3">
                <div className="w-32 h-3 bg-white/5 rounded" />
                <div className="w-24 h-3 bg-white/5 rounded" />
                <div className="w-28 h-3 bg-white/5 rounded" />
              </div>
            </div>
            <div>
              <div className="w-24 h-4 bg-white/10 rounded mb-4" />
              <div className="space-y-3">
                <div className="w-20 h-3 bg-white/5 rounded" />
                <div className="w-24 h-3 bg-white/5 rounded" />
                <div className="w-32 h-3 bg-white/5 rounded" />
              </div>
            </div>
          </section>

          <section className="bg-white/[0.02] border border-white/5 p-8 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="text-[#c9a96e]/50" />
              <div className="w-48 h-6 bg-white/10 rounded" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-3 bg-white/5 rounded" />
              <div className="w-5/6 h-3 bg-white/5 rounded" />
            </div>
          </section>
        </div>

        {/* Right Column: CTA Skeleton */}
        <div className="lg:col-span-1 animate-pulse">
          <div className="sticky top-32 p-8 border border-white/10 bg-white/5 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-white/10 mb-6" />
            <div className="w-48 h-6 bg-white/10 rounded mb-4" />
            <div className="space-y-2 mb-8">
              <div className="w-full h-3 bg-white/5 rounded" />
              <div className="w-full h-3 bg-white/5 rounded" />
              <div className="w-3/4 h-3 bg-white/5 rounded" />
            </div>
            <div className="w-full h-12 bg-white/10 rounded-sm" />
          </div>
        </div>

      </div>
    </main>
  );
}
