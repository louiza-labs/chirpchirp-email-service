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

  // Send daily summary email to all active subscribers
  .post("/send/daily-summary", async ({ body }) => {
    try {
      // Fetch all active daily summary subscribers
      const { data: emailsList, error: dbError } = await supabase
        .from("email_subscriptions")
        .select("email")
        .eq("is_active", true)
        .eq("daily_summary_enabled", true);

      if (dbError) {
        console.error("Database error:", dbError);
        return {
          error: "Failed to fetch subscribers",
          status: 500,
        };
      }

      if (!emailsList || emailsList.length === 0) {
        return {
          success: true,
          message: "No active subscribers found",
          count: 0,
        };
      }

      // Send emails to all subscribers
      const emailPromises = emailsList.map((subscriber) =>
        sendDailySummaryEmail(subscriber.email, supabase, resend)
      );

      const emailResults = await Promise.allSettled(emailPromises);

      const successful = emailResults.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failed = emailResults.filter((r) => r.status === "rejected").length;

      console.log("Daily summary results:", {
        total: emailsList.length,
        successful,
        failed,
      });

      return {
        success: true,
        total: emailsList.length,
        successful,
        failed,
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

  // Handle Subscriptions
  .post("/subscribe", async ({ body }) => {
    try {
      const { email, name } = body as { email: string; name?: string };
      console.log("the email, name", { email, name });

      if (!email) {
        return {
          error: "Email is required",
          status: 400,
        };
      }

      // Insert/update subscriber in database with error checking
      // Note: email column has UNIQUE constraint, so duplicates are prevented
      const { data: subscription, error: dbError } = await supabase
        .from("email_subscriptions")
        .upsert({
          email,
          name,
          is_active: true, // Ensure resubscribes are set to active
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        return {
          error: "Failed to add subscription",
          status: 500,
        };
      }

      // Send welcome email
      const result = await sendWelcomeEmail(email, name, resend);

      return {
        success: true,
        messageId: result.id,
        subscriptionId: subscription.id,
      };
    } catch (error) {
      console.error("Error in subscribe endpoint:", error);
      return {
        error: "Failed to process subscription",
        status: 500,
      };
    }
  })

  // Handle Unsubscribe
  .post("/unsubscribe", async ({ body }) => {
    try {
      const { email } = body as { email: string };

      if (!email) {
        return {
          error: "Email is required",
          status: 400,
        };
      }

      // Set user as inactive instead of deleting (maintains audit trail)
      const { data: subscription, error: dbError } = await supabase
        .from("email_subscriptions")
        .update({ is_active: false })
        .eq("email", email)
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        return {
          error: "Failed to unsubscribe",
          status: 500,
        };
      }

      if (!subscription) {
        return {
          error: "Email not found in subscriptions",
          status: 404,
        };
      }

      return {
        success: true,
        message: "Successfully unsubscribed",
        email: subscription.email,
      };
    } catch (error) {
      console.error("Error in unsubscribe endpoint:", error);
      return {
        error: "Failed to process unsubscribe",
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

  .listen(Number(process.env.PORT) || 8080);

console.log(
  `🦊 Email Service is running at ${app.server?.hostname}:${app.server?.port}`
);
