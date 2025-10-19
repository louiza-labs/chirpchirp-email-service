# Email Service Integration Examples

## Integration with Core API Service

### 1. Send Welcome Email on New Subscription

Add this to your core API when a user subscribes to email notifications:

```typescript
// core-api-service/app/src/index.ts

// Add a new route for email subscription
.post("/subscribe/email", async ({ body }) => {
  try {
    const { email, name } = body as { email: string; name?: string };

    // Insert into subscriptions table
    const { data: subscription, error: subError } = await supabase
      .from("email_subscriptions")
      .insert({
        email,
        name,
        is_active: true,
        daily_summary_enabled: true,
        special_sighting_enabled: true,
      })
      .select()
      .single();

    if (subError) {
      // Handle duplicate email or other errors
      if (subError.code === "23505") {
        return { error: "Email already subscribed", status: 409 };
      }
      throw subError;
    }

    // Send welcome email via email service
    const emailResponse = await fetch("http://localhost:3001/send/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send welcome email");
    }

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error("Error creating email subscription:", error);
    return {
      error: "Failed to create subscription",
      status: 500,
    };
  }
})
```

### 2. Send Special Sighting Email on First-Time Species

Add this to your attribution creation logic:

```typescript
// core-api-service/app/src/index.ts

// Helper function to check if species is first-time sighting
const isFirstTimeSighting = async (species: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from("attributions")
    .select("*", { count: "exact", head: true })
    .eq("species", species);

  if (error) {
    console.error("Error checking species:", error);
    return false;
  }

  return count === 1; // Only 1 means this is the first time
};

// Add after creating a new attribution
.post("/attributions", async ({ body }) => {
  try {
    const { image_id, species, confidence, model_version } = body as {
      image_id: string;
      species: string;
      confidence: number;
      model_version: string;
    };

    // Insert attribution
    const { data: attribution, error } = await supabase
      .from("attributions")
      .insert({
        image_id,
        species,
        confidence,
        model_version,
      })
      .select()
      .single();

    if (error) throw error;

    // Check if this is a first-time sighting
    const isFirstTime = await isFirstTimeSighting(species);

    if (isFirstTime) {
      console.log(`🎉 First time sighting of ${species}!`);

      // Get image details
      const { data: image } = await supabase
        .from("images")
        .select("image_url, user_id")
        .eq("id", image_id)
        .single();

      if (image) {
        // Get all subscribers with special sighting alerts enabled
        const { data: subscribers } = await supabase
          .from("email_subscriptions")
          .select("email")
          .eq("is_active", true)
          .eq("special_sighting_enabled", true);

        // Send special sighting emails
        if (subscribers && subscribers.length > 0) {
          const emailPromises = subscribers.map((sub) =>
            fetch("http://localhost:3001/send/special-sighting", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: sub.email,
                species,
                imageUrl: image.image_url,
                confidence,
              }),
            }).catch((err) =>
              console.error(`Failed to send email to ${sub.email}:`, err)
            )
          );

          await Promise.allSettled(emailPromises);
        }
      }
    }

    return {
      success: true,
      attribution,
      firstTimeSighting: isFirstTime,
    };
  } catch (error) {
    console.error("Error creating attribution:", error);
    return {
      error: "Failed to create attribution",
      status: 500,
    };
  }
})
```

### 3. Schedule Daily Summaries with GitHub Actions

Create `.github/workflows/daily-email.yml`:

```yaml
name: Send Daily Email Summaries

on:
  schedule:
    # Run at 8 AM UTC every day
    - cron: "0 8 * * *"
  # Allow manual trigger
  workflow_dispatch:

jobs:
  send-daily-summaries:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email Service
        run: |
          curl -X POST ${{ secrets.EMAIL_SERVICE_URL }}/trigger/daily-summaries \
            -H "Content-Type: application/json"
        env:
          EMAIL_SERVICE_URL: ${{ secrets.EMAIL_SERVICE_URL }}
```

