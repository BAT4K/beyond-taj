import { Suspense } from 'react';
import { getAllBlogs } from '@/lib/blogs';
import BlogFilter from '@/components/BlogFilter';

export const metadata = {
  title: 'The Journal | Beyond Taj',
  description: 'Expert travel guides, cultural insights, and honest advice for exploring the real India.',
};

export default function JournalIndex() {
  const blogs = getAllBlogs();

  return (
    <div className="min-h-screen bg-[#0a0806] text-white selection:bg-[#c9a96e]/30 pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 md:mb-16 text-center md:text-left">
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white/90 tracking-tight mb-6">
            The Journal
          </h1>
          <p className="font-sans text-white/50 text-lg md:text-xl max-w-2xl leading-relaxed">
            Honest insights, cultural deep-dives, and expert guides for navigating the India that isn't in the brochure.
          </p>
        </header>

        <Suspense fallback={<div className="text-white/50 text-center py-12">Loading articles...</div>}>
          <BlogFilter blogs={blogs} />
        </Suspense>
      </div>
    </div>
  );
}
