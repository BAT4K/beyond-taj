import { NextResponse } from 'next/server';
import {
  validateDestinationCount,
  validateExtremeDistance,
  estimateBudgetRange
} from '@/lib/routingEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedDays, travelStyle, destinationIds } = body;

    if (
      typeof selectedDays !== 'number' ||
      typeof travelStyle !== 'string' ||
      !Array.isArray(destinationIds)
    ) {
      return NextResponse.json(
        { error: 'Invalid payload: required fields are selectedDays (number), travelStyle (string), and destinationIds (string[])' },
        { status: 400 }
      );
    }

    const warnings: string[] = [];

    const countWarning = validateDestinationCount(selectedDays, destinationIds.length);
    if (countWarning) {
      warnings.push(countWarning);
    }

    const distanceWarning = await validateExtremeDistance(destinationIds, selectedDays);
    if (distanceWarning) {
      warnings.push(distanceWarning);
    }

    const isValid = warnings.length === 0;

    return NextResponse.json({
      isValid,
      warnings
    });
  } catch (error) {
    console.error('Validation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
