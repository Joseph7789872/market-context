import { AppShell } from "@/components/app-shell";
import { AuthStatus } from "@/components/auth-status";
import { EventCard } from "@/components/event-card";
import { Icons } from "@/components/icons";
import { SearchControl, SelectControl, Topbar } from "@/components/topbar";
import { getCurrentUser } from "@/lib/auth";
import { getEvents, getWatchlist } from "@/lib/repository";
import type { ConfirmedStatus, EventType } from "@/lib/types";

export const dynamic = "force-dynamic";

const eventTypeOptions = [
  { label: "All events", value: "" },
  { label: "Earnings", value: "Earnings" },
  { label: "IPO", value: "IPO" },
  { label: "Guidance", value: "Guidance" },
  { label: "Product", value: "Product" },
  { label: "SEC filing", value: "SEC Filing" }
];

const statusOptions = [
  { label: "All trust states", value: "" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Developing", value: "developing" },
  { label: "Speculative", value: "speculative" }
];

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ ticker?: string; eventType?: EventType; confirmedStatus?: ConfirmedStatus }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const [{ events }, watchlist] = await Promise.all([
    getEvents({
      ticker: params.ticker,
      eventType: params.eventType || undefined,
      confirmedStatus: params.confirmedStatus || undefined,
      limit: 20
    }),
    user ? getWatchlist(user.id) : Promise.resolve([])
  ]);
  const watchlistCount = watchlist.length;
  const xPostCount = events.reduce((sum, event) => sum + event.xMatches.length, 0);
  const confirmedCount = events.filter((event) => event.confirmedStatus === "confirmed").length;

  return (
    <AppShell active="Live Feed" authSlot={<AuthStatus />}>
        <Topbar
          title="Live Market Events"
          subtitle="Trusted headlines, market reaction, and high-signal X context."
        >
          <form className="search-row">
            <SearchControl defaultValue={params.ticker ?? ""} />
            <SelectControl name="eventType" defaultValue={params.eventType} options={eventTypeOptions} />
            <SelectControl
              name="confirmedStatus"
              defaultValue={params.confirmedStatus}
              options={statusOptions}
            />
            <button className="button" type="submit">
              <Icons.Filter size={15} />
              Apply
            </button>
          </form>
        </Topbar>

        <section className="content">
          <div className="market-strip">
            <div className="metric">
              <span>Visible events</span>
              <strong>{events.length}</strong>
            </div>
            <div className="metric">
              <span>Confirmed</span>
              <strong>{confirmedCount}</strong>
            </div>
            <div className="metric">
              <span>X matches</span>
              <strong>{xPostCount}</strong>
            </div>
            <div className="metric">
              <span>Watchlist</span>
              <strong>{watchlistCount}</strong>
            </div>
          </div>

          <div className="layout-grid">
            <div className="feed">
              {events.length ? events.map((event) => <EventCard key={event.id} event={event} />) : null}
              {!events.length ? <div className="event-card empty">No matching events.</div> : null}
            </div>

            <aside className="side-panel">
              <h3>Watchlist Alerts</h3>
              {watchlist.map((entry) => {
                const companyEvent = events.find((event) => event.company.id === entry.companyId);
                return (
                  <div className="watch-row" key={entry.companyId}>
                    <div>
                      <strong>{companyEvent?.company.ticker ?? companyEvent?.company.name ?? entry.companyId}</strong>
                      <div className="muted">filings · earnings · X context</div>
                    </div>
                    <Icons.Bell size={17} />
                  </div>
                );
              })}

              <h3>Trust Mix</h3>
              {statusOptions.slice(1).map((status) => (
                <div className="sentiment-row" key={status.value}>
                  <span>{status.label}</span>
                  <strong>{events.filter((event) => event.confirmedStatus === status.value).length}</strong>
                </div>
              ))}
            </aside>
          </div>
        </section>
    </AppShell>
  );
}
