import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Font,
} from '@react-email/components';

interface ReceiptEmailProps {
  customerName: string;
  destination: string;
  days: number;
  price: number;
}

export const ReceiptEmailTemplate = ({
  customerName,
  destination,
  days,
  price,
}: ReceiptEmailProps) => {
  // Use a public URL for the logo
  const logoUrl = 'https://raw.githubusercontent.com/BAT4K/beyond-taj/main/public/logo.svg';

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Playfair Display"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PweEOvB1h1U.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
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
      <Preview>Your Beyond Taj Journey Begins</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src={logoUrl}
              width="60"
              height="60"
              alt="Beyond Taj Emblem"
              style={logo}
            />
            <Heading style={heading}>Beyond Taj</Heading>
          </Section>
          
          <Hr style={divider} />
          
          <Section style={bodySection}>
            <Text style={greeting}>
              Dear {customerName},
            </Text>
            
            <Text style={text}>
              Thank you for trusting Beyond Taj with your expedition. We have successfully received your payment of <strong>${price}</strong>.
            </Text>
            
            <Text style={highlightText}>
              Our concierge specialists are currently reviewing your preferences and curating your bespoke itinerary. We will personally deliver your complete blueprint shortly.
            </Text>
            
            <Container style={summaryBox}>
              <Text style={summaryTitle}>Purchase Summary</Text>
              <Hr style={summaryDivider} />
              <Section>
                <Text style={summaryRow}>
                  <strong style={summaryLabel}>Destination:</strong> {destination}
                </Text>
                <Text style={summaryRow}>
                  <strong style={summaryLabel}>Duration:</strong> {days} Days
                </Text>
                <Text style={summaryRow}>
                  <strong style={summaryLabel}>Total Paid:</strong> ${price}
                </Text>
              </Section>
            </Container>
            
            <Text style={signoff}>
              Warm regards,<br/>
              <span style={{ color: '#c9a96e' }}>The Beyond Taj Team</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ReceiptEmailTemplate;

const main = {
  backgroundColor: '#0a0806',
  color: '#ffffff',
  fontFamily: 'Inter, Helvetica, sans-serif',
  padding: '40px 0',
};

const container = {
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '560px',
};

const headerSection = {
  textAlign: 'center' as const,
  paddingBottom: '20px',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const heading = {
  fontFamily: '"Playfair Display", Georgia, serif',
  fontSize: '28px',
  fontWeight: '400',
  letterSpacing: '0.1em',
  color: '#c9a96e',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};

const divider = {
  borderColor: 'rgba(255,255,255,0.1)',
  margin: '20px 0',
};

const bodySection = {
  padding: '20px 0',
};

const greeting = {
  color: '#f5f0e8',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '0 0 24px',
};

const text = {
  color: 'rgba(255,255,255,0.8)',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px',
};

const highlightText = {
  color: '#c9a96e',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 32px',
  fontStyle: 'italic',
};

const summaryBox = {
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(201,169,110,0.2)',
  borderRadius: '4px',
  padding: '24px',
  marginBottom: '32px',
};

const summaryTitle = {
  color: '#c9a96e',
  fontSize: '14px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const summaryDivider = {
  borderColor: 'rgba(201,169,110,0.2)',
  margin: '0 0 16px',
};

const summaryRow = {
  color: 'rgba(255,255,255,0.9)',
  fontSize: '15px',
  margin: '8px 0',
};

const summaryLabel = {
  color: 'rgba(255,255,255,0.5)',
  fontWeight: 'normal',
  display: 'inline-block',
  width: '100px',
};

const signoff = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};
