import { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { DailySummaryEmail } from "./templates/daily-summary";
import { SpecialSightingEmail } from "./templates/special-sighting";
import { WelcomeEmail } from "./templates/welcome";

// ============================================================================
// Data Fetching Functions
// ============================================================================

interface DailySummaryData {
  newPicturesCount: number;
  birdTypesCount: number;
  mostPopularBird: string | null;
  timeline: Array<{ time: string; species: string; imageUrl: string }>;
  gallery: Array<{ id: string; imageUrl: string; species: string }>;
  date: Date;
}

export const fetchDailySummaryData = async (
  supabase: SupabaseClient
): Promise<DailySummaryData> => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  // Get new pictures from last 24 hours
  const { data: newImages, error: imagesError } = await supabase
    .from("images")
    .select("id, image_url, taken_on")
    .gte("taken_on", yesterday.toISOString())
    .lt("taken_on", todayStart.toISOString())
    .order("taken_on", { ascending: false });

  if (imagesError) throw imagesError;

  const imageIds = (newImages || []).map((img) => img.id);

  if (imageIds.length === 0) {
    return {
      newPicturesCount: 0,
      birdTypesCount: 0,
      mostPopularBird: null,
      timeline: [],
      gallery: [],
      date: yesterday,
    };
  }

  // Get attributions for these images
  const { data: attributions, error: attribError } = await supabase
    .from("attributions")
    .select("image_id, species, confidence")
    .in("image_id", imageIds)
    .order("confidence", { ascending: false });

  if (attribError) throw attribError;

  // Count bird types
  const speciesCount = new Map<string, number>();
  (attributions || []).forEach((attr) => {
    const count = speciesCount.get(attr.species) || 0;
    speciesCount.set(attr.species, count + 1);
  });

  const birdTypesCount = speciesCount.size;

  // Find most popular bird
  let mostPopularBird: string | null = null;
  let maxCount = 0;
  speciesCount.forEach((count, species) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularBird = species;
    }
  });

  // Create timeline (chronological order with top species per image)
  const timeline = (newImages || [])
    .slice(0, 8) // Limit to 8 for email readability
    .map((img) => {
      const imgAttribution = (attributions || [])
        .filter((a) => a.image_id === img.id)
        .sort((a, b) => b.confidence - a.confidence)[0];

      return {
        time: new Date(img.taken_on).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        species: imgAttribution?.species || "Unknown",
        imageUrl: img.image_url,
      };
    });

  // Create gallery (best images with attributions)
  const gallery = (newImages || [])
    .slice(0, 6) // Limit to 6 for gallery
    .map((img) => {
      const imgAttribution = (attributions || [])
        .filter((a) => a.image_id === img.id)
        .sort((a, b) => b.confidence - a.confidence)[0];

      return {
        id: img.id,
        imageUrl: img.image_url,
        species: imgAttribution?.species || "Unknown",
      };
    });

  return {
    newPicturesCount: imageIds.length,
    birdTypesCount,
    mostPopularBird,
    timeline,
    gallery,
    date: yesterday,
  };
};

// ============================================================================
// Email Sending Functions
// ============================================================================

export const sendDailySummaryEmail = async (
  to: string,
  supabase: SupabaseClient,
  resend: Resend
) => {
  const summaryData = await fetchDailySummaryData(supabase);

  const { data, error } = await resend.emails.send({
    from: "ChirpChirp Daily <joe@louiza.xyz>",
    to,
    subject: `Your Daily Bird Summary - ${summaryData.newPicturesCount} New Sightings!`,
    react: DailySummaryEmail(summaryData),
  });

  if (error) throw error;
  return data;
};

export const sendSpecialSightingEmail = async (
  to: string,
  species: string,
  imageUrl: string,
  confidence: number,
  resend: Resend
) => {
  const { data, error } = await resend.emails.send({
    from: "ChirpChirp Alerts <joe@louiza.xyz>",
    to,
    subject: `🎉 New Species Alert: ${species} spotted!`,
    react: SpecialSightingEmail({ species, imageUrl, confidence }),
  });

  if (error) throw error;
  return data;
};

export const sendWelcomeEmail = async (
  to: string,
  name: string | undefined,
  resend: Resend
) => {
  const { data, error } = await resend.emails.send({
    from: "ChirpChirp <joe@louiza.xyz>",
    to,
    subject: "Welcome to ChirpChirp! 🐦",
    react: WelcomeEmail({ name }),
  });

  if (error) throw error;
  return data;
};
