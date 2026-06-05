import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { journeyId } = await req.json();

    if (!journeyId) {
      return NextResponse.json({ error: 'Missing journeyId' }, { status: 400 });
    }

    const journey = await prisma.journey.findUnique({
      where: { id: journeyId }
    });

    if (!journey) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
    }

    const destinationIds = (journey.destinations || []) as string[];
    const unorderedDestinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds } },
      select: { id: true, name: true }
    });
    
    // Sort destinations back to original sequence
    const destinationsMap = new Map(unorderedDestinations.map(d => [d.id, d.name]));
    const destinationNames = destinationIds.map(id => destinationsMap.get(id)).filter(Boolean);

    // Call Gemini directly using REST API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = `You are a luxury Indian travel expert. Create a luxurious, highly curated itinerary for a ${journey.days} day trip to ${destinationNames.join(', ')} in India.

Return ONLY a valid JSON object matching this exact TypeScript interface, with no markdown formatting or backticks:

interface ItineraryResponse {
  tripSummary: string; // A beautiful 2-3 sentence overview of the vibe
  dailyItinerary: {
    day: number;
    location: string; // e.g. "Delhi", "Agra", "Jaipur"
    morningActivity: string;
    afternoonActivity: string;
    eveningActivity: string;
    accommodationVibe: string; // e.g. "Heritage Haveli", "5-Star Palace"
  }[];
  hiddenGems: string[]; // 3-4 highly specific, non-touristy recommendations
  antiScamTips: string[]; // 2-3 essential security tips for these specific locations
}

The dailyItinerary array must have exactly ${journey.days} items. Keep activity descriptions highly descriptive and luxurious but concise (1-2 sentences max).`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API Error:", err);
      throw new Error("Failed to generate itinerary with AI");
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("No content generated");
    }

    const parsedItinerary = JSON.parse(resultText);

    return NextResponse.json(parsedItinerary);

  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
