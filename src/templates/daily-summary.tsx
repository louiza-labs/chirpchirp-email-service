import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DailySummaryEmailProps {
  newPicturesCount: number;
  birdTypesCount: number;
  mostPopularBird: string | null;
  timeline: Array<{ time: string; species: string; imageUrl: string }>;
  gallery: Array<{ id: string; imageUrl: string; species: string }>;
  date: Date;
}

const chunkArray = <T,>(array: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const DailySummaryEmail = ({
  newPicturesCount,
  birdTypesCount,
  mostPopularBird,
  timeline,
  gallery,
  date,
}: DailySummaryEmailProps) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const galleryRows = chunkArray(gallery, 2);

  return (
    <Html>
      <Head />
      <Preview>
        ChirpChirp daily briefing • {String(newPicturesCount)} photos • {String(
          birdTypesCount
        )} species logged
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={heroSection}>
            <div style={heroCard}>
              <Heading style={h1}>ChirpChirp Daily Briefing</Heading>
              <Text style={heroDate}>{formattedDate}</Text>
              <Text style={introText}>
                A concise, client-ready overview of everything your feeders
                captured today. Review headline stats, scroll the activity
                timeline, and bookmark standout photos without leaving your
                inbox.
              </Text>
            </div>
          </Section>

          {/* Quick Stats */}
          <Section style={statsWrapper}>
            <Row style={statsRow}>
              <Column style={statColumn}>
                <Text style={statEyebrow}>New imagery</Text>
                <Text style={statNumber}>{newPicturesCount}</Text>
                <Text style={statLabel}>Fresh photos captured</Text>
              </Column>
              <Column style={statColumn}>
                <Text style={statEyebrow}>Biodiversity</Text>
                <Text style={statNumber}>{birdTypesCount}</Text>
                <Text style={statLabel}>Distinct species observed</Text>
              </Column>
              <Column style={{ ...statColumn, borderRight: "none" }}>
                <Text style={statEyebrow}>Trending species</Text>
                <Text style={statHighlight}>
                  {mostPopularBird || "No clear front-runner today"}
                </Text>
                <Text style={statLabel}>Based on sightings volume</Text>
              </Column>
            </Row>
          </Section>

          {/* Summary Callouts */}
          <Section style={calloutSection}>
            <Heading style={h2}>Today&apos;s highlights</Heading>
            <Text style={calloutBody}>
              Start with what matters: peaks in activity, biodiversity trends,
              and any follow-up tasks to keep your monitoring on track.
            </Text>
            <ul style={calloutList}>
              <li style={calloutListItem}>
                Keep tabs on new species arrivals to update your observation log
                or share with your team.
              </li>
              <li style={calloutListItem}>
                Use the curated gallery to save assets for upcoming reports or
                social highlights.
              </li>
              <li style={calloutListItem}>
                Follow the timeline for context around peak feeder traffic and
                automation triggers.
              </li>
            </ul>
          </Section>

          <Hr style={hr} />

          {/* Timeline Section */}
          {timeline.length > 0 && (
            <>
              <Heading style={h2}>📅 Activity timeline</Heading>
              <Section style={timelineSection}>
                {timeline.map((item, index) => (
                  <Row key={index} style={timelineRow}>
                    <Column style={timelineDetails}>
                      <Text style={timelineTime}>{item.time}</Text>
                      <Text style={timelineSpecies}>{item.species}</Text>
                      <Text style={timelineCaption}>
                        Captured by ChirpChirp vision. Open the dashboard clip
                        for full motion and metadata.
                      </Text>
                    </Column>
                    <Column style={timelineImageColumn}>
                      <Img
                        src={item.imageUrl}
                        alt={item.species}
                        style={timelineImage}
                      />
                    </Column>
                  </Row>
                ))}
              </Section>

              <Hr style={hr} />
            </>
          )}

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <>
              <Heading style={h2}>🖼️ Curated gallery</Heading>
              <Section style={gallerySection}>
                {galleryRows.map((row, rowIndex) => (
                  <Row key={rowIndex} style={galleryRow}>
                    {row.map((item) => (
                      <Column key={item.id} style={galleryColumn}>
                        <div style={galleryCard}>
                          <Img
                            src={item.imageUrl}
                            alt={item.species}
                            style={galleryImage}
                          />
                          <Text style={galleryCaption}>{item.species}</Text>
                          <Text style={gallerySubCaption}>
                            Auto-tagged and saved in your media library
                          </Text>
                        </div>
                      </Column>
                    ))}
                    {row.length === 1 && <Column style={galleryColumn} />}
                  </Row>
                ))}
              </Section>
            </>
          )}

          {/* No Activity Message */}
          {newPicturesCount === 0 && (
            <Section style={noActivitySection}>
              <Text style={noActivityText}>
                It was a quiet day on the feeders. We'll send a fresh round-up
                as soon as new visitors appear. 🌤️
              </Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this briefing because daily summaries are enabled in
            your ChirpChirp profile. Update your preferences anytime to tailor
            what lands in your inbox.
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
  padding: "32px 0 48px",
  marginBottom: "64px",
  maxWidth: "640px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.05)",
  overflow: "hidden" as const,
};

const h1 = {
  color: "#0f172a",
  fontSize: "30px",
  fontWeight: "700",
  margin: "0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px",
  padding: "0 48px",
};

const heroSection = {
  padding: "0",
};

const heroCard = {
  background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
  padding: "40px 32px 48px",
  borderRadius: "16px 16px 0 0",
  textAlign: "center" as const,
};

const heroDate = {
  color: "#4338ca",
  fontSize: "13px",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: "12px 0 16px",
};

const introText = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
};

