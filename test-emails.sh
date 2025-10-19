#!/bin/bash

# Test script for email service
# Make sure the email service is running first: bun run dev

BASE_URL="http://localhost:3001"
EMAIL="your-email@example.com"  # Change this to your email

echo "🧪 Testing ChirpChirp Email Service"
echo "======================================"
echo ""

# Test 1: Health check
echo "1️⃣  Testing health check..."
curl -s "$BASE_URL/" | jq .
echo ""
echo ""

# Test 2: Welcome email
echo "2️⃣  Sending welcome email to $EMAIL..."
curl -s -X POST "$BASE_URL/send/welcome" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"name\": \"Test User\"}" | jq .
echo ""
echo ""

# Test 3: Special sighting email
echo "3️⃣  Sending special sighting email to $EMAIL..."
curl -s -X POST "$BASE_URL/send/special-sighting" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"species\": \"Blue Jay\",
    \"imageUrl\": \"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800\",
    \"confidence\": 0.95
  }" | jq .
echo ""
echo ""

# Test 4: Daily summary (requires data in DB)
echo "4️⃣  Sending daily summary to $EMAIL..."
curl -s -X POST "$BASE_URL/send/daily-summary" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\"}" | jq .
echo ""
echo ""

echo "✅ Tests complete! Check your inbox at $EMAIL"
echo ""
echo "💡 Tips:"
echo "  - If you don't see emails, check spam folder"
echo "  - Make sure RESEND_API_KEY is set correctly"
echo "  - Check the service logs for any errors"
echo "  - For testing, you can use onboarding@resend.dev as the sender"

