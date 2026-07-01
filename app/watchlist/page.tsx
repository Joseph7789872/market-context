import Link from "next/link";
import { AlertToggles } from "@/components/alert-toggles";
import { AppShell } from "@/components/app-shell";
import { AuthStatus } from "@/components/auth-status";
import { Icons } from "@/components/icons";
import { Topbar } from "@/components/topbar";
import { getCurrentUser } from "@/lib/auth";
import { getCompanyById, getEvents, getWatchlist } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <AppShell active="Watchlist" authSlot={<AuthStatus />}>
        <Topbar title="Watchlist" subtitle="Tracked companies and alert preferences." />
        <section className="content">
          <div className="event-card empty">
            <Link className="button primary" href="/login?redirectTo=/watchlist">
              Sign in to view your watchlist
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const entries = await getWatchlist(user.id);
  const { events: allEvents } = await getEvents({ limit: 50 });
  const events = allEvents.filter((event) => entries.some((entry) => entry.companyId === event.company.id));
  const companies = await Promise.all(entries.map((entry) => getCompanyById(entry.companyId)));

  return (
    <AppShell active="Watchlist" authSlot={<AuthStatus />}>
      <Topbar title="Watchlist" subtitle="Tracked companies and alert preferences." />
      <section className="content">
        <div className="layout-grid">
          <div className="feed">
            {entries.map((entry, index) => {
              const company = companies[index];
              if (!company) return null;
              return (
                <article className="event-card" key={entry.companyId}>
                  <div className="event-head">
                    <div className="event-title">
                      <div className="eyebrow">
                        <span>{company.ticker ?? "Private"}</span>
                        <span>{company.sector}</span>
                      </div>
                      <h2>{company.name}</h2>
                    </div>
                    <span className={`pill ${Object.values(entry.alertPreferences).some(Boolean) ? "confirmed" : "speculative"}`}>
                      <Icons.Bell size={14} />
                      {Object.values(entry.alertPreferences).some(Boolean) ? "alerts on" : "alerts off"}
                    </span>
                  </div>
                  <AlertToggles companyId={entry.companyId} initialPreferences={entry.alertPreferences} />
                  <Link className="button" href={`/companies/${company.ticker ?? company.name}`}>
                    Open ticker
                  </Link>
                </article>
              );
            })}
          </div>
          <aside className="side-panel">
            <h3>Watchlist Events</h3>
            {events.map((event) => (
              <Link className="watch-row" href={`/events/${event.id}`} key={event.id}>
                <span>{event.company.ticker ?? event.company.name}</span>
                <strong>{event.eventType}</strong>
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
