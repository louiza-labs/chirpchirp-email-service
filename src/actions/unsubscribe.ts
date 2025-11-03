import { supabase } from "../services/supabase";

export async function subscribeUser(email: string, name?: string) {
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
}
