import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/repository";
import type { ConfirmedStatus, EventType } from "@/lib/types";
import { CONFIRMED_STATUSES, EVENT_TYPES, isConfirmedStatus, isEventType } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") ?? "20");

  const eventTypeParam = searchParams.get("eventType");
  if (eventTypeParam && !isEventType(eventTypeParam)) {
    return NextResponse.json(
      { error: `eventType must be one of: ${EVENT_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  const confirmedStatusParam = searchParams.get("confirmedStatus");
  if (confirmedStatusParam && !isConfirmedStatus(confirmedStatusParam)) {
    return NextResponse.json(
      { error: `confirmedStatus must be one of: ${CONFIRMED_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const eventType: EventType | undefined =
    eventTypeParam && isEventType(eventTypeParam) ? eventTypeParam : undefined;
  const confirmedStatus: ConfirmedStatus | undefined =
    confirmedStatusParam && isConfirmedStatus(confirmedStatusParam) ? confirmedStatusParam : undefined;

  const result = await getEvents({
    ticker: searchParams.get("ticker") ?? undefined,
    eventType,
    confirmedStatus,
    cursor: searchParams.get("cursor") ?? undefined,
    limit: Number.isFinite(limit) ? limit : 20
  });

  return NextResponse.json(result);
}
