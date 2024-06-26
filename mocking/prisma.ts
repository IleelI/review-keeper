import { faker } from "@faker-js/faker";
import type {
  Review,
  ReviewCategory,
  ReactionType,
  User,
} from "@prisma/client";

import { hashPassword } from "~/.server/service/auth";

type MockWithout<T, K extends keyof T> = Omit<T, K>;

type MockedUser = MockWithout<User, "id" | "createdAt" | "updatedAt">;
const mockUser = (): MockedUser => {
  const username = faker.internet.userName();
  const email = faker.internet.email({ firstName: username });
  const hash = hashPassword(faker.internet.password({ length: 8 }));

  return {
    email,
    hash,
    refreshToken: null,
    username,
  };
};

export const mockUsers = (userCount = faker.number.int({ min: 3, max: 5 })) =>
  Array(userCount).fill(null).map(mockUser);

type MockedReviewCategory = MockWithout<
  ReviewCategory,
  "id" | "createdAt" | "updatedAt"
>;
export const mockCategories = (): MockedReviewCategory[] => [
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

type MockedReactionType = MockWithout<
  ReactionType,
  "id" | "createdAt" | "updatedAt"
>;
export const mockReactionTypes = (): MockedReactionType[] => [
  { name: "Like" },
  { name: "Love" },
  { name: "Dislike" },
  { name: "Angry" },
  { name: "Sad" },
];

type MockedReview = MockWithout<
  Review,
  "id" | "authorId" | "createdAt" | "updatedAt"
>;
export const mockReview = (categories: ReviewCategory[]): MockedReview => {
  const { id: categoryId } =
    categories[Math.floor(Math.random() * (categories.length - 1))];

  const paragraphs = Array(faker.number.int({ min: 1, max: 5 }))
    .fill(null)
    .map(() => faker.lorem.paragraph({ min: 1, max: 5 }));

  const content = paragraphs
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("\n");

  const ratingScale = 100;
  const rating = faker.number.int({ min: 0, max: ratingScale });

  const title = faker.lorem.sentence({ min: 3, max: 9 });

  return {
    categoryId,
    content,
    rating,
    ratingScale,
    title,
  };
};

export const mockReviews = (
  categories: ReviewCategory[],
  reviewCount = faker.number.int({ min: 1, max: 5 }),
) =>
  Array(reviewCount)
    .fill(null)
    .map(() => mockReview(categories));
