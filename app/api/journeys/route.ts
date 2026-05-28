import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const journey = await prisma.journey.create({
      data: {
        days: body.days,
        travelStyle: body.travelStyle,
        residency: body.residency,
        startLocation: body.startLocation,
        landscapes: body.landscapes,
        destinations: body.destinations,
        customerName: body.customerName || "Anonymous",
        customerEmail: body.customerEmail || "anonymous@example.com",
      }
    });
    
    return NextResponse.json(journey);
  } catch (error) {
    console.error('Error creating journey:', error);
    return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 });
  }
}
