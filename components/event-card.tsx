import Link from "next/link";
import type { EventCard as EventCardType, Sentiment } from "@/lib/types";
import { Icons } from "./icons";
import { Sparkline } from "./sparkline";

const statusClass = {
  confirmed: "confirmed",
  developing: "developing",
  speculative: "speculative"
};

const sentimentLabels: Sentiment[] = ["bullish", "bearish", "skeptical", "informational"];

function formatPercent(value: number) {
  if (value === 0) return "0.00%";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function EventCard({ event }: { event: EventCardType }) {
  const reaction = event.reaction;
  const pctClass = reaction && reaction.percentChange < 0 ? "down" : "up";
  const topPosts = event.xMatches.slice(0, 2);

  return (
    <article className="event-card">
      <div className="event-head">
        <div className="event-title">
          <div className="eyebrow">
            <span>{event.company.ticker ?? "Private"}</span>
            <span>{event.company.name}</span>
            <span>{event.eventType}</span>
            <span>{new Date(event.publishedAt).toLocaleString()}</span>
          </div>
          <h2>
            <Link href={`/events/${event.id}`}>{event.headline}</Link>
          </h2>
        </div>
        <span className={`pill ${statusClass[event.confirmedStatus]}`}>
          <Icons.ShieldCheck size={14} />
          {event.confirmedStatus}
        </span>
      </div>

      <p className="summary">{event.summary}</p>

      <div className="reaction-grid">
        <div className="reaction">
          <span>Price Move</span>
          <strong className={pctClass}>{reaction ? formatPercent(reaction.percentChange) : "N/A"}</strong>
        </div>
        <div className="reaction">
          <span>Volume</span>
          <strong>{reaction ? `${reaction.volumeChange.toFixed(1)}x` : "N/A"}</strong>
        </div>
        <div className={`reaction ${pctClass}`}>
          <span>{reaction?.timeWindow ?? "No window"}</span>
          {reaction ? <Sparkline values={reaction.sparkline} /> : null}
        </div>
      </div>

      <div className="post-list">
        {topPosts.map((match) => (
          <div className="x-post" key={match.xPostId}>
            <div className="post-meta">
              <span>
                @{match.post.authorHandle} · {match.post.authorCluster}
              </span>
              <span className="pill">{match.sentiment}</span>
            </div>
            <p>{match.post.text}</p>
            <div className="match-reason">{match.matchReason}</div>
          </div>
        ))}
      </div>

      <div className="card-actions">
        <div className="eyebrow">
          {sentimentLabels.map((sentiment) => (
            <span key={sentiment}>
              {sentiment}: {event.sentimentBreakdown[sentiment]}
            </span>
          ))}
        </div>
        <Link className="button primary" href={`/events/${event.id}`}>
          <Icons.ExternalLink size={15} />
          Open event
        </Link>
      </div>
    </article>
  );
}
