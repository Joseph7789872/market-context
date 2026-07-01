import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthStatus } from "@/components/auth-status";
import { EventCard } from "@/components/event-card";
import { Icons } from "@/components/icons";
import { Topbar } from "@/components/topbar";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyByTicker } from "@/lib/repository";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CompanyPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const user = await getCurrentUser();
  const company = await getCompanyByTicker(ticker, user?.id);
  if (!company) notFound();

  return (
    <AppShell active="Ticker" authSlot={<AuthStatus />}>
        <Topbar
          title={`${company.name} ${company.ticker ? `(${company.ticker})` : ""}`}
          subtitle={`${company.sector} · ${company.isPublic ? company.exchange : "Private company"}`}
        >
          <Link className="button" href="/">
            Feed
          </Link>
          <button className="button primary" type="button">
            <Icons.Star size={15} />
            {company.watchlistState ? "Watching" : "Watch"}
          </button>
        </Topbar>

        <section className="content">
          <div className="market-strip">
            <div className="metric">
              <span>Events</span>
              <strong>{company.events.length}</strong>
            </div>
            <div className="metric">
              <span>Executives</span>
              <strong>{company.executives.length}</strong>
            </div>
            <div className="metric">
              <span>Aliases</span>
              <strong>{company.aliases.length}</strong>
            </div>
            <div className="metric">
              <span>Status</span>
              <strong>{company.isPublic ? "Public" : "Private"}</strong>
            </div>
          </div>

          <div className="layout-grid">
            <div className="feed">
              {company.events.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
            <aside className="side-panel">
              <h3>Sentiment Trend</h3>
              {company.sentimentTrend.map((point) => (
                <div className="sentiment-row" key={point.label}>
                  <span>{point.label}</span>
                  <strong>
                    {point.bullish}/{point.bearish}/{point.skeptical}
                  </strong>
                </div>
              ))}
              <h3>Tracked Names</h3>
              {[company.name, ...company.aliases, ...company.executives].map((name) => (
                <div className="watch-row" key={name}>
                  <span>{name}</span>
                  <Icons.CircleDot size={14} />
                </div>
              ))}
            </aside>
          </div>
        </section>
    </AppShell>
  );
}
