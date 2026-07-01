import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthStatus } from "@/components/auth-status";
import { Icons } from "@/components/icons";
import { Sparkline } from "@/components/sparkline";
import { Topbar } from "@/components/topbar";
import { getEventById } from "@/lib/repository";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <AppShell authSlot={<AuthStatus />}>
        <Topbar
          title={`${event.company.ticker ?? event.company.name} Event`}
          subtitle={`${event.eventType} · ${event.sourceName} · ${new Date(event.publishedAt).toLocaleString()}`}
        >
          <Link className="button" href="/">
            Back to feed
          </Link>
          <a className="button primary" href={event.sourceUrl} target="_blank" rel="noreferrer">
            <Icons.ExternalLink size={15} />
            Source
          </a>
        </Topbar>

        <section className="content">
          <div className="detail-grid">
            <article className="detail-panel">
              <div className="eyebrow">
                <span className={`pill ${event.confirmedStatus}`}>{event.confirmedStatus}</span>
                <span>{event.company.isPublic ? event.company.exchange : "Private company"}</span>
                <span>{event.company.sector}</span>
              </div>

              <h2>{event.headline}</h2>
              <p className="summary">{event.summary}</p>

              <div className="reaction-grid">
                <div className="reaction">
                  <span>Before</span>
                  <strong>{event.reaction?.priceBefore ? `$${event.reaction.priceBefore}` : "N/A"}</strong>
                </div>
                <div className="reaction">
                  <span>After</span>
                  <strong>{event.reaction?.priceAfter ? `$${event.reaction.priceAfter}` : "N/A"}</strong>
                </div>
                <div className="reaction">
                  <span>Move</span>
                  <strong className={(event.reaction?.percentChange ?? 0) < 0 ? "down" : "up"}>
                    {event.reaction ? `${event.reaction.percentChange > 0 ? "+" : ""}${event.reaction.percentChange}%` : "N/A"}
                  </strong>
                </div>
              </div>

              {event.reaction ? <Sparkline values={event.reaction.sparkline} /> : null}

              <div>
                <h2>X Context</h2>
                <div className="post-list">
                  {event.xMatches.map((match) => (
                    <a className="x-post" href={match.post.url} target="_blank" rel="noreferrer" key={match.xPostId}>
                      <div className="post-meta">
                        <span>
                          @{match.post.authorHandle}
                          {match.post.authorCluster ? ` · ${match.post.authorCluster}` : ""}
                        </span>
                        <span className="pill">{match.sentiment}</span>
                      </div>
                      <p>{match.post.text}</p>
                      <div className="match-reason">
                        relevance {match.relevanceScore.toFixed(2)} · credibility{" "}
                        {match.credibilityScore.toFixed(2)} · {match.matchReason}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </article>

            <aside className="side-panel">
              <h3>Source Trail</h3>
              <div className="watch-row">
                <div>
                  <strong>{event.sourceName}</strong>
                  <div className="muted">{new Date(event.detectedAt).toLocaleString()}</div>
                </div>
                <Icons.Newspaper size={17} />
              </div>
              <a className="source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
                Open trusted source
              </a>

              <h3>Sentiment Split</h3>
              {Object.entries(event.sentimentBreakdown).map(([sentiment, count]) => (
                <div className="sentiment-row" key={sentiment}>
                  <span>{sentiment}</span>
                  <strong>{count}</strong>
                </div>
              ))}

              <p className="summary">
                MarketContext separates confirmed sources from social interpretation. Nothing here is investment advice.
              </p>
            </aside>
          </div>
        </section>
    </AppShell>
  );
}
