const fs = require('fs');

let content = fs.readFileSync('components/TravelWizard.tsx', 'utf8');

// Add imports
if (!content.includes('useVirtualizer')) {
  content = content.replace(
    'import { motion, AnimatePresence } from "framer-motion";',
    'import { motion, AnimatePresence } from "framer-motion";\nimport { useVirtualizer } from "@tanstack/react-virtual";\nimport { X } from "lucide-react";'
  );
}

// Add state for Quick Look Drawer
if (!content.includes('const [quickLookId, setQuickLookId]')) {
  content = content.replace(
    'const [validationMessages, setValidationMessages] = useState<WarningMessage[]>([]);',
    'const [validationMessages, setValidationMessages] = useState<WarningMessage[]>([]);\n  const [quickLookId, setQuickLookId] = useState<string | null>(null);'
  );
}

// Replace the grid block
const gridStartStr = '<div \n                      id="destination-grid"';
const gridEndStr = '</div>\n                      )}\n                    </div>';

const startIdx = content.indexOf(gridStartStr);
const endIdx = content.indexOf(gridEndStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const before = content.substring(0, startIdx);
  const after = content.substring(endIdx + gridEndStr.length);

  const newGridContent = `
{/* Zero-State Lobby & Grid Container */}
<div className="flex-1 flex flex-col min-w-0 max-h-[70vh] overflow-y-auto custom-scrollbar" id="main-scroll-container">
  {(() => {
    const showZeroState = selectedDestinations.length === 0 && selectedLandscapes.length === 0 && !isAutoCurated;
    
    if (showZeroState) {
      const currentMonth = new Date().getMonth() + 1;
      const seasonal = destinations.filter(d => d.peakMonths?.includes(currentMonth)).slice(0, 7);
      const hubs = destinations.filter(d => d.isHub).slice(0, 7);
      const wild = destinations.filter(d => d.vibeTags?.includes("Nature" as any) || d.vibeTags?.includes("Wild" as any)).slice(0, 7);
      
      const renderRow = (title, items) => (
        <div className="mb-10">
          <h3 className="font-serif text-2xl text-white/90 mb-4 px-2">{title}</h3>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 custom-scrollbar px-2">
            {items.map(dest => (
              <div 
                key={dest.id}
                className="shrink-0 w-[280px] h-[320px] snap-start relative group rounded-md overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out"
                onClick={() => setQuickLookId(dest.id)}
              >
                <Image 
                  src={DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE} 
                  alt={dest.name} 
                  fill
                  sizes="280px"
                  className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end z-20">
                  <h4 className="font-serif text-xl drop-shadow-md">{dest.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-[#c9a96e]">{dest.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      return (
        <div className="animate-in fade-in duration-300 ease-in-out">
          {renderRow("Seasonal Highlights", seasonal)}
          {renderRow("Major Hubs", hubs)}
          {renderRow("Wilderness & Nature", wild)}
        </div>
      );
    }

    // Virtualized Grid
    const sortedDests = [...filteredDestinations].sort((a, b) => getTierAndReason(a).tier - getTierAndReason(b).tier);
    
    return (
      <div 
        id="destination-grid"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pr-4 animate-in fade-in duration-300 ease-in-out"
      >
        <button 
          onClick={toggleAutoCuration}
          disabled={loadingAction !== null}
          className={\`relative h-[260px] group rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 \${
            isAutoCurated 
              ? 'bg-gradient-to-br from-amber-900/60 to-zinc-900 border-[#c9a96e]' 
              : 'bg-gradient-to-br from-amber-950/40 to-zinc-900 border-zinc-800'
          }\`}
        >
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center z-20">
            <Sparkles className={\`mb-4 \${isAutoCurated ? 'text-[#c9a96e]' : 'text-white/50 group-hover:text-white/80'} transition-colors\`} size={32} />
            <h3 className={\`font-serif text-xl md:text-2xl mb-2 \${isAutoCurated ? 'text-white' : 'text-white/90'}\`}>Bespoke Curation</h3>
          </div>
        </button>

        {sortedDests.map((dest) => {
          const { tier, reasons, originalTier } = getTierAndReason(dest);
          const isSelected = selectedDestinations.includes(dest.id);
          const currentTotalMinDays = selectedDestinations.reduce((sum, id) => sum + (destinations.find(x => x.id === id)?.minRequiredDays || 2), 0);
          const notEnoughDays = !isSelected && (currentTotalMinDays + (dest.minRequiredDays || 2) > selectedDays);
          const isDisabled = (!isSelected && isAutoCurated) || notEnoughDays;
          
          return (
            <div
              key={dest.id}
              className={\`relative h-[260px] group rounded-sm overflow-hidden border transition-all duration-300 bg-zinc-800 \${
                isDisabled ? 'opacity-20 grayscale' : 'hover:-translate-y-1 hover:shadow-xl'
              }\`}
              style={{ borderColor: isSelected ? theme.gold : theme.border }}
            >
              <Image 
                src={DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE} 
                alt={dest.name} 
                fill
                className={\`object-cover transition-opacity duration-300 \${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}\`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              
              <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-30">
                {isSelected && <div className="bg-[#c9a96e] p-1 rounded-full"><Check size={12} className="text-black" /></div>}
              </div>

              <div className="absolute inset-0 p-4 flex flex-col justify-end z-20">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest mb-0.5 text-[#c9a96e]">{dest.region}</p>
                    <h3 className="font-serif text-xl">{dest.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setQuickLookId(dest.id)}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-white/20 rounded bg-black/40 hover:bg-white/10 transition-colors backdrop-blur-md"
                    >
                      Info
                    </button>
                    <button 
                      onClick={() => !isDisabled && toggleDestination(dest.id)}
                      className={\`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded transition-colors backdrop-blur-md \${isSelected ? 'bg-[#c9a96e] text-black' : 'border border-white/20 bg-black/40 hover:bg-white/10'}\`}
                    >
                      {isSelected ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {sortedDests.length === 0 && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 p-10 text-center border border-zinc-800 bg-zinc-900 rounded-sm">
            <p className="text-white/40 italic">No destinations match your filters.</p>
          </div>
        )}
      </div>
    );
  })()}
</div>

{/* Quick Look Side Drawer */}
{quickLookId && (() => {
  const dest = destinations.find(d => d.id === quickLookId);
  if (!dest) return null;
  const isSelected = selectedDestinations.includes(dest.id);
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-300" onClick={() => setQuickLookId(null)} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 pointer-events-auto shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] translate-x-0 flex flex-col">
        <div className="relative h-64 w-full shrink-0">
          <Image src={DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE} alt={dest.name} fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          <button onClick={() => setQuickLookId(null)} className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#c9a96e] mb-1">{dest.region}</p>
            <h2 className="font-serif text-4xl mb-2">{dest.name}</h2>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-white/50 mb-4">
              <span>{dest.minRequiredDays} Days Min</span>
              <span>•</span>
              <span>{dest.idealSeason}</span>
            </div>
            {/* Type assertion needed here because schema was updated */}
            <p className="text-white/80 leading-relaxed font-light text-sm italic">"{(dest as any).shortPitch || dest.description}"</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Highlights</h3>
            <ul className="space-y-2">
              {((dest as any).topHighlights || []).map((hl: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="text-[#c9a96e] mt-1">✦</span>
                  <span className="leading-relaxed">{hl}</span>
                </li>
              ))}
              {(!(dest as any).topHighlights || (dest as any).topHighlights.length === 0) && (
                <li className="text-sm text-zinc-500 italic">No highlights available yet.</li>
              )}
            </ul>
          </div>
          
          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={() => { toggleDestination(dest.id); setQuickLookId(null); }}
              className={\`w-full py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 \${isSelected ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50' : 'bg-[#c9a96e] text-black hover:bg-[#d4b47a]'}\`}
            >
              {isSelected ? 'Remove from Itinerary' : 'Add to Itinerary'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})()}
`;

  fs.writeFileSync('components/TravelWizard.tsx', before + newGridContent + after);
  console.log("Successfully refactored TravelWizard.tsx!");
} else {
  console.log("Could not find grid start/end strings in TravelWizard.tsx");
}
