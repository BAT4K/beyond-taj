"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { X } from "lucide-react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Info, Diamond, ShieldCheck, Loader2, Crown, Scale, Compass, Users, Mountain, Palmtree, Castle, Sun, Waves, Lock, Sunset, Moon, Wallet, Flower2, PawPrint, Leaf, Shell, Trees, Sparkles, Building2, Plane, Check, CloudRain, Plus, Minus, Search } from "lucide-react";
import Spinner from "./Spinner";
import FullscreenLoader from "./FullscreenLoader";
import Link from "next/link";
import Image from "next/image";
import { generateBespokeRoute } from "@/lib/curationEngine";
import { calculateMatchScore, Destination } from "@shared/travel-rules";

export type MappedDestination = Destination & {
  imageUrl: string | null;
  landscapes: string[];
  clusterId: string | null;
  compatibleClusters: string[];
  isHub: boolean;
};

import DestinationCard from "./DestinationCard";


export type WarningMessage = {
  category: 'weather' | 'logistics' | 'vibe';
  severity: 'critical' | 'warning' | 'info';
  message: string;
};




interface TravelWizardProps {
  destinations: MappedDestination[];
  transitRoutes?: { originId: string; destinationId: string; fatigueCost: number }[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800";
const DESTINATION_IMAGES: Record<string, string> = {};


const LANDSCAPE_IMAGES: Record<string, string> = {
  "Mountains": "/destinations/leh-ladakh.webp",
  "Coastal & Islands": "/destinations/andaman-islands.webp",
  "Royal Cities": "/destinations/jaipur.webp",
  "Desert": "/destinations/jaisalmer.webp",
  "Backwaters": "/destinations/alleppey.webp",
  "Spirituality & Ghats": "/destinations/varanasi.webp",
  "Wildlife & Safaris": "/destinations/ranthambore.webp",
  "Tea Plantations & Valleys": "/destinations/munnar.webp",
  "Vibrant Metropolises": "/destinations/mumbai.webp",
  "Northeast & Living Roots": "/destinations/shillong.webp",
};


import { useRouter } from "next/navigation";
import { validateItinerary as performValidation } from "@/lib/travelValidator";

// ... existing imports/types

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function isMonthInSeason(month: string, season: string) {
  if (!month || !season) return false;
  if (season.toLowerCase().includes("all year")) return true;
  const shortMonth = month.substring(0, 3);
  if (season.includes(shortMonth)) return true;
  
  const match = season.match(/([A-Z][a-z]{2})[^\w]+([A-Z][a-z]{2})/);
  if (match) {
    const start = MONTHS.indexOf(match[1]);
    const end = MONTHS.indexOf(match[2]);
    const target = MONTHS.indexOf(shortMonth);
    if (start !== -1 && end !== -1 && target !== -1) {
      if (start <= end) return target >= start && target <= end;
      return target >= start || target <= end; 
    }
  }
  return false;
}

const categoryMap: Record<string, string[]> = {
  "Spirituality & Ghats": ["Spiritual India"],
  "Wildlife & Safaris": ["Wildlife & Jungle"],
  "Tea Plantations & Valleys": ["Tea Plantations"],
  "Northeast & Living Roots": ["Hidden Villages"],
  "Vibrant Metropolises": ["Modern Cities"],
  "Coastal & Islands": ["Beaches", "Islands"]
};

// ── VirtualizedGrid: Netflix-tier virtualized destination grid ──
interface VirtualizedGridProps {
  sortedDests: Destination[];
  columns: number;
  rowCount: number;
  rowHeight: number;
  currentTotalMinDays: number;
  selectedDays: number;
  selectedDestinations: string[];
  isAutoCurated: boolean;
  destinations: Destination[];
  getTierAndReason: (dest: Destination) => { tier: number; reasons: string[]; originalTier: number };
  theme: { bg: string; gold: string; cream: string; darker: string; border: string };
  onCardClick: (id: string) => void;
  onToggle: (id: string) => void;
  gridScrollRef: React.RefObject<HTMLDivElement | null>;
}

// Removed VirtualizedGrid logic to eliminate mobile hydration glitches and improve native scrolling performance.

export default function TravelWizard({ destinations, transitRoutes = [] }: TravelWizardProps) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hydration check
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [residency, setResidency] = useState<'International' | 'India'>('International');
  const [startLocation, setStartLocation] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return destinations.filter(d => 
      d.name.toLowerCase().includes(query) || 
      (d.state && d.state.toLowerCase().includes(query)) ||
      (d.vibeTags && d.vibeTags.some(v => (v as string).toLowerCase().includes(query)))
    );
  }, [searchQuery, destinations]);
  const [selectedDays, setSelectedDays] = useState(14);
  const [travelMonths, setTravelMonths] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [companions, setCompanions] = useState("");
  const [selectedLandscapes, setSelectedLandscapes] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAutoCurated, setIsAutoCurated] = useState(false);
  const [curationRationale, setCurationRationale] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<WarningMessage[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessages, setValidationMessages] = useState<WarningMessage[]>([]);
  const [quickLookId, setQuickLookId] = useState<string | null>(null);

  // Generation States
  const [loadingAction, setLoadingAction] = useState<"curating" | "checkout" | null>(null);



  // Void auto-curation if core preferences change
  useEffect(() => {
    if (isAutoCurated) {
      setIsAutoCurated(false);
      setCurationRationale(null);
      setSelectedDestinations([]);
    }
  }, [travelMonths, selectedDays, travelStyle, selectedLandscapes]);


  // Debounced Mapbox Geocoding
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (locationQuery.trim().length < 3) {
        setLocationResults([]);
        return;
      }
      setIsSearchingLocation(true);
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        const countryParam = residency === 'India' ? '&country=in' : '';
        const typesParam = residency === 'India' ? 'place,region' : 'place,region,country';
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationQuery)}.json?access_token=${token}&types=${typesParam}${countryParam}`);
        const data = await res.json();
        if (data.features) {
          setLocationResults(data.features);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [locationQuery, residency]);

  useEffect(() => {
    // Step 2: Trigger Distance Validation
    if (step === 7) {
      // Only show loading state if we actually have enough to validate
      if (selectedDestinations.length >= 1 && !isAutoCurated) {
        setIsValidating(true);
      }
      
      const controller = new AbortController();
      const handler = setTimeout(() => {
        validateItinerary(controller.signal);
      }, 400); // 400ms debounce
      
      return () => {
        clearTimeout(handler);
        controller.abort();
      };
    }
  }, [selectedDays, selectedDestinations, travelStyle, step]);

  const validateItinerary = async (signal?: AbortSignal) => {
    if (selectedDestinations.length < 1 || isAutoCurated) {
      setWarnings([]);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    try {
      const selectedDestObjs = destinations.filter(d => selectedDestinations.includes(d.id));
      const clientWarnings: WarningMessage[] = [];

      const res = await fetch("/api/validate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          selectedDays,
          travelStyle,
          travelMonths,
          residency,
          startLocation,
          destinationIds: selectedDestObjs.map(d => d.id),
          selectedLandscapes,
          companions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWarnings([...clientWarnings, ...(data.warnings || [])]);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignored, because it was cancelled
        return;
      }
      console.error(error);
    } finally {
      if (!signal?.aborted) {
        setIsValidating(false);
      }
    }
  };

  const saveJourneyAndCheckout = async () => {
    setLoadingAction('checkout');
    try {
      const response = await fetch('/api/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          days: selectedDays,
          travelStyle,
          residency,
          startLocation,
          landscapes: selectedLandscapes,
          destinations: selectedDestinations,
          isAutoCurated,
          companions,
        }),
      });
      if (response.ok) {
        const journey = await response.json();
        router.push(`/checkout/${journey.id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save journey');
        setLoadingAction(null);
      }
    } catch (err) {
      console.error(err);
      setLoadingAction(null);
    }
  };

  const nextStep = async () => {
    if (step === 7) {
      if (selectedDestinations.length === 0 && !isAutoCurated) return;
      saveJourneyAndCheckout();
    } else {
      if (step === 1 && !startLocation.trim()) {
        return;
      }
      if (step === 3 && travelMonths.length === 0) {
        return;
      }
      setDirection(1);
      setStep((s) => Math.min(s + 1, 7));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step === 1) {
      router.push("/");
    } else {
      setDirection(-1);
      setStep((s) => Math.max(s - 1, 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLandscape = (landscape: string) => {
    setSelectedLandscapes((prev) =>
      prev.includes(landscape)
        ? prev.filter((l) => l !== landscape)
        : [...prev, landscape]
    );
  };

  const toggleAutoCuration = () => {
    if (!isAutoCurated) {
      setLoadingAction('curating');
      
      setTimeout(() => {
        setIsAutoCurated(true);
        // Map travelStyle to vibe tags for the engine
        const styleVibeMap: Record<string, string[]> = {
          'Luxury Explorer': ['Luxury', 'Regal', 'Exclusive', 'Iconic', 'Historic'],
          'Balanced': ['Authentic', 'Cultural', 'Scenic', 'Soulful', 'Vibrant'],
        };
        const selectedVibes = styleVibeMap[travelStyle] || styleVibeMap['Balanced'];
        
        const result = generateBespokeRoute(
          { travelMonths, selectedLandscapes, selectedVibes, days: selectedDays, companions: companions || undefined }, 
          destinations,
          transitRoutes
        );
        setSelectedDestinations(result.destinationIds);
        setCurationRationale(result.rationale);
        setWarnings([]);
        setValidationMessages([]);
        setLoadingAction(null);
      }, 4000);
    } else {
      setIsAutoCurated(false);
      setSelectedDestinations([]);
      setCurationRationale(null);
    }
  };

  const toggleDestination = useCallback((destId: string) => {
    if (isAutoCurated) setIsAutoCurated(false);
    const maxAllowed = Math.max(3, Math.floor(selectedDays / 1.5));

    setSelectedDestinations((prev) => {
      if (prev.includes(destId)) {
        setDestinationError(null);
        // Clear warnings immediately so name + warnings disappear in sync
        setWarnings([]);
        setIsValidating(false);
        setTimeout(() => document.getElementById('destination-grid')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return prev.filter((id) => id !== destId);
      } else {
        if (prev.length >= maxAllowed) {
          setDestinationError(`Maximum destinations reached for a ${selectedDays}-day journey.`);
          setTimeout(() => setDestinationError(null), 3000);
          return prev;
        }
        setDestinationError(null);
        // If this will be the 2nd+ dest, show spinner immediately (no flash of stale state)
        if (prev.length >= 1 && step === 7) {
          setWarnings([]);
          setIsValidating(true);
        }
        setTimeout(() => document.getElementById('destination-grid')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return [...prev, destId];
      }
    });
  }, [isAutoCurated, selectedDays, step]);

  // Stable callbacks for memoized DestinationCard
  const handleCardClick = useCallback((id: string) => {
    setQuickLookId(id);
  }, []);

  const handleToggleDestination = useCallback((id: string) => {
    toggleDestination(id);
  }, [toggleDestination]);

  // Ref for the virtualized grid scroll container
  const gridScrollRef = useRef<HTMLDivElement>(null);

  const theme = {
    bg: "#0a0806",
    gold: "#c9a96e",
    cream: "#f5f0e8",
    darker: "#12100e",
    border: "#2a241e",
  };

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  if (loadingAction) {
    const bespokePhrases = [
      "Analyzing preferences…",
      "Cross-referencing seasonal matrices…",
      "Calculating transit friction…",
      "Optimizing honest route…"
    ];
    const checkoutPhrases = [
      "Securing your itinerary…",
      "Reserving dates…",
      "Preparing checkout…"
    ];
    
    return (
      <FullscreenLoader 
        title={loadingAction === 'checkout' ? checkoutPhrases : bespokePhrases} 
        subtitle="PLEASE DO NOT CLOSE THIS WINDOW" 
      />
    );
  }

  const isDisabledGlobal = isAutoCurated;
  const monthMap: Record<string, number> = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12
  };

  const nbdIds = new Set<string>();
  const lastSelectedId = selectedDestinations.length > 0 ? selectedDestinations[selectedDestinations.length - 1] : null;
  const lastSelectedDest = lastSelectedId ? destinations.find(d => d.id === lastSelectedId) : null;

  if (lastSelectedId) {
    if (transitRoutes && transitRoutes.length > 0) {
      const routes = transitRoutes.filter(r => r.originId === lastSelectedId || r.destinationId === lastSelectedId);
      if (routes.length > 0) {
        // Collect valid connected destinations
        const connectedNodes = new Set<string>();
        routes.forEach(r => {
          const targetId = r.originId === lastSelectedId ? r.destinationId : r.originId;
          if (!selectedDestinations.includes(targetId)) {
            connectedNodes.add(targetId);
          }
        });

        // Score them using the dynamic multi-vector engine
        const userContext = {
          travelMonths,
          selectedLandscapes,
          days: selectedDays,
          selectedVibes: [] // Optional vibes array could be populated here if added to step 3 in future
        };

        const scoredCandidates = Array.from(connectedNodes).map(id => {
          const destObj = destinations.find(d => d.id === id);
          if (!destObj) return { id, score: 0, isDeadEnd: true };
          
          const { score, isDeadEnd } = calculateMatchScore(destObj, userContext, lastSelectedId, transitRoutes);
          return { id, score, isDeadEnd };
        });

        const candidates = scoredCandidates
          .filter(c => !c.isDeadEnd && c.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
          
        candidates.forEach(c => nbdIds.add(c.id));
      } else if (lastSelectedDest) {
        destinations.forEach(d => {
          if (!selectedDestinations.includes(d.id) && d.region === lastSelectedDest.region) {
            nbdIds.add(d.id);
          }
        });
      }
    } else if (lastSelectedDest) {
      destinations.forEach(d => {
        if (!selectedDestinations.includes(d.id) && d.region === lastSelectedDest.region) {
          nbdIds.add(d.id);
        }
      });
    }
  }

  const getTierAndReason = (dest: Destination) => {
    const userContext = {
      travelMonths,
      selectedLandscapes,
      days: selectedDays,
      selectedVibes: []
    };

    // To prevent a selected disconnected node from losing its disconnected status, 
    // we use the node selected *before* it if it's currently selected
    let lastSelectedId: string | undefined = selectedDestinations[selectedDestinations.length - 1];
    if (selectedDestinations.includes(dest.id)) {
       const index = selectedDestinations.indexOf(dest.id);
       if (index > 0) {
           lastSelectedId = selectedDestinations[index - 1];
       } else {
           lastSelectedId = undefined;
       }
    }
    
    // Use the AI Scoring Engine to determine true viability!
    const { weatherFactor, logisticsFactor } = calculateMatchScore(dest, userContext, lastSelectedId, transitRoutes || []);

    let calculatedTier = 2;
    let reasons: string[] = [];

    // Apply Companions Adjustments
    if (companions === "Solo Female Journey") {
      // Heavily penalize specific high-hassle hubs for solo females if they don't have dedicated safety tags
      if (['Delhi', 'Agra'].includes(dest.name)) {
        calculatedTier = 3;
      }
    } else if (companions === "Family Vacation") {
      // Family wants easy transit, penalize high fatigue
      if (logisticsFactor <= 0.2) {
        calculatedTier = 3;
      }
    } else if (companions === "Romantic Getaway") {
      // Boost romantic destinations
      if (dest.vibeTags?.includes('Luxury') || dest.vibeTags?.includes('Romantic') || ['Udaipur', 'Kumarakom', 'Kochi'].includes(dest.name)) {
        calculatedTier = 1;
      }
    }

    // 1. Evaluate Weather via AI Factor
    if (weatherFactor <= 0.1) {
      calculatedTier = 3;
    }

    // 2. Evaluate Logistics via AI Factor (if a node is selected)
    if (lastSelectedId && transitRoutes && transitRoutes.length > 0) {
      // If logistics penalty is massive (meaning 0 direct connections and high fatigue)
      if (logisticsFactor <= 0.0) {
         calculatedTier = 3;
      }
    } else if (selectedDestinations.length > 0) {
      // Fallback if no transit routes are loaded
      const activeRegions = new Set(selectedDestinations.map(id => destinations.find(d => d.id === id)?.region).filter(Boolean));
      if (!activeRegions.has(dest.region) && !nbdIds.has(dest.id)) {
        calculatedTier = 3;
      }
    }
    
    // 4. AI Suggestions
    if (calculatedTier !== 3 && nbdIds.has(dest.id) && !isDisabledGlobal) {
      return { tier: 1, reasons: ["Suggested"], originalTier: 1 };
    }
    
    if (selectedDestinations.includes(dest.id)) {
      return { tier: 0, reasons, originalTier: calculatedTier };
    }

    return { tier: calculatedTier, reasons, originalTier: calculatedTier };
  };

  const filteredDestinations = destinations
    .filter((d) => {
      if (selectedDestinations.includes(d.id)) return true;
      if (selectedLandscapes.length === 0) return true;
      const matchedCategories = selectedLandscapes.flatMap(label => categoryMap[label] || [label]);
      return matchedCategories.some(cat => d.landscapes?.includes(cat as any));
    })
    .sort((a, b) => {
      const tierA = getTierAndReason(a).tier;
      const tierB = getTierAndReason(b).tier;
      if (tierA !== tierB) return tierA - tierB;
      return a.region.localeCompare(b.region);
    });

  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans"
      style={{ backgroundColor: theme.bg, color: theme.cream, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className="w-full h-1 bg-black fixed top-0 z-50">
        <motion.div
          className="h-full"
          style={{ backgroundColor: theme.gold, boxShadow: `0 0 15px ${theme.gold}` }}
          initial={{ width: 0 }}
          animate={{ width: `${(step / 6) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <header className="pt-20 md:pt-32 px-6 md:px-10 pb-2 md:pb-6 flex justify-start relative z-20 w-full">
        <button
          onClick={prevStep}
          className={`group inline-flex items-center gap-2 uppercase tracking-widest text-[10px] md:text-xs transition cursor-pointer print:hidden opacity-70 hover:opacity-100 active:scale-95 active:opacity-50 touch-manipulation w-fit py-2 pr-4`}
          style={{ color: theme.gold }}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 md:px-10 py-10 relative z-30 justify-start mt-0 md:pt-4">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`framer-motion-print-fix w-full mx-auto px-4 lg:px-12 ${step === 7 ? 'max-w-[1600px]' : 'max-w-4xl min-h-[60vh] flex flex-col justify-center'}`}
          >
            {step === 1 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">
                  Where are you traveling from?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {[
                    { id: 'International', title: "International", subtext: "", icon: Compass },
                    { id: 'India', title: "Resident of India", subtext: "", icon: Users },
                  ].map((option, index) => (
                    <button
                      type="button"
                      aria-pressed={residency === option.id}
                      key={option.id}
                      onClick={() => setResidency(option.id as any)}
                      style={{
                        borderColor: residency === option.id ? theme.gold : theme.border,
                        backgroundColor: residency === option.id ? theme.gold + '0D' : theme.darker
                      }}
                      className="p-6 md:p-8 text-center border rounded-sm transition duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col items-center active:scale-[0.98] active:opacity-80 touch-manipulation"
                    >
                      <option.icon className={`w-8 h-8 mb-4 ${residency === option.id ? 'text-[#c9a96e]' : 'text-white/40'}`} strokeWidth={1.5} />
                      <h3 className="font-serif text-xl md:text-2xl mb-2 text-white/90">{option.title}</h3>
                      {option.subtext && (
                        <p className="text-sm tracking-widest text-[#c9a96e] font-light uppercase">{option.subtext}</p>
                      )}
                      
                      {residency === option.id && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-[#c9a96e] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#c9a96e]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-12 max-w-2xl mx-auto text-left relative">
                  <label htmlFor="startLocation" className="block text-sm uppercase tracking-widest text-[#c9a96e] mb-4">
                    Where will you start your journey from?
                  </label>
                  <input
                    id="startLocation"
                    type="text"
                    value={locationQuery || startLocation}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      if (startLocation) setStartLocation('');
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    placeholder={residency === 'India' ? "e.g., Chandigarh, India" : "e.g., Paris, France or London, UK"}
                    className="w-full bg-[#12100e] border border-[#2a241e] focus:border-[#c9a96e] rounded-sm px-6 py-4 text-lg text-white placeholder-white/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0806] transition-colors shadow-inner"
                  />
                  {showLocationDropdown && locationQuery.length >= 3 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1714] border border-[#2a241e] rounded-sm shadow-2xl z-50 overflow-hidden">
                      {isSearchingLocation ? (
                        <div className="p-4 text-white/50 text-sm flex items-center gap-3">
                          <Spinner size="sm" showLogo={false} /> Searching…
                        </div>
                      ) : locationResults.length > 0 ? (
                        <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                          {locationResults.map((result: MappedDestination) => (
                            <li 
                              key={result.id}
                              onClick={() => {
                                setStartLocation(result.place_name);
                                setLocationQuery(result.place_name);
                                setShowLocationDropdown(false);
                              }}
                              className="px-4 py-3 hover:bg-white/5 cursor-pointer text-sm text-white/80 border-b border-white/5 last:border-0 transition-colors"
                            >
                              {result.place_name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-white/50 text-sm">No locations found.</div>
                      )}
                    </div>
                  )}
                  {startLocation && !showLocationDropdown && (
                    <p className="absolute -bottom-6 left-0 text-[9px] uppercase tracking-widest text-[#c9a96e]/80 flex items-center gap-1.5 font-semibold">
                      <Compass size={11} className="opacity-70" /> Origin Selected
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-16">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md">
                  How many days do you have?
                </h2>
                <div className="relative py-10 max-w-xl mx-auto flex flex-col items-center">
                  <div className="flex items-center gap-8 mb-6">
                    <button 
                      onClick={() => setSelectedDays(prev => Math.max(1, prev - 1))}
                      className="w-14 h-14 rounded-full border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e] hover:bg-[#c9a96e]/10 active:scale-95 touch-manipulation transition duration-200"
                    >
                      <Minus size={24} />
                    </button>
                    
                    <div className="text-center w-32 flex flex-col items-center">
                      <input 
                        type="number"
                        value={selectedDays}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setSelectedDays(Math.min(90, Math.max(1, val)));
                          }
                        }}
                        className="w-full bg-transparent text-center text-7xl font-serif text-[#c9a96e] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0a0806] appearance-none m-0 p-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
                        style={{ textShadow: "0px 0px 30px rgba(201,169,110,0.4)", MozAppearance: "textfield" }}
                      />
                      <span className="text-xl text-white/50 mt-2 font-serif">Days</span>
                    </div>

                    <button 
                      onClick={() => setSelectedDays(prev => Math.min(90, prev + 1))}
                      className="w-14 h-14 rounded-full border border-[#c9a96e]/30 flex items-center justify-center text-[#c9a96e] hover:bg-[#c9a96e]/10 active:scale-95 touch-manipulation transition duration-200"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                  
                  <motion.p
                    key={`narrative-${selectedDays}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/60 text-sm italic tracking-wide"
                  >
                    {selectedDays < 7 ? "A brief escape…" : selectedDays <= 14 ? "A standard tour…" : selectedDays <= 21 ? "A grand immersion…" : selectedDays <= 45 ? "A long expedition…" : "A monumental journey…"}
                  </motion.p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-2">When are you planning to travel?</h2>
                <p className="text-white/50 text-sm tracking-wide font-light">Select all the months your journey will span across.</p>
                <p className="text-[#a0a0a0] text-[13px] md:text-[14px] italic tracking-wide mb-10 mx-auto max-w-xl leading-relaxed mt-4">
                  Don't worry about getting this perfect. These answers give us a direction — we'll fine-tune every detail with you directly before we begin.
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-4 max-w-3xl mx-auto">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => {
                    const isSelected = travelMonths.includes(month);
                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        key={month}
                        onClick={() => {
                          setTravelMonths(prev => 
                            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
                          );
                        }}
                        style={{
                          borderColor: isSelected ? theme.gold : theme.border,
                          backgroundColor: isSelected ? theme.gold + '1A' : theme.darker,
                          color: isSelected ? theme.gold : theme.cream
                        }}
                        className="p-3 md:p-4 border rounded-sm font-sans tracking-wide transition hover:border-white/20 uppercase text-[10px] sm:text-xs md:text-sm cursor-pointer active:scale-[0.98] active:opacity-80 touch-manipulation"
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">
                  Who are you traveling with?
                </h2>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
                  {[
                    { name: "Solo Expedition", icon: Compass, desc: "Unbound freedom, spontaneous exploration, and complete independence." },
                    { name: "Solo Female Journey", icon: ShieldCheck, desc: "Prioritizes verified safety, curated experiences, and vetted accommodations." },
                    { name: "Romantic Getaway", icon: Diamond, desc: "Intimate heritage stays, secluded landscapes, and slower pacing." },
                    { name: "Family Vacation", icon: Castle, desc: "Easy transit, spacious resorts, and engaging activities for all ages." },
                    { name: "Traveling with Friends", icon: Palmtree, desc: "Vibrant culture, nightlife, adventure, and shared memories." }
                  ].map(({ name, icon: Icon, desc }) => (
                    <button
                      type="button"
                      aria-pressed={companions === name}
                      key={name}
                      onClick={() => setCompanions(name)}
                      style={{
                        borderColor: companions === name ? theme.gold : theme.border,
                        backgroundColor: companions === name ? theme.gold + '0D' : theme.darker,
                        boxShadow: companions === name ? '0 0 30px rgba(201,169,110,0.15)' : 'none'
                      }}
                      className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] p-4 md:p-5 text-left border rounded-sm transition duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col active:scale-[0.98] active:opacity-80 touch-manipulation"
                    >
                      {companions === name && (
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.gold }} />
                      )}
                      <div className="flex justify-between items-start w-full mb-3 md:mb-4">
                        <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: companions === name ? theme.gold : 'rgba(255,255,255,0.4)' }} strokeWidth={1.5} />
                        <div className="w-4 h-4 md:w-4 md:h-4 rounded-full border flex items-center justify-center transition duration-300" style={{ borderColor: companions === name ? theme.gold : 'rgba(255,255,255,0.2)' }}>
                          {companions === name && <div className="w-2 h-2 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: theme.gold }} />}
                        </div>
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-light tracking-wide mb-1.5 md:mb-2" style={{ color: companions === name ? theme.gold : 'rgba(255,255,255,0.9)' }}>
                        {name}
                      </h3>
                      <p className="font-sans text-[10px] sm:text-[11px] md:text-xs leading-relaxed" style={{ color: companions === name ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}>
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">Define your aesthetic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { name: "Luxury Explorer", icon: Crown, desc: "Five-star heritage properties, private transfers, exclusive access." },
                    { name: "Balanced", icon: Scale, desc: "Boutique stays, comfortable pace, authentic immersive experiences." },
                  ].map(({ name, icon: Icon, desc }, index) => (
                    <button
                      type="button"
                      aria-pressed={travelStyle === name}
                      key={name}
                      onClick={() => setTravelStyle(name)}
                      style={{
                        borderColor: travelStyle === name ? theme.gold : theme.border,
                        backgroundColor: travelStyle === name ? theme.gold + '0D' : theme.darker
                      }}
                      className="p-6 md:p-8 text-left border rounded-sm transition duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col active:scale-[0.98] active:opacity-80 touch-manipulation"
                    >
                      {travelStyle === name && (
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.gold }} />
                      )}
                      <div className="flex justify-between items-start w-full mb-6 md:mb-8">
                        <div
                          className="p-3 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor: travelStyle === name ? theme.gold + '20' : 'rgba(255,255,255,0.03)',
                            color: travelStyle === name ? theme.gold : 'rgba(255,255,255,0.3)'
                          }}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition duration-300 ${travelStyle === name ? 'border-transparent' : 'border-white/20'}`}
                          style={{ backgroundColor: travelStyle === name ? theme.gold : 'transparent' }}
                        >
                          {travelStyle === name && <div className="w-1.5 h-1.5 rounded-full bg-[#0a0806]" />}
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl mb-2">{name}</h3>
                      <p className="text-sm text-white/40 font-light leading-relaxed">
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="text-center">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-4">What moves you?</h2>
                <p className="text-white/50 text-sm tracking-wide font-light">Select the landscapes that resonate with your soul.</p>
                <p className="text-[#a0a0a0] text-[13px] md:text-[14px] italic tracking-wide mb-12 mx-auto max-w-xl leading-relaxed mt-4">
                  Don't worry about getting this perfect. These answers give us a direction — we'll fine-tune every detail with you directly before we begin.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
                  {[
                    { name: "Mountains", icon: Mountain },
                    { name: "Coastal & Islands", icon: Palmtree },
                    { name: "Royal Cities", icon: Castle },
                    { name: "Desert", icon: Sun },
                    { name: "Backwaters", icon: Waves },
                    { name: "Spirituality & Ghats", icon: Flower2 },
                    { name: "Wildlife & Safaris", icon: PawPrint },
                    { name: "Tea Plantations & Valleys", icon: Leaf },
                    { name: "Vibrant Metropolises", icon: Building2 },
                    { name: "Northeast & Living Roots", icon: Trees },
                  ].map(({ name: landscape, icon: Icon }, index) => {
                    const isSelected = selectedLandscapes.includes(landscape);
                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        key={landscape}
                        onClick={() => toggleLandscape(landscape)}
                        style={{
                          borderColor: isSelected ? theme.gold : theme.border,
                          backgroundColor: isSelected ? theme.gold + '0D' : theme.darker
                        }}
                        className="group relative p-6 md:p-8 flex flex-col items-center justify-center border rounded-sm transition duration-300 cursor-pointer hover:border-white/20 hover:-translate-y-1 w-full overflow-hidden active:scale-[0.98] active:opacity-80 touch-manipulation"
                      >
                        <Image
                          src={LANDSCAPE_IMAGES[landscape] || FALLBACK_IMAGE}
                          alt={landscape}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                          className={`object-cover transition duration-700 ease-out z-0 ${isSelected ? 'opacity-70 scale-105 saturate-100' : 'opacity-40 saturate-0 group-hover:opacity-60 group-hover:saturate-50 scale-100 group-hover:scale-105'}`}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent z-[1] opacity-100 pointer-events-none" />

                        <div
                          className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition duration-300 z-20 ${isSelected ? 'border-transparent' : 'border-white/20'}`}
                          style={{ backgroundColor: isSelected ? theme.gold : 'transparent' }}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-[#0a0806] rounded-full" />}
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-xl">
                          <Icon
                            className={`w-6 h-6 mb-4 transition-colors duration-300 drop-shadow-md ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                            strokeWidth={1.5}
                            style={{ color: isSelected ? theme.gold : 'white' }}
                          />
                          <span className="font-sans uppercase tracking-widest text-[10px] md:text-xs text-center drop-shadow-md font-medium">{landscape}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 7 && (() => {
              const maxAllowedDestinations = Math.max(3, Math.floor(selectedDays / 1.5));
              const isMaxReached = selectedDestinations.length >= maxAllowedDestinations;
              const showZeroState = selectedDestinations.length === 0 && !isAutoCurated && selectedLandscapes.length === 0;

              return (
                <div className="space-y-8 -mt-6">
                  <div className="text-center relative">
                    <h2 className="font-serif text-4xl md:text-5xl font-light mb-2">Curate your canvas.</h2>
                    <p className="text-white/50 tracking-wide font-light">Select your preferred destinations. Our engine will handle the routing.</p>
                    
                    <div className="relative max-w-xl mx-auto mt-6 mb-2">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-white/40" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search destinations (e.g. Rishikesh)…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm md:text-base text-white placeholder-white/40 focus:outline-none focus:border-[#c9a96e]/50 focus:bg-white/10 transition-colors"
                      />
                    </div>
                    <AnimatePresence>
                      {destinationError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-400 bg-red-950/40 px-4 py-1.5 rounded-full border border-red-900/50 z-50"
                        >
                          {destinationError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-8">
                    
{/* Zero-State Lobby & Grid Container */}
<div ref={gridScrollRef} className="flex-1 flex flex-col min-w-0 max-h-[70vh] overflow-y-auto custom-scrollbar" id="main-scroll-container">
  <AnimatePresence mode="wait">
    {(() => {
      
      if (searchQuery.trim()) {
        return (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 pr-4 pb-12"
          >
            <h3 className="text-white/70 font-serif text-2xl mb-2">Search Results for "{searchQuery}"</h3>
            {searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 rounded-xl bg-white/[0.02]">
                <Search className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/60 text-lg font-light mb-2">We couldn't find "{searchQuery}" in our database.</p>
                <p className="text-white/40 text-sm max-w-sm">BeyondTaj curates specific, vetted routes in India. Try searching for major cities, regions, or vibes like "Spiritual".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map(dest => {
                  const isSelected = selectedDestinations.includes(dest.id);
                  return (
                    <div key={dest.id} className={`flex items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${isSelected ? 'bg-[#c9a96e]/5 border-[#c9a96e]/30' : 'bg-white/5 border-white/10 hover:border-[#c9a96e]/30'}`}>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-serif text-lg md:text-xl text-white leading-tight break-words">{dest.name}</span>
                        <span className="text-white/50 text-[10px] md:text-xs font-sans uppercase tracking-widest mt-1 truncate">{dest.state}</span>
                      </div>
                      <button
                        onClick={() => toggleDestination(dest.id)}
                        className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors border ${
                          isSelected 
                            ? 'bg-[#c9a96e]/20 border-[#c9a96e]/50 text-[#c9a96e]' 
                            : 'border-white/20 text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {isSelected ? "Added" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      }

      if (showZeroState) {
        const currentMonthIndices = travelMonths.length > 0 ? travelMonths.map(m => monthMap[m]) : [new Date().getMonth() + 1];
        const monthMatch = filteredDestinations.filter(d => currentMonthIndices.some(idx => d.peakMonths?.includes(idx)));
        
        const iconicMatch = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Iconic", "Historic", "Regal", "Cultural"].includes(v as string)));
        const slowTravelMatch = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Soulful", "Restorative", "Peaceful", "Spiritual"].includes(v as string)));

        const offPath = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Remote", "Untouched", "Hidden", "Pure", "Quiet", "Raw"].includes(v as string)));
        
        let companionMatch: MappedDestination[] = [];
        let companionTitle = "";
        
        if (companions === "Romantic Getaway") {
           companionTitle = "The Romantic Collection";
           companionMatch = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Romantic", "Luxury", "Dreamy", "Restorative"].includes(v as string)) || ['Udaipur', 'Kumarakom', 'Kochi'].includes(d.name));
        } else if (companions === "Family Vacation") {
           companionTitle = "The Family Edit";
           companionMatch = filteredDestinations.filter(d => d.isHub || d.vibeTags?.some(v => ["Iconic", "Relaxed", "Scenic"].includes(v as string)));
        } else if (companions === "Solo Female Journey") {
           companionTitle = "The Solo Female Edit";
           companionMatch = filteredDestinations.filter(d => !['Delhi', 'Agra'].includes(d.name) && d.vibeTags?.some(v => ["Spiritual", "Peaceful", "Soulful", "Authentic"].includes(v as string)));
        } else if (companions === "Solo Expedition") {
           companionTitle = "The Intrepid Collection";
           companionMatch = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Remote", "Exhilarating", "Wild", "Raw", "Untouched"].includes(v as string)));
        } else if (companions === "Traveling with Friends") {
           companionTitle = "The Group Adventure";
           companionMatch = filteredDestinations.filter(d => d.vibeTags?.some(v => ["Vibrant", "Fast-paced", "Bohemian", "Cosmopolitan", "Bustling"].includes(v as string)));
        }
        
        const seasonalRow = monthMatch;
        const iconicRow = iconicMatch;
        const slowTravelRow = slowTravelMatch;
        const offPathRow = offPath;
        const companionRow = companionMatch;
        
        const landscapeRows = selectedLandscapes.map(landscape => {
           const catList = categoryMap[landscape] || [landscape];
           const match = filteredDestinations.filter(d => catList.some(cat => d.landscapes?.includes(cat as any)));
           return { title: landscape, items: match };
        });

        const renderRow = (title: string, items: MappedDestination[]) => {
          if (items.length === 0) return null;
          return (
            <motion.div variants={itemVariants} className="mb-12" key={title}>
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-serif text-2xl md:text-3xl text-white/90">{title}</h3>
                <div className="h-px bg-white/10 flex-1 ml-6"></div>
              </div>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 custom-scrollbar px-2 -mx-2">
                {items.map((dest: MappedDestination, index: number) => {
                  const { reasons } = getTierAndReason(dest);
                  const isSelected = selectedDestinations.includes(dest.id);
                  const currentTotalMinDays = selectedDestinations.reduce((sum, id) => sum + (destinations.find(x => x.id === id)?.minRequiredDays || 2), 0);
                  const notEnoughDays = !isSelected && (currentTotalMinDays + (dest.minRequiredDays || 2) > selectedDays);
                  const isDisabled = notEnoughDays;

                  return (
                    <div key={dest.id} className="shrink-0 w-[200px] md:w-[280px] snap-start">
                      <DestinationCard
                        id={dest.id}
                        name={dest.name}
                        region={dest.region}
                        imageSrc={dest.imageUrl || FALLBACK_IMAGE}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        reasons={reasons}
                        borderColor={isSelected ? theme.gold : theme.border}
                        isPriority={index < 3} // Prioritize first few items in the row
                        index={index}
                        onCardClick={handleCardClick}
                        onToggle={handleToggleDestination}
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        };

        return (
          <motion.div 
            key="zero-state"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="w-full pb-10"
          >
            {/* BESPOKE CURATION BANNER */}
            <motion.div variants={itemVariants} className="mb-14 px-2">
              <button 
                type="button"
                aria-pressed={isAutoCurated}
                onClick={toggleAutoCuration}
                disabled={loadingAction !== null}
                className="w-full relative overflow-hidden rounded-xl border border-[#c9a96e]/30 bg-gradient-to-r from-amber-950/20 to-zinc-950 hover:border-[#c9a96e]/60 transition duration-500 hover:shadow-2xl group flex flex-col md:flex-row items-center justify-between p-6 md:p-10 cursor-pointer disabled:opacity-50 active:scale-[0.98] touch-manipulation"
              >
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-0 z-20 flex-1 md:pr-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c9a96e]/20 transition duration-500">
                    <Sparkles className="text-[#c9a96e] w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-xl md:text-3xl text-white/90 mb-2 group-hover:text-white transition-colors">Don&apos;t Know Where to Start?</h3>
                    <p className="text-white/50 text-sm md:text-base font-light italic leading-relaxed">Most first-timers spend 20 hours Googling and still aren&apos;t sure where to go. Let our experts choose the right destinations for you.</p>
                  </div>
                </div>
                
                <div className="z-20 w-full md:w-auto shrink-0">
                  <div className="px-8 py-4 w-full md:w-auto text-center border border-[#c9a96e] text-[#c9a96e] group-hover:bg-[#c9a96e] group-hover:text-black text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center justify-center gap-3 whitespace-nowrap">
                    Curate My Journey <ChevronRight size={16} />
                  </div>
                </div>
                
                {/* Subtle background glow */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#c9a96e]/5 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </button>
            </motion.div>

            {landscapeRows.length > 0 ? (
              <>
                {renderRow(travelMonths.length > 0 ? `Peak in ${travelMonths.length === 1 ? travelMonths[0] : travelMonths.length + " Months"}` : "In Season Right Now", seasonalRow)}
              
              {/* COMPANION MATCH */}
              {renderRow(companionTitle, companionRow)}

              {/* NEW MICRO COLLECTIONS */}
              {renderRow("The Iconic Edit", iconicRow)}
              {renderRow("The Slow Travel Edit", slowTravelRow)}

              {/* LANDSCAPES */}
              {landscapeRows.map(row => renderRow(row.title, row.items))}
              </>
            ) : (
              <>
                {renderRow(companionTitle, companionRow)}
                {renderRow("The Iconic Edit", iconicRow)}
                {renderRow("The Slow Travel Edit", slowTravelRow)}
                {renderRow("Off the Beaten Path", offPathRow)}
                {seasonalRow.length > 0 && renderRow("Seasonal Alternatives", seasonalRow)}
              </>
            )}
          </motion.div>
        );
      }

      // Virtualized Grid
      const sortedDests = [...filteredDestinations].sort((a, b) => getTierAndReason(a).tier - getTierAndReason(b).tier);
      
      // Compute columns based on a breakpoint heuristic (SSR-safe)
      const isMobile = windowWidth < 768;
      const CARD_HEIGHT = isMobile ? 220 : 360; 
      const GAP = 20; // gap-5 = 1.25rem = 20px
      const ROW_HEIGHT = CARD_HEIGHT + GAP;
      
      // We'll compute columns dynamically matching Tailwind's viewport breakpoints
      const getColumns = () => {
        if (windowWidth >= 1280) return 3; // xl
        if (windowWidth >= 768) return 2;  // md
        return 2; // Force 2 columns on mobile
      };
      
      const columns = getColumns();
      const rowCount = Math.ceil(sortedDests.length / columns);
      const currentTotalMinDays = selectedDestinations.reduce((sum, id) => sum + (destinations.find(x => x.id === id)?.minRequiredDays || 2), 0);
      
      return (
        <motion.div 
          key="main-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="flex flex-col gap-8 pr-4 pb-12"
        >
          {/* Top Banner for Bespoke AI */}
          <button 
            onClick={toggleAutoCuration}
            disabled={loadingAction !== null}
            className={`w-full relative overflow-hidden rounded-xl border transition duration-500 hover:shadow-2xl group flex flex-col md:flex-row items-center justify-between p-6 md:p-10 cursor-pointer disabled:opacity-50 active:scale-[0.98] touch-manipulation ${
              isAutoCurated 
                ? 'border-[#c9a96e]/60 bg-gradient-to-r from-amber-950/40 to-zinc-950 shadow-[0_0_30px_rgba(201,169,110,0.15)]' 
                : 'border-[#c9a96e]/30 bg-gradient-to-r from-amber-950/20 to-zinc-950 hover:border-[#c9a96e]/60'
            }`}
          >
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-0 z-20 flex-1 md:pr-8">
              <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#c9a96e]/20 transition duration-500">
                <Sparkles className="text-[#c9a96e] w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-serif text-xl md:text-3xl text-white/90 mb-2 group-hover:text-white transition-colors">Don&apos;t Know Where to Start?</h3>
                <p className="text-white/50 text-sm md:text-base font-light italic leading-relaxed">Most first-timers spend 20 hours Googling and still aren&apos;t sure where to go. Let our experts choose the right destinations for you.</p>
              </div>
            </div>
            
            <div className="z-20 w-full md:w-auto shrink-0">
              <div className="px-8 py-4 w-full md:w-auto text-center border border-[#c9a96e] text-[#c9a96e] group-hover:bg-[#c9a96e] group-hover:text-black text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors flex items-center justify-center gap-3 whitespace-nowrap">
                {isAutoCurated ? 'Curated Mode Active' : 'Curate My Journey'} <ChevronRight size={16} />
              </div>
            </div>
            {/* Subtle background glow */}
            <div className={`absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#c9a96e]/5 to-transparent z-10 pointer-events-none transition-opacity duration-700 ${isAutoCurated ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </button>

          {selectedLandscapes.length > 0 && !isAutoCurated && !searchQuery.trim() && (
            <div className="flex items-center justify-between mt-6 mb-2 px-2">
              <h3 className="font-serif text-2xl md:text-3xl text-[#c9a96e]">
                {selectedLandscapes.length === 1 ? `${selectedLandscapes[0]} Destinations` : 'Filtered Destinations'}
              </h3>
              <div className="h-px bg-[#c9a96e]/20 flex-1 ml-6"></div>
            </div>
          )}

          {/* Native CSS Grid */}
          {sortedDests.length === 0 ? (
            <div className="p-10 text-center border border-white/10 bg-white/5 rounded-xl mt-4">
              <p className="text-white/40 italic">No destinations match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 pb-6">
              {sortedDests.map((dest, index) => {
                const { reasons } = getTierAndReason(dest);
                const isSelected = selectedDestinations.includes(dest.id);
                const notEnoughDays = !isSelected && (currentTotalMinDays + (dest.minRequiredDays || 2) > selectedDays);
                const isDisabled = (!isSelected && isAutoCurated) || notEnoughDays;

                return (
                  <DestinationCard
                    key={dest.id}
                    id={dest.id}
                    name={dest.name}
                    region={dest.region}
                    imageSrc={dest.imageUrl || FALLBACK_IMAGE}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    reasons={reasons}
                    borderColor={isSelected ? theme.gold : theme.border}
                    isPriority={index < 6}
                    index={index}
                    onCardClick={handleCardClick}
                    onToggle={handleToggleDestination}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      );
    })()}
  </AnimatePresence>
</div>

{/* Quick Look Netflix-Style Modal */}
<AnimatePresence>
  {quickLookId && (() => {
    const dest = destinations.find(d => d.id === quickLookId);
    if (!dest) return null;
    const isSelected = selectedDestinations.includes(dest.id);
    
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-10 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto" 
          onClick={() => setQuickLookId(null)} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-[92vw] md:w-full max-w-6xl max-h-[80dvh] h-auto md:h-[70vh] bg-[#0a0806] rounded-xl overflow-hidden border border-white/5 pointer-events-auto shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={() => setQuickLookId(null)} 
            className="absolute top-3 right-3 md:top-5 md:right-5 z-50 p-3 bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-full transition-colors duration-200 active:scale-90 touch-manipulation cursor-pointer"
          >
            <X size={18} className="text-white/70 hover:text-white" />
          </button>

          {/* Left Side: Static Image */}
          <div className="relative w-full md:w-1/2 h-48 md:h-full shrink-0 bg-black">
            <Image 
              src={dest.imageUrl || FALLBACK_IMAGE} 
              alt={dest.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90" 
              priority
            />
            {/* Gradient blends */}
            <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0806] to-transparent z-10" />
            <div className="md:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0806] to-transparent z-10" />
            
            {/* Region Badge overlay */}
            <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20 px-2 py-0.5 md:px-3 md:py-1 bg-black/60 backdrop-blur-md border border-white/5 rounded-full">
              <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#c9a96e]">{dest.region}</span>
            </div>
          </div>
          
          {/* Right Side: Content */}
          <div className="flex-1 flex flex-col min-h-0 relative z-20">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 px-4 md:p-10 md:pr-16 pb-24 md:pb-28">
              <div className="mb-3 md:mb-8 pr-10 md:pr-0">
                <h2 className="font-serif text-lg md:text-4xl leading-tight mb-2 md:mb-4 text-white/90">{dest.name}</h2>
                <div className="flex flex-wrap gap-2.5 md:gap-4 text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 border-b border-white/5 pb-3 md:pb-5">
                  <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-[#c9a96e]" />{dest.minRequiredDays} Days Min</span>
                  <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-[#c9a96e]" />{dest.idealSeason}</span>
                </div>
              </div>

              <div>
                <p className="text-white/60 leading-relaxed md:leading-loose font-light text-xs md:text-base italic mb-5 md:mb-6">&ldquo;{dest.shortPitch || dest.description}&rdquo;</p>
                
                {/* Vibe Tags */}
                {(dest as any).vibeTags && (dest as any).vibeTags.length > 0 && (
                  <div className="mb-5 md:mb-6">
                    <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-2 md:mb-3">Character</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {(dest as any).vibeTags.map((tag: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs tracking-wider text-[#c9a96e]/80 border border-[#c9a96e]/20 rounded-full bg-[#c9a96e]/5">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Landscapes */}
                {dest.landscapes && dest.landscapes.length > 0 && (
                  <div className="mb-5 md:mb-6">
                    <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-2 md:mb-3">Landscapes</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {dest.landscapes.map((l: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs tracking-wider text-white/50 border border-white/10 rounded-full bg-white/5">{l}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature Experiences */}
                <div>
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-2 md:mb-3">Signature Experiences</h3>
                  <ul className="space-y-2 md:space-y-3">
                    {((dest as any).topHighlights || []).map((hl: string, i: number) => (
                      <li 
                        key={i}
                        className="flex gap-2.5 md:gap-3 items-start"
                      >
                        <span className="text-[#c9a96e] mt-0.5 text-xs md:text-sm">✦</span>
                        <span className="leading-relaxed text-white/70 text-xs md:text-sm font-light">{hl}</span>
                      </li>
                    ))}
                    {(!(dest as any).topHighlights || (dest as any).topHighlights.length === 0) && (
                      <li className="text-sm text-zinc-500 italic">No highlights available yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 inset-x-0 p-4 md:p-10 bg-gradient-to-t from-[#0a0806] via-[#0a0806] to-transparent pt-10 md:pt-12 pointer-events-none">
              <button 
                onClick={() => { toggleDestination(dest.id); setQuickLookId(null); }}
                className={`w-full py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm transition duration-300 flex items-center justify-center gap-2 pointer-events-auto active:scale-95 touch-manipulation cursor-pointer ${
                  isSelected 
                    ? 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10 backdrop-blur-sm' 
                    : 'bg-transparent text-[#c9a96e] border border-[#c9a96e] hover:bg-[#c9a96e] hover:text-black shadow-[0_0_20px_rgba(201,169,110,0.1)]'
                }`}
              >
                {isSelected ? 'Remove from Itinerary' : 'Add to Itinerary'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  })()}
</AnimatePresence>

                    <div className="w-full lg:w-96 shrink-0 sticky top-8 h-fit bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
                      <div>
                        <h4 className="font-sans uppercase tracking-widest text-[10px] mb-4 text-white/50">Your Selection</h4>
                        {isAutoCurated ? (
                          <div className="bg-black/40 border border-white/10 p-5 rounded-sm">
                            <div className="flex gap-3 items-center text-[#c9a96e] mb-3">
                              <Crown size={18} />
                              <p className="text-xs uppercase tracking-widest">Concierge Insights</p>
                            </div>
                            <p className="font-serif text-white/90 leading-relaxed tracking-wide">&ldquo;{curationRationale}&rdquo;</p>
                          </div>
                        ) : selectedDestinations.length === 0 ? (
                          <p className="text-sm text-zinc-500 italic">No destinations selected</p>
                        ) : (
                          <ul className="space-y-2">
                            {selectedDestinations.map(id => {
                              const d = destinations.find(x => x.id === id);
                              return (
                                <li key={id} className="text-sm text-zinc-300 flex items-center gap-2">
                                  <span style={{ color: theme.gold }}>✦</span> {d?.name}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      {selectedDestinations.length > 0 && (
                        <div className="bg-black/40 border-l-2 border-[#c9a96e]/50 p-3 md:p-4 rounded-r-sm text-left mb-6">
                          <div className="flex gap-2 items-center text-[#c9a96e]/80 mb-1.5 md:mb-2">
                            <Info size={12} className="md:w-[14px] md:h-[14px]" />
                            <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">Concierge Note</span>
                          </div>
                          <p className="font-sans text-white/70 leading-relaxed text-xs md:text-sm">
                            Don&apos;t worry about getting this perfect. These answers give us a direction — we&apos;ll fine-tune every detail with you directly before we begin.
                          </p>
                        </div>
                      )}

                      {(() => {
                        // Compute slack days client-side for instant feedback
                        const totalMinDays = selectedDestinations.reduce((sum, id) => {
                          const d = destinations.find(x => x.id === id);
                          return sum + (d?.minRequiredDays || 2);
                        }, 0);
                        const slackDays = selectedDays - totalMinDays;
                        const hasSlack = selectedDestinations.length > 0 && totalMinDays <= selectedDays && slackDays >= 5 && selectedDays >= totalMinDays * 2;

                        if (isValidating) {
                          return (
                            <div className="flex gap-3 items-center text-white/40 p-4" aria-live="polite">
                              <Spinner size="sm" showLogo={false} />
                              <span className="font-sans text-[11px] uppercase tracking-widest">Reviewing route…</span>
                            </div>
                          );
                        }
                        if (warnings.length > 0) {
                          return (
                            <div className="space-y-3">
                              {warnings.map((warn, idx) => (
                                <div key={idx} className="bg-black/40 border-l-2 border-[#c9a96e] p-3 md:p-4 rounded-r-sm">
                                  <div className="flex gap-2 items-center text-[#c9a96e] mb-1.5 md:mb-2">
                                    {warn.category === 'vibe' ? <Info size={12} className="md:w-[14px] md:h-[14px]" /> : <AlertTriangle size={12} className="md:w-[14px] md:h-[14px]" />}
                                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">{warn.category} Note</span>
                                  </div>
                                  <p className="font-sans text-white/80 leading-relaxed text-xs md:text-sm">{warn.message}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (hasSlack) {
                          const maxAllowed = Math.max(3, Math.floor(selectedDays / 1.5));
                          const isMaxReachedSlack = selectedDestinations.length >= maxAllowed;
                          
                          const singleSuggest = isMaxReachedSlack ? 'reduce your days' : 'add more stops or reduce your days';
                          const multiSuggest = isMaxReachedSlack ? 'reducing your days' : 'adding more destinations to fill the time';
                          
                          return (
                            <div className="bg-black/40 border-l-2 border-[#c9a96e]/50 p-3 md:p-4 rounded-r-sm">
                              <div className="flex gap-2 items-center text-[#c9a96e]/80 mb-1.5 md:mb-2">
                                <Info size={12} className="md:w-[14px] md:h-[14px]" />
                                <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">Pacing Note</span>
                              </div>
                              <p className="font-sans text-white/70 leading-relaxed text-xs">
                                {selectedDestinations.length === 1 
                                  ? `${destinations.find(d => d.id === selectedDestinations[0])?.name || 'This destination'} needs about ${totalMinDays} days. You have ${selectedDays}. Consider ${singleSuggest} for a tighter journey.`
                                  : `Your selections need roughly ${totalMinDays} days. You have ${selectedDays}. Consider ${multiSuggest}.`
                                }
                              </p>
                            </div>
                          );
                        }
                        if (selectedDestinations.length > 1) {
                          return (
                            <div className="flex gap-2.5 items-center text-[#c9a96e]/70 bg-black/20 border-l-2 border-[#c9a96e]/30 p-3 md:p-4 rounded-r-sm">
                              <CheckCircle size={12} className="md:w-[14px] md:h-[14px]" />
                              <p className="font-sans text-[11px] md:text-xs tracking-wide">Route optimized and feasible.</p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <button
                        onClick={() => {
                          if (step === 7 && selectedDestinations.length === 0 && !isAutoCurated) return;
                          nextStep();
                        }}
                        disabled={selectedDestinations.length === 0 && !isAutoCurated}
                        style={{
                          opacity: (selectedDestinations.length === 0 && !isAutoCurated) ? 0.5 : 1,
                          cursor: (selectedDestinations.length === 0 && !isAutoCurated) ? 'not-allowed' : 'pointer'
                        }}
                        className={`w-full group relative py-4 border overflow-hidden rounded-sm transition duration-300 active:scale-[0.98] touch-manipulation ${(selectedDestinations.length === 0 && !isAutoCurated) ? 'text-white/50' : 'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'}`}
                      >
                        <span className="relative font-sans tracking-widest text-sm uppercase flex items-center justify-center gap-3 font-medium">
                          Proceed to Checkout • ${selectedDays >= 14 ? 75 : 40} <ChevronRight size={16} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}


          </motion.div>
        </AnimatePresence>
      </main>

      {step < 7 && (() => {
        const isNextDisabled = (step === 1 && !startLocation.trim()) || (step === 3 && travelMonths.length === 0) || (step === 4 && !companions);
        return (
          <footer className="p-6 md:p-10 flex justify-end relative z-20">
            <button
              suppressHydrationWarning
              disabled={isNextDisabled}
              onClick={() => {
                if (isNextDisabled) return;
                nextStep();
              }}
              style={{
                borderColor: theme.gold,
                opacity: isNextDisabled ? 0.3 : 1,
                cursor: isNextDisabled ? 'not-allowed' : 'pointer'
              }}
              className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition duration-300 ${
                  isNextDisabled ? 'text-[#c9a96e]/30' : 'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'
                }`}
            >
              <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-medium">
                Next <ChevronRight size={16} />
              </span>
            </button>
          </footer>
        );
      })()}

      {/* Validation modal removed as per client request to reduce friction */}

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .framer-motion-print-fix,
          .framer-motion-print-fix * {
            transform: none !important;
            will-change: auto !important;
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            background-image: none !important;
            transition: none !important;
            animation: none !important;
            mix-blend-mode: normal !important;
            font-weight: 400 !important;
          }
          .framer-motion-print-fix strong,
          .framer-motion-print-fix b,
          .framer-motion-print-fix h1,
          .framer-motion-print-fix h2,
          .framer-motion-print-fix h3,
          .framer-motion-print-fix h4 {
            font-weight: 700 !important;
          }
          [class*="text-white/"] {
            color: #cccccc !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${theme.gold}; opacity: 0.5; }
        
        .premium-slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .premium-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid ${theme.gold};
          box-shadow: 0 0 10px rgba(201,169,110,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .premium-slider:active::-webkit-slider-thumb {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(201,169,110,0.8);
          background: ${theme.gold};
        }
        .premium-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid ${theme.gold};
          box-shadow: 0 0 10px rgba(201,169,110,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .premium-slider:active::-moz-range-thumb {
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(201,169,110,0.8);
          background: ${theme.gold};
        }
      `}} />
    </div>
  );
}
