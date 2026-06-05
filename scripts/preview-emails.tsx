import fs from 'fs';
import path from 'path';
import { render } from '@react-email/render';
import React from 'react';
import MagicLinkEmailTemplate from '../components/emails/MagicLinkEmail';
import ReceiptEmailTemplate from '../components/emails/ReceiptEmail';
import AdminNotificationEmailTemplate from '../components/emails/AdminNotificationEmail';

async function generatePreviews() {
  console.log("Rendering emails...");

  // 1. Magic Link
  const magicLinkHtml = await render(
    <MagicLinkEmailTemplate url="http://localhost:3000/api/auth/callback/email?token=123" host="localhost:3000" />
  );

  // 2. Receipt
  const receiptHtml = await render(
    <ReceiptEmailTemplate customerName="Jessica Smith" destination="Leh, Ladakh & Jaipur" days={14} price={40} />
  );

  // 3. Admin Notification
  const mockJourney = {
    customerName: "Jessica Smith",
    customerEmail: "jessica@example.com",
    customerWhatsapp: "+1 555-0192",
    residency: "International",
    days: 14,
    travelStyle: "Fast & Ambitious",
    startLocation: "New Delhi",
    landscapes: ["Mountains", "Deserts"],
    destinations: ["Leh", "Jaipur"]
  };
  const adminHtml = await render(
    <AdminNotificationEmailTemplate journey={mockJourney} price={40} />
  );

  // Write to public folder
  const publicDir = path.join(process.cwd(), 'public');
  
  fs.writeFileSync(path.join(publicDir, 'preview-magic-link.html'), magicLinkHtml);
  fs.writeFileSync(path.join(publicDir, 'preview-receipt.html'), receiptHtml);
  fs.writeFileSync(path.join(publicDir, 'preview-admin.html'), adminHtml);

  console.log("✅ Successfully generated email previews in public folder.");
}

generatePreviews().catch(console.error);
