import { sendWelcomeEmail } from "../email-service";
import { resend } from "../services/resend";
import { supabase } from "../services/supabase";

export async function subscribeUser(email: string, name?: string) {
  const { data: subscription, error } = await supabase
    .from("email_subscriptions")
    .upsert({ email, name, is_active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const result = await sendWelcomeEmail(email, name, resend);
  return { subscriptionId: subscription.id, messageId: result.id };
}
