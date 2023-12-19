import { mockUsers, mockPosts } from "mocking/prisma";
import { prisma } from "~/server/db.server";

const seed = async () => {
  const users = mockUsers(3);
  // Insert mocked users and assign to the mocked posts.
  await Promise.all(
    users.map(async ({ email, hash, username }) =>
      prisma.user.upsert({
        where: {
          email,
        },
        update: {},
        create: {
          email,
          username,
          hash,
          posts: {
            create: mockPosts(),
          },
        },
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
