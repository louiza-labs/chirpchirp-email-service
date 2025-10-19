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

  return (
    <Html>
      <Head />
      <Preview>
        Your daily bird summary: {String(newPicturesCount)} new pictures,{" "}
        {String(birdTypesCount)} species spotted!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={h1}>🐦 ChirpChirp Daily Summary</Heading>
          <Text>{formattedDate}</Text>

          {/* Quick Stats */}
          <Section style={statsSection}>
            <div style={statBox}>
              <Text style={statNumber}>{newPicturesCount}</Text>
              <Text style={statLabel}>New Pictures</Text>
            </div>
            <div style={statBox}>
              <Text style={statNumber}>{birdTypesCount}</Text>
              <Text style={statLabel}>Bird Species</Text>
            </div>
            <div style={statBox}>
              <Text style={statNumber}>⭐</Text>
              <Text style={statLabel}>{mostPopularBird || "No sightings"}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Timeline Section */}
          {timeline.length > 0 && (
            <>
              <Heading style={h2}>📅 Today's Timeline</Heading>
              <Section style={timelineSection}>
                {timeline.map((item, index) => (
                  <div key={index} style={timelineItem}>
                    <div style={timelineLeft}>
                      <Text style={timelineTime}>{item.time}</Text>
                      <Text style={timelineSpecies}>{item.species}</Text>
                    </div>
                    <Img
                      src={item.imageUrl}
                      alt={item.species}
                      style={timelineImage}
                    />
                  </div>
                ))}
              </Section>

              <Hr style={hr} />
            </>
          )}

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <>
              <Heading style={h2}>🖼️ Today's Gallery</Heading>
              <Section style={gallerySection}>
                {gallery.map((item) => (
                  <div key={item.id} style={galleryItem}>
                    <Img
                      src={item.imageUrl}
                      alt={item.species}
                      style={galleryImage}
                    />
                    <Text style={galleryCaption}>{item.species}</Text>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* No Activity Message */}
          {newPicturesCount === 0 && (
            <Section style={noActivitySection}>
              <Text style={noActivityText}>
                No new bird sightings today. Check back tomorrow! 🌤️
              </Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this email because you subscribed to ChirpChirp
            daily summaries.
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

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  margin: "30px 0 20px",
  padding: "0 40px",
};

const date = {
  color: "#666",
  fontSize: "14px",
  textAlign: "center" as const,
  marginBottom: "30px",
};

const statsSection = {
  display: "flex",
  justifyContent: "space-around",
  padding: "20px 40px",
  gap: "20px",
};

const statBox = {
  textAlign: "center" as const,
  flex: 1,
};

const statNumber = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#4f46e5",
  margin: "0 0 8px 0",
};

const statLabel = {
  fontSize: "14px",
  color: "#666",
  margin: "0",
};

const timelineSection = {
  padding: "0 40px",
};

const timelineItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  padding: "12px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const timelineLeft = {
  flex: 1,
};

const timelineTime = {
  fontSize: "12px",
  color: "#666",
  margin: "0 0 4px 0",
  fontWeight: "500",
};

const timelineSpecies = {
  fontSize: "16px",
  color: "#333",
  margin: "0",
  fontWeight: "600",
};

const timelineImage = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "8px",
};

const gallerySection = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  padding: "0 40px",
};

const galleryItem = {
  textAlign: "center" as const,
};

const galleryImage = {
  width: "100%",
  aspectRatio: "1",
  objectFit: "cover" as const,
  borderRadius: "8px",
};

const galleryCaption = {
  fontSize: "12px",
  color: "#666",
  marginTop: "8px",
};

const noActivitySection = {
  padding: "40px",
  textAlign: "center" as const,
};

const noActivityText = {
  fontSize: "16px",
  color: "#666",
  fontStyle: "italic",
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

export default DailySummaryEmail;
