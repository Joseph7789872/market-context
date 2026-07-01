import { prisma } from "./db";
import type {
  CompanyProfile,
  ConfirmedStatus,
  EventCard,
  EventType,
  Sentiment,
  UserWatchlist,
  XPost
} from "./types";

const sentimentKeys: Sentiment[] = ["bullish", "bearish", "skeptical", "informational"];

const eventInclude = {
  company: true,
  reaction: true,
  xMatches: { include: { post: true } }
} as const;

type RawEvent = NonNullable<Awaited<ReturnType<typeof fetchEventRaw>>>;

function toNumber(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function toNullableNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function mapEvent(event: RawEvent): EventCard {
  const matches = event.xMatches
    .map((match) => ({
      eventId: match.eventId,
      xPostId: match.xPostId,
      relevanceScore: toNumber(match.relevanceScore),
      credibilityScore: toNumber(match.credibilityScore),
      sentiment: match.sentiment as Sentiment,
      stance: match.stance,
      matchReason: match.matchReason,
      post: {
        id: match.post.id,
        xPostId: match.post.xPostId,
        authorHandle: match.post.authorHandle,
        authorName: match.post.authorName,
        text: match.post.text,
        url: match.post.url,
        postedAt: match.post.postedAt.toISOString(),
        engagement: match.post.engagement,
        verifiedStatus: match.post.verifiedStatus,
        authorCluster: match.post.authorCluster as XPost["authorCluster"]
      }
    }))
    .sort((a, b) => b.relevanceScore + b.credibilityScore - (a.relevanceScore + a.credibilityScore));

  const sentimentBreakdown = sentimentKeys.reduce(
    (acc, key) => {
      acc[key] = matches.filter((match) => match.sentiment === key).length;
      return acc;
    },
    {} as Record<Sentiment, number>
  );

  return {
    id: event.id,
    companyId: event.companyId,
    eventType: event.eventType as EventType,
    headline: event.headline,
    summary: event.summary,
    sourceUrl: event.sourceUrl,
    sourceName: event.sourceName,
    confirmedStatus: event.confirmedStatus as ConfirmedStatus,
    publishedAt: event.publishedAt.toISOString(),
    detectedAt: event.detectedAt.toISOString(),
    company: {
      id: event.company.id,
      name: event.company.name,
      ticker: event.company.ticker,
      exchange: event.company.exchange,
      aliases: event.company.aliases,
      isPublic: event.company.isPublic,
      sector: event.company.sector,
      executives: event.company.executives
    },
    reaction: event.reaction
      ? {
          eventId: event.reaction.eventId,
          priceBefore: toNullableNumber(event.reaction.priceBefore),
          priceAfter: toNullableNumber(event.reaction.priceAfter),
          percentChange: toNumber(event.reaction.percentChange),
          volumeChange: toNumber(event.reaction.volumeChange),
          timeWindow: event.reaction.timeWindow,
          sparkline: event.reaction.sparkline.map((value) => toNumber(value))
        }
      : null,
    xMatches: matches,
    sentimentBreakdown
  };
}

function fetchEventRaw(id: string) {
  return prisma.marketEvent.findUnique({ where: { id }, include: eventInclude });
}

export async function getEvents(filters: {
  ticker?: string;
  eventType?: EventType;
  confirmedStatus?: ConfirmedStatus;
  limit?: number;
  cursor?: string;
}): Promise<{ events: EventCard[]; nextCursor: string | null }> {
  const normalizedTicker = filters.ticker?.trim().toUpperCase();
  const limit = Math.min(Math.max(filters.limit ?? 20, 1), 50);

  const rows = await prisma.marketEvent.findMany({
    where: {
      ...(normalizedTicker ? { company: { ticker: normalizedTicker } } : {}),
      ...(filters.eventType ? { eventType: filters.eventType } : {}),
      ...(filters.confirmedStatus ? { confirmedStatus: filters.confirmedStatus } : {})
    },
    include: eventInclude,
    orderBy: { publishedAt: "desc" },
    take: limit + 1,
    ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {})
  });

  const hasMore = rows.length > limit;
  const page = rows.slice(0, limit).map(mapEvent);
  const nextCursor = hasMore ? rows[limit].id : null;

  return { events: page, nextCursor };
}

export async function getEventById(id: string): Promise<EventCard | null> {
  const event = await fetchEventRaw(id);
  return event ? mapEvent(event) : null;
}

export async function getCompanyByTicker(ticker: string, userId?: string | null): Promise<CompanyProfile | null> {
  const normalizedTicker = ticker.toUpperCase();
  const company = await prisma.company.findFirst({
    where: {
      OR: [{ ticker: normalizedTicker }, { name: { equals: normalizedTicker, mode: "insensitive" } }]
    }
  });
  if (!company) return null;

  const { events } = await getEvents({ limit: 50 });
  const companyEvents = events.filter((event) => event.company.id === company.id);

  const watchlistState = userId
    ? Boolean(
        await prisma.userWatchlist.findUnique({
          where: { userId_companyId: { userId, companyId: company.id } }
        })
      )
    : false;

  return {
    id: company.id,
    name: company.name,
    ticker: company.ticker,
    exchange: company.exchange,
    aliases: company.aliases,
    isPublic: company.isPublic,
    sector: company.sector,
    executives: company.executives,
    events: companyEvents,
    sentimentTrend: [
      { label: "48h", bullish: 38, bearish: 22, skeptical: 18 },
      { label: "24h", bullish: 42, bearish: 25, skeptical: 14 },
      { label: "Now", bullish: 54, bearish: 20, skeptical: 11 }
    ],
    watchlistState
  };
}

export async function getWatchlist(userId: string): Promise<UserWatchlist[]> {
  const entries = await prisma.userWatchlist.findMany({ where: { userId } });
  return entries.map((entry) => ({
    userId: entry.userId,
    companyId: entry.companyId,
    alertPreferences: entry.alertPreferences as UserWatchlist["alertPreferences"]
  }));
}

export async function addToWatchlist(userId: string, companyId: string): Promise<UserWatchlist> {
  const entry = await prisma.userWatchlist.upsert({
    where: { userId_companyId: { userId, companyId } },
    update: {},
    create: {
      userId,
      companyId,
      alertPreferences: { filings: true, earnings: true, xContext: true }
    }
  });

  return {
    userId: entry.userId,
    companyId: entry.companyId,
    alertPreferences: entry.alertPreferences as UserWatchlist["alertPreferences"]
  };
}

export async function removeFromWatchlist(userId: string, companyId: string): Promise<boolean> {
  try {
    await prisma.userWatchlist.delete({ where: { userId_companyId: { userId, companyId } } });
    return true;
  } catch {
    return false;
  }
}

export async function getCompanyById(companyId: string) {
  return prisma.company.findUnique({ where: { id: companyId } });
}
