import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import prisma from '@/lib/prisma';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ItineraryResponse {
  tripSummary: string;
  dailyItinerary: {
    day: number;
    location: string;
    morningActivity: string;
    afternoonActivity: string;
    eveningActivity: string;
    accommodationVibe: string;
  }[];
  hiddenGems: string[];
  antiScamTips: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { journeyId } = body;

    if (!journeyId) {
      return NextResponse.json(
        { error: 'Invalid payload: required field is journeyId' },
        { status: 400 }
      );
    }

    // Fetch Journey from DB
    const journey = await prisma.journey.findUnique({
      where: { id: journeyId }
    });

    if (!journey) {
      return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
    }

    // Fetch destinations to get their names
    const destinationIds = journey.destinations as string[];
    const dbDestinations = await prisma.destination.findMany({
      where: { id: { in: destinationIds } }
    });

    // Map IDs to names in the same order
    const destinationNames = destinationIds.map(id => {
      const dest = dbDestinations.find((d: any) => d.id === id);
      return dest?.name || id;
    });

    const selectedDays = journey.days;
    const travelStyle = journey.travelStyle;
    const selectedLandscapes = journey.landscapes;
    const travelMonth = (journey as any).travelMonth || 'October'; // FIXED: Extracted from DB
    const residency = journey.residency;
    const startLocation = journey.startLocation;
    const estimatedBudget = "Premium/Luxury";

    // Feature Flag: Flip this in your .env file to toggle between Live and Mock
    const useMock = process.env.USE_MOCK_AI === 'true';

    let itinerary: ItineraryResponse;

    if (!useMock) {
      // --- LIVE GEMINI 2.5 FLASH MODE ---
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          tripSummary: { type: Type.STRING },
          dailyItinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                location: { type: Type.STRING },
                morningActivity: { type: Type.STRING },
                afternoonActivity: { type: Type.STRING },
                eveningActivity: { type: Type.STRING },
                accommodationVibe: { type: Type.STRING },
              },
              required: ["day", "location", "morningActivity", "afternoonActivity", "eveningActivity", "accommodationVibe"]
            }
          },
          hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
          antiScamTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["tripSummary", "dailyItinerary", "hiddenGems", "antiScamTips"]
      };

      // FIXED PROMPT: Removed contradictions and updated constraints cleanly
      const prompt = `You are an elite, luxury travel specialist for "Beyond Taj", curating bespoke Indian journeys. 
Create a highly detailed, day-by-day itinerary based strictly on these parameters:
- Duration: ${selectedDays} days
- Travel Month: ${travelMonth}
- Travel Style: ${travelStyle}
- Destinations: ${destinationNames.join(', ')}
- Preferred Landscapes: ${selectedLandscapes?.join(', ') || 'Any'}
- Estimated Budget: ${estimatedBudget}

[TRAVELER PROFILE CONTEXT]
- Origin Point: ${startLocation}
- Traveler Type: ${residency}

[STRICT GENERATION DIRECTIVES FOR TRANSIT & LOGISTICS]
1. If Traveler Type is "International", you MUST dedicate Day 1 to "Arrival, International Airport Smooth Landing, and Jetlag Calibration". Explicitly recommend the optimal major entry hub airport in India relative to their selected cities and their origin at ${startLocation}.
2. If Traveler Type is "India", assume zero long-haul flight fatigue. Day 1 should optimize for immediate domestic regional flights or luxury private vehicle transfers originating smoothly from ${startLocation}.
3. In the final "Logistical Checklist" section of the output, dynamically generate specific luxury transfer requirements.

Your response must be entirely structured JSON matching the requested schema. Ensure pacing makes geographical sense. Include destination-specific luxury experiences, highly actionable local insider advice, and pragmatic anti-scam tips.

STRICT FORMATTING RULES:
Output pure text inside JSON values. Do not use markdown notation, formatting syntax, or emojis. Do not use dollar signs for wrapping mathematical code or text formatting; use the dollar sign ($) exclusively for standard currency representation.

ACCOMMODATION & TRANSIT PROTOCOLS:
If the user remains in the same city for consecutive days, the accommodationVibe must read exactly 'Same property as previous night'. For transit days between cities, the morning/afternoon entries must explicitly detail high-end transfer logistics, and the accommodationVibe must update to reflect the new arrival city's destination.`;

      let response;
      let retries = 0;
      const maxRetries = 5;
      let lastError;

      while (retries < maxRetries) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
            }
          });
          break;
        } catch (err: any) {
          lastError = err;
          const errorMessage = String(err.message || '');
          if (err.status === 503 || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
            retries++;
            if (retries < maxRetries) {
              const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
              console.log(`Gemini API 503 High Demand. Retrying in ${Math.round(delay)}ms...`);
              await new Promise(res => setTimeout(res, delay));
              continue;
            }
          }
          throw err;
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error("No response generated from Gemini");
      }

      itinerary = JSON.parse(response.text);

    } else {
      // --- SMART DYNAMIC MOCK MODE ---
      // Simulates network latency for testing loading spinners
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Dynamically build the daily itinerary loop to match the exact duration requested
      const dynamicDays = Array.from({ length: selectedDays }, (_, i) => {
        const dayNum = i + 1;
        const currentCity = destinationNames[Math.min(Math.floor(i / 2), destinationNames.length - 1)] || "Udaipur";

        return {
          day: dayNum,
          location: currentCity,
          morningActivity: dayNum === 1
            ? "Private chauffeur airport transfer with VIP heritage welcome reception."
            : `Curated private guided excursion exploring the historic highlights of ${currentCity}.`,
          afternoonActivity: "Bespoke culinary masterclass or fine art workshop with local masters.",
          eveningActivity: "Private sunset boat charter followed by an exclusive rooftop dining experience.",
          accommodationVibe: dayNum % 2 === 0 ? "Same property as previous night" : `Luxury boutique heritage estate in ${currentCity}`
        };
      });

      itinerary = {
        tripSummary: `A meticulously tailored ${selectedDays}-day journey across ${destinationNames.join(', ')} configured perfectly for a ${travelStyle} experience during the month of ${travelMonth}.`,
        dailyItinerary: dynamicDays,
        hiddenGems: [
          "A beautifully preserved, historic stepwell completely missed by standard tour groups.",
          "An exclusive multi-generational textile workshop tucked away inside the artisan quarter."
        ],
        antiScamTips: [
          "Verify all private transit drivers possess our official brand dispatch confirmation documentation.",
          "Politely refuse unsolicited boutique or gem showroom detours recommended by external city couriers."
        ]
      };
    }

    // Save generated itinerary to DB and update status
    await prisma.journey.update({
      where: { id: journeyId },
      data: {
        itinerary: itinerary as any,
        status: "completed"
      }
    });

    return NextResponse.json(itinerary);
  } catch (error: any) {
    console.error('Generation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary', details: String(error) },
      { status: 500 }
    );
  }
}