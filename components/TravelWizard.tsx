"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, Diamond, ShieldCheck, Loader2, Crown, Scale, Compass, Users, Mountain, Palmtree, Castle, Sun, Waves, Lock, Sunset, Moon, Wallet } from "lucide-react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
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
  "Leh-Ladakh": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
  "Udaipur": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800",
  "Jaisalmer": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800",
  "Varkala": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
  "Alleppey": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800",
  "Manali": "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800"
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
  "Backwaters": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
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

// ... existing imports/types

export default function TravelWizard({ destinations }: TravelWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedDays, setSelectedDays] = useState(14);
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [selectedLandscapes, setSelectedLandscapes] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [warnings, setWarnings] = useState<string[]>([]);
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Saving your selections...");

  useEffect(() => {
    if (step === 4) {
      validateItinerary();
    }
  }, [selectedDestinations, selectedDays, travelStyle, step]);

  const validateItinerary = async () => {
    if (selectedDestinations.length === 0) {
      setWarnings([]);
      setEstimatedBudget("");
      return;
    }

    setIsValidating(true);
    try {
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
        setWarnings(data.warnings || []);
        setEstimatedBudget(data.estimatedBudgetRange || "");
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
    if (step === 4) {
      saveJourneyAndCheckout();
    } else {
      setDirection(1);
      setStep((s) => Math.min(s + 1, 4));
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

  const filteredDestinations = destinations.filter(
    (d) => selectedLandscapes.length === 0 || selectedLandscapes.includes(d.landscape)
  );

  // Haversine formula to calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const selectedCoords = selectedDestinations
    .map(id => destinations.find(d => d.id === id))
    .filter(d => d && d.latitude && d.longitude);

  let maxDistance = 0;
  for (let i = 0; i < selectedCoords.length; i++) {
    for (let j = i + 1; j < selectedCoords.length; j++) {
      const dist = calculateDistance(
        selectedCoords[i]!.latitude, selectedCoords[i]!.longitude,
        selectedCoords[j]!.latitude, selectedCoords[j]!.longitude
      );
      if (dist > maxDistance) {
        maxDistance = dist;
      }
    }
  }

  const hasGeoConflict = selectedDays < 8 && maxDistance > 1500;

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
          animate={{ width: `${(step / 4) * 100}%` }}
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
            className="framer-motion-print-fix w-full max-w-4xl mx-auto"
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
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-12">Define your aesthetic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { name: "Luxury Explorer", icon: Crown, desc: "Five-star heritage properties, private transfers, exclusive access." },
                    { name: "Balanced", icon: Scale, desc: "Boutique stays, comfortable pace, authentic immersive experiences." },
                    { name: "Adventure Nomad", icon: Compass, desc: "Off-grid locations, active pursuits, raw and unfiltered." },
                    { name: "Deep Immersion", icon: Users, desc: "Local transit, community homestays, and unfiltered cultural connection." },
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

            {step === 3 && (
              <div className="text-center">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-4">What moves you?</h2>
                <p className="text-white/50 text-sm italic tracking-wide mb-12">Select the landscapes that resonate with your soul.</p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
                  {[
                    { name: "Mountains", icon: Mountain },
                    { name: "Beaches", icon: Palmtree },
                    { name: "Royal Cities", icon: Castle },
                    { name: "Desert", icon: Sun },
                    { name: "Backwaters", icon: Waves },
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
                        className="relative p-6 md:p-8 flex flex-col items-center justify-center border rounded-sm transition-all duration-300 cursor-pointer hover:border-white/20 hover:-translate-y-1 w-[130px] md:w-[150px] overflow-hidden"
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

            {step === 4 && (() => {
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {filteredDestinations.map((dest) => {
                        const isSelected = selectedDestinations.includes(dest.id);
                        const isDisabled = !isSelected && isMaxReached;
                        const imageUrl = DESTINATION_IMAGES[dest.name] || FALLBACK_IMAGE;
                        return (
                          <div
                            key={dest.id}
                            onClick={() => toggleDestination(dest.id)}
                            onMouseEnter={() => setHoveredCard(dest.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`relative h-64 group rounded-sm overflow-hidden border transition-all duration-300 ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer hover:border-white/20'}`}
                            style={{ borderColor: isSelected ? theme.gold : theme.border }}
                          >
                            {/* Poster image (always visible as fallback) */}
                            <img src={imageUrl} alt={dest.name} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'} opacity-60`} />

                            {/* Hover video (only mounts when hovered — prevents 20 simultaneous downloads) */}
                            {hoveredCard === dest.id && DESTINATION_VIDEOS[dest.name] && (
                              <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 z-[1]"
                              >
                                <source src={DESTINATION_VIDEOS[dest.name]} type="video/mp4" />
                              </video>
                            )}

                            {/* Dark overlay — sits ABOVE video for text legibility */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent z-10 transition-opacity ${isSelected ? 'opacity-90' : 'opacity-80 group-hover:opacity-90'}`} />

                            <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: theme.gold }}>{dest.region}</p>
                                  <h3 className="font-serif text-2xl drop-shadow-md">{dest.name}</h3>
                                </div>
                                <div
                                  className={`w-6 h-6 mt-1 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${isSelected ? 'bg-[#c9a96e] border-[#c9a96e]' : 'border-white/30'}`}
                                >
                                  {isSelected && <CheckCircle size={14} className="text-black" />}
                                </div>
                              </div>

                              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3 pr-4">
                                {dest.description}
                              </p>

                              <div className="flex justify-between items-start pt-3 mt-3 border-t border-white/10 text-[0.65rem] tracking-[0.15em] text-white/60 uppercase">
                                <div className="w-1/2 pr-2 flex items-start gap-1.5">
                                  <span style={{ color: theme.gold }} className="flex-shrink-0">✦</span>
                                  <span>{dest.vibeTags.slice(0, 2).join(" • ")}</span>
                                </div>
                                <div className="w-1/2 text-right pl-2 border-l border-white/10">
                                  Best: {dest.idealSeason}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {filteredDestinations.length === 0 && (
                        <div className="col-span-1 md:col-span-2 p-10 text-center border rounded-sm" style={{ borderColor: theme.border, backgroundColor: theme.darker }}>
                          <p className="text-white/40 italic">No destinations match your selected landscapes. Try removing some filters.</p>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1">
                      <div style={{ backgroundColor: theme.darker, borderColor: theme.border }} className="p-6 border rounded-sm sticky top-10">
                        <h4 className="font-sans uppercase tracking-widest text-xs mb-6 text-white/50">Live Validation</h4>

                        <div className="space-y-6">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Estimated Budget</p>
                            <p className="font-serif text-2xl" style={{ color: theme.gold }}>
                              {estimatedBudget || "$0 - $0"}
                            </p>
                          </div>

                          {isValidating ? (
                            <div className="text-sm text-white/50 animate-pulse">Analyzing route physics...</div>
                          ) : hasGeoConflict ? (
                            <div className="flex flex-col gap-2 items-start bg-amber-950/20 border border-amber-500/50 p-4 rounded-sm">
                              <div className="flex gap-3 items-center">
                                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
                                <p className="text-sm text-amber-500 font-bold tracking-wide">Geographic Conflict</p>
                              </div>
                              <p className="text-sm text-amber-200/80 leading-relaxed mt-1">Your destinations are over 1,500km apart. For a short {selectedDays}-day trip, we highly recommend focusing on a single region to avoid exhausting transit times.</p>
                            </div>
                          ) : warnings.length > 0 ? (
                            <div className="space-y-3">
                              {warnings.map((warn, idx) => (
                                <div key={idx} className="flex gap-3 items-start bg-amber-950/30 border border-amber-900/50 p-4 rounded-sm">
                                  <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-amber-200/80 leading-relaxed">{warn}</p>
                                </div>
                              ))}
                            </div>
                          ) : selectedDestinations.length > 0 ? (
                            <div className="flex gap-3 items-center text-emerald-400/80 bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-sm">
                              <CheckCircle size={16} />
                              <p className="text-sm">Pacing and logistics look excellent.</p>
                            </div>
                          ) : (
                            <div className="text-sm text-white/30 italic">Select destinations to validate.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}


          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="p-6 md:p-10 flex justify-end relative z-40">
        <button
          onClick={() => {
            if (step === 4 && selectedDestinations.length === 0) return;
            nextStep();
          }}
          style={{
            borderColor: step === 4 && hasGeoConflict ? 'rgba(245, 158, 11, 0.5)' : theme.gold,
            opacity: step === 4 && selectedDestinations.length === 0 ? 0.5 : 1,
            cursor: step === 4 && selectedDestinations.length === 0 ? 'not-allowed' : 'pointer'
          }}
          className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition-all duration-300 ${step === 4 && hasGeoConflict ? 'text-amber-500 hover:bg-amber-500/10' :
              step === 4 && selectedDestinations.length === 0 ? 'text-white/50' :
                'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'
            }`}
        >
          <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-medium">
            {step === 4 ? "Review Journey" : "Next"} <ChevronRight size={16} />
          </span>
        </button>
      </footer>

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
