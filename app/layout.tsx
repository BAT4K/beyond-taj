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
  title: "Beyond Taj | Bespoke Itinerary",
  description: "Curated, AI-engineered luxury travel itineraries for the discerning explorer.",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col" suppressHydrationWarning>
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
              "description": "Curated, AI-engineered luxury travel itineraries for the discerning explorer.",
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
