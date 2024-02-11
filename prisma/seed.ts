import { mockCategories, mockUsers } from "mocking/prisma";
import { prisma } from "~/server/db.server";

const seed = async () => {
  const users = mockUsers(3);
  await Promise.all(
    users.map(async ({ email, hash, username }) =>
      prisma.user.upsert({
        create: {
          email,
          username,
          hash,
        },
        update: {},
        where: { email },
      }),
    ),
  );

  const categories = mockCategories();
  await Promise.all(
    categories.map(async ({ name }) =>
      prisma.reviewCategory.upsert({
        create: { name },
        update: {},
        where: { name },
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
