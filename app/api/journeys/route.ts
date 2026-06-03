import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redis = redisUrl ? Redis.fromEnv() : null;

export async function POST(request: Request) {
  try {
    if (redis) {
      const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
      const windowSeconds = 3600; // 1 hour
      const maxRequests = 20; // Increased from 3 to accommodate regular user testing
      
      const key = `ratelimit_journeys_v2_${ip}`;
      const requests = await redis.incr(key);
      
      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }
      
      if (requests > maxRequests) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    } else {
      console.warn('UPSTASH_REDIS_REST_URL is not set. Bypassing rate limiter.');
    }

    const body = await request.json();
    
    const journey = await prisma.journey.create({
      data: {
        days: body.days,
        travelStyle: body.companions ? `${body.travelStyle} | ${body.companions}` : body.travelStyle,
        residency: body.residency,
        startLocation: body.startLocation,
        landscapes: body.landscapes,
        destinations: body.destinations,
        customerName: body.customerName || "Anonymous",
        customerEmail: body.customerEmail || "anonymous@example.com",
      }
    });
    
    return NextResponse.json(journey);
  } catch (error: unknown) {
    console.error('Error creating journey:', error);
    return NextResponse.json({ error: 'Failed to create journey' }, { status: 500 });
  }
}
