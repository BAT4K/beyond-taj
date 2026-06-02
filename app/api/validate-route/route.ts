import { NextResponse } from 'next/server';
import { evaluateTripFeasibility } from '@/lib/routingEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      selectedDays, 
      travelStyle, 
      travelMonth,
      residency,
      startLocation,
      destinationIds,
      selectedLandscapes,
      companions
    } = body;

    if (
      typeof selectedDays !== 'number' ||
      typeof travelStyle !== 'string' ||
      !Array.isArray(destinationIds) ||
      destinationIds.length === 0
    ) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Call the Intelligence Graph Engine
    const result = await evaluateTripFeasibility(
      destinationIds,
      selectedDays,
      travelMonth || 'October', // Fallback
      travelStyle,
      residency || 'International', // Fallback
      startLocation || 'Delhi',
      selectedLandscapes,
      companions
    );

    return NextResponse.json({
      isValid: result.isValid,
      score: result.score, 
      warnings: result.warnings,
      optimalPath: result.optimalPath
    });
  } catch (error: unknown) {
    console.error('Validation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
