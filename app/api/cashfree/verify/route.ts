import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const { order_id, journeyId } = await request.json();
    
    if (!order_id || !journeyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isTest = (process.env.CASHFREE_APP_ID || '').startsWith('TEST');
    const baseUrl = isTest ? 'https://sandbox.cashfree.com' : 'https://api.cashfree.com';

    const res = await fetch(`${baseUrl}/pg/orders/${order_id}`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch order from Cashfree" }, { status: res.status });
    }

    const orderData = await res.json();

    // order_status can be PAID, ACTIVE, EXPIRED, etc.
    if (orderData.order_status === 'PAID') {
      const journey = await prisma.journey.update({
        where: { id: journeyId },
        data: { status: 'completed' }
      });
      
      // Fire admin notification securely in the background
      if (journey.customerEmail) {
        // We don't await this so it doesn't block the webhook response
        sendAdminNotification(journey.customerEmail, journey.days, orderData.order_amount).catch(err => {
          console.error("Failed to trigger admin notification", err);
        });
      }

      return NextResponse.json({ success: true, status: 'completed' });
    }

    return NextResponse.json({ success: false, status: orderData.order_status });
  } catch (error: any) {
    console.error("Cashfree verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
