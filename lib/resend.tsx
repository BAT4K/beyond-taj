import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReceiptEmailTemplate } from '@/components/emails/ReceiptEmail';
import { AdminNotificationEmailTemplate } from '@/components/emails/AdminNotificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(journey: any, price: number) {
  const adminEmails = process.env.ADMIN_EMAILS;
  
  if (!adminEmails) {
    console.warn("ADMIN_EMAILS not set. Skipping admin notification.");
    return;
  }

  const emails = adminEmails.split(',').map(email => email.trim());

  const destinationsList = typeof journey?.destinations === 'string' ? journey.destinations : JSON.stringify(journey?.destinations);

  try {
    const htmlString = await render(
      <AdminNotificationEmailTemplate journey={journey} price={price} />
    );

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Beyond Taj <onboarding@resend.dev>",
      to: emails,
      subject: `New Blueprint Purchased (${journey.days} Days) - Beyond Taj`,
      html: htmlString,
      text: `New Purchase Alert\n\nName: ${journey.customerName}\nEmail: ${journey.customerEmail}\nWhatsApp: ${journey.customerWhatsapp}\n\nDuration: ${journey.days} days\nStyle: ${journey.travelStyle}\nDestinations: ${destinationsList}\n\nPrice Collected: $${price}`,
    });
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}

export async function sendCustomerReceipt(customerEmail: string, customerName: string, destination: string, days: number, price: number) {
  try {
    const htmlString = await render(
      <ReceiptEmailTemplate 
        customerName={customerName || 'Traveler'} 
        destination={destination} 
        days={days} 
        price={price} 
      />
    );

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Beyond Taj <onboarding@resend.dev>",
      to: customerEmail,
      subject: "Your Beyond Taj Journey: Itinerary in Progress",
      html: htmlString,
      text: `Dear ${customerName || 'Traveler'},\n\nThank you for trusting Beyond Taj. We have successfully received your payment of $${price}.\n\nOur concierge specialists are currently reviewing your preferences and curating your bespoke itinerary. We will personally deliver your complete blueprint shortly.\n\nPurchase Summary:\nDestination: ${destination}\nDuration: ${days} Days\nTotal Paid: $${price}\n\nWarm regards,\nThe Beyond Taj Team`,
    });
  } catch (error) {
    console.error("Failed to send customer receipt email", error);
  }
}
