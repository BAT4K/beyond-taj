import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Font,
} from '@react-email/components';

interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export const MagicLinkEmailTemplate = ({
  url,
  host,
}: MagicLinkEmailProps) => {
  // Use a public absolute URL for the logo in development, otherwise construct from host
  const logoUrl = host.includes('localhost') 
    ? 'https://raw.githubusercontent.com/BAT4K/beyond-taj/main/public/logo.svg' 
    : `https://${host}/logo.svg`;

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
      <Preview>Sign in to your Beyond Taj Blueprint</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src={logoUrl}
              width="60"
              alt="Beyond Taj Emblem"
              style={{ ...logo, height: 'auto' }}
            />
            <Heading style={heading}>Beyond Taj</Heading>
          </Section>
          
          <Hr style={divider} />
          
          <Section style={bodySection}>
            <Text style={text}>
              A secure login request was made for <strong>{host}</strong>.
            </Text>
            <Text style={subtext}>
              Click the button below to securely access your travel blueprints. This link expires in 24 hours and can only be used once.
            </Text>
            
            <Section style={buttonContainer}>
              <Link href={url} style={button}>
                Authenticate & Enter
              </Link>
            </Section>
            
            <Text style={securityText}>
              If you didn't request this email, you can safely ignore it. Your blueprints remain protected.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicLinkEmailTemplate;

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

const text = {
  color: '#f5f0e8',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
};

const subtext = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  margin: '0 0 40px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: 'rgba(201,169,110,0.1)',
  border: '1px solid rgba(201,169,110,0.4)',
  borderRadius: '2px',
  color: '#c9a96e',
  fontSize: '12px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
};

const securityText = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '12px',
  lineHeight: '18px',
  textAlign: 'center' as const,
  margin: '40px 0 0',
  fontStyle: 'italic',
};
