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
      <Preview>ChirpChirp • Your birding updates are ready to take flight</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <div style={headerCard}>
              <Text style={headerEmoji}>🐦</Text>
              <Heading style={h1}>Welcome to ChirpChirp</Heading>
              <Text style={headerCopy}>
                A smarter way to monitor your feeders, discover new visitors,
                and stay organized with polished photo digests.
              </Text>
            </div>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greetingStyle}>{greeting}! 👋</Text>

            <Text style={paragraph}>
              Thanks for subscribing to ChirpChirp updates. We&apos;ll pair the
              insights from your cameras with handcrafted summaries so you can
              celebrate every visit without sifting through raw footage.
            </Text>

            <Text style={paragraph}>Here&apos;s what to expect:</Text>

            <Section style={featureList}>
              <div style={featureItem}>
                <div>
                  <Text style={featureTitle}>Daily Summaries</Text>
                  <Text style={featureDescription}>
                    Receive a polished digest each morning with standout photos,
                    species totals, and quick links back to your dashboard.
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <div>
                  <Text style={featureTitle}>Special Sightings</Text>
                  <Text style={featureDescription}>
                    Get instant alerts when our models confirm a first-time
                    visitor, complete with confidence ratings and imagery.
                  </Text>
                </div>
              </div>

              <div style={featureItem}>
                <div>
                  <Text style={featureTitle}>Activity Highlights</Text>
                  <Text style={featureDescription}>
                    Track peak feeding windows and view curated timelines to
                    understand how activity shifts throughout the week.
                  </Text>
                </div>
              </div>
            </Section>

            <Text style={paragraph}>
              We&apos;ll send a daily round-up when there&apos;s activity and prompt
              alerts when something rare appears so you never miss a moment.
            </Text>

            <Button style={button} href="https://chirpchirp-ui.vercel.app/">
              Visit your dashboard
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            Questions or feedback? Reply directly to this email — we&apos;re always
            listening.
          </Text>
          <Text style={footer}>
            Happy bird watching! 🐦
            <br />The ChirpChirp Team
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
  boxShadow: "0 14px 36px rgba(15, 23, 42, 0.06)",
  overflow: "hidden" as const,
};

const headerSection = {
  padding: "0 48px 32px",
};

const headerCard = {
  background: "linear-gradient(135deg, #4338ca, #6366f1)",
  padding: "40px 48px",
  textAlign: "center" as const,
  borderRadius: "16px",
};

const headerEmoji = {
  fontSize: "64px",
  margin: "0 0 20px 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const headerCopy = {
  color: "#e0e7ff",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
};

const contentSection = {
  padding: "0 48px",
};

const greetingStyle = {
  fontSize: "20px",
  color: "#1f2937",
  fontWeight: "600",
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "16px",
  color: "#4b5563",
  lineHeight: "26px",
  marginBottom: "18px",
};

const featureList = {
  margin: "28px 0",
};

const featureItem = {
  display: "flex",
  gap: "20px",
  columnGap: "8px",
  marginBottom: "24px",
  alignItems: "flex-start",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "20px 24px",
  border: "1px solid #e2e8f0",
};

const featureIcon = {
  fontSize: "32px",
  margin: "0",
};

const featureTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const featureDescription = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "22px",
  margin: "0",
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
  margin: "28px auto",
  boxShadow: "0 12px 28px rgba(67, 56, 202, 0.32)",
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
  borderColor: "#e5e7eb",
  margin: "36px 48px 24px",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  padding: "0 48px",
  textAlign: "center" as const,
  marginBottom: "12px",
};

export default WelcomeEmail;
