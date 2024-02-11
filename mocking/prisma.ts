import { faker } from "@faker-js/faker";
import type { ReviewCategory, User } from "@prisma/client";

type MockWithoutId<T> = Omit<T, "id">;

type MockedUser = MockWithoutId<User>;
const mockUser = (): MockedUser => {
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

type MockedCategory = MockWithoutId<ReviewCategory>;
export const mockCategories = (): MockedCategory[] => [
  { name: "Restaurants" },
  { name: "Hotels" },
  { name: "Movies" },
  { name: "Books" },
  { name: "Electronics" },
  { name: "Fashion" },
  { name: "Travel Destinations" },
  { name: "Fitness & Health" },
  { name: "Video Games" },
  { name: "Home & Garden" },
  { name: "Automobiles" },
  { name: "Music" },
  { name: "Sports Equipment" },
  { name: "Beauty Products" },
  { name: "Educational Courses" },
];
