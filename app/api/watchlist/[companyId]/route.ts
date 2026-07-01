import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeFromWatchlist } from "@/lib/repository";

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
