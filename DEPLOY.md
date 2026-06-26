# Deploy — Nordstrand Commerce

## Översikt

| Del | Tjänst | URL (efter deploy) |
|-----|--------|-------------------|
| Butik | Netlify | `https://nordstrand-commerce.netlify.app` |
| API | Render | `https://nordstrand-api.onrender.com` |
| Databas | Neon | PostgreSQL connection string |

## 1. Databas (Neon)

1. Skapa gratis konto på [neon.tech](https://neon.tech)
2. Skapa projekt `nordstrand`
3. Kopiera **connection string** → `DATABASE_URL`
4. Kör migration + seed lokalt mot Neon en gång:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate:deploy --workspace @nordstrand/api
DATABASE_URL="postgresql://..." npm run db:seed --workspace @nordstrand/api
```

## 2. API (Render)

1. Pusha repot till GitHub
2. [render.com](https://render.com) → New → Blueprint → välj `render.yaml`
3. Sätt environment variables:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `CORS_ORIGIN` = din Netlify-URL
   - `API_BASE_URL` = din Render-URL
4. Deploy

## 3. Butik (Netlify)

1. [netlify.com](https://netlify.com) → Add site → Import from Git
2. Välj `nordstrand-commerce`
3. Build settings läses från `netlify.toml`
4. Environment variables:
   - `NEXT_PUBLIC_API_URL` = Render API-URL
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`

## 4. Stripe webhook (produktion)

I Stripe Dashboard → Webhooks → Add endpoint:

`https://nordstrand-api.onrender.com/api/v1/webhooks/stripe`

Events: `checkout.session.completed`, `checkout.session.expired`

Kopiera signing secret → `STRIPE_WEBHOOK_SECRET` på Render.

## Lokal utveckling

```bash
npm run db:setup
npm run dev:api
npm run dev:web
```
