"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogPost, BlogCategory } from '@/lib/blogs';

const ITEMS_PER_PAGE = 12;

export default function BlogFilter({ blogs }: { blogs: BlogPost[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const categories: (BlogCategory | 'All')[] = ['All', 'Safety', 'Culture & Etiquette', 'Logistics', 'Regions', 'Itineraries', 'General'];
  
  const filteredBlogs = blogs.filter(blog => activeCategory === 'All' || blog.category === activeCategory);
  
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE));
  
  // Ensure current page doesn't exceed total pages if category changes
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-16">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`?category=${encodeURIComponent(cat)}&page=1`}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition duration-300 ${
              activeCategory === cat 
                ? 'bg-[#c9a96e] text-black font-semibold' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16">
        {paginatedBlogs.map((blog) => (
          <Link 
            href={`/journal/${blog.slug}`} 
            key={blog.slug}
            className="group block"
          >
            <article className="h-full p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#c9a96e]/30 transition duration-300 flex flex-col">
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          {validCurrentPage > 1 ? (
            <Link 
              href={`?category=${encodeURIComponent(activeCategory)}&page=${validCurrentPage - 1}`}
              className="px-6 py-2 border border-white/20 text-white hover:border-[#c9a96e] hover:text-[#c9a96e] transition rounded-sm text-sm tracking-widest uppercase"
            >
              Previous
            </Link>
          ) : (
            <span className="px-6 py-2 border border-transparent text-white/20 text-sm tracking-widest uppercase cursor-not-allowed">
              Previous
            </span>
          )}

          <span className="text-white/50 text-sm font-sans">
            Page {validCurrentPage} of {totalPages}
          </span>

          {validCurrentPage < totalPages ? (
            <Link 
              href={`?category=${encodeURIComponent(activeCategory)}&page=${validCurrentPage + 1}`}
              className="px-6 py-2 border border-white/20 text-white hover:border-[#c9a96e] hover:text-[#c9a96e] transition rounded-sm text-sm tracking-widest uppercase"
            >
              Next
            </Link>
          ) : (
            <span className="px-6 py-2 border border-transparent text-white/20 text-sm tracking-widest uppercase cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      )}
    </>
  );
}
