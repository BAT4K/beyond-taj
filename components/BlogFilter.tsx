"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost, BlogCategory } from '@/lib/blogs';

export default function BlogFilter({ blogs }: { blogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const categories: (BlogCategory | 'All')[] = ['All', 'Safety', 'Culture & Etiquette', 'Logistics', 'Regions', 'Itineraries', 'General'];
  const filteredBlogs = blogs.filter(blog => activeCategory === 'All' || blog.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeCategory === cat 
                ? 'bg-[#c9a96e] text-black font-semibold' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredBlogs.map((blog) => (
          <Link 
            href={`/journal/${blog.slug}`} 
            key={blog.slug}
            className="group block"
          >
            <article className="h-full p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#c9a96e]/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                <span className="text-[9px] uppercase tracking-widest text-white/40">{blog.category}</span>
              </div>
              <h2 className="font-serif text-2xl text-white/90 group-hover:text-[#c9a96e] transition-colors mb-3">
                {blog.title}
              </h2>
              <p className="font-sans text-sm text-white/50 line-clamp-3 mb-6 flex-grow">
                {blog.metaDescription}
              </p>
              <div className="text-[10px] uppercase tracking-widest text-[#c9a96e] font-semibold mt-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Read Article <span className="text-[14px]">→</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
