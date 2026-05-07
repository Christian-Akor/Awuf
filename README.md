# Awuf

A free-tier, Next.js PWA for Nigerian VAS data gifting with wallet funding and Paystack payments.

## Stack
- Next.js + API Routes
- Supabase (PostgreSQL + Auth)
- Paystack (payments)
- Jarapoint (data gifting) — **requires official API payload details**

## Setup
1. Create a Supabase project and run SQL in `supabase/`.
2. Copy `.env.example` to `.env.local` and fill in secrets.
3. Run:

```bash
npm install
npm run dev
```

## Paystack Webhook
Set webhook URL:
```
https://<your-vercel-app>.vercel.app/api/paystack/webhook
```

## Jarapoint Integration
Update `lib/jarapoint.ts` with the **exact endpoint, headers, and payload** from Jarapoint docs.

## Deployment (Vercel)
- Import repo into Vercel.
- Set environment variables from `.env.example`.
- Deploy.
