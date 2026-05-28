export default function ShowcaseVideo() {
  return (
    <section className="py-24 px-4 bg-[#0a0806]">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#c9a96e] mb-10 text-center tracking-wide drop-shadow-sm">
          India you'll be visiting!
        </h2>
        
        <div className="w-full relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className="w-full h-auto object-cover"
            src="/showcase-video.mp4"
          />
        </div>
      </div>
    </section>
  );
}
