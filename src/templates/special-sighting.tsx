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
        🎉 New species alert! We just spotted a {species} for the first time!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with celebration */}
          <Section style={celebrationBanner}>
            <Text style={celebrationEmoji}>🎉🐦✨</Text>
            <Heading style={h1}>New Species Spotted!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <div style={badge}>
              <Text style={badgeText}>FIRST TIME SIGHTING</Text>
            </div>

            <Heading style={speciesName}>{species}</Heading>

            <Img src={imageUrl} alt={species} style={mainImage} />

            <Section style={infoBox}>
              <div style={infoItem}>
                <Text style={infoLabel}>Confidence</Text>
                <Text style={infoValue}>{confidencePercent}%</Text>
              </div>
              <div style={infoDivider} />
              <div style={infoItem}>
                <Text style={infoLabel}>Status</Text>
                <Text style={infoValue}>New Species! 🆕</Text>
              </div>
            </Section>

            <Text style={description}>
              This is the first time we've identified a{" "}
              <strong>{species}</strong> in your camera feed! This is an
              exciting addition to your bird watching collection.
            </Text>

            <Button style={button} href="https://chirpchirp.app/gallery">
              View Full Gallery
            </Button>
          </Section>

          {/* Fun Facts Section */}
          <Section style={funFactSection}>
            <Text style={funFactTitle}>🔍 Did You Know?</Text>
            <Text style={funFactText}>
              Each new species you spot adds to the biodiversity record of your
              area. Keep watching to see what other visitors drop by!
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this email because you have special sighting alerts
            enabled. We'll notify you whenever we spot a new species for the
            first time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const celebrationBanner = {
  backgroundColor: "#4f46e5",
  padding: "40px",
  textAlign: "center" as const,
};

const celebrationEmoji = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const contentSection = {
  padding: "40px",
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
  color: "#333",
  fontSize: "36px",
  fontWeight: "bold",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const mainImage = {
  width: "100%",
  maxWidth: "520px",
  height: "auto",
  borderRadius: "12px",
  marginBottom: "24px",
};

const infoBox = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "24px",
};

const infoItem = {
  textAlign: "center" as const,
  flex: 1,
};

const infoLabel = {
  fontSize: "12px",
  color: "#666",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const infoValue = {
  fontSize: "20px",
  color: "#333",
  fontWeight: "bold",
  margin: "0",
};

const infoDivider = {
  width: "1px",
  height: "40px",
  backgroundColor: "#e5e7eb",
};

const description = {
  fontSize: "16px",
  color: "#555",
  lineHeight: "24px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 32px",
  margin: "0 auto",
};

const funFactSection = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 40px",
};

const funFactTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#166534",
  margin: "0 0 12px 0",
};

const funFactText = {
  fontSize: "14px",
  color: "#166534",
  lineHeight: "20px",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 40px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 40px",
  textAlign: "center" as const,
};

export default SpecialSightingEmail;
