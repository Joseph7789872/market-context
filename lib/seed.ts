import type {
  Company,
  EventXMatch,
  MarketEvent,
  MarketReaction,
  UserWatchlist,
  XPost
} from "./types";

export const companies: Company[] = [
  {
    id: "company-nvidia",
    name: "NVIDIA",
    ticker: "NVDA",
    exchange: "NASDAQ",
    aliases: ["Nvidia", "NVIDIA Corporation", "$NVDA"],
    isPublic: true,
    sector: "Semiconductors",
    executives: ["Jensen Huang"]
  },
  {
    id: "company-tesla",
    name: "Tesla",
    ticker: "TSLA",
    exchange: "NASDAQ",
    aliases: ["Tesla Inc", "$TSLA"],
    isPublic: true,
    sector: "Automotive",
    executives: ["Elon Musk"]
  },
  {
    id: "company-apple",
    name: "Apple",
    ticker: "AAPL",
    exchange: "NASDAQ",
    aliases: ["Apple Inc", "$AAPL"],
    isPublic: true,
    sector: "Consumer Technology",
    executives: ["Tim Cook"]
  },
  {
    id: "company-spacex",
    name: "SpaceX",
    ticker: null,
    exchange: null,
    aliases: ["Space Exploration Technologies", "Starlink"],
    isPublic: false,
    sector: "Aerospace",
    executives: ["Elon Musk", "Gwynne Shotwell"]
  }
];

export const marketEvents: MarketEvent[] = [
  {
    id: "event-nvda-earnings",
    companyId: "company-nvidia",
    eventType: "Earnings",
    headline: "NVIDIA posts data center revenue beat and raises next-quarter outlook",
    summary:
      "NVIDIA reported stronger data center sales than expected and lifted guidance, reinforcing that AI infrastructure demand remains the primary driver of the stock's move.",
    sourceUrl: "https://finance.yahoo.com/",
    sourceName: "Yahoo Finance",
    confirmedStatus: "confirmed",
    publishedAt: "2026-07-01T12:15:00.000Z",
    detectedAt: "2026-07-01T12:17:08.000Z"
  },
  {
    id: "event-tsla-deliveries",
    companyId: "company-tesla",
    eventType: "Guidance",
    headline: "Tesla shares move after delivery update points to softer near-term demand",
    summary:
      "Tesla's delivery update showed pressure in key markets. Traders are watching whether management commentary frames the shortfall as temporary or structural.",
    sourceUrl: "https://www.sec.gov/edgar/search/",
    sourceName: "SEC EDGAR",
    confirmedStatus: "confirmed",
    publishedAt: "2026-07-01T10:45:00.000Z",
    detectedAt: "2026-07-01T10:46:22.000Z"
  },
  {
    id: "event-spacex-ipo",
    companyId: "company-spacex",
    eventType: "IPO",
    headline: "SpaceX prepares confidential IPO filing for Starlink unit, report says",
    summary:
      "SpaceX is still private, but a reported Starlink listing process is being tracked as a private-company market event until an exchange and ticker are confirmed.",
    sourceUrl: "https://www.reuters.com/",
    sourceName: "Reuters",
    confirmedStatus: "developing",
    publishedAt: "2026-07-01T09:35:00.000Z",
    detectedAt: "2026-07-01T09:37:41.000Z"
  },
  {
    id: "event-apple-product",
    companyId: "company-apple",
    eventType: "Product",
    headline: "Apple expands on-device AI features across iPhone and Mac lineup",
    summary:
      "Apple announced additional on-device AI features, shifting investor attention to upgrade-cycle timing and services attachment.",
    sourceUrl: "https://www.apple.com/newsroom/",
    sourceName: "Apple Newsroom",
    confirmedStatus: "confirmed",
    publishedAt: "2026-06-30T19:05:00.000Z",
    detectedAt: "2026-06-30T19:06:16.000Z"
  }
];

export const marketReactions: MarketReaction[] = [
  {
    eventId: "event-nvda-earnings",
    priceBefore: 149.42,
    priceAfter: 157.9,
    percentChange: 5.67,
    volumeChange: 2.4,
    timeWindow: "90m after headline",
    sparkline: [149, 150.2, 151.4, 153.8, 154.6, 156.1, 157.9]
  },
  {
    eventId: "event-tsla-deliveries",
    priceBefore: 218.14,
    priceAfter: 207.58,
    percentChange: -4.84,
    volumeChange: 1.8,
    timeWindow: "90m after headline",
    sparkline: [218, 216.4, 214.1, 213.5, 211.8, 209.6, 207.6]
  },
  {
    eventId: "event-spacex-ipo",
    priceBefore: null,
    priceAfter: null,
    percentChange: 0,
    volumeChange: 0,
    timeWindow: "Private company; no public tape",
    sparkline: [0, 0, 0, 0, 0, 0, 0]
  },
  {
    eventId: "event-apple-product",
    priceBefore: 204.1,
    priceAfter: 207.02,
    percentChange: 1.43,
    volumeChange: 1.2,
    timeWindow: "2h after announcement",
    sparkline: [204.1, 204.9, 205.2, 205.7, 206.4, 206.1, 207.02]
  }
];

