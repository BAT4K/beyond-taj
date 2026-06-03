import nextDynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ShowcaseVideo from "@/components/ShowcaseVideo";

import { getAllBlogs, BlogPost } from '@/lib/blogs';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours
// Dynamically import components below the fold
const WhyChooseUs = nextDynamic(() => import("@/components/WhyChooseUs"));
const Manifesto = nextDynamic(() => import("@/components/Manifesto"));
const BlueprintHighlights = nextDynamic(() => import("@/components/BlueprintHighlights"));
const FAQ = nextDynamic(() => import("@/components/FAQ"));
const JournalShowcase = nextDynamic(() => import("@/components/JournalShowcase"));
const FloatingReviewTicker = nextDynamic(() => import("@/components/FloatingReviewTicker"));
const FeaturedBlogWidget = nextDynamic(() => import("@/components/FeaturedBlogWidget"));

export default function Home() {
  const allBlogs = getAllBlogs();
  
  // The curated array of 5 Pillar articles (Safety always first)
  const targetFilenames = [
    'Article_21_Is_India_Safe_for_Solo_Female_Trave.txt',
    'Article_34_Best_Time_to_Visit_India__Region_by.txt',
    'Article_22_Top_10_Scams_Targeting_Foreign_Tour.txt',
    'Article_32_How_to_Get_an_India_Visa__The_Compl.txt',
    'Article_48_Best_India_Itinerary_for_FirstTimer.txt'
  ];

  const featuredBlogs = targetFilenames
    .map(filename => allBlogs.find(b => b.filename === filename))
    .filter(Boolean) as BlogPost[];

  const showcaseFilenames = [
    'Article_21_Is_India_Safe_for_Solo_Female_Trave.txt',
    'Article_22_Top_10_Scams_Targeting_Foreign_Tour.txt'
  ];
  const showcaseBlogs = showcaseFilenames
    .map(filename => allBlogs.find(b => b.filename === filename))
    .filter(Boolean) as BlogPost[];

  return (
    <main className="bg-[#0a0806]">
      <Hero />
      <ShowcaseVideo />
      <WhyChooseUs />
      <Manifesto />
      <BlueprintHighlights />
      <JournalShowcase blogs={showcaseBlogs} />
      <FAQ />
      <FloatingReviewTicker />
      <FeaturedBlogWidget blogs={featuredBlogs} />
    </main>
  );
}
