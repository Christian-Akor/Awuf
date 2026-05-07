# Deployment Steps (Vercel + Supabase)

## Supabase
1. Create a Supabase project.
2. Run SQL scripts:
   - `supabase/schema.sql`
   - `supabase/credit_wallet.sql`
   - `supabase/purchase_atomic.sql`
3. Copy `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Vercel
1. Import the repo into Vercel.
2. Add env vars from `.env.example`.
3. Deploy.

## Paystack Webhook
Set webhook URL:
```
https://<your-vercel-app>.vercel.app/api/paystack/webhook
```
