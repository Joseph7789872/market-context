import { PrismaClient } from "@prisma/client";
import { companies, eventXMatches, marketEvents, marketReactions, xPosts } from "../lib/seed";

const prisma = new PrismaClient();

async function main() {
  for (const company of companies) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: {},
      create: company
    });
  }

  for (const event of marketEvents) {
    await prisma.marketEvent.upsert({
      where: { id: event.id },
      update: {},
      create: {
        ...event,
        publishedAt: new Date(event.publishedAt),
        detectedAt: new Date(event.detectedAt)
      }
    });
  }

  for (const reaction of marketReactions) {
    await prisma.marketReaction.upsert({
      where: { eventId: reaction.eventId },
      update: {},
      create: reaction
    });
  }

  for (const post of xPosts) {
    await prisma.xPost.upsert({
      where: { id: post.id },
      update: {},
      create: { ...post, postedAt: new Date(post.postedAt) }
    });
  }

  for (const match of eventXMatches) {
    await prisma.eventXMatch.upsert({
      where: { eventId_xPostId: { eventId: match.eventId, xPostId: match.xPostId } },
      update: {},
      create: match
    });
  }

  console.log(`Seeded ${companies.length} companies and ${marketEvents.length} events.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
