import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyByTicker } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await context.params;
  const user = await getCurrentUser();
  const company = await getCompanyByTicker(ticker, user?.id);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company });
}
