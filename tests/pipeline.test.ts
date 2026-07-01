import { describe, expect, it } from "vitest";
import { getEvents } from "@/lib/repository";
import { buildSummary, classifyConfirmedStatus, scorePost } from "@/lib/pipeline";
import type { NewsArticle, XPost } from "@/lib/types";

const earningsArticle: NewsArticle = {
  id: "test-earnings",
  headline: "NVIDIA posts data center revenue beat and raises next-quarter outlook",
  sourceUrl: "https://finance.yahoo.com/",
  sourceName: "Yahoo Finance",
  publishedAt: "2026-07-01T12:15:00.000Z",
  companyName: "NVIDIA",
  ticker: "NVDA",
  eventType: "Earnings",
  body: "NVIDIA reported stronger data center demand and raised its outlook."
};

describe("MarketContext source-first pipeline", () => {
  it("classifies trusted source headlines as confirmed", () => {
    expect(classifyConfirmedStatus(earningsArticle)).toBe("confirmed");
  });

  it("classifies report-says private company IPO stories as developing", () => {
    expect(
      classifyConfirmedStatus({
        ...earningsArticle,
        headline: "SpaceX prepares confidential IPO filing for Starlink unit, report says",
        sourceName: "Reuters",
        companyName: "SpaceX",
        ticker: null,
        eventType: "IPO"
      })
    ).toBe("developing");
  });

  it("penalizes generic ticker spam below high-signal analysis", () => {
    const genericPost: XPost = {
      id: "generic",
      xPostId: "generic",
      authorHandle: "fastmoney",
      authorName: "Fast Money",
      text: "$NVDA buy buy buy",
      url: "https://x.com/fastmoney/status/generic",
      postedAt: "2026-07-01T12:20:00.000Z",
      engagement: 500,
      verifiedStatus: false,
      authorCluster: "retail"
    };

    const analystPost: XPost = {
      ...genericPost,
      id: "analyst",
      xPostId: "analyst",
      authorHandle: "semisignal",
      authorName: "Maya Chen",
      text: "NVIDIA data center revenue beat and guide raise point to sustained AI demand.",
      verifiedStatus: true,
      authorCluster: "analyst",
      engagement: 18000
    };

    const genericScore = scorePost(genericPost, earningsArticle);
    const analystScore = scorePost(analystPost, earningsArticle);

    expect(analystScore.relevanceScore + analystScore.credibilityScore).toBeGreaterThan(
      genericScore.relevanceScore + genericScore.credibilityScore
    );
  });

  it.skipIf(!process.env.DATABASE_URL)(
    "keeps private-company IPO events visible without a ticker",
    async () => {
      const { events } = await getEvents({ limit: 50 });
      const spacex = events.find((event) => event.company.name === "SpaceX");

      expect(spacex?.company.ticker).toBeNull();
      expect(spacex?.eventType).toBe("IPO");
    }
  );

  it.skipIf(!process.env.DATABASE_URL)("returns stable cursor pagination", async () => {
    const first = await getEvents({ limit: 2 });
    const second = await getEvents({ limit: 2, cursor: first.nextCursor ?? undefined });

    expect(first.events).toHaveLength(2);
    expect(second.events[0]?.id).not.toBe(first.events[0]?.id);
  });

  it("summaries identify source confidence without inventing recommendations", () => {
    const summary = buildSummary(earningsArticle);

    expect(summary).toContain("confirmed source");
    expect(summary.toLowerCase()).not.toContain("buy");
    expect(summary.toLowerCase()).not.toContain("sell");
  });
});
