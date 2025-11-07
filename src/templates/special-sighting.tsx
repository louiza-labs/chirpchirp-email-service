import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SpecialSightingEmailProps {
  species: string;
  imageUrl: string;
  confidence: number;
}

export const SpecialSightingEmail = ({
  species,
  imageUrl,
  confidence,
}: SpecialSightingEmailProps) => {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Html>
      <Head />
      <Preview>
        ChirpChirp alert • First-time sighting confirmed: {species}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with celebration */}
          <Section style={celebrationSection}>
            <div style={celebrationBanner}>
              <Text style={celebrationEmoji}>🎉🐦✨</Text>
              <Heading style={h1}>First-time visitor confirmed</Heading>
              <Text style={celebrationCopy}>
                Our classifiers just verified a brand-new species in your
                feed. Take a closer look and log the sighting while the details
                are fresh.
              </Text>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <div style={badge}>
              <Text style={badgeText}>FIRST TIME SIGHTING</Text>
            </div>

            <Heading style={speciesName}>{species}</Heading>

            <Text style={leadInText}>
              Captured in crisp detail and validated with high confidence. We
              saved the original file so you can tag it or share it with your
              local birding community.
            </Text>

            <Img src={imageUrl} alt={species} style={mainImage} />

            <Section style={infoBox}>
              <div style={infoItem}>
                <Text style={infoLabel}>Confidence</Text>
                <Text style={infoValue}>{confidencePercent}%</Text>
              </div>
              <div style={infoDivider} />
              <div style={infoItem}>
                <Text style={infoLabel}>Status</Text>
                <Text style={infoValue}>New to your catalog 🆕</Text>
              </div>
            </Section>

            <Text style={description}>
              Add notes, confirm the location, or mark the sighting as a
              favorite. Every interaction helps ChirpChirp fine-tune alerts for
              future visitors.
            </Text>

            <Button style={button} href="https://chirpchirp.app/gallery">
              Review this sighting
            </Button>
          </Section>

          {/* Fun Facts Section */}
          <Section style={funFactSection}>
            <Text style={funFactTitle}>🔍 Field note</Text>
            <Text style={funFactText}>
              Each confirmed addition enriches the biodiversity record for your
              area. Log a short note so you can track migration patterns over
              time.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this alert because first-time sightings are enabled
            in your ChirpChirp notifications. Update your alert cadence anytime
            from settings.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#eef2f7",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 0 56px",
  marginBottom: "64px",
  maxWidth: "640px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 14px 36px rgba(15, 23, 42, 0.08)",
  overflow: "hidden" as const,
};

const celebrationSection = {
  padding: "0 48px 32px",
};

const celebrationBanner = {
  background: "linear-gradient(135deg, #4338ca, #7c3aed)",
  padding: "40px 48px",
  textAlign: "center" as const,
  borderRadius: "16px",
};

const celebrationEmoji = {
  fontSize: "48px",
  margin: "0 0 20px 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "30px",
  fontWeight: "700",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const celebrationCopy = {
  color: "#e0e7ff",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
};

const contentSection = {
  padding: "0 48px",
};

const badge = {
  backgroundColor: "#fef3c7",
  border: "2px solid #fbbf24",
  borderRadius: "20px",
  display: "inline-block",
  padding: "8px 16px",
  marginBottom: "20px",
};

const badgeText = {
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0",
};

const speciesName = {
  color: "#1f2937",
  fontSize: "34px",
  fontWeight: "700",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const leadInText = {
  fontSize: "16px",
  color: "#4b5563",
  lineHeight: "26px",
  textAlign: "center" as const,
  margin: "0 0 28px 0",
};

const mainImage = {
  width: "100%",
  maxWidth: "520px",
  height: "auto",
  borderRadius: "14px",
  marginBottom: "28px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
};

const infoBox = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  border: "1px solid #e2e8f0",
};

const infoItem = {
  textAlign: "center" as const,
  flex: 1,
};

const infoLabel = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const infoValue = {
  fontSize: "22px",
  color: "#1f2937",
  fontWeight: "700",
  margin: "0",
};

const infoDivider = {
  width: "1px",
  height: "40px",
  backgroundColor: "#e5e7eb",
};

const description = {
  fontSize: "16px",
  color: "#4b5563",
  lineHeight: "26px",
  marginBottom: "28px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4338ca",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 32px",
  margin: "0 auto",
  boxShadow: "0 10px 24px rgba(67, 56, 202, 0.35)",
};

const funFactSection = {
  backgroundColor: "#f1f5f9",
  border: "1px solid #dbeafe",
  borderRadius: "12px",
  padding: "28px",
  margin: "0 48px",
};

const funFactTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1d4ed8",
  margin: "0 0 12px 0",
};

const funFactText = {
  fontSize: "14px",
  color: "#1e3a8a",
  lineHeight: "22px",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "36px 48px 24px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  padding: "0 48px",
  textAlign: "center" as const,
};

export default SpecialSightingEmail;
