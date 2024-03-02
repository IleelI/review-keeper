-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReviewReactionType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ReviewReactionType" ("id", "name") SELECT "id", "name" FROM "ReviewReactionType";
DROP TABLE "ReviewReactionType";
ALTER TABLE "new_ReviewReactionType" RENAME TO "ReviewReactionType";
CREATE UNIQUE INDEX "ReviewReactionType_name_key" ON "ReviewReactionType"("name");
CREATE TABLE "new_ReviewCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ReviewCategory" ("id", "name") SELECT "id", "name" FROM "ReviewCategory";
DROP TABLE "ReviewCategory";
ALTER TABLE "new_ReviewCategory" RENAME TO "ReviewCategory";
CREATE UNIQUE INDEX "ReviewCategory_name_key" ON "ReviewCategory"("name");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "username" TEXT,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("email", "hash", "id", "refreshToken", "username") SELECT "email", "hash", "id", "refreshToken", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER,
    "ratingScale" INTEGER,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ReviewCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("authorId", "categoryId", "content", "id", "rating", "ratingScale", "title") SELECT "authorId", "categoryId", "content", "id", "rating", "ratingScale", "title" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE TABLE "new_ReviewReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "ReviewReaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ReviewReactionType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewReaction_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReviewReaction" ("id", "reviewId", "typeId") SELECT "id", "reviewId", "typeId" FROM "ReviewReaction";
DROP TABLE "ReviewReaction";
ALTER TABLE "new_ReviewReaction" RENAME TO "ReviewReaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
