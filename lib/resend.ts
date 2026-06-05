import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(customerEmail: string, days: number, price: number) {
  const adminEmails = process.env.ADMIN_EMAILS;
  
  if (!adminEmails) {
    console.warn("ADMIN_EMAILS not set. Skipping admin notification.");
    return;
  }

  const emails = adminEmails.split(',').map(email => email.trim());

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Beyond Taj <hello@beyondtaj.com>",
      to: emails,
      subject: `New Blueprint Purchased (${days} Days) - Beyond Taj`,
      html: `
        <div style="font-family: sans-serif; background-color: #0a0806; color: #fff; padding: 40px;">
          <h2 style="color: #c9a96e; letter-spacing: 1px; font-weight: normal;">New Purchase Alert</h2>
          <p style="color: rgba(255,255,255,0.7); font-size: 16px;">A new blueprint has been securely purchased.</p>
          
          <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 4px; border-left: 2px solid #c9a96e; margin-top: 20px;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${days} days</p>
            <p style="margin: 5px 0;"><strong>Price Collected:</strong> $${price}</p>
          </div>
        </div>
      `,
      text: `New Purchase Alert\n\nCustomer: ${customerEmail}\nDuration: ${days} days\nPrice Collected: $${price}`,
    });
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}
