"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ReviewPage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    review: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Form will be connected to DB later
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setRating(0);
    setFormData({ name: '', location: '', review: '' });
  };

  return (
    <main className="min-h-screen bg-[#0a0806] text-white pt-24 pb-12 px-6 flex flex-col items-center">
      <Navbar />
      
      <div className="w-full max-w-2xl mx-auto mt-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#c9a96e] mb-4">
            Share Your Experience
          </h1>
          <p className="text-zinc-400 font-light text-lg">
            Your insights help us curate better journeys for future travelers.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900/50 border border-amber-500/30 rounded-2xl p-12 text-center flex flex-col items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              <CheckCircle2 className="w-16 h-16 text-amber-500" />
              <div>
                <h2 className="text-2xl font-serif text-white mb-2">Thank you for your feedback!</h2>
                <p className="text-zinc-400">Your review has been successfully submitted.</p>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 px-8 py-3 bg-amber-600/10 text-amber-500 border border-amber-500/30 hover:bg-amber-600/20 rounded-full text-sm font-semibold tracking-wider uppercase transition-colors"
              >
                Write Another Review
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col gap-8 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="e.g. Sarah M."
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="location" className="text-sm font-medium text-zinc-300">
                    Nationality / Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="e.g. London, UK"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-zinc-300">
                  Overall Rating
                </label>
                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        fill={star <= (hoverRating || rating) ? "currentColor" : "transparent"}
                        className={`transition-colors duration-150 ${
                          star <= (hoverRating || rating) ? "text-amber-400" : "text-zinc-600 hover:text-zinc-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-2">
                <label htmlFor="review" className="text-sm font-medium text-zinc-300">
                  Your Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  required
                  rows={5}
                  value={formData.review}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  placeholder="Share the details of your journey..."
                />
              </div>




              {/* Submit */}
              <button
                type="submit"
                disabled={rating === 0}
                className="mt-2 w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold tracking-widest uppercase transition-colors shadow-[0_5px_20px_rgba(217,119,6,0.3)] hover:shadow-[0_8px_25px_rgba(217,119,6,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Submit Review
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