const statsWrapper = {
  padding: "0 32px",
  marginTop: "-32px",
};

const statsRow = {
  backgroundColor: "#ffffff",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  width: "100%",
};

const statColumn = {
  padding: "24px 20px",
  textAlign: "left" as const,
  borderRight: "1px solid #e2e8f0",
  width: "33.33%",
};

const statEyebrow = {
  color: "#6366f1",
  fontSize: "12px",
  letterSpacing: "0.6px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
  fontWeight: "600",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "0 0 6px",
};

const statHighlight = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 6px",
};

const statLabel = {
  fontSize: "13px",
  color: "#64748b",
  margin: "0",
  lineHeight: "20px",
};

const calloutSection = {
  padding: "32px 48px 0",
};

const calloutBody = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const calloutList: React.CSSProperties = {
  margin: "0",
  padding: "0 0 0 20px",
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "22px",
};

const calloutListItem: React.CSSProperties = {
  marginBottom: "10px",
};

const timelineSection = {
  padding: "0 24px",
};

const timelineRow = {
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  marginBottom: "16px",
  overflow: "hidden",
};

const timelineDetails = {
  padding: "18px 20px",
  backgroundColor: "#f8fafc",
};

const timelineTime = {
  fontSize: "13px",
  color: "#4338ca",
  margin: "0 0 6px",
  fontWeight: "600",
};

const timelineSpecies = {
  fontSize: "16px",
  color: "#0f172a",
  margin: "0 0 6px",
  fontWeight: "600",
};

const timelineCaption = {
  fontSize: "12px",
  color: "#64748b",
  margin: "0",
  lineHeight: "18px",
};

const timelineImageColumn = {
  width: "120px",
  padding: "0",
  backgroundColor: "#ffffff",
  textAlign: "center" as const,
};

const timelineImage = {
  width: "120px",
  height: "120px",
  objectFit: "cover" as const,
  display: "block",
  borderLeft: "1px solid #e2e8f0",
};

const gallerySection = {
  padding: "0 32px",
};

const galleryRow = {
  marginBottom: "16px",
};

const galleryColumn = {
  padding: "0 8px",
  width: "50%",
};

const galleryCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  padding: "16px",
  textAlign: "center" as const,
};

const galleryImage = {
  width: "100%",
  height: "auto",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
};

const galleryCaption = {
  fontSize: "14px",
  color: "#0f172a",
  margin: "12px 0 4px",
  fontWeight: "600",
};

const gallerySubCaption = {
  fontSize: "12px",
  color: "#64748b",
  margin: "0",
  lineHeight: "18px",
};

const noActivitySection = {
  padding: "40px",
  textAlign: "center" as const,
};

const noActivityText = {
  fontSize: "16px",
  color: "#64748b",
  fontStyle: "italic" as const,
  lineHeight: "26px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 48px",
};

const footer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "20px",
  padding: "0 48px",
  textAlign: "center" as const,
};

export default DailySummaryEmail;
