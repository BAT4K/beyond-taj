import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
});

import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "Beyond Taj | Honest Itinerary",
  description: "Honest India trip planning for foreign travelers. Skip the tourist traps. Avoid the scams. Get a tested itinerary built by people who know India — starting at $40.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-full flex flex-col antialiased bg-[#0a0806] text-white`} suppressHydrationWarning>
        <style dangerouslySetInnerHTML={{__html: `
          .hidden { display: none !important; }
          img.object-cover, video.object-cover { object-fit: cover !important; }
          img.object-contain { object-fit: contain !important; }
          @media (min-width: 768px) { .md\\:block { display: block !important; } .md\\:flex { display: flex !important; } .md\\:hidden { display: none !important; } }
          @media (min-width: 1024px) { .lg\\:block { display: block !important; } .lg\\:flex { display: flex !important; } .lg\\:hidden { display: none !important; } }
        `}} />
        <Providers>
          <Navbar />
          {children}
          <SpeedInsights />
        </Providers>
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Beyond Taj",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://beyondtaj.com",
              "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://beyondtaj.com"}/icon.png`,
              "description": "Honest India trip planning for foreign travelers. Skip the tourist traps. Avoid the scams. Get a tested itinerary built by people who know India — starting at $40.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            })
          }}
        />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
