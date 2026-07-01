import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/repository";
import type { ConfirmedStatus, EventType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") ?? "20");

  const result = await getEvents({
    ticker: searchParams.get("ticker") ?? undefined,
    eventType: (searchParams.get("eventType") as EventType | null) ?? undefined,
    confirmedStatus: (searchParams.get("confirmedStatus") as ConfirmedStatus | null) ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: Number.isFinite(limit) ? limit : 20
  });

  return NextResponse.json(result);
}
