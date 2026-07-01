import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeFromWatchlist, updateAlertPreferences } from "@/lib/repository";
import type { UserWatchlist } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: { params: Promise<{ companyId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await context.params;
  const removed = await removeFromWatchlist(user.id, companyId);
  if (!removed) {
    return NextResponse.json({ error: "Watchlist entry not found" }, { status: 404 });
  }

  return NextResponse.json({ removed: true });
}

function isValidAlertPreferences(value: unknown): value is UserWatchlist["alertPreferences"] {
  if (!value || typeof value !== "object") return false;
  const prefs = value as Record<string, unknown>;
  return (
    typeof prefs.filings === "boolean" &&
    typeof prefs.earnings === "boolean" &&
    typeof prefs.xContext === "boolean" &&
    Object.keys(prefs).length === 3
  );
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ companyId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { alertPreferences?: unknown } | null;
  if (!isValidAlertPreferences(body?.alertPreferences)) {
    return NextResponse.json(
      { error: "alertPreferences must be { filings, earnings, xContext } booleans" },
      { status: 400 }
    );
  }

  const { companyId } = await context.params;
  const entry = await updateAlertPreferences(user.id, companyId, body.alertPreferences);
  if (!entry) {
    return NextResponse.json({ error: "Watchlist entry not found" }, { status: 404 });
  }

  return NextResponse.json({ watchlistEntry: entry });
}
