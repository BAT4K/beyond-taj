import { getBlogBySlug, getAllBlogs } from '@/lib/blogs';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: 'Guide Not Found | Beyond Taj'
    };
  }

  return {
    title: `${blog.title} | Beyond Taj Journal`,
    description: blog.metaDescription,
    keywords: blog.targetKeyword,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription,
      type: 'article',
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = getAllBlogs();
  const relatedBlogs = allBlogs.filter(b => b.category === blog.category && b.slug !== blog.slug);
  
  const premiumFiles = [
    'Article_34_Best_Time_to_Visit_India__Region_by.txt',
    'Article_22_Top_10_Scams_Targeting_Foreign_Tour.txt',
    'Article_32_How_to_Get_an_India_Visa__The_Compl.txt',
    'Article_21_Is_India_Safe_for_Solo_Female_Trave.txt',
    'Article_48_Best_India_Itinerary_for_FirstTimer.txt',
    'Article_103_Ayurveda_in_Kerala__The_Honest_Guid.txt',
    'Article_104_Is_Amritsar_Safe_for_Tourists.txt',
    'Article_105_Is_Udaipur_Safe_for_Solo_Female_Tra.txt'
  ];

  // 1. Try to find a premium blog in the same category
  const premiumRelated = relatedBlogs.filter(b => premiumFiles.includes(b.filename));
  // 2. Fallback to any premium blog globally
  const globalPremium = allBlogs.filter(b => premiumFiles.includes(b.filename) && b.slug !== blog.slug);

  let readNext;
  if (premiumRelated.length > 0) {
    readNext = premiumRelated[Math.floor(Math.random() * premiumRelated.length)];
  } else if (globalPremium.length > 0) {
    readNext = globalPremium[Math.floor(Math.random() * globalPremium.length)];
  } else if (relatedBlogs.length > 0) {
    readNext = relatedBlogs[Math.floor(Math.random() * relatedBlogs.length)];
  } else {
    readNext = allBlogs.find(b => b.slug !== blog.slug);
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'Beyond Taj',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.com'}/journal`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.com'}/journal/${blog.slug}`
      }
    ]
  };

  return (
    <article className="min-h-screen bg-[#0a0806] text-white pt-32 pb-32 px-6 md:px-12 selection:bg-[#c9a96e]/30">
      <ScrollToTop />
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Back */}
        <Link 
          href="/journal" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-[#c9a96e] transition-all active:scale-95 active:opacity-50 active:duration-150 mb-12 md:mb-16 group py-2"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-16 text-center md:text-left">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
          <h1 className="font-serif text-4xl md:text-6xl font-light text-white/90 leading-tight mb-8">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10 pb-8">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
              {blog.category}
            </span>
            {blog.targetKeyword && (
              <>
                <span className="text-white/20">|</span>
                <span className="text-white/30">{blog.targetKeyword}</span>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose-luxury">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Read Next */}
        {readNext && (
          <div className="mt-24 pt-12 border-t border-white/10">
            <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-6">Read Next in {blog.category}</h3>
            <Link href={`/journal/${readNext.slug}`} className="group block p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#c9a96e]/30 transition-all duration-300">
              <h4 className="font-serif text-2xl text-white/90 group-hover:text-[#c9a96e] transition-colors mb-2">{readNext.title}</h4>
              <p className="font-sans text-sm text-white/50 line-clamp-2">{readNext.metaDescription}</p>
            </Link>
          </div>
        )}

      </div>
    </article>
  );
}
