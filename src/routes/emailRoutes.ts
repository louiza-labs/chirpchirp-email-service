import { subscribeUser } from "../actions/subscribe";
import {
  sendDailySummaryEmail,
  sendSpecialSightingEmail,
} from "../email-service";
import { resend } from "../services/resend";
import { supabase } from "../services/supabase";
import { handleError } from "../utils/handleError";

export const emailRoutes = (app: any) =>
  app
    .post("/send/daily-summary", async () => {
      try {
        const { data: subscribers, error } = await supabase
          .from("email_subscriptions")
          .select("email")
          .eq("is_active", true)
          .eq("daily_summary_enabled", true);

        if (error) throw error;
        if (!subscribers?.length)
          return { success: true, message: "No active subscribers" };

        const results = await Promise.allSettled(
          subscribers.map((s) =>
            sendDailySummaryEmail(s.email, supabase, resend)
          )
        );

        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.length - successful;

        return { success: true, total: subscribers.length, successful, failed };
      } catch (err) {
        return handleError(err as string, "Failed to send daily summary");
      }
    })
    .post("/send/special-sighting", async ({ body }: any) => {
      try {
        const { species, imageUrl, confidence } = body;
        if (!species) return { error: "Species is required", status: 400 };

        // Fetch all active subscribers
        const { data: subscribers, error } = await supabase
          .from("email_subscriptions")
          .select("email")
          .eq("is_active", true);

        if (error) throw error;
        if (!subscribers?.length)
          return { success: true, message: "No active subscribers" };

        // Send to all subscribers
        const results = await Promise.allSettled(
          subscribers.map((s) =>
            sendSpecialSightingEmail(
              s.email,
              species,
              imageUrl,
              confidence,
              resend
            )
          )
        );

        const successful = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.length - successful;

        return { success: true, total: subscribers.length, successful, failed };
      } catch (err) {
        return handleError(
          err as string,
          "Failed to send special sighting email"
        );
      }
    })
    .post(
      "/subscribe",
      async ({ body }: { body: { email: string; name?: string } }) => {
        try {
          const { email, name } = body;
          if (!email) return { error: "Email required", status: 400 };
          const result = await subscribeUser(email, name);
          return { success: true, ...result };
        } catch (err) {
          return handleError(err as string, "Failed to subscribe user");
        }
      }
    )
    .post(
      "/unsubscribe",
      async ({ body }: { body: { email: string; name?: string } }) => {
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
      }
    );
