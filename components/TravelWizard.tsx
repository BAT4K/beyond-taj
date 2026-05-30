"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Info, Diamond, ShieldCheck, Loader2, Crown, Scale, Compass, Users, Mountain, Palmtree, Castle, Sun, Waves, Lock, Sunset, Moon, Wallet, Flower2, PawPrint, Leaf, Shell, Trees, Sparkles, Building2, Plane, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { generateBespokeRoute } from "@/utils/curationEngine";
import { calculateMatchScore } from "@/utils/scoringEngine";


export type Destination = {
  id: string;
  name: string;
  description: string;
  region: string;
  vibeTags: string[];
  idealSeason: string;
  image: string;
  landscapes: string[];
  peakMonths: number[];
  shoulderMonths: number[];
  avoidMonths: number[];
  closedMonths: number[];
  minRequiredDays: number;
  latitude: number;
  longitude: number;
  clusterId?: string | null;
  compatibleClusters?: string[];
  isHub?: boolean;
};

export type WarningMessage = {
  category: 'weather' | 'logistics' | 'vibe';
  severity: 'critical' | 'warning' | 'info';
  message: string;
};

interface TravelWizardProps {
  destinations: Destination[];
  transitRoutes?: { originId: string; destinationId: string; fatigueCost: number }[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800";
const DESTINATION_IMAGES: Record<string, string> = {
  "Alleppey": "/destinations/alleppey.webp",
  "Bundi": "/destinations/bundi.webp",
  "Darjeeling": "/destinations/darjeeling.webp",
  "Delhi": "/destinations/delhi.webp",
  "Gokarna": "/destinations/gokarna.webp",
  "Gulmarg": "/destinations/gulmarg.webp",
  "Hampi": "/destinations/hampi.webp",
  "Havelock Island (Swaraj Dweep)": "/destinations/havelock.webp",
  "Jaipur": "/destinations/jaipur.webp",
  "Jaisalmer": "/destinations/jaisalmer.webp",
  "Jawai": "/destinations/jawai.webp",
  "Jodhpur": "/destinations/jodhpur.webp",
  "Kabini": "/destinations/kabini.webp",
  "Kaziranga": "/destinations/kaziranga.webp",
  "Leh-Ladakh": "/destinations/leh.webp",
  "Manali": "/destinations/manali.webp",
  "Meghalaya (Shillong & Sohra)": "/destinations/meghalaya.webp",
  "Mumbai": "/destinations/mumbai.webp",
  "Munnar": "/destinations/munnar.webp",
  "Munroe Island": "/destinations/munroe.webp",
  "Mysore": "/destinations/mysore.webp",
  "Ranthambore": "/destinations/ranthambore.webp",
  "Rishikesh": "/destinations/rishikesh.webp",
  "South Goa": "/destinations/southgoa.webp",
  "Spiti Valley": "/destinations/spiti.webp",
  "Tirthan Valley": "/destinations/tirthan.webp",
  "Udaipur": "/destinations/udaipur.webp",
  "Varanasi": "/destinations/varanasi.webp",
  "Varkala": "/destinations/varkala.webp",
  "Ziro Valley": "/destinations/ziro.webp",
};


const LANDSCAPE_IMAGES: Record<string, string> = {
  "Mountains": "/destinations/leh.webp",
  "Coastal & Islands": "/destinations/havelock.webp",
  "Royal Cities": "/destinations/jaipur.webp",
  "Desert": "/destinations/jaisalmer.webp",
  "Backwaters": "/destinations/alleppey.webp",
  "Spirituality & Ghats": "/destinations/varanasi.webp",
  "Wildlife & Safaris": "/destinations/ranthambore.webp",
  "Tea Plantations & Valleys": "/destinations/munnar.webp",
  "Vibrant Metropolises": "/destinations/mumbai.webp",
  "Northeast & Living Roots": "/destinations/meghalaya.webp",
};


import { useRouter } from "next/navigation";
import { validateItinerary as performValidation } from "@/utils/travelValidator";

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

export default function TravelWizard({ destinations, transitRoutes = [] }: TravelWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [residency, setResidency] = useState<'International' | 'India'>('International');
  const [startLocation, setStartLocation] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedDays, setSelectedDays] = useState(14);
  const [travelMonth, setTravelMonth] = useState("");
  const [travelStyle, setTravelStyle] = useState("Balanced");
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

  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing preferences...");

  useEffect(() => {
    if (!isGenerating) return;

    const phrases = [
      "Analyzing preferences...",
      "Cross-referencing seasonal matrices...",
      "Calculating transit friction...",
      "Optimizing bespoke route..."
    ];
    let index = 0;
    
    setLoadingText(phrases[0]); // Reset to first phrase immediately

    const intervalId = setInterval(() => {
      index = (index + 1) % phrases.length;
      setLoadingText(phrases[index]);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [isGenerating]);

  // Unified Synchronization Hook
  useEffect(() => {
    const maxAllowedDestinations = Math.max(3, Math.floor(selectedDays / 1.5));
    if (selectedDestinations.length > maxAllowedDestinations) {
      setSelectedDestinations(prev => prev.slice(0, maxAllowedDestinations));
      return; 
    }
  }, [selectedDays, selectedDestinations]);

  // Void auto-curation if core preferences change
  useEffect(() => {
    if (isAutoCurated) {
      setIsAutoCurated(false);
      setCurationRationale(null);
      setSelectedDestinations([]);
    }
  }, [travelMonth, selectedDays, travelStyle, selectedLandscapes]);

  useEffect(() => {
    if (selectedLandscapes.length === 0) {
      if (selectedDestinations.length > 0) {
        setSelectedDestinations([]);
      }
      return;
    }
    
    const matchedCategories = selectedLandscapes.flatMap(label => categoryMap[label] || [label]);
    
    setSelectedDestinations(prev => {
      const newSelection = prev.filter(id => {
        const d = destinations.find(dest => dest.id === id);
        if (!d) return false;
        return matchedCategories.some(cat => d.landscapes.includes(cat));
      });
      
      if (newSelection.length !== prev.length) {
        return newSelection;
      }
      return prev;
    });
  }, [selectedLandscapes, destinations]);
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
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationQuery)}.json?access_token=${token}&types=place,locality,region${countryParam}`);
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
    if (step === 6) {
      // Only show loading state if we actually have enough to validate
      if (selectedDestinations.length >= 2 && !isAutoCurated) {
        setIsValidating(true);
      }
      const handler = setTimeout(() => {
        validateItinerary();
      }, 400); // 400ms debounce
      return () => clearTimeout(handler);
    }
  }, [selectedDays, selectedDestinations, travelStyle, step]);

  const validateItinerary = async () => {
    if (selectedDestinations.length < 2 || isAutoCurated) {
      setWarnings([]);
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    try {
      const selectedDestObjs = destinations.filter(d => selectedDestinations.includes(d.id));

      // Note: We bypass clientWarnings since the server handles all complex validation now.
      // We can just rely entirely on the API response.
      const clientWarnings: WarningMessage[] = [];

      const res = await fetch("/api/validate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedDays,
          travelStyle,
          travelMonth,
          residency,
          startLocation,
          destinationIds: selectedDestObjs.map(d => d.id),
          selectedLandscapes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setWarnings([...clientWarnings, ...(data.warnings || [])]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const saveJourneyAndCheckout = async () => {
    setIsGenerating(true);
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
        }),
      });
      if (response.ok) {
        const journey = await response.json();
        router.push(`/checkout/${journey.id}`);
      } else {
        throw new Error("Failed to save journey");
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const nextStep = async () => {
    if (step === 6) {
      if (selectedDestinations.length === 0 && !isAutoCurated) return;
      if (isAutoCurated) {
        saveJourneyAndCheckout();
        return;
      }
      
      setIsValidating(true);
      if (warnings.length > 0) {
        setValidationMessages(warnings);
        setShowValidationModal(true);
        return;
      }
      setIsValidating(false);
      saveJourneyAndCheckout();
    } else {
      if (step === 1 && !startLocation.trim()) {
        return;
      }
      if (step === 3 && !travelMonth) {
        return;
      }
      setDirection(1);
      setStep((s) => Math.min(s + 1, 6));
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
      setIsGenerating(true);
      
      setTimeout(() => {
        setIsAutoCurated(true);
        const result = generateBespokeRoute(
          { travelMonth, selectedLandscapes, days: selectedDays }, 
          destinations,
          transitRoutes
        );
        setSelectedDestinations(result.destinationIds);
        setCurationRationale(result.rationale);
        setWarnings([]);
        setValidationMessages([]);
        setIsGenerating(false);
      }, 4000);
    } else {
      setIsAutoCurated(false);
      setSelectedDestinations([]);
      setCurationRationale(null);
    }
  };

  const toggleDestination = (destId: string) => {
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
        if (prev.length >= 1 && step === 6) {
          setWarnings([]);
          setIsValidating(true);
        }
        setTimeout(() => document.getElementById('destination-grid')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return [...prev, destId];
      }
    });
  };

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


  if (isGenerating) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.cream }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center z-10 text-center px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="mb-10"
          >
            <Loader2 size={64} style={{ color: theme.gold }} className="opacity-80" />
          </motion.div>

          <div className="h-16 flex items-center justify-center" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.h3
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-3xl md:text-4xl tracking-wide font-light"
              >
                {loadingText}
              </motion.h3>
            </AnimatePresence>
          </div>
          <p className="text-white/40 mt-4 tracking-widest uppercase text-xs">Please do not close this window</p>
        </motion.div>
      </div>
    );
  }

  const maxAllowedDestinations = Math.max(3, Math.floor(selectedDays / 1.5));
  const isMaxReached = selectedDestinations.length >= maxAllowedDestinations;
  const isDisabledGlobal = isMaxReached || isAutoCurated;

  const monthMap: Record<string, number> = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12
  };
  const monthIndex = travelMonth ? monthMap[travelMonth] : null;

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
          travelMonth,
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
    if (selectedDestinations.includes(dest.id)) return { tier: 0 };
    
    const userContext = {
      travelMonth,
      selectedLandscapes,
      days: selectedDays,
      selectedVibes: []
    };

    const lastSelectedId = selectedDestinations[selectedDestinations.length - 1];
    
    // Use the AI Scoring Engine to determine true viability!
    const { weatherFactor, logisticsFactor } = calculateMatchScore(dest, userContext, lastSelectedId, transitRoutes || []);

    // 1. Evaluate Weather via AI Factor
    if (weatherFactor <= 0.1) {
      return { tier: 3, reason: "Off-Season" };
    }

    // 2. Evaluate Pacing (Time-Space Law)
    const startNode = destinations.find(d => d.name.toLowerCase() === startLocation.toLowerCase() || d.id === startLocation);
    const startNodeDays = startNode ? (startNode.minRequiredDays || 2) : 2;

    const currentMinDays = selectedDestinations.reduce((sum, id) => {
      const d = destinations.find(x => x.id === id);
      return sum + (d?.minRequiredDays || 2);
    }, 0);
    
    if (startNodeDays + currentMinDays + (dest.minRequiredDays || 2) > selectedDays) {
      return { tier: 3, reason: "Not Enough Days" };
    }

    // 3. Evaluate Logistics via AI Factor (if a node is selected)
    if (lastSelectedId && transitRoutes && transitRoutes.length > 0) {
      // If logistics penalty is massive (meaning 0 direct connections and high fatigue)
      if (logisticsFactor <= 0.0) {
         return { tier: 3, reason: "Disconnected" };
      }
    } else if (selectedDestinations.length > 0) {
      // Fallback if no transit routes are loaded
      const activeRegions = new Set(selectedDestinations.map(id => destinations.find(d => d.id === id)?.region).filter(Boolean));
      if (!activeRegions.has(dest.region) && !nbdIds.has(dest.id)) {
        return { tier: 3, reason: "Distant Region" };
      }
    }
    
    // 3. AI Suggestions
    if (nbdIds.has(dest.id) && !isDisabledGlobal) return { tier: 1 };
    
    return { tier: 2 };
  };

  const filteredDestinations = destinations
    .filter((d) => {
      if (selectedDestinations.includes(d.id)) return true;
      if (selectedLandscapes.length === 0) return true;
      const matchedCategories = selectedLandscapes.flatMap(label => categoryMap[label] || [label]);
      return matchedCategories.some(cat => d.landscapes.includes(cat));
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

      <header className="pt-32 px-6 md:px-10 pb-6 flex justify-between items-center relative z-40">
        <button
          onClick={prevStep}
          className={`group flex items-center gap-2 uppercase tracking-widest text-xs transition-all cursor-pointer print:hidden opacity-70 hover:opacity-100 active:scale-95 active:opacity-50 touch-manipulation`}
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
            className={`framer-motion-print-fix w-full mx-auto px-4 lg:px-12 ${step === 6 ? 'max-w-[1600px]' : 'max-w-4xl min-h-[60vh] flex flex-col justify-center'}`}
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
                      key={option.id}
                      onClick={() => setResidency(option.id as any)}
                      style={{
                        borderColor: residency === option.id ? theme.gold : theme.border,
                        backgroundColor: residency === option.id ? theme.gold + '0D' : theme.darker
                      }}
                      className="p-6 md:p-8 text-center border rounded-sm transition-all duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col items-center active:scale-[0.98] active:opacity-80 touch-manipulation"
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
                    className="w-full bg-[#12100e] border border-[#2a241e] focus:border-[#c9a96e] rounded-sm px-6 py-4 text-lg text-white placeholder-white/20 outline-none transition-colors shadow-inner"
                  />
                  {showLocationDropdown && locationQuery.length >= 3 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1714] border border-[#2a241e] rounded-sm shadow-2xl z-50 overflow-hidden">
                      {isSearchingLocation ? (
                        <div className="p-4 text-white/50 text-sm flex items-center gap-3">
                          <Loader2 className="animate-spin w-4 h-4" /> Searching...
                        </div>
                      ) : locationResults.length > 0 ? (
                        <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                          {locationResults.map((result: any) => (
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
                    <p className="absolute -bottom-6 left-0 text-xs text-[#25D366] flex items-center gap-1">
                      <CheckCircle size={12} /> Confirmed Location
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
                <div className="relative py-10 max-w-xl mx-auto">
                  <motion.div
                    key={selectedDays}
                    initial={{ textShadow: "0px 0px 0px rgba(201,169,110,0)", scale: 0.98 }}
                    animate={{ textShadow: ["0px 0px 30px rgba(201,169,110,0.8)", "0px 0px 0px rgba(201,169,110,0)"], scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-7xl font-serif mb-2 inline-block leading-none pb-2"
                    style={{ color: theme.gold }}
                  >
                    {selectedDays} <span className="text-2xl text-white/50">Days</span>
                  </motion.div>
                  <motion.p
                    key={`narrative-${selectedDays}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/60 text-sm italic tracking-wide mb-8"
                  >
                    {selectedDays < 7 ? "A brief escape..." : selectedDays <= 14 ? "A standard tour..." : selectedDays <= 21 ? "A grand immersion..." : "A long expedition..."}
                  </motion.p>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Number(e.target.value))}
                    className="premium-slider w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer outline-none"
                  />
                  <div className="flex justify-between text-xs tracking-widest text-white/40 mt-4 uppercase">
                    <span>3 Days</span>
                    <span>30 Days</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-8">When are you planning to travel?</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                    <button
                      key={month}
                      onClick={() => setTravelMonth(month)}
                      style={{
                        borderColor: travelMonth === month ? theme.gold : theme.border,
                        backgroundColor: travelMonth === month ? theme.gold + '1A' : theme.darker,
                        color: travelMonth === month ? theme.gold : theme.cream
                      }}
                      className="p-4 border rounded-sm font-sans tracking-wide transition-all hover:border-white/20 uppercase text-xs md:text-sm cursor-pointer active:scale-[0.98] active:opacity-80 touch-manipulation"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">Define your aesthetic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { name: "Luxury Explorer", icon: Crown, desc: "Five-star heritage properties, private transfers, exclusive access." },
                    { name: "Balanced", icon: Scale, desc: "Boutique stays, comfortable pace, authentic immersive experiences." },
                  ].map(({ name, icon: Icon, desc }, index) => (
                    <button
                      key={name}
                      onClick={() => setTravelStyle(name)}
                      style={{
                        borderColor: travelStyle === name ? theme.gold : theme.border,
                        backgroundColor: travelStyle === name ? theme.gold + '0D' : theme.darker
                      }}
                      className="p-6 md:p-8 text-left border rounded-sm transition-all duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col active:scale-[0.98] active:opacity-80 touch-manipulation"
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
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${travelStyle === name ? 'border-transparent' : 'border-white/20'}`}
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

            {step === 5 && (
              <div className="text-center">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-4">What moves you?</h2>
                <p className="text-white/50 text-sm italic tracking-wide mb-12">Select the landscapes that resonate with your soul.</p>
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
                        key={landscape}
                        onClick={() => toggleLandscape(landscape)}
                        style={{
                          borderColor: isSelected ? theme.gold : theme.border,
                          backgroundColor: isSelected ? theme.gold + '0D' : theme.darker
                        }}
                        className="group relative p-6 md:p-8 flex flex-col items-center justify-center border rounded-sm transition-all duration-300 cursor-pointer hover:border-white/20 hover:-translate-y-1 w-full overflow-hidden active:scale-[0.98] active:opacity-80 touch-manipulation"
                      >
                        <Image
                          src={LANDSCAPE_IMAGES[landscape] || FALLBACK_IMAGE}
                          alt={landscape}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                          className="object-cover opacity-0 group-hover:opacity-60 transition-all duration-700 ease-out scale-100 group-hover:scale-110 z-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/80 to-transparent z-[1] transition-opacity opacity-0 group-hover:opacity-100 duration-700" />

                        <div
                          className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 z-20 ${isSelected ? 'border-transparent' : 'border-white/20'}`}
                          style={{ backgroundColor: isSelected ? theme.gold : 'transparent' }}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-[#0a0806] rounded-full" />}
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-2">
                          <Icon
                            className={`w-6 h-6 mb-4 transition-colors duration-300 ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                            strokeWidth={1.5}
                            style={{ color: isSelected ? theme.gold : 'white' }}
                          />
                          <span className="font-sans uppercase tracking-widest text-[10px] md:text-xs text-center">{landscape}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 6 && (() => {
              const maxAllowedDestinations = Math.max(3, Math.floor(selectedDays / 1.5));
              const isMaxReached = selectedDestinations.length >= maxAllowedDestinations;

              return (
                <div className="space-y-10">
                  <div className="text-center relative">
                    <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Curate your canvas.</h2>
                    <p className="text-white/50 tracking-wide font-light">Select your preferred destinations. Our engine will handle the routing.</p>
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
                    <div 
                      id="destination-grid"
                      className={`flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar ${isGenerating ? 'pointer-events-none' : ''}`}
                    >
                      {/* Magic Card */}
                      <button 
                        onClick={toggleAutoCuration}
                        disabled={isGenerating}
                        className={`relative h-[260px] group rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer active:scale-[0.98] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
                          isAutoCurated 
                            ? 'bg-gradient-to-br from-amber-900/60 to-zinc-900 border-[#c9a96e] shadow-[0_0_20px_rgba(201,169,110,0.3)]' 
                            : 'bg-gradient-to-br from-amber-950/40 to-zinc-900 border-zinc-800 hover:border-white/20'
                        }`}
                      >
                        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center z-20">
                          <Sparkles className={`mb-4 ${isAutoCurated ? 'text-[#c9a96e]' : 'text-white/50 group-hover:text-white/80'} transition-colors`} size={32} />
                          <h3 className={`font-serif text-xl md:text-2xl mb-2 ${isAutoCurated ? 'text-white' : 'text-white/90'}`}>Bespoke Curation</h3>
                          <p className="text-xs text-white/60 leading-relaxed max-w-[90%]">
                            Unsure where to begin? Let our deterministic matching engine effortlessly map the absolute best destinations tailored perfectly to your travel month, pace, and landscape preferences.
                          </p>
                        </div>
                      </button>

                      {[...filteredDestinations].sort((a, b) => getTierAndReason(a).tier - getTierAndReason(b).tier).map((dest) => {
                          const { tier, reason } = getTierAndReason(dest);
                          const isSelected = selectedDestinations.includes(dest.id);
                          const isDisabled = (!isSelected && isMaxReached) || (!isSelected && isAutoCurated);
                          const isTier3 = tier === 3;
                          
                          return (
                            <div
                              key={dest.id}
                              onClick={() => { if (!isDisabled) toggleDestination(dest.id) }}
                              onMouseEnter={() => setHoveredCard(dest.id)}
                              onMouseLeave={() => setHoveredCard(null)}
                              className={`relative h-[260px] group rounded-sm overflow-hidden border transition-colors duration-300 bg-zinc-800 touch-manipulation ${
                                isDisabled 
                                  ? 'opacity-20 cursor-not-allowed grayscale' 
                                  : isTier3 
                                    ? 'opacity-60 grayscale cursor-pointer hover:border-red-900/50 active:scale-[0.98]'
                                    : 'cursor-pointer hover:border-white/20 active:scale-[0.98]'
                              }`}
                              style={{ borderColor: isSelected ? theme.gold : theme.border }}
                            >
                              <Image 
                                src={DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE} 
                                alt={dest.name} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                                className={`object-cover transition-transform duration-[1000ms] ease-out ${isSelected ? 'scale-110 opacity-100' : 'scale-100 group-hover:scale-110 opacity-60'}`} 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />

                              <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent z-10 transition-colors duration-500 ${isSelected ? 'bg-transparent' : 'bg-transparent group-hover:bg-black/40'}`} />

                              {isTier3 && reason && (
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[9px] text-white/90 flex items-center gap-1.5 border border-white/10 z-30 pointer-events-none">
                                  <Plane className="w-3 h-3 text-white/70" />
                                  <span className="uppercase tracking-widest font-medium">{reason}</span>
                                </div>
                              )}
                              
                              {tier === 1 && (
                                <div className="absolute top-3 right-3 bg-[#c9a96e] px-2.5 py-1 rounded text-[9px] text-[#0a0806] flex items-center gap-1.5 z-30 pointer-events-none font-bold">
                                  <span className="uppercase tracking-widest">Suggested</span>
                                </div>
                              )}

                            <div className="absolute inset-0 p-4 flex flex-col justify-end z-20">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <p className="text-[0.6rem] uppercase tracking-widest mb-0.5" style={{ color: theme.gold }}>{dest.region}</p>
                                  <h3 className="font-serif text-xl drop-shadow-md leading-tight">{dest.name}</h3>
                                </div>
                                <div
                                  className={`w-5 h-5 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${isSelected ? 'bg-[#c9a96e] border-[#c9a96e]' : 'border-white/30'}`}
                                >
                                  {isSelected && <CheckCircle size={12} className="text-black" />}
                                </div>
                              </div>

                              <div className="flex flex-wrap justify-between items-start pt-2 mt-2 border-t border-white/10 text-[0.6rem] tracking-[0.12em] text-white/60 uppercase gap-1">
                                <div className="flex-1 min-w-[80px] flex items-start gap-1">
                                  <span style={{ color: theme.gold }} className="flex-shrink-0">✦</span>
                                  <span>{dest.vibeTags.slice(0, 2).join(" • ")}</span>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                  {dest.idealSeason}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {filteredDestinations.length === 0 && (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 p-10 text-center border rounded-sm" style={{ borderColor: theme.border, backgroundColor: theme.darker }}>
                          <p className="text-white/40 italic">No destinations match your selected landscapes. Try removing some filters.</p>
                        </div>
                      )}
                    </div>
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
                      {isValidating ? (
                        <div className="flex gap-3 items-center text-white/40 p-4">
                          <div className="w-3 h-3 border border-white/20 border-t-[#c9a96e] rounded-full animate-spin" />
                          <span className="font-sans text-[11px] uppercase tracking-widest">Reviewing route...</span>
                        </div>
                      ) : warnings.length > 0 ? (
                        <div className="space-y-3">
                          {warnings.map((warn, idx) => (
                            <div key={idx} className="bg-black/40 border-l-2 border-[#c9a96e] p-4 rounded-r-sm">
                              <div className="flex gap-2 items-center text-[#c9a96e] mb-2">
                                {warn.category === 'vibe' ? <Info size={14} /> : <AlertTriangle size={14} />}
                                <span className="text-[10px] uppercase tracking-widest font-semibold">{warn.category} Note</span>
                              </div>
                              <p className="font-sans text-white/80 leading-relaxed text-xs md:text-sm">{warn.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : selectedDestinations.length > 1 ? (
                        <div className="flex gap-3 items-center text-[#c9a96e]/70 bg-black/20 border-l-2 border-[#c9a96e]/30 p-4 rounded-r-sm">
                          <CheckCircle size={14} />
                          <p className="font-sans text-xs tracking-wide">Route optimized and feasible.</p>
                        </div>
                      ) : null}
                      <button
                        onClick={() => {
                          if (step === 6 && selectedDestinations.length === 0 && !isAutoCurated) return;
                          nextStep();
                        }}
                        disabled={selectedDestinations.length === 0 && !isAutoCurated}
                        style={{
                          opacity: (selectedDestinations.length === 0 && !isAutoCurated) ? 0.5 : 1,
                          cursor: (selectedDestinations.length === 0 && !isAutoCurated) ? 'not-allowed' : 'pointer'
                        }}
                        className={`w-full group relative py-4 border overflow-hidden rounded-sm transition-all duration-300 active:scale-[0.98] touch-manipulation ${(selectedDestinations.length === 0 && !isAutoCurated) ? 'text-white/50' : 'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'}`}
                      >
                        <span className="relative font-sans tracking-widest text-sm uppercase flex items-center justify-center gap-3 font-medium">
                          Proceed to Checkout <ChevronRight size={16} />
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

      {step < 6 && (() => {
        const isNextDisabled = (step === 1 && !startLocation.trim()) || (step === 3 && !travelMonth);
        return (
          <footer className="p-6 md:p-10 flex justify-end relative z-40">
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
              className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition-all duration-300 ${
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

      <AnimatePresence>
        {showValidationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-sm p-8 shadow-2xl flex flex-col gap-6"
            >
              <h3 className="font-serif text-3xl text-white/90">Local Insights & Route Adjustments</h3>
              <div className="w-16 h-px bg-white/20 mb-2" />
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {validationMessages.map((msg, i) => {
                  let Icon = AlertTriangle;
                  let colorClass = "text-[#c9a96e]";
                  if (msg.severity === 'critical') {
                    colorClass = "text-red-500";
                  } else if (msg.severity === 'info') {
                    Icon = Info;
                    colorClass = "text-blue-400";
                  }
                  
                  return (
                    <div key={i} className="flex gap-4 items-start bg-zinc-900/50 p-4 rounded-sm border border-zinc-800/50">
                      <Icon size={20} className={`${colorClass} flex-shrink-0 mt-0.5`} />
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${colorClass}`}>
                          {msg.category}
                        </span>
                        <p className="text-sm leading-relaxed text-zinc-300">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className={`flex-1 py-3 px-4 border transition-colors uppercase tracking-widest text-xs rounded-sm cursor-pointer ${
                    validationMessages.some(m => m.severity === 'critical')
                      ? 'border-[#c9a96e] bg-[#c9a96e] text-black hover:bg-[#b08d55]'
                      : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white/80'
                  }`}
                >
                  Adjust My Plan
                </button>
                <button
                  onClick={() => {
                    if (validationMessages.some(m => m.severity === 'critical')) {
                      if (window.confirm("WARNING: This route contains critical blockers (e.g., closed roads, extreme weather). The trip may be physically impossible. Are you absolutely sure you want to proceed?")) {
                        setShowValidationModal(false);
                        saveJourneyAndCheckout();
                      }
                    } else {
                      setShowValidationModal(false);
                      saveJourneyAndCheckout();
                    }
                  }}
                  className={`flex-1 py-3 px-4 border transition-colors uppercase tracking-widest text-xs font-medium rounded-sm cursor-pointer ${
                    validationMessages.some(m => m.severity === 'critical')
                      ? 'border-red-900/50 text-red-500 hover:bg-red-950 hover:border-red-900'
                      : 'border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black'
                  }`}
                >
                  Proceed Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
