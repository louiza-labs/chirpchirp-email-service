import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name?: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => {
  const greeting = name ? `Hi ${name}` : "Hi there";

  return (
    <Html>
      <Head />
      <Preview>
        Welcome to ChirpChirp - Your bird watching journey begins!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerEmoji}>🐦</Text>
            <Heading style={h1}>Welcome to ChirpChirp!</Heading>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greetingStyle}>{greeting}! 👋</Text>

            <Text style={paragraph}>
              Thank you for subscribing to ChirpChirp email updates! We're
              excited to share the wonderful world of birds with you.
            </Text>

            <Text style={paragraph}>
              You're now signed up to receive notifications about:
            </Text>

            <Section style={featureList}>
              <div style={featureItem}>
                <Text style={featureIcon}>📊</Text>
                <div>
                  <Text style={featureTitle}>Daily Summaries</Text>
                  <Text style={featureDescription}>
                    Get a beautiful recap of all bird sightings, species counts,
                    and a gallery of the day's best photos
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <Text style={featureIcon}>🎉</Text>
                <div>
                  <Text style={featureTitle}>Special Sightings</Text>
                  <Text style={featureDescription}>
                    Be the first to know when we spot a new species for the very
                    first time
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <Text style={featureIcon}>📸</Text>
                <div>
                  <Text style={featureTitle}>Activity Highlights</Text>
                  <Text style={featureDescription}>
                    See timelines of bird activity and discover when your
                    feathered friends are most active
                  </Text>
                </div>
              </div>
            </Section>

            <Text style={paragraph}>
              We'll send you a daily summary each morning (when there's
              activity!) and instant alerts when we spot something special.
            </Text>

            <Button style={button} href="https://chirpchirp.app">
              View Your Dashboard
            </Button>
          </Section>

          {/* Tips Section */}
          <Section style={tipsSection}>
            <Text style={tipsTitle}>🌟 Pro Tips</Text>
            <Text style={tipText}>
              • Check your camera angles and battery regularly for best results
            </Text>
            <Text style={tipText}>
              • Early morning and late afternoon typically have the most
              activity
            </Text>
            <Text style={tipText}>
              • Keep feeders filled to attract more diverse species
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            Questions or feedback? Just reply to this email - we'd love to hear
            from you!
          </Text>
          <Text style={footer}>
            Happy bird watching! 🐦
            <br />
            The ChirpChirp Team
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

const header = {
  backgroundColor: "#4f46e5",
  padding: "40px",
  textAlign: "center" as const,
};

const headerEmoji = {
  fontSize: "64px",
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

const greetingStyle = {
  fontSize: "20px",
  color: "#333",
  fontWeight: "600",
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "16px",
  color: "#555",
  lineHeight: "24px",
  marginBottom: "16px",
};

const featureList = {
  margin: "24px 0",
};

const featureItem = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  alignItems: "flex-start",
};

const featureIcon = {
  fontSize: "32px",
  margin: "0",
};

const featureTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 8px 0",
};

const featureDescription = {
  fontSize: "14px",
  color: "#666",
  lineHeight: "20px",
  margin: "0",
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
  margin: "24px auto",
};

const tipsSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 40px 24px",
};

const tipsTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
  margin: "0 0 16px 0",
};

const tipText = {
  fontSize: "14px",
  color: "#555",
  lineHeight: "20px",
  margin: "0 0 8px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "30px 40px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
  padding: "0 40px",
  textAlign: "center" as const,
  marginBottom: "12px",
};

export default WelcomeEmail;
