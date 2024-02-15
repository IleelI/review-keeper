/*
  Warnings:

  - The primary key for the `ReviewTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ReviewCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ReviewReactionType` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ReviewTag" ("id", "name") SELECT "id", "name" FROM "ReviewTag";
DROP TABLE "ReviewTag";
ALTER TABLE "new_ReviewTag" RENAME TO "ReviewTag";
CREATE UNIQUE INDEX "ReviewTag_name_key" ON "ReviewTag"("name");
CREATE TABLE "new_ReviewReaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "ReviewReaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ReviewReactionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewReaction" ("id", "reviewId", "typeId") SELECT "id", "reviewId", "typeId" FROM "ReviewReaction";
DROP TABLE "ReviewReaction";
ALTER TABLE "new_ReviewReaction" RENAME TO "ReviewReaction";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("email", "hash", "id", "refreshToken", "username") SELECT "email", "hash", "id", "refreshToken", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__ReviewToReviewTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ReviewToReviewTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ReviewToReviewTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ReviewTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__ReviewToReviewTag" ("A", "B") SELECT "A", "B" FROM "_ReviewToReviewTag";
DROP TABLE "_ReviewToReviewTag";
ALTER TABLE "new__ReviewToReviewTag" RENAME TO "_ReviewToReviewTag";
CREATE UNIQUE INDEX "_ReviewToReviewTag_AB_unique" ON "_ReviewToReviewTag"("A", "B");
CREATE INDEX "_ReviewToReviewTag_B_index" ON "_ReviewToReviewTag"("B");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "ratingScale" INTEGER,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Review_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReviewCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("authorId", "categoryId", "content", "id", "rating", "ratingScale", "title") SELECT "authorId", "categoryId", "content", "id", "rating", "ratingScale", "title" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE TABLE "new_ReviewCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ReviewCategory" ("id", "name") SELECT "id", "name" FROM "ReviewCategory";
DROP TABLE "ReviewCategory";
ALTER TABLE "new_ReviewCategory" RENAME TO "ReviewCategory";
CREATE UNIQUE INDEX "ReviewCategory_name_key" ON "ReviewCategory"("name");
CREATE TABLE "new_ReviewReactionType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ReviewReactionType" ("id", "name") SELECT "id", "name" FROM "ReviewReactionType";
DROP TABLE "ReviewReactionType";
ALTER TABLE "new_ReviewReactionType" RENAME TO "ReviewReactionType";
CREATE UNIQUE INDEX "ReviewReactionType_name_key" ON "ReviewReactionType"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
