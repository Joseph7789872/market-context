import { prisma } from "./db";
import { findCompanyFromArticle, type MarketDataProvider, type TrustedNewsProvider, type XContextProvider } from "./providers";
import type { ConfirmedStatus, EventXMatch, MarketEvent, NewsArticle, Sentiment, XPost } from "./types";

const trustedConfirmedSources = new Set(["SEC EDGAR", "Apple Newsroom", "Yahoo Finance"]);

export function classifyConfirmedStatus(article: NewsArticle): ConfirmedStatus {
  if (trustedConfirmedSources.has(article.sourceName)) return "confirmed";
  if (article.headline.toLowerCase().includes("report says")) return "developing";
  return "speculative";
}

export function buildEventKeywords(article: NewsArticle): string[] {
  return article.headline
    .replace(/[^\w\s$-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 8);
}

export function buildSummary(article: NewsArticle): string {
  const status = classifyConfirmedStatus(article);
  const basis =
    status === "confirmed"
      ? "confirmed source"
      : status === "developing"
        ? "credible developing report"
        : "speculative source";

  return `${article.companyName} has a ${article.eventType.toLowerCase()} event from a ${basis}. Traders should compare the trusted source with price reaction and high-signal X context before treating the discussion as market fact.`;
}

export function scorePost(post: XPost, article: NewsArticle): EventXMatch {
  const text = post.text.toLowerCase();
  const keywords = buildEventKeywords(article).map((word) => word.toLowerCase());
  const keywordHits = keywords.filter((word) => text.includes(word.replace("$", ""))).length;
  const eventSpecificity = Math.min(keywordHits / Math.max(keywords.length, 1), 1);
  const clusterBoost = {
    company: 0.3,
    executive: 0.28,
    journalist: 0.24,
    analyst: 0.24,
    investor: 0.2,
    "sector-specialist": 0.2,
    retail: -0.18
  }[post.authorCluster];
  const engagementBoost = Math.min(Math.log10(post.engagement + 1) / 10, 0.45);
  const credibilityScore = Math.max(
    0,
    Math.min(1, (post.verifiedStatus ? 0.48 : 0.18) + clusterBoost + engagementBoost)
  );
  const relevanceScore = Math.max(0.05, Math.min(1, eventSpecificity + (post.verifiedStatus ? 0.2 : 0.05)));

  return {
    eventId: "",
    xPostId: post.id,
    relevanceScore: Number(relevanceScore.toFixed(2)),
    credibilityScore: Number(credibilityScore.toFixed(2)),
    sentiment: inferSentiment(post.text),
    stance: inferStance(post.text),
    matchReason:
      relevanceScore < 0.4
        ? "Mentions the ticker or company but has limited event-specific detail."
        : "Discusses terms that overlap with the trusted event and comes from a higher-signal account."
  };
}

function inferSentiment(text: string): Sentiment {
  const normalized = text.toLowerCase();
  if (/(miss|pressure|risk|shortfall|bear|weak)/.test(normalized)) return "bearish";
  if (/(beat|improving|growth|advantage|strong|bull)/.test(normalized)) return "bullish";
  if (/(if|whether|debate|uncertain|skeptical)/.test(normalized)) return "skeptical";
  return "informational";
}

function inferStance(text: string): string {
  if (text.length <= 84) return text;
  return `${text.slice(0, 81)}...`;
}

export async function runIngestionJob(providers: {
  news: TrustedNewsProvider;
  marketData: MarketDataProvider;
  xContext: XContextProvider;
}) {
  const articles = await providers.news.fetchLatest();
  const created: MarketEvent[] = [];

  for (const article of articles) {
    const company = findCompanyFromArticle(article);
    if (!company) continue;

    const existing = await prisma.marketEvent.findFirst({
      where: { companyId: company.id, headline: { equals: article.headline, mode: "insensitive" } }
    });

    if (existing) continue;

    const event: MarketEvent = {
      id: `event-${article.id}`,
      companyId: company.id,
      eventType: article.eventType,
      headline: article.headline,
      summary: buildSummary(article),
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      confirmedStatus: classifyConfirmedStatus(article),
      publishedAt: article.publishedAt,
      detectedAt: new Date().toISOString()
    };

    const reaction = await providers.marketData.getReaction(company, event.id);

    const posts = await providers.xContext.searchRelatedPosts({
      company,
      headline: article.headline,
      eventKeywords: buildEventKeywords(article),
      from: new Date(Date.parse(article.publishedAt) - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(Date.parse(article.publishedAt) + 48 * 60 * 60 * 1000).toISOString()
    });

    const matches = posts
      .map((post) => ({ ...scorePost(post, article), eventId: event.id }))
      .filter((match) => match.relevanceScore >= 0.25 || match.credibilityScore >= 0.7);

    await prisma.marketEvent.create({
      data: {
        id: event.id,
        companyId: event.companyId,
        eventType: event.eventType,
        headline: event.headline,
        summary: event.summary,
        sourceUrl: event.sourceUrl,
        sourceName: event.sourceName,
        confirmedStatus: event.confirmedStatus,
        publishedAt: new Date(event.publishedAt),
        detectedAt: new Date(event.detectedAt)
      }
    });

    await prisma.marketReaction.create({
      data: {
        eventId: event.id,
        priceBefore: reaction.priceBefore,
        priceAfter: reaction.priceAfter,
        percentChange: reaction.percentChange,
        volumeChange: reaction.volumeChange,
        timeWindow: reaction.timeWindow,
        sparkline: reaction.sparkline
      }
    });

    for (const match of matches) {
      const post = posts.find((candidate) => candidate.id === match.xPostId);
      if (!post) continue;

      await prisma.xPost.upsert({
        where: { xPostId: post.xPostId },
        update: {},
        create: {
          id: post.id,
          xPostId: post.xPostId,
          authorHandle: post.authorHandle,
          authorName: post.authorName,
          text: post.text,
          url: post.url,
          postedAt: new Date(post.postedAt),
          engagement: post.engagement,
          verifiedStatus: post.verifiedStatus,
          authorCluster: post.authorCluster
        }
      });

      await prisma.eventXMatch.create({
        data: {
          eventId: match.eventId,
          xPostId: match.xPostId,
          relevanceScore: match.relevanceScore,
          credibilityScore: match.credibilityScore,
          sentiment: match.sentiment,
          stance: match.stance,
          matchReason: match.matchReason
        }
      });
    }

    created.push(event);
  }

  return { createdCount: created.length, created };
}
