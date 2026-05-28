import { NextResponse } from 'next/server';
import { Cashfree } from "cashfree-pg";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const cashfree = new Cashfree(
  1, // CFEnvironment.SANDBOX
  process.env.CASHFREE_APP_ID || '',
  process.env.CASHFREE_SECRET_KEY || ''
);
// Make sure to use the API version required by our request payload
cashfree.XApiVersion = "2023-08-01";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to complete checkout." }, { status: 401 });
    }

    const body = await request.json();
    const { journeyId, customerEmail, customerName, region } = body;

    if (!journeyId) {
      return NextResponse.json({ error: "Missing journeyId" }, { status: 400 });
    }

    const journey = await prisma.journey.findUnique({
      where: { id: journeyId }
    });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    if (journey.status === "paid") {
      return NextResponse.json({ error: "Journey is already paid" }, { status: 400 });
    }

    // Securely link the journey to the authenticated user BEFORE payment initialization
    await prisma.journey.update({
      where: { id: journeyId },
      data: {
        // @ts-ignore
        userId: session.user.id,
      },
    });

    // Explicit Billing Country Logic
    // Use the explicit user selection from the frontend to determine pricing tier.
    let orderAmount = 3751;
    
    if (region === 'India') {
      orderAmount = 249;
    } else {
      orderAmount = 3751; // Static INR conversion for international users
    }
    
    const orderCurrency = "INR";

    const requestBody = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: journeyId,
      customer_details: {
        customer_id: journeyId,
        customer_name: customerName || journey.customerName || "Anonymous",
        customer_email: customerEmail || journey.customerEmail || "anonymous@example.com",
        customer_phone: "+19999999999" // placeholder required by Cashfree
      },
      order_meta: {
        // Return URL is required by some payment modes, especially standard checkout
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/${journeyId}?order_id={order_id}`,
      }
    };

    const response = await cashfree.PGCreateOrder(requestBody as any);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Cashfree order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" }, 
      { status: 500 }
    );
  }
}
