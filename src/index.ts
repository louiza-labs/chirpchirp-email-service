import { createClient } from "@supabase/supabase-js";
import { Elysia } from "elysia";
import { Resend } from "resend";
import {
  sendDailySummaryEmail,
  sendSpecialSightingEmail,
  sendWelcomeEmail,
} from "./email-service";

// ============================================================================
// Setup
// ============================================================================

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// ============================================================================
// API Routes
// ============================================================================

const app = new Elysia()
  // Health check
  .get("/", () => ({ status: "ok", service: "email-service" }))

  // Send daily summary email
  .post("/send/daily-summary", async ({ body }) => {
    try {
      const { email } = body as { email: string };

      if (!email) {
        return {
          error: "Email is required",
          status: 400,
        };
      }

      const result = await sendDailySummaryEmail(email, supabase, resend);

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Error sending daily summary:", error);
      return {
        error: "Failed to send daily summary email",
        status: 500,
      };
    }
  })

  // Send special sighting email
  .post("/send/special-sighting", async ({ body }) => {
    try {
      const { email, species, imageUrl, confidence } = body as {
        email: string;
        species: string;
        imageUrl: string;
        confidence: number;
      };

      if (!email || !species) {
        return {
          error: "Email and species are required",
          status: 400,
        };
      }

      const result = await sendSpecialSightingEmail(
        email,
        species,
        imageUrl,
        confidence,
        resend
      );

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Error sending special sighting email:", error);
      return {
        error: "Failed to send special sighting email",
        status: 500,
      };
    }
  })

  // Send welcome email when user subscribes
  .post("/send/welcome", async ({ body }) => {
    try {
      const { email, name } = body as { email: string; name?: string };

      if (!email) {
        return {
          error: "Email is required",
          status: 400,
        };
      }

      const result = await sendWelcomeEmail(email, name, resend);

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return {
        error: "Failed to send welcome email",
        status: 500,
      };
    }
  })

  // Trigger daily summary for all subscribers
  .post("/trigger/daily-summaries", async () => {
    try {
      // Fetch all email subscribers
      const { data: subscribers, error } = await supabase
        .from("email_subscriptions")
        .select("email")
        .eq("is_active", true)
        .eq("daily_summary_enabled", true);

      if (error) throw error;

      if (!subscribers || subscribers.length === 0) {
        return {
          success: true,
          message: "No active subscribers found",
          count: 0,
        };
      }

      // Send emails to all subscribers
      const results = await Promise.allSettled(
        subscribers.map((sub) =>
          sendDailySummaryEmail(sub.email, supabase, resend)
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      return {
        success: true,
        total: subscribers.length,
        successful,
        failed,
      };
    } catch (error) {
      console.error("Error triggering daily summaries:", error);
      return {
        error: "Failed to trigger daily summaries",
        status: 500,
      };
    }
  })

  .listen(8080);

console.log(
  `🦊 Email Service is running at ${app.server?.hostname}:${app.server?.port}`
);