export const xPosts: XPost[] = [
  {
    id: "x-nvda-analyst-1",
    xPostId: "1910000001",
    authorHandle: "semisignal",
    authorName: "Maya Chen",
    text: "NVDA guide is still about data center supply, not lack of demand. Gross margin commentary matters more than the headline EPS beat.",
    url: "https://x.com/semisignal/status/1910000001",
    postedAt: "2026-07-01T12:27:00.000Z",
    engagement: 18400,
    verifiedStatus: true,
    authorCluster: "analyst"
  },
  {
    id: "x-nvda-retail-low",
    xPostId: "1910000002",
    authorHandle: "rockettradez",
    authorName: "Momentum Max",
    text: "$NVDA moon time. Everyone buy now.",
    url: "https://x.com/rockettradez/status/1910000002",
    postedAt: "2026-07-01T12:29:00.000Z",
    engagement: 920,
    verifiedStatus: false,
    authorCluster: "retail"
  },
  {
    id: "x-tsla-journalist-1",
    xPostId: "1910000010",
    authorHandle: "evledger",
    authorName: "Alex Rivera",
    text: "Tesla deliveries missed the most watched buyside bogey. The debate now is whether incentives can stabilize Q3 without pressuring margins.",
    url: "https://x.com/evledger/status/1910000010",
    postedAt: "2026-07-01T10:53:00.000Z",
    engagement: 11200,
    verifiedStatus: true,
    authorCluster: "journalist"
  },
  {
    id: "x-spacex-executive-1",
    xPostId: "1910000020",
    authorHandle: "elonmusk",
    authorName: "Elon Musk",
    text: "Starlink cash flow keeps improving. Long-term goal remains making internet access reliable anywhere on Earth.",
    url: "https://x.com/elonmusk/status/1910000020",
    postedAt: "2026-07-01T09:58:00.000Z",
    engagement: 256000,
    verifiedStatus: true,
    authorCluster: "executive"
  },
  {
    id: "x-spacex-analyst-1",
    xPostId: "1910000021",
    authorHandle: "spacecap",
    authorName: "Rina Patel",
    text: "If Starlink files, public comps will likely center on broadband growth, capex intensity, churn, and launch cost advantage.",
    url: "https://x.com/spacecap/status/1910000021",
    postedAt: "2026-07-01T10:04:00.000Z",
    engagement: 8700,
    verifiedStatus: true,
    authorCluster: "sector-specialist"
  },
  {
    id: "x-apple-company-1",
    xPostId: "1910000030",
    authorHandle: "Apple",
    authorName: "Apple",
    text: "New intelligence features are coming across iPhone, iPad, and Mac with privacy built into the experience.",
    url: "https://x.com/Apple/status/1910000030",
    postedAt: "2026-06-30T19:12:00.000Z",
    engagement: 145000,
    verifiedStatus: true,
    authorCluster: "company"
  }
];

export const eventXMatches: EventXMatch[] = [
  {
    eventId: "event-nvda-earnings",
    xPostId: "x-nvda-analyst-1",
    relevanceScore: 0.94,
    credibilityScore: 0.89,
    sentiment: "bullish",
    stance: "Demand still exceeds supply",
    matchReason: "Discusses the same earnings guide and highlights the data center demand driver."
  },
  {
    eventId: "event-nvda-earnings",
    xPostId: "x-nvda-retail-low",
    relevanceScore: 0.31,
    credibilityScore: 0.12,
    sentiment: "bullish",
    stance: "Low-context momentum reaction",
    matchReason: "Mentions the ticker but has little event-specific detail, so it is ranked low."
  },
  {
    eventId: "event-tsla-deliveries",
    xPostId: "x-tsla-journalist-1",
    relevanceScore: 0.91,
    credibilityScore: 0.84,
    sentiment: "bearish",
    stance: "Delivery miss raises margin concern",
    matchReason: "Directly connects the delivery update to investor expectations and margin risk."
  },
  {
    eventId: "event-spacex-ipo",
    xPostId: "x-spacex-executive-1",
    relevanceScore: 0.72,
    credibilityScore: 0.96,
    sentiment: "informational",
    stance: "Executive comments on Starlink fundamentals",
    matchReason: "Does not confirm an IPO, but it comments on Starlink financial trajectory near the report."
  },
  {
    eventId: "event-spacex-ipo",
    xPostId: "x-spacex-analyst-1",
    relevanceScore: 0.88,
    credibilityScore: 0.78,
    sentiment: "informational",
    stance: "Frames possible public-market comps",
    matchReason: "Analyzes valuation inputs investors would watch if Starlink files to go public."
  },
  {
    eventId: "event-apple-product",
    xPostId: "x-apple-company-1",
    relevanceScore: 0.9,
    credibilityScore: 0.98,
    sentiment: "informational",
    stance: "Official product context",
    matchReason: "Official Apple account confirms the product direction behind the market event."
  }
];

export const watchlist: UserWatchlist[] = [
  {
    userId: "demo-user",
    companyId: "company-nvidia",
    alertPreferences: { filings: true, earnings: true, xContext: true }
  },
  {
    userId: "demo-user",
    companyId: "company-spacex",
    alertPreferences: { filings: true, earnings: false, xContext: true }
  }
];
