import type { Company, MarketReaction, NewsArticle, XPost } from "./types";
import { companies, marketReactions, xPosts } from "./seed";

export interface TrustedNewsProvider {
  fetchLatest(): Promise<NewsArticle[]>;
}

export interface MarketDataProvider {
  getReaction(company: Company, eventId: string): Promise<MarketReaction>;
}

export interface XContextProvider {
  searchRelatedPosts(query: {
    company: Company;
    headline: string;
    eventKeywords: string[];
    from: string;
    to: string;
  }): Promise<XPost[]>;
}

export class DemoNewsProvider implements TrustedNewsProvider {
  async fetchLatest(): Promise<NewsArticle[]> {
    return [
      {
        id: "article-nvda-earnings",
        headline: "NVIDIA posts data center revenue beat and raises next-quarter outlook",
        sourceUrl: "https://finance.yahoo.com/",
        sourceName: "Yahoo Finance",
        publishedAt: "2026-07-01T12:15:00.000Z",
        companyName: "NVIDIA",
        ticker: "NVDA",
        eventType: "Earnings",
        body: "NVIDIA reported stronger data center demand and raised its outlook."
      },
      {
        id: "article-spacex-ipo",
        headline: "SpaceX prepares confidential IPO filing for Starlink unit, report says",
        sourceUrl: "https://www.reuters.com/",
        sourceName: "Reuters",
        publishedAt: "2026-07-01T09:35:00.000Z",
        companyName: "SpaceX",
        ticker: null,
        eventType: "IPO",
        body: "The report describes a potential filing for Starlink while SpaceX remains private."
      }
    ];
  }
}

export class DemoMarketDataProvider implements MarketDataProvider {
  async getReaction(_company: Company, eventId: string): Promise<MarketReaction> {
    return (
      marketReactions.find((reaction) => reaction.eventId === eventId) ?? {
        eventId,
        priceBefore: null,
        priceAfter: null,
        percentChange: 0,
        volumeChange: 0,
        timeWindow: "No public market data",
        sparkline: [0, 0, 0, 0]
      }
    );
  }
}

export class DemoXContextProvider implements XContextProvider {
  async searchRelatedPosts(query: {
    company: Company;
    headline: string;
    eventKeywords: string[];
    from: string;
    to: string;
  }): Promise<XPost[]> {
    const searchTerms = [
      query.company.name,
      query.company.ticker ?? "",
      ...query.company.aliases,
      ...query.company.executives,
      ...query.eventKeywords
    ]
      .map((term) => term.toLowerCase())
      .filter(Boolean);

    return xPosts.filter((post) => {
      const haystack = `${post.text} ${post.authorName} ${post.authorHandle}`.toLowerCase();
      return searchTerms.some((term) => haystack.includes(term.replace("$", "")));
    });
  }
}

export function findCompanyFromArticle(article: NewsArticle): Company | null {
  return (
    companies.find((company) => company.ticker === article.ticker) ??
    companies.find((company) => company.name.toLowerCase() === article.companyName.toLowerCase()) ??
    null
  );
}
