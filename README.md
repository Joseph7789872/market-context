# MarketContext

MarketContext is a source-first market event intelligence app. It starts with trusted financial events, enriches them with market reaction data, and attaches ranked X context from credible account clusters.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Implemented

- Live market events feed with ticker, event type, and trust-state filters
- Event cards with trusted source, price reaction, sentiment split, and related X posts
- Event detail, company, watchlist, and settings views
- Internal API routes for events, event detail, company profile, watchlist, and ingestion
- Provider interfaces for trusted news, market data, and X context
- Demo ingestion pipeline with deduplication, source confidence, X ranking, and private-company support
- Prisma schema for the production Postgres/Supabase model
- Vitest coverage for the core MVP acceptance scenarios

## Production connector notes

The app currently uses deterministic demo providers in `lib/providers.ts`. Replace those providers with SEC EDGAR, a licensed market news API, market data, and X MCP implementations behind the same interfaces.

This app is informational only and does not provide investment advice.
