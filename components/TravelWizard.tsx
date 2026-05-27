"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Diamond, ShieldCheck, Loader2, Crown, Scale, Compass, Users, Mountain, Palmtree, Castle, Sun, Waves, Lock, Sunset, Moon, Wallet, Flower2, PawPrint, Leaf, Shell, Trees } from "lucide-react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import Image from "next/image";
import type { ItineraryResponse } from "@/app/api/generate-itinerary/route";

export type Destination = {
  id: string;
  name: string;
  description: string;
  region: string;
  vibeTags: string[];
  idealSeason: string;
  image: string;
  landscape: string;
  latitude: number;
  longitude: number;
};

interface TravelWizardProps {
  destinations: Destination[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800";
const DESTINATION_IMAGES: Record<string, string> = {
  // --- Local images (public/destinations/) ---
  "Alleppey": "/destinations/alleppey.webp",
  "Delhi": "/destinations/delhi.webp",
  "Gokarna": "/destinations/gokarna.webp",
  "Gulmarg": "/destinations/gulmarg.webp",
  "Havelock Island (Swaraj Dweep)": "/destinations/havelock.webp",
  "Kaziranga": "/destinations/kaziranga.webp",
  "Meghalaya (Shillong & Sohra)": "/destinations/meghalaya.webp",
  "Munroe Island": "/destinations/munroe.webp",
  "Mysore": "/destinations/mysore.webp",
  "Varanasi": "/destinations/varanasi.webp",
  "Varkala": "/destinations/varkala.webp",
  // --- Unsplash fallbacks (no local image yet) ---
  "Leh-Ladakh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800",
  "Spiti Valley": "https://images.unsplash.com/photo-1626714100232-10d8709aba3d?q=80&w=800",
  "Manali": "https://images.unsplash.com/photo-1626015365107-28b43c255b0d?q=80&w=800",
  "Tirthan Valley": "https://images.unsplash.com/photo-1600792809461-3b2aa31dde52?q=80&w=800",
  "Udaipur": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800",
  "Jodhpur": "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800",
  "Jaisalmer": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800",
  "Jaipur": "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?q=80&w=800",
  "Bundi": "https://images.unsplash.com/photo-1616323439449-1fc6c26fdc69?q=80&w=800",
  "South Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800",
  "Ranthambore": "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=800",
  "Jawai": "https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=800",
  "Kabini": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=800",
  "Munnar": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800",
  "Darjeeling": "https://images.unsplash.com/photo-1622308644420-736e4e4dbdef?q=80&w=800",
  "Ziro Valley": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
  "Rishikesh": "https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=800",
  "Hampi": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800",
  "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
};

const HERO_PLAYLIST = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4"
];
const STYLE_VIDEOS: Record<string, string> = {
  "Luxury Explorer": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Balanced": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Adventure Nomad": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Deep Immersion": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
};
const LANDSCAPE_VIDEOS: Record<string, string> = {
  "Mountains": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Beaches": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Royal Cities": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Desert": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Backwaters": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Spirituality & Ghats": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Wildlife & Safaris": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Tea Plantations & Valleys": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Islands & Diving": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Northeast & Living Roots": "https://www.w3schools.com/html/mov_bbb.mp4"
};
const DESTINATION_VIDEOS: Record<string, string> = {
  "Leh-Ladakh": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Udaipur": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Jaisalmer": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Varkala": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  "Alleppey": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "Manali": "https://www.w3schools.com/html/mov_bbb.mp4"
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

export default function TravelWizard({ destinations }: TravelWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedDays, setSelectedDays] = useState(14);
  const [travelMonth, setTravelMonth] = useState("");
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [selectedLandscapes, setSelectedLandscapes] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [warnings, setWarnings] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Saving your selections...");

  useEffect(() => {
    if (step === 5) {
      validateItinerary();
    }
  }, [selectedDestinations, selectedDays, travelStyle, step]);

  const validateItinerary = async () => {
    if (selectedDestinations.length === 0) {
      setWarnings([]);
      return;
    }

    setIsValidating(true);
    try {
      const selectedNames = destinations
        .filter(d => selectedDestinations.includes(d.id))
        .map(d => d.name);

      const clientWarnings = performValidation({
        destinations: selectedNames,
        durationDays: selectedDays,
        travelMonth,
      });

      const res = await fetch("/api/validate-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedDays,
          travelStyle,
          destinationIds: selectedDestinations,
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
          landscapes: selectedLandscapes,
          destinations: selectedDestinations,
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

  const nextStep = () => {
    if (step === 5) {
      if (selectedDestinations.length === 0) return;
      const selectedNames = destinations
        .filter(d => selectedDestinations.includes(d.id))
        .map(d => d.name);

      const msgs = performValidation({
        destinations: selectedNames,
        durationDays: selectedDays,
        travelMonth,
      });
      // also check if there are API warnings that are "High Transit Friction"
      const allWarnings = [...msgs, ...warnings.filter(w => w.includes("High Transit Friction") || w.includes("High Friction Route") || w.includes("Extreme distance"))];
      
      if (allWarnings.length > 0) {
        setValidationMessages(Array.from(new Set(allWarnings)));
        setShowValidationModal(true);
        return;
      }
      saveJourneyAndCheckout();
    } else {
      if (step === 2 && !travelMonth) {
        return;
      }
      setDirection(1);
      setStep((s) => Math.min(s + 1, 5));
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

  const toggleDestination = (destId: string) => {
    const maxAllowed = Math.max(2, Math.floor(selectedDays / 2.5));

    setSelectedDestinations((prev) => {
      if (prev.includes(destId)) {
        setDestinationError(null);
        return prev.filter((id) => id !== destId);
      } else {
        if (prev.length >= maxAllowed) {
          setDestinationError(`Maximum destinations reached for a ${selectedDays}-day journey.`);
          setTimeout(() => setDestinationError(null), 3000);
          return prev;
        }
        setDestinationError(null);
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
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "none",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
    }),
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

          <div className="h-16 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h3
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
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

  const filteredDestinations = destinations
    .filter((d) => selectedLandscapes.length === 0 || selectedLandscapes.includes(d.landscape))
    .sort((a, b) => {
      const aMatch = isMonthInSeason(travelMonth, a.idealSeason) ? 1 : 0;
      const bMatch = isMonthInSeason(travelMonth, b.idealSeason) ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
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
          animate={{ width: `${(step / 5) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <header className="pt-32 px-6 md:px-10 pb-6 flex justify-between items-center relative z-40">
        <button
          onClick={prevStep}
          className={`group flex items-center gap-2 uppercase tracking-widest text-xs transition-opacity cursor-pointer print:hidden opacity-70 hover:opacity-100`}
          style={{ color: theme.gold }}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-10 py-10 relative z-30">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`framer-motion-print-fix w-full mx-auto px-4 lg:px-12 ${step === 5 ? 'max-w-[1600px]' : 'max-w-4xl'}`}
          >
            {step === 1 && (
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

            {step === 2 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-8">When are you planning to travel?</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                    <motion.button
                      key={month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      onClick={() => setTravelMonth(month)}
                      style={{
                        borderColor: travelMonth === month ? theme.gold : theme.border,
                        backgroundColor: travelMonth === month ? theme.gold + '1A' : theme.darker,
                        color: travelMonth === month ? theme.gold : theme.cream
                      }}
                      className="p-4 border rounded-sm font-sans tracking-wide transition-all hover:border-white/20 uppercase text-xs md:text-sm cursor-pointer"
                    >
                      {month}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">Define your aesthetic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { name: "Luxury Explorer", icon: Crown, desc: "Five-star heritage properties, private transfers, exclusive access." },
                    { name: "Balanced", icon: Scale, desc: "Boutique stays, comfortable pace, authentic immersive experiences." },
                  ].map(({ name, icon: Icon, desc }, index) => (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      key={name}
                      onClick={() => setTravelStyle(name)}
                      style={{
                        borderColor: travelStyle === name ? theme.gold : theme.border,
                        backgroundColor: travelStyle === name ? theme.gold + '0D' : theme.darker
                      }}
                      className="p-6 md:p-8 text-left border rounded-sm transition-all duration-300 hover:border-white/20 hover:-translate-y-1 relative overflow-hidden group cursor-pointer flex flex-col"
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
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-4">What moves you?</h2>
                <p className="text-white/50 text-sm italic tracking-wide mb-12">Select the landscapes that resonate with your soul.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
                  {[
                    { name: "Mountains", icon: Mountain },
                    { name: "Beaches", icon: Palmtree },
                    { name: "Royal Cities", icon: Castle },
                    { name: "Desert", icon: Sun },
                    { name: "Backwaters", icon: Waves },
                    { name: "Spirituality & Ghats", icon: Flower2 },
                    { name: "Wildlife & Safaris", icon: PawPrint },
                    { name: "Tea Plantations & Valleys", icon: Leaf },
                    { name: "Islands & Diving", icon: Shell },
                    { name: "Northeast & Living Roots", icon: Trees },
                  ].map(({ name: landscape, icon: Icon }, index) => {
                    const isSelected = selectedLandscapes.includes(landscape);
                    return (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        key={landscape}
                        onClick={() => toggleLandscape(landscape)}
                        onMouseEnter={() => setHoveredCard('land-' + landscape)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          borderColor: isSelected ? theme.gold : theme.border,
                          backgroundColor: isSelected ? theme.gold + '0D' : theme.darker
                        }}
                        className="relative p-6 md:p-8 flex flex-col items-center justify-center border rounded-sm transition-all duration-300 cursor-pointer hover:border-white/20 hover:-translate-y-1 w-full overflow-hidden"
                      >
                        {/* Hover video overlay */}
                        {hoveredCard === 'land-' + landscape && LANDSCAPE_VIDEOS[landscape] && (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                            src={LANDSCAPE_VIDEOS[landscape]}
                          />
                        )}
                        <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/80 to-transparent z-[1] transition-opacity ${hoveredCard === 'land-' + landscape ? 'opacity-100' : 'opacity-0'}`} />

                        <div
                          className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${isSelected ? 'border-transparent' : 'border-white/20'}`}
                          style={{ backgroundColor: isSelected ? theme.gold : 'transparent' }}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-[#0a0806] rounded-full" />}
                        </div>
                        <Icon
                          className={`w-6 h-6 mb-4 transition-colors duration-300 z-10 ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                          strokeWidth={1.5}
                          style={{ color: isSelected ? theme.gold : 'white' }}
                        />
                        <span className="font-sans uppercase tracking-widest text-[10px] md:text-xs text-center z-10">{landscape}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (() => {
              const maxAllowedDestinations = Math.max(2, Math.floor(selectedDays / 2.5));
              const isMaxReached = selectedDestinations.length >= maxAllowedDestinations;

              return (
                <div className="space-y-10">
                  <div className="text-center relative">
                    <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Curate your canvas.</h2>
                    <p className="text-white/50 tracking-wide font-light">Select up to {maxAllowedDestinations} destinations. Our routing engine will guide you.</p>

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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                      {filteredDestinations.map((dest) => {
                        const isSelected = selectedDestinations.includes(dest.id);
                        const isDisabled = !isSelected && isMaxReached;
                        return (
                          <div
                            key={dest.id}
                            onClick={() => toggleDestination(dest.id)}
                            onMouseEnter={() => setHoveredCard(dest.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`relative h-[260px] group rounded-sm overflow-hidden border transition-all duration-300 bg-zinc-800 ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer hover:border-white/20'}`}
                            style={{ borderColor: isSelected ? theme.gold : theme.border }}
                          >
                            {/* Poster image with cinematic Ken Burns effect */}
                            <Image 
                              src={DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE} 
                              alt={dest.name} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 30vw"
                              className={`object-cover transition-transform duration-[1000ms] ease-out ${isSelected ? 'scale-110' : 'scale-100 group-hover:scale-110'} opacity-60`} 
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />

                            {/* Dark overlay — sits ABOVE image for text legibility */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent z-10 transition-colors duration-500 ${isSelected ? 'bg-black/40' : 'bg-transparent group-hover:bg-black/40'}`} />

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
                        {selectedDestinations.length === 0 ? (
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
                        <div className="text-sm text-white/50 animate-pulse">Analyzing route physics...</div>
                      ) : warnings.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-sans uppercase tracking-widest text-[10px] mb-2 text-white/50">Live Validation</h4>
                          {warnings.map((warn, idx) => (
                            <div key={idx} className="flex gap-3 items-start bg-amber-950/30 border border-amber-900/50 p-4 rounded-sm">
                              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-200/80 leading-relaxed">{warn}</p>
                            </div>
                          ))}
                        </div>
                      ) : selectedDestinations.length > 0 ? (
                        <div className="flex gap-3 items-center text-emerald-400/80 bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-sm">
                          <CheckCircle size={16} />
                          <p className="text-xs">Pacing and logistics look excellent.</p>
                        </div>
                      ) : null}
                      <button
                        onClick={() => {
                          if (step === 5 && selectedDestinations.length === 0) return;
                          nextStep();
                        }}
                        style={{
                          borderColor: theme.gold,
                          opacity: selectedDestinations.length === 0 ? 0.5 : 1,
                          cursor: selectedDestinations.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                        className={`w-full group relative py-4 border overflow-hidden rounded-sm transition-all duration-300 ${selectedDestinations.length === 0 ? 'text-white/50' : 'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'}`}
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

      {step < 5 && (
        <footer className="p-6 md:p-10 flex justify-end relative z-40">
          <button
            onClick={() => {
              if (step === 5 && selectedDestinations.length === 0) return;
              nextStep();
            }}
            style={{
              borderColor: theme.gold,
              opacity: step === 5 && selectedDestinations.length === 0 ? 0.5 : 1,
              cursor: step === 5 && selectedDestinations.length === 0 ? 'not-allowed' : 'pointer'
            }}
            className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition-all duration-300 ${step === 5 ? 'hover:bg-[#c9a96e]/10' :
                step === 5 && selectedDestinations.length === 0 ? 'text-white/50' :
                  'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'
              }`}
          >
            <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-medium">
              {step === 5 ? "Proceed to Checkout" : "Next"} <ChevronRight size={16} />
            </span>
          </button>
        </footer>
      )}

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
                {validationMessages.map((msg, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <AlertTriangle size={18} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-zinc-300">{msg}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="flex-1 py-3 px-4 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs text-white/80 rounded-sm cursor-pointer"
                >
                  Adjust My Plan
                </button>
                <button
                  onClick={() => {
                    setShowValidationModal(false);
                    saveJourneyAndCheckout();
                  }}
                  className="flex-1 py-3 px-4 border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black transition-colors uppercase tracking-widest text-xs font-medium rounded-sm cursor-pointer"
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
