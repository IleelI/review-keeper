import {
  mockCategories,
  mockReactionTypes,
  mockReviews,
  mockUsers,
} from "mocking/prisma";
import { prisma } from "~/.server/service/db";

const seed = async () => {
  const categories = await Promise.all(
    mockCategories().map(({ name }) =>
      prisma.reviewCategory.upsert({
        create: { name },
        update: {},
        where: { name },
      }),
    ),
  );

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

  await Promise.all(
    mockUsers().map(async ({ email, hash, username }) =>
      prisma.user.upsert({
        create: {
          email,
          hash,
          username,
          reviews: {
            create: mockReviews(categories),
          },
        },
        update: {},
        where: { email },
      }),
    ),
  );

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
