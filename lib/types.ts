export type ConfirmedStatus = "confirmed" | "developing" | "speculative";

export type EventType =
  | "IPO"
  | "Earnings"
  | "Guidance"
  | "M&A"
  | "Leadership"
  | "SEC Filing"
  | "Product"
  | "Regulatory"
  | "Litigation"
  | "Analyst Rating"
  | "Macro";

export type Sentiment = "bullish" | "bearish" | "skeptical" | "informational";

export type Company = {
  id: string;
  name: string;
  ticker: string | null;
  exchange: string | null;
  aliases: string[];
  isPublic: boolean;
  sector: string;
  executives: string[];
};

export type MarketEvent = {
  id: string;
  companyId: string;
  eventType: EventType;
  headline: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  confirmedStatus: ConfirmedStatus;
  publishedAt: string;
  detectedAt: string;
};

export type MarketReaction = {
  eventId: string;
  priceBefore: number | null;
  priceAfter: number | null;
  percentChange: number;
  volumeChange: number;
  timeWindow: string;
  sparkline: number[];
};

export type XPost = {
  id: string;
  xPostId: string;
  authorHandle: string;
  authorName: string;
  text: string;
  url: string;
  postedAt: string;
  engagement: number;
  verifiedStatus: boolean;
  authorCluster:
    | "company"
    | "executive"
    | "journalist"
    | "analyst"
    | "investor"
    | "sector-specialist"
    | "retail";
};

export type EventXMatch = {
  eventId: string;
  xPostId: string;
  relevanceScore: number;
  credibilityScore: number;
  sentiment: Sentiment;
  stance: string;
  matchReason: string;
};

export type UserWatchlist = {
  userId: string;
  companyId: string;
  alertPreferences: {
    filings: boolean;
    earnings: boolean;
    xContext: boolean;
  };
};

export type NewsArticle = {
  id: string;
  headline: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  companyName: string;
  ticker: string | null;
  eventType: EventType;
  body: string;
};

export type EventCard = MarketEvent & {
  company: Company;
  reaction: MarketReaction | null;
  xMatches: Array<EventXMatch & { post: XPost }>;
  sentimentBreakdown: Record<Sentiment, number>;
};

export type CompanyProfile = Company & {
  events: EventCard[];
  sentimentTrend: Array<{ label: string; bullish: number; bearish: number; skeptical: number }>;
  watchlistState: boolean;
};
