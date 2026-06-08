import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Font,
} from '@react-email/components';

interface AdminNotificationProps {
  journey: any;
  price: number;
}

export const AdminNotificationEmailTemplate = ({
  journey,
  price,
}: AdminNotificationProps) => {
  // Format arrays and JSON safely
  const formatList = (val: any) => {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') return val;
    try {
      if (val) return JSON.parse(val).join(', ');
    } catch(e) {}
    return 'Not specified';
  };

  const destinationsList = formatList(journey?.destinations);
  const landscapesList = formatList(journey?.landscapes);

  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>
          {`
            :root {
              color-scheme: light dark;
              supported-color-schemes: light dark;
            }
            body {
              background-color: #0a0806 !important;
            }
          `}
        </style>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={300}
          fontStyle="normal"
        />
      </Head>
      <Preview>New Inquiry Alert: {journey?.days} Days</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Blueprint Inquiry</Heading>
          <Text style={subtitle}>A new customer inquiry has been received.</Text>
          
          <Section style={box}>
            <Text style={boxTitle}>Traveler Details</Text>
            <Text style={row}><strong>Name:</strong> {journey?.customerName || 'N/A'}</Text>
            <Text style={row}><strong>Email:</strong> {journey?.customerEmail}</Text>
            <Text style={row}><strong>WhatsApp:</strong> {journey?.customerWhatsapp || 'Not provided'}</Text>
            <Text style={row}><strong>Residency:</strong> {journey?.residency}</Text>
            <Text style={row}><strong>Specific Interests:</strong> {journey?.specificInterests || 'None'}</Text>
          </Section>

          <Section style={box}>
            <Text style={boxTitle}>Journey Parameters</Text>
            <Text style={row}><strong>Duration:</strong> {journey?.days} days</Text>
            <Text style={row}><strong>Travel Style:</strong> {journey?.travelStyle}</Text>
            <Text style={row}><strong>Start Location:</strong> {journey?.startLocation}</Text>
            <Text style={row}><strong>Landscapes:</strong> {landscapesList}</Text>
            <Text style={row}><strong>Destinations:</strong> {destinationsList}</Text>
          </Section>

          <Section style={priceBox}>
            <Text style={priceText}><strong>Note:</strong> Payment is pending manual WhatsApp outreach.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNotificationEmailTemplate;

const main = {
  backgroundColor: '#0a0806',
  color: '#ffffff',
  fontFamily: 'Inter, Helvetica, sans-serif',
  padding: '40px 0',
};

const container = {
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '600px',
};

const heading = {
  color: '#c9a96e',
  letterSpacing: '1px',
  fontWeight: 'normal' as const,
  marginTop: '0',
  fontSize: '24px',
};

const subtitle = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '16px',
  marginBottom: '30px',
};

const box = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '25px',
  borderRadius: '4px',
  borderLeft: '3px solid #c9a96e',
  marginBottom: '30px',
};

const boxTitle = {
  color: '#c9a96e',
  marginTop: '0',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '16px',
};

const row = {
  margin: '8px 0',
  fontSize: '15px',
  color: 'rgba(255,255,255,0.9)',
};

const priceBox = {
  backgroundColor: 'rgba(201,169,110,0.1)',
  padding: '20px',
  borderRadius: '4px',
  textAlign: 'center' as const,
};

const priceText = {
  margin: '0',
  fontSize: '18px',
  color: '#c9a96e',
};
