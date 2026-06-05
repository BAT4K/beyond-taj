"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/lib/blogs";
import { ArrowRight } from "lucide-react";

export default function JournalShowcase({ blogs }: { blogs: BlogPost[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-10 bg-[#0a0806] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto"
        >
          <p className="text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-4 font-sans">
            WHAT WE'VE WRITTEN
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-light leading-tight mb-6 text-balance">
            Before you spend $40, spend 20 minutes reading what's already free.
          </h2>
          <p className="font-sans text-white/60 text-lg md:text-xl leading-relaxed font-light text-balance">
            If our free articles don't sound like the BeyondTaj you want, our paid blueprint won't either.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link 
                href={`/journal/${blog.slug}`}
                className="group block p-8 md:p-10 rounded-sm bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-[#c9a96e]/50 transition-colors duration-500 h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-tight group-hover:text-[#c9a96e] transition-colors text-balance">
                    {blog.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed font-sans font-light line-clamp-3">
                    {blog.metaDescription || "Read our honest, locally-vetted guide designed specifically for foreign travelers navigating India."}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a96e] font-semibold">
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/journal" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest font-semibold">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
