"use client";

import React from "react";
import FullscreenLoader from "./FullscreenLoader";

const PHRASES = [
  "Analyzing routing logistics...",
  "Vetting heritage properties...",
  "Optimizing transit windows...",
  "Generating custom vector blueprint..."
];

export default function CinematicLoader() {
  return (
    <FullscreenLoader 
      title={PHRASES} 
      subtitle="PLEASE DO NOT CLOSE THIS WINDOW" 
    />
  );
}
