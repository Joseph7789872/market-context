import { NextRequest, NextResponse } from "next/server";
import { DemoMarketDataProvider, DemoNewsProvider, DemoXContextProvider } from "@/lib/providers";
import { runIngestionJob } from "@/lib/pipeline";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-marketcontext-admin-token");
  const expected = process.env.MARKETCONTEXT_ADMIN_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitKey = request.headers.get("x-forwarded-for") ?? "jobs-ingest";
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMIT);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Retry after ${rateLimit.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  const result = await runIngestionJob({
    news: new DemoNewsProvider(),
    marketData: new DemoMarketDataProvider(),
    xContext: new DemoXContextProvider()
  });

  return NextResponse.json(result);
}
