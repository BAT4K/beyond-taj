import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

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
  financialOverview: string;
}

import prisma from '@/lib/prisma';

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
      const dest = dbDestinations.find(d => d.id === id);
      return dest?.name || id;
    });

    const selectedDays = journey.days;
    const travelStyle = journey.travelStyle;
    const selectedLandscapes = journey.landscapes;
    const estimatedBudget = "Premium/Luxury"; // Or calculate based on style

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
        hiddenGems: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        antiScamTips: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        financialOverview: { type: Type.STRING }
      },
      required: ["tripSummary", "dailyItinerary", "hiddenGems", "antiScamTips", "financialOverview"]
    };

    const prompt = `You are an elite, luxury travel specialist for "Beyond Taj", curating bespoke Indian journeys. 
Create a detailed, day-by-day itinerary based strictly on the following parameters:
- Duration: ${selectedDays} days
- Travel Style: ${travelStyle}
- Destinations: ${destinationNames.join(', ')}
- Preferred Landscapes: ${selectedLandscapes?.join(', ') || 'Any'}
- Estimated Budget: ${estimatedBudget || 'Not specified'}

Your response must be entirely in structured JSON matching the requested schema. Ensure the pacing is realistic, the locations make geographical sense, and the activities align with the ${travelStyle} aesthetic. Include specific, non-generic hidden gems and pragmatic anti-scam tips relevant to the selected destinations.
Include a 'Financial Investment Overview' at the end of the itinerary that justifies the user's estimated budget of ${estimatedBudget || 'the selected travel style'}. You MUST format the budget numbers with standard US currency symbols and commas (e.g., if the input is '1050 to 2100', output it as '$1,050 to $2,100'). Break down how this budget aligns with their ${travelStyle} travel style.

STRICT FORMATTING RULES:
You must output pure text. Strictly forbid the use of markdown math delimiters, LaTeX, or dollar signs ($) for wrapping text, altitudes, or N/A values. If a value does not exist (e.g., evening activity on departure day), output the exact string 'None'.
Do not use emojis, special characters, or markdown formatting inside the JSON string values. Time blocks must be exactly 'MORNING', 'AFTERNOON', and 'EVENING' without any leading letters or symbols.

ACCOMMODATION LOGIC:
If the user is staying in the same destination for multiple consecutive days, DO NOT change the hotel/accommodation description. You must either write 'Same property as previous night' or keep the exact same property description. Users should only change accommodations when they change cities.

CRITICAL TRANSIT DAY PROTOCOLS:
- NEVER duplicate an accommodation description across two different days if it involves a transit day. If a day involves major transit (e.g., flying or driving between cities), the accommodation field MUST reflect the arrival city's property.
- For transit days, the Morning and Afternoon blocks MUST specifically detail the luxury transfer logistics (e.g., 'Private chauffeur transfer to airport, VIP lounge access, and scenic arrival drive'). Do not hallucinate activities in the departure city if they are traveling.`;

    // TODO: Restore live Gemini call after billing upgrade
    /*
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
        break; // Success
      } catch (err: any) {
        lastError = err;
        const errorMessage = String(err.message || '');
        if (err.status === 503 || errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE')) {
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
            console.log(`Gemini API 503 High Demand. Retrying in ${Math.round(delay)}ms... (Attempt ${retries}/${maxRetries})`);
            await new Promise(res => setTimeout(res, delay));
            continue;
          }
        }
        throw err; // Not a 503 or out of retries
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("No response generated from Gemini");
    }

    const itinerary: ItineraryResponse = JSON.parse(response.text);
    */

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const itinerary: ItineraryResponse = {
      tripSummary: "A mock luxury journey crafted specifically for your testing purposes. We explore vibrant cultures and historical landmarks with the utmost elegance.",
      dailyItinerary: [
        {
          day: 1,
          location: destinationNames[0] || "Udaipur",
          morningActivity: "Private chauffeur transfer to a heritage hotel with VIP welcome.",
          afternoonActivity: "Guided sunset boat ride on Lake Pichola with champagne.",
          eveningActivity: "Exclusive royal dining experience overlooking the City Palace.",
          accommodationVibe: "Heritage palace hotel with panoramic lake views"
        },
        {
          day: 2,
          location: destinationNames[0] || "Udaipur",
          morningActivity: "Early morning private tour of the City Palace complex.",
          afternoonActivity: "Bespoke miniature painting workshop with a master artist.",
          eveningActivity: "Relax at the hotel spa followed by a private lakeside dinner.",
          accommodationVibe: "Same property as previous night"
        }
      ],
      hiddenGems: [
        "A secret stepwell unknown to most tourists, perfect for photography.",
        "A private textile workshop tucked away in the old city."
      ],
      antiScamTips: [
        "Ignore unauthorized guides at major monuments; your private guide will handle all entry.",
        "Avoid roadside gem vendors claiming to sell antique stones."
      ],
      financialOverview: "Based on the Luxury Explorer tier, this journey is estimated at $1,200 - $1,600, encompassing 5-star accommodations, private transfers, and elite curated experiences."
    };

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