### 4. Using Supabase Edge Functions

Create a Supabase Edge Function that triggers daily:

```typescript
// supabase/functions/send-daily-emails/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const emailServiceUrl = Deno.env.get("EMAIL_SERVICE_URL");

    const response = await fetch(`${emailServiceUrl}/trigger/daily-summaries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

Then schedule it with `pg_cron` in Supabase:

```sql
-- Schedule daily email at 8 AM
SELECT cron.schedule(
  'send-daily-emails',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/send-daily-emails',
      headers := jsonb_build_object('Content-Type', 'application/json')
    );
  $$
);
```

## Docker Compose Setup

Add the email service to your `docker-compose.yml`:

```yaml
version: "3.8"

services:
  core-api:
    # ... your core api config
    environment:
      EMAIL_SERVICE_URL: http://email-service:3001

  email-service:
    build: ./email-service/app
    ports:
      - "3001:3001"
    environment:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      RESEND_API_KEY: ${RESEND_API_KEY}
    depends_on:
      - core-api

  # Scheduler for daily emails (using Ofelia)
  scheduler:
    image: mcuadros/ofelia:latest
    depends_on:
      - email-service
    command: daemon --docker
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    labels:
      ofelia.job-exec.daily-emails.schedule: "0 0 8 * * *"
      ofelia.job-exec.daily-emails.command: >
        curl -X POST http://email-service:3001/trigger/daily-summaries
```

## Environment Variables for Other Services

Update your core API `.env`:

```bash
# Add this to core-api-service/.env
EMAIL_SERVICE_URL=http://localhost:3001

# Or in production
EMAIL_SERVICE_URL=https://email-service.your-domain.com
```

## Testing Integration Locally

1. Start all services:

```bash
# Terminal 1: Core API
cd core-api-service/app
bun run dev

# Terminal 2: Email Service
cd email-service/app
bun run dev

# Terminal 3: External Media Service
cd external-media-service
bun run dev
```

2. Test the flow:

```bash
# Subscribe to emails
curl -X POST http://localhost:3000/subscribe/email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Manually trigger attribution (which could trigger special sighting)
curl -X POST http://localhost:3000/attributions \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "some-image-id",
    "species": "Rare Bird Species",
    "confidence": 0.95,
    "model_version": "v1.0"
  }'

# Test daily summary
curl -X POST http://localhost:3001/trigger/daily-summaries
```

## Production Deployment Tips

1. **Use environment-based URLs:**

   ```typescript
   const EMAIL_SERVICE_URL =
     process.env.EMAIL_SERVICE_URL || "http://localhost:3001";
   ```

2. **Add retry logic for email delivery:**

   ```typescript
   async function sendEmailWithRetry(url: string, data: any, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(url, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(data),
         });

         if (response.ok) return await response.json();
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

3. **Use a message queue for high-volume:**
   - Consider RabbitMQ, Redis, or AWS SQS
   - Queue email jobs instead of direct HTTP calls
   - Provides better reliability and rate limiting

4. **Monitor email delivery:**
   ```sql
   -- Check email delivery stats
   SELECT
     email_type,
     status,
     COUNT(*) as count,
     DATE(sent_at) as date
   FROM email_logs
   GROUP BY email_type, status, DATE(sent_at)
   ORDER BY date DESC;
   ```

## Webhook Integration (Advanced)

If you want the email service to listen to Supabase webhooks:

```typescript
// Add to email-service index.ts

.post("/webhooks/new-attribution", async ({ body }) => {
  try {
    const { record } = body as { record: any };

    // Check if first-time species
    const isFirstTime = await isFirstTimeSighting(record.species);

    if (isFirstTime) {
      // Trigger special sighting emails
      // ... email logic
    }

    return { success: true };
  } catch (error) {
    console.error("Webhook error:", error);
    return { error: error.message, status: 500 };
  }
})
```

Then configure Supabase webhook to call this endpoint on new attributions.

---

**Questions?** Check the main README.md or open an issue!
