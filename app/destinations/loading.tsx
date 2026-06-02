export default function LoadingDestinations() {
  return (
    <div className="min-h-screen bg-[#0a0806] pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 text-center animate-pulse">
          <div className="w-32 h-3 bg-[#c9a96e]/50 mx-auto mb-6 rounded" />
          <div className="w-3/4 md:w-1/2 h-16 bg-white/10 mx-auto mb-6 rounded" />
          <div className="w-2/3 h-4 bg-white/10 mx-auto rounded" />
        </header>

        <div className="space-y-24">
          {[1, 2].map((section) => (
            <section key={section} className="animate-pulse">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-48 h-8 bg-white/10 rounded" />
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="aspect-[5/4] md:aspect-[4/5] rounded-lg bg-white/5 border border-white/5" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
