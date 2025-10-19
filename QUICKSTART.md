# Email Service - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Set Up Environment Variables

Create a `.env` file in the `app` directory:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Resend API Key - Get free key at https://resend.com
RESEND_API_KEY=re_your_api_key_here
```

### 2. Set Up Database

Run the setup SQL in your Supabase SQL editor:

```bash
# Copy the contents of setup.sql and run it in Supabase SQL Editor
```

Or use the Supabase CLI:

```bash
supabase db push --file setup.sql
```

### 3. Configure Resend (Optional but Recommended)

**For Testing (Free):**

- Sign up at [resend.com](https://resend.com)
- Get your API key from the dashboard
- Use the default `onboarding@resend.dev` sender (works immediately, no domain needed)
- Update the `from` addresses in `src/email-service.ts` to use `onboarding@resend.dev`

**For Production:**

1. Add your domain in Resend dashboard
2. Add DNS records they provide
3. Wait for verification (usually instant)
4. Update `from` addresses to use your domain (e.g., `alerts@chirpchirp.app`)

### 4. Start the Service

```bash
bun run dev
```

The service will start on **http://localhost:3001**

### 5. Test It Out

Send a welcome email:

```bash
curl -X POST http://localhost:3001/send/welcome \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "name": "Your Name"}'
```

Send a special sighting alert:

```bash
curl -X POST http://localhost:3001/send/special-sighting \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "species": "Blue Jay",
    "imageUrl": "https://example.com/image.jpg",
    "confidence": 0.95
  }'
```

## 📧 Preview Email Templates

Want to see how the emails look before sending?

```bash
bun run preview-emails
```

This opens a browser at `http://localhost:3000` with live preview of all templates!

## 🔗 Integration Examples

### From your Core API Service

```typescript
// When a new user signs up for email alerts
await fetch("http://localhost:3001/send/welcome", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: user.email,
    name: user.name,
  }),
});

// When detecting a first-time species
await fetch("http://localhost:3001/send/special-sighting", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: user.email,
    species: "Northern Cardinal",
    imageUrl: image.image_url,
    confidence: 0.96,
  }),
});
```

### Schedule Daily Summaries

Add to your cron or scheduler:

```bash
# Run at 8 AM daily
curl -X POST http://localhost:3001/trigger/daily-summaries
```

## 🎨 Customizing Email Templates

All templates are in `src/templates/` and use React Email components.

1. Edit the `.tsx` files
2. Run `bun run preview-emails` to see changes live
3. Refresh to see updates

## 📊 Email Subscriptions

Add subscribers to your database:

```sql
INSERT INTO email_subscriptions (email, name, is_active, daily_summary_enabled, special_sighting_enabled)
VALUES ('user@example.com', 'John Doe', true, true, true);
```

Or via Supabase client in your core API.

## 🐛 Troubleshooting

**Emails not sending?**

- Check your Resend API key is valid
- For testing, use `onboarding@resend.dev` as sender
- Check logs for errors

**Can't connect to Supabase?**

- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check if tables exist (run setup.sql)

**Type errors?**

- Run `bun install` to ensure all deps are installed
- Check that tsconfig.json has `"jsx": "react"`

## 📦 What's Included

- **3 Beautiful Email Templates:**
  - Daily Summary (stats, timeline, gallery)
  - Special Sighting (new species celebration)
  - Welcome Email (onboarding)

- **5 API Endpoints:**
  - `GET /` - Health check
  - `POST /send/daily-summary` - Send daily recap
  - `POST /send/special-sighting` - Alert for new species
  - `POST /send/welcome` - Onboarding email
  - `POST /trigger/daily-summaries` - Send to all subscribers

- **Database Setup:**
  - Email subscriptions table
  - Email logs for tracking
  - Helper functions

## 🚢 Ready for Production

When deploying:

1. Set up environment variables in your hosting platform
2. Verify your domain with Resend
3. Update `from` email addresses to use your domain
4. Set up scheduled job for daily summaries
5. Monitor email logs table for delivery issues

## 💡 Pro Tips

- Use `email_logs` table to track sent emails and debug issues
- Test templates with real data using the preview server
- Keep image URLs public and use HTTPS for email compatibility
- Consider adding unsubscribe links for production

---

**Need help?** Check the full README.md for detailed documentation!
