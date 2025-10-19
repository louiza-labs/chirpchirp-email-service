# ChirpChirp Email Service

A microservice for sending beautiful, dynamic emails for bird watching notifications.

## Features

- 📊 **Daily Summary Emails** - Gorgeous recaps with stats, timelines, and photo galleries
- 🎉 **Special Sighting Alerts** - Instant notifications for first-time species sightings
- 👋 **Welcome Emails** - Beautiful onboarding for new subscribers
- ⚡ **Built with Elysia + Bun** - Fast and modern TypeScript framework
- 📧 **Resend Integration** - Professional email delivery
- 🎨 **React Email Templates** - Beautiful, responsive email designs

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `RESEND_API_KEY` - Your Resend API key ([Get one here](https://resend.com))

### 3. Set Up Email Subscriptions Table

Create the `email_subscriptions` table in your Supabase database:

```sql
CREATE TABLE email_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  daily_summary_enabled BOOLEAN DEFAULT true,
  special_sighting_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_email_subscriptions_active ON email_subscriptions(is_active);
```

### 4. Configure Resend Domain

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `chirpchirp.app`)
3. Add the DNS records they provide
4. Update the `from` addresses in `src/email-service.ts` to use your domain

### 5. Run the Service

```bash
bun run dev
```

The service will start on `http://localhost:3001`

## API Endpoints

### Health Check

```bash
GET /
```

### Send Daily Summary Email

```bash
POST /send/daily-summary
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Send Special Sighting Email

```bash
POST /send/special-sighting
Content-Type: application/json

{
  "email": "user@example.com",
  "species": "Blue Jay",
  "imageUrl": "https://...",
  "confidence": 0.95
}
```

### Send Welcome Email

```bash
POST /send/welcome
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Trigger Daily Summaries for All Subscribers

```bash
POST /trigger/daily-summaries
```

This endpoint fetches all active subscribers with daily summaries enabled and sends them their personalized daily recap.

## Email Templates

All email templates are built with React Email and located in `src/templates/`:

- `daily-summary.tsx` - Daily bird activity recap with stats and gallery
- `special-sighting.tsx` - New species alert with celebration design
- `welcome.tsx` - Onboarding email for new subscribers

### Preview Templates Locally

```bash
cd src/templates
email dev
```

This will start a preview server at `http://localhost:3000` where you can see all your email templates.

## Scheduled Jobs

To send daily summaries automatically, set up a cron job or use a service like:

### Option 1: Cron Job

```bash
0 8 * * * curl -X POST http://localhost:3001/trigger/daily-summaries
```

### Option 2: GitHub Actions

Create `.github/workflows/daily-email.yml`:

```yaml
name: Send Daily Email Summaries
on:
  schedule:
    - cron: "0 8 * * *" # 8 AM UTC daily
  workflow_dispatch:

jobs:
  send-emails:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email Service
        run: |
          curl -X POST ${{ secrets.EMAIL_SERVICE_URL }}/trigger/daily-summaries
```

### Option 3: Supabase Edge Function

Use Supabase's pg_cron to trigger the endpoint daily.

## Integration with Other Services

### From Core API Service

When a new attribution is created and it's a first-time species, call:

```typescript
// After inserting attribution
const isFirstTimeSighting = await checkIfFirstTimeSighting(species);

if (isFirstTimeSighting) {
  await fetch("http://email-service:3001/send/special-sighting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      species: attribution.species,
      imageUrl: image.image_url,
      confidence: attribution.confidence,
    }),
  });
}
```

## Architecture

```
email-service/
├── src/
│   ├── index.ts              # Main Elysia app with API routes
│   ├── email-service.ts      # Email sending logic and data fetching
│   └── templates/            # React Email templates
│       ├── daily-summary.tsx
│       ├── special-sighting.tsx
│       └── welcome.tsx
```

## Technology Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Email Provider**: Resend
- **Email Templates**: React Email
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Troubleshooting

### Emails not sending

- Check your Resend API key is valid
- Verify your domain is verified in Resend
- Check the logs for error messages

### Images not loading in emails

- Ensure image URLs are publicly accessible
- Check if URLs use HTTPS
- Verify Supabase storage permissions

### Template styling issues

- Test templates using `email dev` locally
- Check that inline styles are being applied
- Remember email clients have limited CSS support

## Production Deployment

1. Deploy to a hosting service (Railway, Fly.io, etc.)
2. Set environment variables in production
3. Update your domain references in templates
4. Set up monitoring and error tracking
5. Configure scheduled jobs for daily summaries

## License

MIT
