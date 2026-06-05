import { NextResponse } from 'next/server';
import { Cashfree } from "cashfree-pg";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const { journeyId, customerEmail, customerName, whatsappNumber } = body;

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

    if (whatsappNumber) {
      const sanitized = whatsappNumber.replace(/\D/g, '');
      if (sanitized.length < 7 || sanitized.length > 15) {
        return NextResponse.json({ error: "Invalid WhatsApp number" }, { status: 400 });
      }
    }

    // Securely link the journey to the authenticated user BEFORE payment initialization
    await prisma.journey.update({
      where: { id: journeyId },
      data: {
        // @ts-ignore
        userId: session.user.id,
        customerName: customerName,
        customerEmail: customerEmail,
        ...(whatsappNumber && { customerWhatsapp: whatsappNumber.replace(/\D/g, '') })
      },
    });

    // Explicit Billing Country Logic
    // Use the explicit user selection from the frontend to determine pricing tier.
    // Calculate price dynamically based on journey duration securely on the server
    const isLongJourney = journey.days >= 14;
    
    let orderAmount = 3400; // Base rate: ~$40 USD
    
    if (journey.residency === 'India') {
      orderAmount = 249; // Domestic India pricing
    } else {
      orderAmount = isLongJourney ? 6375 : 3400; // Static INR conversion for international users (~$75 or ~$40)
    }
    
    const orderCurrency = "INR";

    const requestBody = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: `${journeyId.replace(/-/g, "")}_${Date.now()}`,
      customer_details: {
        customer_id: journeyId,
        customer_name: customerName || journey.customerName || "Anonymous",
        customer_email: customerEmail || journey.customerEmail || "anonymous@example.com",
        customer_phone: whatsappNumber ? whatsappNumber.replace(/\D/g, '') : "+19999999999"
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
