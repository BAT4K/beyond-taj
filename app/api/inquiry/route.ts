import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { sendAdminNotification, sendCustomerInquiryEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { journeyId, customerName, customerEmail, customerWhatsapp, specificInterests } = body;
    
    if (!journeyId || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: customerEmail } });

    const journey = await prisma.journey.update({
      where: { id: journeyId },
      data: { 
        status: 'inquiry_submitted',
        customerName: customerName || "Anonymous",
        customerEmail: customerEmail,
        customerWhatsapp: customerWhatsapp || null,
        specificInterests: specificInterests || null,
        ...(user ? { User: { connect: { id: user.id } } } : {})
      }
    });
    
    // Fire admin notification securely in the background
    // Pass '0' for price since this is just an inquiry now
    sendAdminNotification(journey, 0).catch(err => {
      console.error("Failed to trigger admin notification", err);
    });
    
    sendCustomerInquiryEmail(
      customerEmail, 
      customerName || "Anonymous", 
      "India", // General destination
      journey.days
    ).catch(err => {
      console.error("Failed to trigger customer notification", err);
    });

    return NextResponse.json({ success: true, status: 'inquiry_submitted' });
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
