export const config = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
  resendKey: process.env.RESEND_API_KEY!,
  port: Number(process.env.PORT) || 8080,
};
