import { faker } from "@faker-js/faker";
import type { Post, User } from "@prisma/client";

export type MockedUser = Omit<User, "id">;
export const mockUser = (): MockedUser => {
  const username = faker.internet.userName();
  const email = faker.internet.email({ firstName: username });
  const hash = faker.internet.password({ length: 16 });

  return {
    email,
    hash,
    refreshToken: null,
    username,
  };
};
export const mockUsers = (count?: number) => {
  const userCount = count ?? faker.number.int({ min: 1, max: 3 });
  return Array(userCount)
    .fill(null)
    .map(() => mockUser());
};

export type MockedPost = Omit<Post, "id" | "authorId">;
export const mockPost = (): MockedPost => {
  return {
    title: faker.lorem.sentence({ min: 1, max: 6 }),
    content: faker.lorem.sentences(),
    published: faker.datatype.boolean(),
  };
};
export const mockPosts = (count?: number) => {
  const postCount = count ?? faker.number.int({ min: 1, max: 5 });
  return Array(postCount)
    .fill(null)
    .map(() => mockPost());
};
