import {
  mockCategories,
  mockReactionTypes,
  mockReviews,
  mockUsers,
} from "mocking/prisma";
import { prisma } from "~/.server/service/db";

const seed = async () => {
  await Promise.all(
    mockCategories().map(({ name }) =>
      prisma.reviewCategory.upsert({
        create: { name },
        update: {},
        where: { name },
      }),
    ),
  );
  const categories = await prisma.reviewCategory.findMany();

  await Promise.all(
    mockReactionTypes().map(({ name }) =>
      prisma.reactionType.upsert({
        create: {
          name,
        },
        update: {},
        where: {
          name,
        },
      }),
    ),
  );
  const reactionTypes = await prisma.reactionType.findMany();

  await Promise.all(
    mockUsers(20).map(async ({ email, hash, username }) =>
      prisma.user.upsert({
        create: {
          email,
          hash,
          username,
          reviews: {
            create: mockReviews(categories, 10),
          },
        },
        update: {},
        where: { email },
      }),
    ),
  );
  const users = await prisma.user.findMany();
  const reviews = await prisma.review.findMany();

  await Promise.all([
    ...reviews.map(async ({ id: reviewId }) =>
      users.map(async ({ id: userId }) =>
        prisma.reviewReaction.create({
          data: {
            reviewId,
            typeId:
              reactionTypes[
                Math.floor(Math.random() * (reactionTypes.length - 1))
              ].id,
            userId,
          },
        }),
      ),
    ),
  ]);

  console.log(`Database has been seeded. 🌱`);
};

seed()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
